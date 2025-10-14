<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class VehicleStoreRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true; // Vous pouvez ajouter des règles d'autorisation ici
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'brand' => [
                'required',
                'string',
                'max:255',
                // Rule::in(\App\Models\Vehicule::getBrands())
            ],
            'model' => 'required|string|max:255',
            'year' => 'required|integer|min:1900|max:' . (date('Y') + 1),
            'price' => 'required|numeric|min:0',
            'mileage' => 'required|integer|min:0|max:999999',
            'fuel' => [
                'required',
                'string',
                Rule::in(\App\Models\Vehicule::getFuelTypes())
            ],
            'transmission' => [
                'required',
                'string',
                Rule::in(\App\Models\Vehicule::getTransmissionTypes())
            ],
            'color' => 'required|string|max:255',
            'description' => 'nullable|string|max:2000',
            'photos' => 'nullable|array|max:10',
            'photos.*' => 'image|mimes:jpeg,png,jpg,gif|max:5120', // 5MB max per image
            'is_featured' => 'boolean',
            'is_new' => 'boolean',
            'contact_number' => 'nullable|string|max:20|regex:/^[0-9+\s\-()]+$/',
            'status' => [
                'nullable',
                'string',
                Rule::in(\App\Models\Vehicule::getStatuses())
            ],
        ];
    }

    /**
     * Get custom messages for validator errors.
     */
    public function messages(): array
    {
        return [
            'brand.required' => 'La marque est obligatoire.',
            'brand.in' => 'La marque sélectionnée n\'est pas valide.',
            'model.required' => 'Le modèle est obligatoire.',
            'year.required' => 'L\'année est obligatoire.',
            'year.min' => 'L\'année doit être supérieure à 1900.',
            'year.max' => 'L\'année ne peut pas être dans le futur.',
            'price.required' => 'Le prix est obligatoire.',
            'price.min' => 'Le prix doit être positif.',
            'mileage.required' => 'Le kilométrage est obligatoire.',
            'mileage.min' => 'Le kilométrage ne peut pas être négatif.',
            'fuel.required' => 'Le type de carburant est obligatoire.',
            'fuel.in' => 'Le type de carburant sélectionné n\'est pas valide.',
            'transmission.required' => 'Le type de transmission est obligatoire.',
            'transmission.in' => 'Le type de transmission sélectionné n\'est pas valide.',
            'color.required' => 'La couleur est obligatoire.',
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
            'brand' => 'marque',
            'model' => 'modèle',
            'year' => 'année',
            'price' => 'prix',
            'mileage' => 'kilométrage',
            'fuel' => 'carburant',
            'transmission' => 'transmission',
            'color' => 'couleur',
            'description' => 'description',
            'photos' => 'photos',
            'is_featured' => 'véhicule en vedette',
            'is_new' => 'véhicule neuf',
            'contact_number' => 'numéro de contact',
            'status' => 'statut',
        ];
    }
}
