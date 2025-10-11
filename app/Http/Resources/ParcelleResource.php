<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ParcelleResource extends JsonResource
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
            'title' => $this->title,
            'location' => $this->location,
            'price' => $this->price,
            'type' => $this->type,
            'surface' => $this->surface,
            'rooms' => $this->rooms,
            'bedrooms' => $this->bedrooms,
            'bathrooms' => $this->bathrooms,
            'description' => $this->description,
            'photos' => $this->photos,
            'contact_number' => $this->contact_number,
            'status' => $this->status,
            'is_featured' => $this->is_featured,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,

            // Computed attributes
            'formatted_price' => $this->formatted_price,
            'photo_urls' => $this->photo_urls,
            'formatted_contact' => $this->formatted_contact,
        ];
    }
}
