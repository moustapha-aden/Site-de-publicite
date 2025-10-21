<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Notifications\ResetPasswordNotification;
use App\Notifications\SendTemporaryPasswordNotification;
use App\Notifications\SendRealPasswordNotification;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;

class ForgotPasswordController extends Controller
{
    /**
     * Envoie le vrai mot de passe de l'utilisateur par email
     */
    public function sendResetLinkEmail(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email|exists:users,email'
        ], [
            'email.required' => 'L\'adresse email est requise.',
            'email.email' => 'L\'adresse email doit être valide.',
            'email.exists' => 'Aucun compte n\'est associé à cette adresse email.'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur de validation',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $user = User::where('email', $request->email)->first();

            if (!$user) {
                return response()->json([
                    'success' => false,
                    'message' => 'Aucun compte n\'est associé à cette adresse email.'
                ], 404);
            }

            // Vérifier si l'utilisateur a un mot de passe en clair stocké
            if (!$user->plain_password) {
                return response()->json([
                    'success' => false,
                    'message' => 'Aucun mot de passe en clair trouvé pour ce compte. Contactez l\'administrateur.'
                ], 404);
            }

            // Envoyer l'email avec le vrai mot de passe
            $user->notify(new SendRealPasswordNotification($user->plain_password));

            Log::info('Real password sent', [
                'email' => $request->email,
                'ip' => $request->ip(),
                'password_sent' => true
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Votre mot de passe a été envoyé à votre adresse email.'
            ]);

        } catch (\Exception $e) {
            Log::error('Error sending real password', [
                'email' => $request->email,
                'error' => $e->getMessage()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Une erreur est survenue lors de l\'envoi de l\'email.'
            ], 500);
        }
    }

}
