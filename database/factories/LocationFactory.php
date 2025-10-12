<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Location>
 */
class LocationFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $types = \App\Models\Location::getTypes();

        // Tableau d'URL d'images de remplacement pour la démo
        $imageUrls = [
            'https://picsum.photos/seed/house1/800/600',
            'https://picsum.photos/seed/house2/800/600',
            'https://picsum.photos/seed/house3/800/600',
            'https://picsum.photos/seed/apartment1/800/600',
            'https://picsum.photos/seed/apartment2/800/600',
            'https://picsum.photos/seed/villa1/800/600',
            'https://picsum.photos/seed/office1/800/600',
            'https://picsum.photos/seed/commerce1/800/600',
        ];

        return [
            'title' => $this->faker->randomElement([
                'Belle maison familiale',
                'Appartement moderne',
                'Villa luxueuse',
                'Bureau professionnel',
                'Commerce idéal',
                'Maison avec jardin',
                'Appartement en centre-ville',
                'Villa avec piscine',
                'Bureau spacieux',
                'Local commercial'
            ]) . ' à ' . $this->faker->city(),
            'location' => $this->faker->city() . ', ' . $this->faker->country(),
            'price' => $this->faker->randomFloat(2, 200, 5000),
            'type' => $this->faker->randomElement($types),
            'surface' => $this->faker->randomFloat(2, 30, 500),
            'rooms' => $this->faker->numberBetween(1, 10),
            'bedrooms' => $this->faker->numberBetween(1, 6),
            'bathrooms' => $this->faker->numberBetween(1, 4),
            'description' => $this->faker->paragraph(3),
            'photos' => json_encode($this->faker->randomElements($imageUrls, $this->faker->numberBetween(1, 4))),
            'contact_number' => '+253' . $this->faker->numerify('########'),
            'status' => $this->faker->randomElement(['active', 'inactive']),
            'is_featured' => $this->faker->boolean(15), // 15% chance to be featured
        ];
    }

    /**
     * Indicate that the location is featured.
     */
    public function featured(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_featured' => true,
        ]);
    }

    /**
     * Indicate that the location is active.
     */
    public function active(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'active',
        ]);
    }

    /**
     * Indicate that the location is inactive.
     */
    public function inactive(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'inactive',
        ]);
    }

    /**
     * Create a luxury location.
     */
    public function luxury(): static
    {
        return $this->state(fn (array $attributes) => [
            'type' => 'villa',
            'price' => $this->faker->randomFloat(2, 2000, 8000),
            'surface' => $this->faker->randomFloat(2, 200, 800),
            'bedrooms' => $this->faker->numberBetween(4, 8),
            'bathrooms' => $this->faker->numberBetween(3, 6),
            'is_featured' => true,
        ]);
    }

    /**
     * Create a small apartment.
     */
    public function small(): static
    {
        return $this->state(fn (array $attributes) => [
            'type' => 'appartement',
            'price' => $this->faker->randomFloat(2, 200, 800),
            'surface' => $this->faker->randomFloat(2, 30, 60),
            'rooms' => $this->faker->numberBetween(1, 3),
            'bedrooms' => $this->faker->numberBetween(1, 2),
            'bathrooms' => 1,
        ]);
    }
}
