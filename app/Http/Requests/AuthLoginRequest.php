<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rules\Password;

class AuthLoginRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
{
    return [
        'email' => [
            'required',
            'email',
            'max:255'
        ],
        'password' => [
            'required',
            'string',
        ],
        'remember' => 'sometimes|boolean',
    ];
}

    /**
     * Get custom messages for validator errors.
     */
    public function messages(): array
    {
        return [
            'email.required' => 'L\'adresse email est obligatoire.',
            'email.email' => 'L\'adresse email doit être valide.',
            'email.max' => 'L\'adresse email ne peut pas dépasser 255 caractères.',
            'password.required' => 'Le mot de passe est obligatoire.',
            'password.min' => 'Le mot de passe doit contenir au moins 8 caractères.',
            'password.mixed_case' => 'Le mot de passe doit contenir des majuscules et minuscules.',
            'password.numbers' => 'Le mot de passe doit contenir des chiffres.',
            'password.symbols' => 'Le mot de passe doit contenir des symboles.',
            'remember.boolean' => 'Le champ "Se souvenir" doit être vrai ou faux.',
        ];
    }

    /**
     * Get custom attributes for validator errors.
     */
    public function attributes(): array
    {
        return [
            'email' => 'adresse email',
            'password' => 'mot de passe',
            'remember' => 'se souvenir',
        ];
    }

    /**
     * Handle a failed validation attempt.
     */
    protected function failedValidation(\Illuminate\Contracts\Validation\Validator $validator)
    {
        // Rate limiting pour les tentatives de connexion échouées
        $this->ensureIsNotRateLimited();

        parent::failedValidation($validator);
    }

    /**
     * Ensure the login request is not rate limited.
     */
    public function ensureIsNotRateLimited(): void
    {
        if (!\Illuminate\Support\Facades\RateLimiter::tooManyAttempts($this->throttleKey(), 5)) {
            return;
        }

        $seconds = \Illuminate\Support\Facades\RateLimiter::availableIn($this->throttleKey());

        throw new \Illuminate\Validation\ValidationException(
            \Illuminate\Support\Facades\Validator::make([], []),
            [
                'email' => [
                    "Trop de tentatives de connexion. Réessayez dans " . ceil($seconds / 60) . " minutes."
                ]
            ]
        );
    }

    /**
     * Get the rate limiting throttle key for the request.
     */
    public function throttleKey(): string
    {
        return \Illuminate\Support\Str::transliterate(\Illuminate\Support\Str::lower($this->string('email')).'|'.$this->ip());
    }
}
