<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Vehicule>
 */
class VehiculeFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $brands = \App\Models\Vehicule::getBrands();
        $fuelTypes = \App\Models\Vehicule::getFuelTypes();
        $transmissionTypes = \App\Models\Vehicule::getTransmissionTypes();
        // Tableau d'URL d'images de remplacement pour la démo
        $imageUrls = [
            'https://picsum.photos/seed/car1/800/600',
            'https://picsum.photos/seed/car2/800/600',
            'https://picsum.photos/seed/car3/800/600',
            // Ajoutez plus d'URLs si vous voulez plus d'images par défaut
        ];

        return [
            'brand' => $this->faker->randomElement($brands),
            'model' => $this->faker->randomElement([
                'A3', 'A4', 'A6', 'A8', 'Q3', 'Q5', 'Q7', 'TT', 'R8',
                'Série 1', 'Série 3', 'Série 5', 'Série 7', 'X1', 'X3', 'X5', 'X7',
                'Classe A', 'Classe C', 'Classe E', 'Classe S', 'GLA', 'GLC', 'GLE', 'GLS',
                'Golf', 'Passat', 'Tiguan', 'Touareg', 'Arteon', 'ID.3', 'ID.4',
                'Corolla', 'Camry', 'RAV4', 'Highlander', 'Prius', 'Yaris',
                'Civic', 'Accord', 'CR-V', 'Pilot', 'HR-V', 'Fit',
                'Focus', 'Fiesta', 'Mondeo', 'Kuga', 'Explorer', 'Mustang',
                'Leaf', 'Sentra', 'Altima', 'Rogue', 'Pathfinder', 'Armada',
                'Tucson', 'Elantra', 'Sonata', 'Santa Fe', 'Palisade',
                'Sportage', 'Sorento', 'Telluride', 'Soul', 'Niro',
                '208', '308', '408', '508', '2008', '3008', '5008',
                'Clio', 'Mégane', 'Kadjar', 'Koleos', 'Captur', 'Talisman',
                'C3', 'C4', 'C5', 'Berlingo', 'Jumpy', 'Spacetourer',
                'Corsa', 'Astra', 'Insignia', 'Crossland', 'Grandland',
                'Punto', '500', 'Panda', 'Tipo', 'Doblo', 'Ducato',
                'Octavia', 'Superb', 'Kodiaq', 'Kamiq', 'Karoq',
                'Ibiza', 'Leon', 'Ateca', 'Tarraco', 'Arona',
            ]),
            'year' => $this->faker->numberBetween(2010, date('Y')),
            'price' => $this->faker->randomFloat(2, 5000, 150000),
            'mileage' => $this->faker->numberBetween(0, 300000),
            'fuel' => $this->faker->randomElement($fuelTypes),
            'transmission' => $this->faker->randomElement($transmissionTypes),
            'color' => $this->faker->randomElement([
                'Blanc', 'Noir', 'Gris', 'Argent', 'Bleu', 'Rouge', 'Vert', 'Jaune', 'Orange', 'Violet'
            ]),
            'description' => $this->faker->paragraph(3),
            'photos' => null, // Will be handled by upload system
            'is_featured' => $this->faker->boolean(15), // 15% chance to be featured
            'is_new' => $this->faker->boolean(25), // 25% chance to be new
            'photos' => json_encode($this->faker->randomElements($imageUrls, $this->faker->numberBetween(1, 3))),
            'is_featured' => $this->faker->boolean(15),
            'is_new' => $this->faker->boolean(25),
        ];
    }

    /**
     * Indicate that the vehicle is featured.
     */
    public function featured(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_featured' => true,
        ]);
    }

    /**
     * Indicate that the vehicle is new.
     */
    public function isNew(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_new' => true,
            'mileage' => $this->faker->numberBetween(0, 100),
        ]);
    }

    /**
     * Indicate that the vehicle is used.
     */
    public function used(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_new' => false,
            'mileage' => $this->faker->numberBetween(1000, 200000),
        ]);
    }

    /**
     * Create a luxury vehicle.
     */
    public function luxury(): static
    {
        return $this->state(fn (array $attributes) => [
            'brand' => $this->faker->randomElement(['BMW', 'Mercedes-Benz', 'Audi', 'Lexus', 'Jaguar']),
            'price' => $this->faker->randomFloat(2, 80000, 200000),
            'is_featured' => true,
        ]);
    }

    /**
     * Create an electric vehicle.
     */
    public function electric(): static
    {
        return $this->state(fn (array $attributes) => [
            'fuel' => 'Electric',
            'brand' => $this->faker->randomElement(['Tesla', 'BMW', 'Mercedes-Benz', 'Audi', 'Volkswagen']),
            'model' => $this->faker->randomElement(['Model S', 'Model 3', 'Model X', 'Model Y', 'i3', 'iX', 'EQC', 'e-tron', 'ID.4']),
        ]);
    }
}
