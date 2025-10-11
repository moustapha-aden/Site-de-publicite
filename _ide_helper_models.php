<?php

// @formatter:off
// phpcs:ignoreFile
/**
 * A helper file for your Eloquent Models
 * Copy the phpDocs from this file to the correct Model,
 * And remove them from this file, to prevent double declarations.
 *
 * @author Barry vd. Heuvel <barryvdh@gmail.com>
 */


namespace App\Models{
/**
 * @property int $id
 * @property string $name
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Vehicule> $vehicules
 * @property-read int|null $vehicules_count
 * @method static \Database\Factories\BrandFactory factory($count = null, $state = [])
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Brand newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Brand newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Brand query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Brand whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Brand whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Brand whereName($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Brand whereUpdatedAt($value)
 */
	class Brand extends \Eloquent {}
}

namespace App\Models{
/**
 * @property int $id
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @method static \Database\Factories\ReparationFactory factory($count = null, $state = [])
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Reparation newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Reparation newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Reparation query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Reparation whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Reparation whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Reparation whereUpdatedAt($value)
 */
	class Reparation extends \Eloquent {}
}

namespace App\Models{
/**
 * @property int $id
 * @property string $name
 * @property string $email
 * @property \Illuminate\Support\Carbon|null $email_verified_at
 * @property string $password
 * @property string|null $remember_token
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \Illuminate\Notifications\DatabaseNotificationCollection<int, \Illuminate\Notifications\DatabaseNotification> $notifications
 * @property-read int|null $notifications_count
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \Laravel\Sanctum\PersonalAccessToken> $tokens
 * @property-read int|null $tokens_count
 * @method static \Database\Factories\UserFactory factory($count = null, $state = [])
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User whereEmail($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User whereEmailVerifiedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User whereName($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User wherePassword($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User whereRememberToken($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User whereUpdatedAt($value)
 */
	class User extends \Eloquent {}
}

namespace App\Models{
/**
 * @property int $id
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property string $brand
 * @property string $model
 * @property int $year
 * @property numeric $price
 * @property int $mileage
 * @property string $fuel
 * @property string $transmission
 * @property string $color
 * @property string|null $description
 * @property array<array-key, mixed>|null $photos
 * @property bool $is_featured
 * @property bool $is_new
 * @property string|null $contact_number
 * @property string $status
 * @property-read string|null $formatted_contact
 * @property-read string $formatted_price
 * @property-read string $full_name
 * @property-read array $photo_urls
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Vehicule active()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Vehicule byBrand(string $brand)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Vehicule byFuel(string $fuel)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Vehicule byTransmission(string $transmission)
 * @method static \Database\Factories\VehiculeFactory factory($count = null, $state = [])
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Vehicule featured()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Vehicule inactive()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Vehicule new()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Vehicule newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Vehicule newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Vehicule priceRange(?float $min = null, ?float $max = null)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Vehicule query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Vehicule search(string $search)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Vehicule used()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Vehicule whereBrand($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Vehicule whereColor($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Vehicule whereContactNumber($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Vehicule whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Vehicule whereDescription($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Vehicule whereFuel($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Vehicule whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Vehicule whereIsFeatured($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Vehicule whereIsNew($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Vehicule whereMileage($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Vehicule whereModel($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Vehicule wherePhotos($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Vehicule wherePrice($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Vehicule whereStatus($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Vehicule whereTransmission($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Vehicule whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Vehicule whereYear($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Vehicule yearRange(?int $min = null, ?int $max = null)
 */
	class Vehicule extends \Eloquent {}
}

