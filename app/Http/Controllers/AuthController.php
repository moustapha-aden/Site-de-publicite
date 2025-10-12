<?php

namespace App\Http\Controllers;

use App\Http\Requests\AuthLoginRequest;
use App\Http\Resources\UserResource;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;

class AuthController extends Controller
{
    /**
     * Handle user login with Sanctum.
     */
    public function login(AuthLoginRequest $request): JsonResponse
    {
        try {
            $credentials = $request->only('email', 'password');

            if (!Auth::attempt($credentials, $request->boolean('remember'))) {
                Log::warning('Failed login attempt', [
                    'email' => $request->email,
                    'ip' => $request->ip(),
                    'user_agent' => $request->userAgent()
                ]);

                return response()->json([
                    'success' => false,
                    'message' => 'Identifiants incorrects',
                    'errors' => [
                        'email' => ['Les identifiants fournis sont incorrects.']
                    ]
                ], Response::HTTP_UNAUTHORIZED);
            }

            $user = Auth::user();

            // ✅ Crée un vrai token Sanctum
            $token = $user->createToken('auth_token')->plainTextToken;

            Log::info('User logged in successfully', [
                'user_id' => $user->id,
                'email' => $user->email,
                'ip' => $request->ip()
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Connexion réussie',
                'data' => [
                    'user' => new UserResource($user),
                    'token' => $token,
                    'expires_at' => now()->addDays(30)->toISOString(),
                ]
            ]);

        } catch (\Exception $e) {
            Log::error('Login error: ' . $e->getMessage(), [
                'email' => $request->email ?? null,
                'ip' => $request->ip()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Une erreur est survenue lors de la connexion',
                'error' => config('app.debug') ? $e->getMessage() : 'Internal server error'
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Handle user logout.
     */
    public function logout(Request $request): JsonResponse
    {
        try {
            $user = $request->user();
            if ($user && $user->currentAccessToken()) {
                $user->currentAccessToken()->delete();
            }

            Log::info('User logged out', [
                'user_id' => $user?->id,
                'ip' => $request->ip()
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Déconnexion réussie'
            ]);

        } catch (\Exception $e) {
            Log::error('Logout error: ' . $e->getMessage());

            return response()->json([
                'success' => false,
                'message' => 'Une erreur est survenue lors de la déconnexion',
                'error' => config('app.debug') ? $e->getMessage() : 'Internal server error'
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Get the authenticated user.
     */
    public function me(Request $request): JsonResponse
    {
        try {
            $user = $request->user();
            if (!$user) {
                return response()->json([
                    'success' => false,
                    'message' => 'Utilisateur non authentifié',
                ], Response::HTTP_UNAUTHORIZED);
            }

            return response()->json([
                'success' => true,
                'message' => 'Utilisateur récupéré avec succès',
                'data' => new UserResource($user)
            ]);

        } catch (\Exception $e) {
            Log::error('Error retrieving user: ' . $e->getMessage());

            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la récupération de l’utilisateur',
                'error' => config('app.debug') ? $e->getMessage() : 'Internal server error'
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Refresh the user's token.
     */
    public function refresh(Request $request): JsonResponse
    {
        try {
            $user = $request->user();

            if ($user && $user->currentAccessToken()) {
                $user->currentAccessToken()->delete();
            }

            $newToken = $user->createToken('auth_token')->plainTextToken;

            Log::info('Token refreshed', [
                'user_id' => $user->id,
                'ip' => $request->ip()
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Token rafraîchi avec succès',
                'data' => [
                    'user' => new UserResource($user),
                    'token' => $newToken,
                    'expires_at' => now()->addDays(30)->toISOString(),
                ]
            ]);

        } catch (\Exception $e) {
            Log::error('Token refresh error: ' . $e->getMessage());

            return response()->json([
                'success' => false,
                'message' => 'Erreur lors du rafraîchissement du token',
                'error' => config('app.debug') ? $e->getMessage() : 'Internal server error'
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Update the authenticated user's profile.
     */
    public function profile(Request $request): JsonResponse
    {
        try {
            $user = $request->user();
            if (!$user) {
                return response()->json([
                    'success' => false,
                    'message' => 'Utilisateur non authentifié',
                ], Response::HTTP_UNAUTHORIZED);
            }

            $validator = Validator::make($request->all(), [
                'name' => 'required|string|max:255',
                'email' => 'required|string|email|max:255|unique:users,email,' . $user->id,
                'current_password' => 'nullable|string|min:8',
                'password' => 'nullable|string|min:8|confirmed',
            ], [
                'name.required' => 'Le nom est obligatoire.',
                'name.string' => 'Le nom doit être une chaîne de caractères.',
                'name.max' => 'Le nom ne peut pas dépasser 255 caractères.',
                'email.required' => 'L\'email est obligatoire.',
                'email.email' => 'L\'email doit être une adresse email valide.',
                'email.unique' => 'Cette adresse email est déjà utilisée.',
                'current_password.min' => 'Le mot de passe actuel doit contenir au moins 8 caractères.',
                'password.min' => 'Le nouveau mot de passe doit contenir au moins 8 caractères.',
                'password.confirmed' => 'La confirmation du nouveau mot de passe ne correspond pas.',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Erreur de validation',
                    'errors' => $validator->errors()
                ], Response::HTTP_UNPROCESSABLE_ENTITY);
            }

            // Vérifier le mot de passe actuel si un nouveau mot de passe est fourni
            if ($request->filled('password')) {
                if (!$request->filled('current_password')) {
                    return response()->json([
                        'success' => false,
                        'message' => 'Le mot de passe actuel est requis pour changer le mot de passe',
                        'errors' => [
                            'current_password' => ['Le mot de passe actuel est obligatoire.']
                        ]
                    ], Response::HTTP_UNPROCESSABLE_ENTITY);
                }

                if (!Hash::check($request->current_password, $user->password)) {
                    return response()->json([
                        'success' => false,
                        'message' => 'Le mot de passe actuel est incorrect',
                        'errors' => [
                            'current_password' => ['Le mot de passe actuel est incorrect.']
                        ]
                    ], Response::HTTP_UNPROCESSABLE_ENTITY);
                }
            }

            // Mettre à jour les informations
            $updateData = [
                'name' => $request->name,
                'email' => $request->email,
            ];

            if ($request->filled('password')) {
                $updateData['password'] = Hash::make($request->password);
            }

            $user->update($updateData);

            Log::info('User profile updated', [
                'user_id' => $user->id,
                'email' => $user->email,
                'ip' => $request->ip()
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Profil mis à jour avec succès',
                'data' => new UserResource($user->fresh())
            ]);

        } catch (\Exception $e) {
            Log::error('Profile update error: ' . $e->getMessage());

            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la mise à jour du profil',
                'error' => config('app.debug') ? $e->getMessage() : 'Internal server error'
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }
}
