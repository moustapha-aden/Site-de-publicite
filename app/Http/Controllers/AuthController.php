<?php

namespace App\Http\Controllers;

use App\Http\Requests\AuthLoginRequest;
use App\Http\Resources\AuthResource;
use App\Http\Resources\UserResource;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

class AuthController extends Controller
{
    /**
     * Handle user login.
     */
    public function login(AuthLoginRequest $request): JsonResponse
    {
        try {
            $credentials = $request->only('email', 'password');

            // Attempt authentication
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

            // Manually create a token if createToken is not available
            // For example, using Laravel Passport or a custom implementation
            // Here, we'll fallback to a simple random string for demonstration
            $token = bin2hex(random_bytes(40));
            $expiresAt = now()->addDays(30);

            // Optionally, store the token and expiry in the database if needed
            // e.g., $user->tokens()->create(['token' => hash('sha256', $token), 'expires_at' => $expiresAt]);

            Log::info('User logged in successfully', [
                'user_id' => $user->id,
                'email' => $user->email,
                'ip' => $request->ip()
            ]);

            $authData = [
                'user' => $user,
                'token' => $token,
                'expires_at' => now()->addDays(30)->toISOString(),
                'message' => 'Connexion réussie'
            ];

            return response()->json([
                'success' => true,
                'message' => 'Connexion réussie',
                'data' => new AuthResource($authData)
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

            // Revoke the token that was used to authenticate the current request
            $request->user()->currentAccessToken()->delete();

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
            return response()->json([
                'success' => true,
                'message' => 'User retrieved successfully',
                'data' => new UserResource($request->user())
            ]);

        } catch (\Exception $e) {
            Log::error('Error retrieving user: ' . $e->getMessage());

            return response()->json([
                'success' => false,
                'message' => 'Une erreur est survenue lors de la récupération des informations utilisateur',
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

            // Revoke current token
            $request->user()->currentAccessToken()->delete();

            // Create new token
            $token = $user->createToken('auth_token', ['*'], now()->addDays(30))->plainTextToken;

            Log::info('Token refreshed', [
                'user_id' => $user->id,
                'ip' => $request->ip()
            ]);

            $authData = [
                'user' => $user,
                'token' => $token,
                'expires_at' => now()->addDays(30)->toISOString(),
                'message' => 'Token rafraîchi avec succès'
            ];

            return response()->json([
                'success' => true,
                'message' => 'Token rafraîchi avec succès',
                'data' => new AuthResource($authData)
            ]);

        } catch (\Exception $e) {
            Log::error('Token refresh error: ' . $e->getMessage());

            return response()->json([
                'success' => false,
                'message' => 'Une erreur est survenue lors du rafraîchissement du token',
                'error' => config('app.debug') ? $e->getMessage() : 'Internal server error'
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }
}
