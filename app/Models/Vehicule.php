<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Facades\Storage;

class Vehicule extends Model
{
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
        'contact_number',
        'status', // ✅ ajout du champ status
    ];

    protected $casts = [
        'photos' => 'array',
        'is_featured' => 'boolean',
        'is_new' => 'boolean',
        'price' => 'decimal:2',
        'year' => 'integer',
        'mileage' => 'integer',
    ];

    protected $appends = ['full_name', 'formatted_price', 'photo_urls', 'formatted_contact']; // ✅ ajouté ici pour inclure dans JSON

    /** Full name (brand + model) */
    public function getFullNameAttribute(): string
    {
        return "{$this->brand} {$this->model}";
    }

    /** Formatted price */
    public function getFormattedPriceAttribute(): string
    {
        return number_format($this->price, 2) . ' €';
    }

    /** Formatted contact number (+253 prefix) */
    public function getFormattedContactAttribute(): ?string
    {
        if (!$this->contact_number) {
            return null;
        }

        if (str_starts_with($this->contact_number, '+')) {
            return $this->contact_number;
        }

        return '+253 ' . $this->contact_number;
    }

    /** Photo URLs accessor */
    public function getPhotoUrlsAttribute(): array
    {
        $photos = $this->photos;

        if (is_string($photos)) {
            $photos = json_decode($photos, true) ?? [];
        }

        if (!is_array($photos)) {
            return [];
        }

        return array_map(fn($photo) => Storage::url($photo), $photos);
    }

    /** Scopes */
    public function scopeFeatured(Builder $query): Builder
    {
        return $query->where('is_featured', true);
    }

    public function scopeNew(Builder $query): Builder
    {
        return $query->where('is_new', true);
    }

    public function scopeUsed(Builder $query): Builder
    {
        return $query->where('is_new', false);
    }

    public function scopeByBrand(Builder $query, string $brand): Builder
    {
        return $query->where('brand', 'like', "%{$brand}%");
    }

    public function scopePriceRange(Builder $query, float $min = null, float $max = null): Builder
    {
        if ($min !== null) $query->where('price', '>=', $min);
        if ($max !== null) $query->where('price', '<=', $max);
        return $query;
    }

    public function scopeYearRange(Builder $query, int $min = null, int $max = null): Builder
    {
        if ($min !== null) $query->where('year', '>=', $min);
        if ($max !== null) $query->where('year', '<=', $max);
        return $query;
    }

    public function scopeByFuel(Builder $query, string $fuel): Builder
    {
        return $query->where('fuel', $fuel);
    }

    public function scopeByTransmission(Builder $query, string $transmission): Builder
    {
        return $query->where('transmission', $transmission);
    }

    public function scopeSearch(Builder $query, string $search): Builder
    {
        return $query->where(fn($q) =>
            $q->where('brand', 'like', "%{$search}%")
              ->orWhere('model', 'like', "%{$search}%")
              ->orWhere('description', 'like', "%{$search}%")
        );
    }

    /** Scopes pour le statut */
    public function scopeActive(Builder $query): Builder
    {
        return $query->where('status', 'active');
    }

    public function scopeInactive(Builder $query): Builder
    {
        return $query->where('status', 'inactive');
    }

    /** Static lists */
    public static function getFuelTypes(): array
    {
        return ['Gasoline', 'Diesel', 'Electric', 'Hybrid', 'LPG'];
    }

    public static function getTransmissionTypes(): array
    {
        return ['Manual', 'Automatic', 'Semi-Automatic', 'CVT'];
    }

    public static function getBrands(): array
    {
        return [
            'Audi', 'BMW', 'Mercedes-Benz', 'Volkswagen', 'Toyota',
            'Honda', 'Ford', 'Nissan', 'Hyundai', 'Kia', 'Peugeot',
            'Renault', 'Citroën', 'Opel', 'Fiat', 'Skoda', 'SEAT'
        ];
    }

    public static function getStatuses(): array
    {
        return ['active', 'inactive'];
    }
}
