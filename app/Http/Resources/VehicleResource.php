<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class VehicleResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'brand' => $this->brand,
            'model' => $this->model,
            'full_name' => $this->full_name,
            'year' => $this->year,
            'price' => $this->price,
            'formatted_price' => $this->formatted_price,
            'mileage' => $this->mileage,
            'fuel' => $this->fuel,
            'transmission' => $this->transmission,
            'color' => $this->color,
            'description' => $this->description,
            'photos' => $this->photos,
            'photo_urls' => $this->photo_urls,
            'is_featured' => $this->is_featured,
            'is_new' => $this->is_new,
            'created_at' => $this->created_at?->toISOString(),
            'updated_at' => $this->updated_at?->toISOString(),
        ];
    }

    /**
     * Get additional data that should be returned with the resource array.
     *
     * @return array<string, mixed>
     */
    public function with(Request $request): array
    {
        return [
            'meta' => [
                'version' => '1.0',
                'timestamp' => now()->toISOString(),
            ],
        ];
    }
}
