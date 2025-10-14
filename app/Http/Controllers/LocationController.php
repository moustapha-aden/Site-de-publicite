<?php

namespace App\Http\Controllers;

use App\Models\Location;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\Rule;

class LocationController extends Controller
{
    /**
     * Display a listing of the locations with filters and search.
     */
    public function index(Request $request): JsonResponse
    {
        try {
            $query = Location::query();

            // Apply filters
            if ($request->filled('search')) {
                $query->search($request->search);
            }

            if ($request->filled('type')) {
                $query->byType($request->type);
            }

            if ($request->filled('location')) {
                $query->byLocation($request->location);
            }

            if ($request->filled('is_featured')) {
                $query->featured();
            }

            if ($request->filled('status')) {
                if ($request->input('status') === 'active') {
                    $query->active();
                } elseif ($request->input('status') === 'inactive') {
                    $query->inactive();
                }
            }

            if ($request->filled('price_min') || $request->filled('price_max')) {
                $query->priceRange($request->input('price_min'), $request->input('price_max'));
            }

            if ($request->filled('surface_min') || $request->filled('surface_max')) {
                $query->surfaceRange($request->input('surface_min'), $request->input('surface_max'));
            }

            // Ajout d'une option pour afficher les annonces inactives (pour les administrateurs, par exemple)
            if ($request->user() && method_exists($request->user(), 'isAdmin') && $request->user()->isAdmin() && $request->boolean('show_inactive')) {
                $query = Location::query(); // Réinitialise pour inclure tous les statuts
            }

            // Pagination
            $locations = $query->latest()->paginate(10);

            // Retourne les données sous forme de JSON pour l'API
            return response()->json($locations);
        } catch (\Exception $e) {
            Log::error('Erreur lors de la récupération des locations: ' . $e->getMessage());
            return response()->json(['error' => 'Erreur lors de la récupération des locations'], 500);
        }
    }

    /**
     * Show the form for creating a new resource. (Afficher le formulaire de création)
     */
    public function create()
    {
        // Retourne la vue pour le formulaire de création
        return view('locations.create', [
            'types' => Location::getTypes(),
            'statuses' => Location::getStatuses(),
        ]);
    }

    /**
     * Store a newly created location in storage.
     */
    public function store(Request $request): JsonResponse
    {
        try {
            $validatedData = $request->validate(
                $this->validationRules(),
                $this->validationMessages()
            );

            // 1. Gestion du téléchargement des photos
            $photoPaths = $this->handlePhotoUploads($request);
            $validatedData['photos'] = $photoPaths;

            // 2. Création de la location
            $location = Location::create($validatedData);

            // 3. Réponse JSON
            return response()->json([
                'message' => 'Location créée avec succès',
                'data' => $location->fresh()
            ], 201);

        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'message' => 'Erreur de validation',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            Log::error('Erreur lors de la création de la location: ' . $e->getMessage());
            return response()->json(['error' => 'Erreur lors de la création de la location'], 500);
        }
    }

    /**
     * Display the specified location.
     */
    public function show(Location $location): JsonResponse
    {
        return response()->json($location);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Location $location)
    {
        return view('locations.edit', [
            'location' => $location,
            'types' => Location::getTypes(),
            'statuses' => Location::getStatuses(),
        ]);
    }

    /**
     * Update the specified location in storage.
     */
    public function update(Request $request, Location $location): JsonResponse
    {
        try {
            $validatedData = $request->validate(
                $this->validationRules($location),
                $this->validationMessages()
            );

            // 1. Gestion des photos
            $photoPaths = $this->handlePhotoUploads($request);
            if (!empty($photoPaths)) {
                $validatedData['photos'] = $photoPaths;
            }

            // 2. Gestion de la suppression des photos existantes
            if ($request->has('photos_to_delete')) {
                $this->deletePhotos($request->input('photos_to_delete'));
            }

            // 3. Mise à jour
            $location->update($validatedData);

            return response()->json([
                'message' => 'Location mise à jour avec succès',
                'data' => $location->fresh()
            ]);

        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'message' => 'Erreur de validation',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            Log::error('Erreur lors de la mise à jour de la location: ' . $e->getMessage());
            return response()->json(['error' => 'Erreur lors de la mise à jour de la location'], 500);
        }
    }

    /**
     * Remove the specified location from storage.
     */
    public function destroy(Location $location): JsonResponse
    {
        try {
            // Supprimer les photos associées
            if ($location->photos) {
                $photos = is_string($location->photos) ? json_decode($location->photos, true) : $location->photos;
                if (is_array($photos)) {
                    $this->deletePhotos($photos);
                }
            }

            $location->delete();

            return response()->json(['message' => 'Location supprimée avec succès']);
        } catch (\Exception $e) {
            Log::error('Erreur lors de la suppression de la location: ' . $e->getMessage());
            return response()->json(['error' => 'Erreur lors de la suppression de la location'], 500);
        }
    }

    /**
     * Get filter options for the frontend.
     */
    public function filterOptions(): JsonResponse
    {
        return response()->json([
            'types' => Location::getTypes(),
            'statuses' => Location::getStatuses(),
        ]);
    }

    /**
     * Validation rules for location data.
     */
    protected function validationRules(?Location $location = null): array
    {
        return [
            'title' => ['required', 'string', 'max:255'],
            'location' => ['required', 'string', 'max:255'],
            'price' => ['required', 'numeric', 'min:0'],
            'type' => ['required', Rule::in(Location::getTypes())],
            'surface' => ['nullable', 'numeric', 'min:0'],
            'rooms' => ['nullable', 'integer', 'min:0'],
            'bedrooms' => ['nullable', 'integer', 'min:0'],
            'bathrooms' => ['nullable', 'integer', 'min:0'],
            'description' => ['nullable', 'string'],
            'contact_number' => ['nullable', 'string', 'max:20'],
            'status' => ['required', Rule::in(Location::getStatuses())],
            'is_featured' => ['boolean'],
            'photos.*' => ['nullable', 'image', 'mimes:jpeg,png,jpg,gif,svg', 'max:2048'], // Pour les nouveaux uploads
            'photos_to_delete' => ['nullable', 'array'], // Utilisé dans la méthode update pour gérer les suppressions
            'photos_to_delete.*' => ['string'],
        ];
    }

    /**
     * Custom validation messages in French.
     */
    protected function validationMessages(): array
    {
        return [
            'title.required' => 'Le titre est obligatoire.',
            'title.string' => 'Le titre doit être une chaîne de caractères.',
            'title.max' => 'Le titre ne peut pas dépasser 255 caractères.',
            'location.required' => 'La localisation est obligatoire.',
            'location.string' => 'La localisation doit être une chaîne de caractères.',
            'location.max' => 'La localisation ne peut pas dépasser 255 caractères.',
            'price.required' => 'Le prix est obligatoire.',
            'price.numeric' => 'Le prix doit être un nombre.',
            'price.min' => 'Le prix doit être supérieur ou égal à 0.',
            'type.required' => 'Le type est obligatoire.',
            'type.in' => 'Le type sélectionné n\'est pas valide.',
            'surface.numeric' => 'La surface doit être un nombre.',
            'surface.min' => 'La surface doit être supérieure ou égale à 0.',
            'rooms.integer' => 'Le nombre de pièces doit être un entier.',
            'rooms.min' => 'Le nombre de pièces doit être supérieur ou égal à 0.',
            'bedrooms.integer' => 'Le nombre de chambres doit être un entier.',
            'bedrooms.min' => 'Le nombre de chambres doit être supérieur ou égal à 0.',
            'bathrooms.integer' => 'Le nombre de salles de bain doit être un entier.',
            'bathrooms.min' => 'Le nombre de salles de bain doit être supérieur ou égal à 0.',
            'description.string' => 'La description doit être une chaîne de caractères.',
            'contact_number.string' => 'Le numéro de contact doit être une chaîne de caractères.',
            'contact_number.max' => 'Le numéro de contact ne peut pas dépasser 20 caractères.',
            'status.required' => 'Le statut est obligatoire.',
            'status.in' => 'Le statut sélectionné n\'est pas valide.',
            'is_featured.boolean' => 'Le champ en vedette doit être vrai ou faux.',
            'photos.*.image' => 'Les fichiers doivent être des images.',
            'photos.*.mimes' => 'Les images doivent être de type : jpeg, png, jpg, gif, svg.',
            'photos.*.max' => 'Les images ne peuvent pas dépasser 2 Mo.',
        ];
    }

    /**
     * Handle photo uploads and return array of stored paths.
     */
    protected function handlePhotoUploads(Request $request): array
    {
        $photoPaths = [];
        if ($request->hasFile('photos')) {
            foreach ($request->file('photos') as $file) {
                // Stocke le fichier dans storage/app/public/locations/photos
                $path = $file->store('locations/photos', 'public');
                $photoPaths[] = $path;
            }
        }
        return $photoPaths;
    }

    /**
     * Gère la suppression des photos sélectionnées lors de la mise à jour.
     */
    protected function deletePhotos(array $photoPaths): void
    {
        foreach ($photoPaths as $photoPath) {
            if (Storage::exists('public/' . $photoPath)) {
                Storage::delete('public/' . $photoPath);
            }
        }
    }
}
