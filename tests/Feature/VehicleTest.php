<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\Vehicule;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class VehicleTest extends TestCase
{
    use RefreshDatabase, WithFaker;

    protected function setUp(): void
    {
        parent::setUp();
        Storage::fake('public');
    }

    /** @test */
    public function can_get_vehicles_list()
    {
        Vehicule::factory()->count(5)->create();

        $response = $this->getJson('/api/vehicles');

        $response->assertStatus(200)
                ->assertJsonStructure([
                    'success',
                    'message',
                    'data' => [
                        '*' => [
                            'id',
                            'brand',
                            'model',
                            'full_name',
                            'year',
                            'price',
                            'formatted_price',
                            'mileage',
                            'fuel',
                            'transmission',
                            'color',
                            'description',
                            'is_featured',
                            'is_new',
                            'created_at',
                            'updated_at'
                        ]
                    ],
                    'meta'
                ]);
    }

    /** @test */
    public function can_get_single_vehicle()
    {
        $vehicle = Vehicule::factory()->create();

        $response = $this->getJson("/api/vehicles/{$vehicle->id}");

        $response->assertStatus(200)
                ->assertJsonStructure([
                    'success',
                    'message',
                    'data' => [
                        'id',
                        'brand',
                        'model',
                        'full_name',
                        'year',
                        'price',
                        'formatted_price',
                        'mileage',
                        'fuel',
                        'transmission',
                        'color',
                        'description',
                        'is_featured',
                        'is_new'
                    ]
                ]);
    }

    /** @test */
    public function can_filter_vehicles_by_brand()
    {
        Vehicule::factory()->create(['brand' => 'BMW']);
        Vehicule::factory()->create(['brand' => 'Audi']);

        $response = $this->getJson('/api/vehicles?brand=BMW');

        $response->assertStatus(200);
        $this->assertCount(1, $response->json('data'));
        $this->assertEquals('BMW', $response->json('data.0.brand'));
    }

    /** @test */
    public function can_filter_vehicles_by_price_range()
    {
        Vehicule::factory()->create(['price' => 10000]);
        Vehicule::factory()->create(['price' => 50000]);
        Vehicule::factory()->create(['price' => 100000]);

        $response = $this->getJson('/api/vehicles?price_min=20000&price_max=80000');

        $response->assertStatus(200);
        $this->assertCount(1, $response->json('data'));
        $this->assertEquals(50000, $response->json('data.0.price'));
    }

    /** @test */
    public function can_search_vehicles()
    {
        Vehicule::factory()->create(['brand' => 'BMW', 'model' => 'X5']);
        Vehicule::factory()->create(['brand' => 'Audi', 'model' => 'A4']);

        $response = $this->getJson('/api/vehicles?search=BMW');

        $response->assertStatus(200);
        $this->assertCount(1, $response->json('data'));
        $this->assertEquals('BMW', $response->json('data.0.brand'));
    }

    /** @test */
    public function can_get_featured_vehicles()
    {
        Vehicule::factory()->count(3)->create(['is_featured' => false]);
        Vehicule::factory()->count(2)->create(['is_featured' => true]);

        $response = $this->getJson('/api/vehicles?is_featured=true');

        $response->assertStatus(200);
        $this->assertCount(2, $response->json('data'));
        $this->assertTrue($response->json('data.0.is_featured'));
        $this->assertTrue($response->json('data.1.is_featured'));
    }

    /** @test */
    public function can_get_filter_options()
    {
        $response = $this->getJson('/api/vehicles/filter/options');

        $response->assertStatus(200)
                ->assertJsonStructure([
                    'success',
                    'message',
                    'data' => [
                        'brands',
                        'fuel_types',
                        'transmission_types'
                    ]
                ]);
    }

    /** @test */
    public function authenticated_user_can_create_vehicle()
    {
        $user = User::factory()->create();
        Sanctum::actingAs($user);

        $vehicleData = [
            'brand' => 'BMW',
            'model' => 'X5',
            'year' => 2023,
            'price' => 75000.00,
            'mileage' => 15000,
            'fuel' => 'Gasoline',
            'transmission' => 'Automatic',
            'color' => 'Black',
            'description' => 'Beautiful BMW X5',
            'is_featured' => true,
            'is_new' => true,
        ];

        $response = $this->postJson('/api/vehicles', $vehicleData);

        $response->assertStatus(201)
                ->assertJsonStructure([
                    'success',
                    'message',
                    'data' => [
                        'id',
                        'brand',
                        'model',
                        'year',
                        'price'
                    ]
                ]);

        $this->assertDatabaseHas('vehicules', [
            'brand' => 'BMW',
            'model' => 'X5',
            'year' => 2023,
            'price' => 75000.00,
        ]);
    }

    /** @test */
    public function can_create_vehicle_with_photos()
    {
        $user = User::factory()->create();
        Sanctum::actingAs($user);

        $photo1 = UploadedFile::fake()->image('vehicle1.jpg');
        $photo2 = UploadedFile::fake()->image('vehicle2.jpg');

        $vehicleData = [
            'brand' => 'Audi',
            'model' => 'A4',
            'year' => 2023,
            'price' => 45000.00,
            'mileage' => 0,
            'fuel' => 'Gasoline',
            'transmission' => 'Automatic',
            'color' => 'White',
            'description' => 'New Audi A4',
            'is_featured' => false,
            'is_new' => true,
            'photos' => [$photo1, $photo2],
        ];

        $response = $this->postJson('/api/vehicles', $vehicleData);

        $response->assertStatus(201);

        $vehicle = Vehicule::latest()->first();
        $this->assertCount(2, $vehicle->photos);
        Storage::disk('public')->assertExists($vehicle->photos[0]);
        Storage::disk('public')->assertExists($vehicle->photos[1]);
    }

    /** @test */
    public function vehicle_creation_validates_required_fields()
    {
        $user = User::factory()->create();
        Sanctum::actingAs($user);

        $response = $this->postJson('/api/vehicles', []);

        $response->assertStatus(422)
                ->assertJsonValidationErrors([
                    'brand',
                    'model',
                    'year',
                    'price',
                    'mileage',
                    'fuel',
                    'transmission',
                    'color'
                ]);
    }

    /** @test */
    public function vehicle_creation_validates_brand_enum()
    {
        $user = User::factory()->create();
        Sanctum::actingAs($user);

        $vehicleData = [
            'brand' => 'InvalidBrand',
            'model' => 'Test',
            'year' => 2023,
            'price' => 30000,
            'mileage' => 10000,
            'fuel' => 'Gasoline',
            'transmission' => 'Automatic',
            'color' => 'Red',
        ];

        $response = $this->postJson('/api/vehicles', $vehicleData);

        $response->assertStatus(422)
                ->assertJsonValidationErrors(['brand']);
    }

    /** @test */
    public function authenticated_user_can_update_vehicle()
    {
        $user = User::factory()->create();
        $vehicle = Vehicule::factory()->create();
        Sanctum::actingAs($user);

        $updateData = [
            'price' => 85000.00,
            'is_featured' => true,
        ];

        $response = $this->putJson("/api/vehicles/{$vehicle->id}", $updateData);

        $response->assertStatus(200);

        $vehicle->refresh();
        $this->assertEquals(85000.00, $vehicle->price);
        $this->assertTrue($vehicle->is_featured);
    }

    /** @test */
    public function authenticated_user_can_delete_vehicle()
    {
        $user = User::factory()->create();
        $vehicle = Vehicule::factory()->create();
        Sanctum::actingAs($user);

        $response = $this->deleteJson("/api/vehicles/{$vehicle->id}");

        $response->assertStatus(200);
        $this->assertDatabaseMissing('vehicules', ['id' => $vehicle->id]);
    }

    /** @test */
    public function unauthenticated_user_cannot_create_vehicle()
    {
        $vehicleData = [
            'brand' => 'BMW',
            'model' => 'X5',
            'year' => 2023,
            'price' => 75000.00,
            'mileage' => 15000,
            'fuel' => 'Gasoline',
            'transmission' => 'Automatic',
            'color' => 'Black',
        ];

        $response = $this->postJson('/api/vehicles', $vehicleData);

        $response->assertStatus(401);
    }

    /** @test */
    public function unauthenticated_user_cannot_update_vehicle()
    {
        $vehicle = Vehicule::factory()->create();

        $response = $this->putJson("/api/vehicles/{$vehicle->id}", ['price' => 50000]);

        $response->assertStatus(401);
    }

    /** @test */
    public function unauthenticated_user_cannot_delete_vehicle()
    {
        $vehicle = Vehicule::factory()->create();

        $response = $this->deleteJson("/api/vehicles/{$vehicle->id}");

        $response->assertStatus(401);
    }
}
