<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Facades\Storage;

class Vehicule extends Model
{
    /** @use HasFactory<\Database\Factories\VehiculeFactory> */
    use HasFactory;

    protected $fillable = [
        'brand',
        'model',
        'year',
        'price',
        'mileage',
        'fuel',
        'transmission',
        'color',
        'description',
        'photos',
        'is_featured',
        'is_new',
    ];

    protected $casts = [
        'photos' => 'array',
        'is_featured' => 'boolean',
        'is_new' => 'boolean',
        'price' => 'decimal:2',
        'year' => 'integer',
        'mileage' => 'integer',
    ];


    protected $appends = ['full_name', 'formatted_price', 'photo_urls']; // <-- AJOUTEZ CECI

    /**
     * Get the vehicle's full name (brand + model)
     */
    public function getFullNameAttribute(): string
    {
        return "{$this->brand} {$this->model}";
    }

    /**
     * Get formatted price
     */
    public function getFormattedPriceAttribute(): string
    {
        return number_format($this->price, 2) . ' €';
    }

    /**
     * Scope for featured vehicles
     */
    public function scopeFeatured(Builder $query): Builder
    {
        return $query->where('is_featured', true);
    }

    /**
     * Scope for new vehicles
     */
    public function scopeNew(Builder $query): Builder
    {
        return $query->where('is_new', true);
    }

    /**
     * Scope for used vehicles
     */
    public function scopeUsed(Builder $query): Builder
    {
        return $query->where('is_new', false);
    }

    /**
     * Scope for vehicles by brand
     */
    public function scopeByBrand(Builder $query, string $brand): Builder
    {
        return $query->where('brand', 'like', "%{$brand}%");
    }

    /**
     * Scope for vehicles by price range
     */
    public function scopePriceRange(Builder $query, float $min = null, float $max = null): Builder
    {
        if ($min !== null) {
            $query->where('price', '>=', $min);
        }
        if ($max !== null) {
            $query->where('price', '<=', $max);
        }
        return $query;
    }

    /**
     * Scope for vehicles by year range
     */
    public function scopeYearRange(Builder $query, int $min = null, int $max = null): Builder
    {
        if ($min !== null) {
            $query->where('year', '>=', $min);
        }
        if ($max !== null) {
            $query->where('year', '<=', $max);
        }
        return $query;
    }

    /**
     * Scope for vehicles by fuel type
     */
    public function scopeByFuel(Builder $query, string $fuel): Builder
    {
        return $query->where('fuel', $fuel);
    }

    /**
     * Scope for vehicles by transmission
     */
    public function scopeByTransmission(Builder $query, string $transmission): Builder
    {
        return $query->where('transmission', $transmission);
    }

    /**
     * Search scope
     */
    public function scopeSearch(Builder $query, string $search): Builder
    {
        return $query->where(function ($q) use ($search) {
            $q->where('brand', 'like', "%{$search}%")
              ->orWhere('model', 'like', "%{$search}%")
              ->orWhere('description', 'like', "%{$search}%");
        });
    }

    /**
     * Get photo URLs
     */
     public function getPhotoUrlsAttribute(): array
    {
        // CORRECTION DANS L'ACCESSEUR :
        $photos = $this->photos;

        if (is_string($photos)) {
            // Si c'est une chaîne, essayez de la décoder.
            // Si le décodage échoue (ou si la chaîne est vide), on obtient un tableau vide.
            $photos = json_decode($photos, true) ?? [];
        }

        // Si après le cast, c'est null (ce qui arrive si la DB contient NULL et que $casts n'a pas été appliqué)
        if (!is_array($photos)) {
             return [];
        }

        return array_map(function ($photo) {
            return Storage::url($photo);}
            , $photos); // <-- On utilise $photos, qui est maintenant garanti d'être un tableau
}

    /**
     * Available fuel types
     */
    public static function getFuelTypes(): array
    {
        return ['Gasoline', 'Diesel', 'Electric', 'Hybrid', 'LPG'];
    }

    /**
     * Available transmission types
     */
    public static function getTransmissionTypes(): array
    {
        return ['Manual', 'Automatic', 'Semi-Automatic', 'CVT'];
    }

    /**
     * Available brands
     */
    public static function getBrands(): array
    {
        return [
            'Audi', 'BMW', 'Mercedes-Benz', 'Volkswagen', 'Toyota',
            'Honda', 'Ford', 'Nissan', 'Hyundai', 'Kia', 'Peugeot',
            'Renault', 'Citroën', 'Opel', 'Fiat', 'Skoda', 'SEAT'
        ];
    }
}
