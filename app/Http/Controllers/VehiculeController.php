<?php

namespace App\Http\Controllers;

use App\Http\Requests\VehicleStoreRequest;
use App\Http\Requests\VehicleUpdateRequest;
use App\Http\Resources\VehicleResource;
use App\Models\Vehicule;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;

class VehiculeController extends Controller
{
    /**
     * Display a listing of the vehicles with filters and search.
     */
    public function index(Request $request): JsonResponse
    {
        try {
            $query = Vehicule::query();

            // Apply filters
            if ($request->filled('search')) {
                $query->search($request->search);
            }

            if ($request->filled('brand')) {
                $query->byBrand($request->brand);
            }

            if ($request->filled('fuel')) {
                $query->byFuel($request->fuel);
            }

            if ($request->filled('transmission')) {
                $query->byTransmission($request->transmission);
            }

            if ($request->filled('is_featured')) {
                $query->featured();
            }

            if ($request->filled('is_new')) {
                if ($request->boolean('is_new')) {
                    $query->new();
                } else {
                    $query->used();
                }
            }

            if ($request->filled('status')) {
                if ($request->input('status') === 'active') {
                    $query->active();
                } elseif ($request->input('status') === 'inactive') {
                    $query->inactive();
                }
            }

            if ($request->filled('price_min') || $request->filled('price_max')) {
                $query->priceRange(
                    $request->input('price_min'),
                    $request->input('price_max')
                );
            }

            if ($request->filled('year_min') || $request->filled('year_max')) {
                $query->yearRange(
                    $request->input('year_min'),
                    $request->input('year_max')
                );
            }

            // Sorting
            $sortBy = $request->input('sort_by', 'created_at');
            $sortOrder = $request->input('sort_order', 'desc');

            if (in_array($sortBy, ['brand', 'model', 'year', 'price', 'mileage', 'created_at'])) {
                $query->orderBy($sortBy, $sortOrder);
            }

            // Pagination
            $perPage = min($request->input('per_page', 15), 100); // Max 100 per page
            $vehicles = $query->paginate($perPage);

            return response()->json([
                'success' => true,
                'message' => 'Vehicles retrieved successfully',
                'data' => VehicleResource::collection($vehicles->items()),
                'meta' => [
                    'current_page' => $vehicles->currentPage(),
                    'last_page' => $vehicles->lastPage(),
                    'per_page' => $vehicles->perPage(),
                    'total' => $vehicles->total(),
                    'from' => $vehicles->firstItem(),
                    'to' => $vehicles->lastItem(),
                ],
            ]);

        } catch (\Exception $e) {
            Log::error('Error retrieving vehicles: ' . $e->getMessage());

            return response()->json([
                'success' => false,
                'message' => 'An error occurred while retrieving vehicles',
                'error' => config('app.debug') ? $e->getMessage() : 'Internal server error',
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Store a newly created vehicle in storage.
     */
    public function store(VehicleStoreRequest $request): JsonResponse
    {
        try {
            $data = $request->validated();

            // Handle photo uploads
            if ($request->hasFile('photos')) {
                $photoPaths = [];
                foreach ($request->file('photos') as $photo) {
                    $path = $photo->store('vehicles', 'public');
                    $photoPaths[] = $path;
                }
                $data['photos'] = $photoPaths;
            }

            $vehicle = Vehicule::create($data);

            Log::info('Vehicle created', ['vehicle_id' => $vehicle->id, 'user_id' => auth()->id()]);

            return response()->json([
                'success' => true,
                'message' => 'Vehicle created successfully',
                'data' => new VehicleResource($vehicle),
            ], Response::HTTP_CREATED);

        } catch (\Exception $e) {
            Log::error('Error creating vehicle: ' . $e->getMessage());

            return response()->json([
                'success' => false,
                'message' => 'An error occurred while creating the vehicle',
                'error' => config('app.debug') ? $e->getMessage() : 'Internal server error',
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Display the specified vehicle.
     */
    public function show(Vehicule $vehicule): JsonResponse
    {
        try {
            return response()->json([
                'success' => true,
                'message' => 'Vehicle retrieved successfully',
                'data' => new VehicleResource($vehicule),
            ]);

        } catch (\Exception $e) {
            Log::error('Error retrieving vehicle: ' . $e->getMessage());

            return response()->json([
                'success' => false,
                'message' => 'An error occurred while retrieving the vehicle',
                'error' => config('app.debug') ? $e->getMessage() : 'Internal server error',
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Update the specified vehicle in storage.
     */
    public function update(VehicleUpdateRequest $request, Vehicule $vehicule): JsonResponse
    {
        try {
            $data = $request->validated();

            // Handle photo uploads
            if ($request->hasFile('photos')) {
                // Delete old photos - AVEC PROTECTION
                $oldPhotos = $vehicule->photos;

                // S'assurer que c'est bien un tableau
                if (is_string($oldPhotos)) {
                    $oldPhotos = json_decode($oldPhotos, true) ?? [];
                }

                if (is_array($oldPhotos) && !empty($oldPhotos)) {
                    foreach ($oldPhotos as $photo) {
                        if ($photo && Storage::disk('public')->exists($photo)) {
                            Storage::disk('public')->delete($photo);
                        }
                    }
                }

                // Upload new photos
                $photoPaths = [];
                foreach ($request->file('photos') as $photo) {
                    $path = $photo->store('vehicles', 'public');
                    $photoPaths[] = $path;
                }
                $data['photos'] = $photoPaths;
            }

            $vehicule->update($data);

            Log::info('Vehicle updated', ['vehicle_id' => $vehicule->id, 'user_id' => auth()->id()]);

            return response()->json([
                'success' => true,
                'message' => 'Vehicle updated successfully',
                'data' => new VehicleResource($vehicule->fresh()),
            ]);

        } catch (\Exception $e) {
            Log::error('Error updating vehicle: ' . $e->getMessage(), [
                'vehicle_id' => $vehicule->id ?? null,
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'An error occurred while updating the vehicle',
                'error' => config('app.debug') ? $e->getMessage() : 'Internal server error',
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Remove the specified vehicle from storage.
     */
    public function destroy(Vehicule $vehicule): JsonResponse
    {
        try {
            // Delete associated photos - AVEC PROTECTION
            $photos = $vehicule->photos;

            // S'assurer que c'est bien un tableau
            if (is_string($photos)) {
                $photos = json_decode($photos, true) ?? [];
            }

            if (is_array($photos) && !empty($photos)) {
                foreach ($photos as $photo) {
                    if ($photo && Storage::disk('public')->exists($photo)) {
                        Storage::disk('public')->delete($photo);
                    }
                }
            }

            $vehicule->delete();

            Log::info('Vehicle deleted', ['vehicle_id' => $vehicule->id, 'user_id' => auth()->id()]);

            return response()->json([
                'success' => true,
                'message' => 'Vehicle deleted successfully',
            ]);

        } catch (\Exception $e) {
            Log::error('Error deleting vehicle: ' . $e->getMessage(), [
                'vehicle_id' => $vehicule->id ?? null,
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'An error occurred while deleting the vehicle',
                'error' => config('app.debug') ? $e->getMessage() : 'Internal server error',
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Get available filter options for vehicles.
     */
    public function filterOptions(): JsonResponse
    {
        try {
            return response()->json([
                'success' => true,
                'message' => 'Filter options retrieved successfully',
                'data' => [
                    'brands' => Vehicule::getBrands(),
                    'fuel_types' => Vehicule::getFuelTypes(),
                    'transmission_types' => Vehicule::getTransmissionTypes(),
                    'statuses' => Vehicule::getStatuses(),
                ],
            ]);

        } catch (\Exception $e) {
            Log::error('Error retrieving filter options: ' . $e->getMessage());

            return response()->json([
                'success' => false,
                'message' => 'An error occurred while retrieving filter options',
                'error' => config('app.debug') ? $e->getMessage() : 'Internal server error',
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }
}
