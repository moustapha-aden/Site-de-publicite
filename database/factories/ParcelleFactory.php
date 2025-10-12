<?php

namespace Database\Factories;

use App\Models\Parcelle;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Parcelle>
 */
class ParcelleFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = Parcelle::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'title' => $this->faker->sentence(3),
            'location' => $this->faker->city(),
            'price' => $this->faker->randomFloat(2, 50000, 500000),
            'type' => $this->faker->randomElement(['terrain', 'maison', 'appartement', 'villa', 'bureau', 'commerce']),
            'surface' => $this->faker->numberBetween(50, 1000),
            'rooms' => $this->faker->numberBetween(1, 8),
            'bedrooms' => $this->faker->numberBetween(1, 5),
            'bathrooms' => $this->faker->numberBetween(1, 4),
            'description' => $this->faker->paragraph(),
            'photos' => json_encode([
                'https://picsum.photos/800/600?random=' . rand(1, 100),
                'https://picsum.photos/800/600?random=' . rand(1, 100),
                'https://picsum.photos/800/600?random=' . rand(1, 100)
            ]),
            'contact_number' => $this->faker->phoneNumber(),
            'status' => $this->faker->randomElement(['active', 'inactive']),
            'is_featured' => $this->faker->boolean(20), // 20% chance d'être en vedette
        ];
    }
}
