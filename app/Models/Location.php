<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Facades\Storage;

class Location extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'location',
        'price',
        'type',
        'surface',
        'rooms',
        'bedrooms',
        'bathrooms',
        'description',
        'photos',
        'contact_number',
        'status',
        'is_featured',
    ];

    protected $casts = [
        'photos' => 'array',
        'is_featured' => 'boolean',
        'price' => 'decimal:2',
        'surface' => 'decimal:2',
        'rooms' => 'integer',
        'bedrooms' => 'integer',
        'bathrooms' => 'integer',
    ];

    protected $appends = ['formatted_price', 'photo_urls', 'formatted_contact'];

    /** Formatted price */
    public function getFormattedPriceAttribute(): string
    {
        return number_format($this->price, 2) . ' FDJ';
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

        return array_map(function($photo) {
            // Si c'est déjà une URL complète (comme picsum.photos), la retourner directement
            if (str_starts_with($photo, 'http')) {
                return $photo;
            }
            // Sinon, construire l'URL avec Storage
            return Storage::url($photo);
        }, $photos);
    }

    /** Scopes */
    public function scopeFeatured(Builder $query): Builder
    {
        return $query->where('is_featured', true);
    }

    public function scopeActive(Builder $query): Builder
    {
        return $query->where('status', 'active');
    }

    public function scopeInactive(Builder $query): Builder
    {
        return $query->where('status', 'inactive');
    }

    public function scopeByType(Builder $query, string $type): Builder
    {
        return $query->where('type', $type);
    }

    public function scopeByLocation(Builder $query, string $location): Builder
    {
        return $query->where('location', 'like', "%{$location}%");
    }

    public function scopePriceRange(Builder $query, float $min = null, float $max = null): Builder
    {
        if ($min !== null) $query->where('price', '>=', $min);
        if ($max !== null) $query->where('price', '<=', $max);
        return $query;
    }

    public function scopeSurfaceRange(Builder $query, float $min = null, float $max = null): Builder
    {
        if ($min !== null) $query->where('surface', '>=', $min);
        if ($max !== null) $query->where('surface', '<=', $max);
        return $query;
    }

    public function scopeSearch(Builder $query, string $search): Builder
    {
        return $query->where(fn($q) =>
            $q->where('title', 'like', "%{$search}%")
              ->orWhere('location', 'like', "%{$search}%")
              ->orWhere('description', 'like', "%{$search}%")
        );
    }

    /** Static lists */
    public static function getTypes(): array
    {
        return ['maison', 'appartement', 'villa', 'bureau', 'commerce'];
    }

    public static function getStatuses(): array
    {
        return ['active', 'inactive'];
    }
}
