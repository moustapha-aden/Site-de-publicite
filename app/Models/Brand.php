<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Brand extends Model
{
    use HasFactory;

    protected $fillable = ['name'];

    /** Relation inverse : une marque a plusieurs véhicules */
    public function vehicules()
    {
        return $this->hasMany(Vehicule::class);
    }
}
