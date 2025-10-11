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
            'year' => $this->year,
            'price' => $this->price,
            'mileage' => $this->mileage,
            'fuel' => $this->fuel,
            'transmission' => $this->transmission,
            'color' => $this->color,
            'description' => $this->description,
            'is_featured' => $this->is_featured,
            'is_new' => $this->is_new,

            // IMPORTANT: Retourner les photos avec les URLs complètes
            'photos' => $this->photos, // Le tableau brut
            'photo_urls' => $this->photo_urls, // Les URLs complètes (depuis l'accessor)

            // Infos supplémentaires
            'full_name' => $this->full_name,
            'formatted_price' => $this->formatted_price,
            'contact_number' => $this->contact_number,
            // Timestamps
            'created_at' => $this->created_at?->toISOString(),
            'updated_at' => $this->updated_at?->toISOString(),
        ];
    }
}
