<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class ParcelleUpdateRequest extends FormRequest
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
     */
    public function rules(): array
    {
        return [
            'title' => 'sometimes|required|string|max:255',
            'location' => 'sometimes|required|string|max:255',
            'price' => 'sometimes|required|numeric|min:0|max:99999999.99',
            'type' => [
                'sometimes',
                'required',
                'string',
                Rule::in(\App\Models\Parcelle::getTypes())
            ],
            'surface' => 'nullable|numeric|min:0|max:999999.99',
            'rooms' => 'nullable|integer|min:0|max:50',
            'bedrooms' => 'nullable|integer|min:0|max:20',
            'bathrooms' => 'nullable|integer|min:0|max:20',
            'description' => 'nullable|string|max:2000',
            'photos' => 'nullable|array|max:10',
            'photos.*' => 'image|mimes:jpeg,png,jpg,gif|max:5120',
            'contact_number' => 'nullable|string|max:20|regex:/^[0-9+\s\-()]+$/',
            'status' => [
                'sometimes',
                'nullable',
                'string',
                Rule::in(\App\Models\Parcelle::getStatuses())
            ],
            'is_featured' => 'sometimes|boolean',
        ];
    }

    /**
     * Get custom messages for validator errors.
     */
    public function messages(): array
    {
        return [
            'title.required' => 'Le titre est obligatoire.',
            'location.required' => 'La localisation est obligatoire.',
            'price.required' => 'Le prix est obligatoire.',
            'price.min' => 'Le prix doit être positif.',
            'type.required' => 'Le type est obligatoire.',
            'type.in' => 'Le type sélectionné n\'est pas valide.',
            'surface.min' => 'La surface ne peut pas être négative.',
            'rooms.min' => 'Le nombre de pièces ne peut pas être négatif.',
            'bedrooms.min' => 'Le nombre de chambres ne peut pas être négatif.',
            'bathrooms.min' => 'Le nombre de salles de bain ne peut pas être négatif.',
            'photos.array' => 'Les photos doivent être un tableau.',
            'photos.max' => 'Vous ne pouvez pas télécharger plus de 10 photos.',
            'photos.*.image' => 'Chaque fichier doit être une image.',
            'photos.*.mimes' => 'Les images doivent être au format JPEG, PNG, JPG ou GIF.',
            'photos.*.max' => 'Chaque image ne peut pas dépasser 5MB.',
            'contact_number.regex' => 'Le numéro de contact contient des caractères non valides.',
            'status.in' => 'Le statut sélectionné n\'est pas valide.',
        ];
    }

    /**
     * Get custom attributes for validator errors.
     */
    public function attributes(): array
    {
        return [
            'title' => 'titre',
            'location' => 'localisation',
            'price' => 'prix',
            'type' => 'type',
            'surface' => 'surface',
            'rooms' => 'pièces',
            'bedrooms' => 'chambres',
            'bathrooms' => 'salles de bain',
            'description' => 'description',
            'photos' => 'photos',
            'contact_number' => 'numéro de contact',
            'status' => 'statut',
            'is_featured' => 'en vedette',
        ];
    }
}
