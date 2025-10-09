<?php

namespace Tests\Unit;

use App\Models\Vehicule;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class VehicleModelTest extends TestCase
{
    use RefreshDatabase;

    /** @test */
    public function vehicle_has_correct_fillable_attributes()
    {
        $vehicle = new Vehicule();

        $expectedFillable = [
            'brand',
            'model',
            'year',
            'price',
            'mileage',
            'fuel',
            'transmission',
            'color',
            'description',
            'photos',
            'is_featured',
            'is_new',
        ];

        $this->assertEquals($expectedFillable, $vehicle->getFillable());
    }

    /** @test */
    public function vehicle_has_correct_casts()
    {
        $vehicle = new Vehicule();

        $expectedCasts = [
            'photos' => 'array',
            'is_featured' => 'boolean',
            'is_new' => 'boolean',
            'price' => 'decimal:2',
            'year' => 'integer',
            'mileage' => 'integer',
        ];

        $this->assertEquals($expectedCasts, $vehicle->getCasts());
    }

    /** @test */
    public function vehicle_has_appended_attributes()
    {
        $vehicle = Vehicule::factory()->create([
            'brand' => 'BMW',
            'model' => 'X5',
            'price' => 75000.50,
        ]);

        $this->assertArrayHasKey('full_name', $vehicle->toArray());
        $this->assertArrayHasKey('formatted_price', $vehicle->toArray());
        $this->assertEquals('BMW X5', $vehicle->full_name);
        $this->assertEquals('75,000.50 €', $vehicle->formatted_price);
    }

    /** @test */
    public function featured_scope_returns_only_featured_vehicles()
    {
        Vehicule::factory()->count(3)->create(['is_featured' => false]);
        Vehicule::factory()->count(2)->create(['is_featured' => true]);

        $featuredVehicles = Vehicule::featured()->get();

        $this->assertCount(2, $featuredVehicles);
        $this->assertTrue($featuredVehicles->every(fn($vehicle) => $vehicle->is_featured));
    }

    /** @test */
    public function new_scope_returns_only_new_vehicles()
    {
        Vehicule::factory()->count(3)->create(['is_new' => false]);
        Vehicule::factory()->count(2)->create(['is_new' => true]);

        $newVehicles = Vehicule::new()->get();

        $this->assertCount(2, $newVehicles);
        $this->assertTrue($newVehicles->every(fn($vehicle) => $vehicle->is_new));
    }

    /** @test */
    public function used_scope_returns_only_used_vehicles()
    {
        Vehicule::factory()->count(3)->create(['is_new' => true]);
        Vehicule::factory()->count(2)->create(['is_new' => false]);

        $usedVehicles = Vehicule::used()->get();

        $this->assertCount(2, $usedVehicles);
        $this->assertTrue($usedVehicles->every(fn($vehicle) => !$vehicle->is_new));
    }

    /** @test */
    public function by_brand_scope_filters_correctly()
    {
        Vehicule::factory()->create(['brand' => 'BMW']);
        Vehicule::factory()->create(['brand' => 'Audi']);
        Vehicule::factory()->create(['brand' => 'BMW X5']); // Should match partial

        $bmwVehicles = Vehicule::byBrand('BMW')->get();

        $this->assertCount(2, $bmwVehicles);
        $this->assertTrue($bmwVehicles->every(fn($vehicle) => str_contains($vehicle->brand, 'BMW')));
    }

    /** @test */
    public function price_range_scope_filters_correctly()
    {
        Vehicule::factory()->create(['price' => 10000]);
        Vehicule::factory()->create(['price' => 50000]);
        Vehicule::factory()->create(['price' => 100000]);

        $vehicles = Vehicule::priceRange(20000, 80000)->get();

        $this->assertCount(1, $vehicles);
        $this->assertEquals(50000, $vehicles->first()->price);
    }

    /** @test */
    public function year_range_scope_filters_correctly()
    {
        Vehicule::factory()->create(['year' => 2020]);
        Vehicule::factory()->create(['year' => 2023]);
        Vehicule::factory()->create(['year' => 2025]);

        $vehicles = Vehicule::yearRange(2021, 2024)->get();

        $this->assertCount(1, $vehicles);
        $this->assertEquals(2023, $vehicles->first()->year);
    }

    /** @test */
    public function by_fuel_scope_filters_correctly()
    {
        Vehicule::factory()->create(['fuel' => 'Gasoline']);
        Vehicule::factory()->create(['fuel' => 'Diesel']);
        Vehicule::factory()->create(['fuel' => 'Electric']);

        $gasolineVehicles = Vehicule::byFuel('Gasoline')->get();

        $this->assertCount(1, $gasolineVehicles);
        $this->assertEquals('Gasoline', $gasolineVehicles->first()->fuel);
    }

    /** @test */
    public function by_transmission_scope_filters_correctly()
    {
        Vehicule::factory()->create(['transmission' => 'Manual']);
        Vehicule::factory()->create(['transmission' => 'Automatic']);
        Vehicule::factory()->create(['transmission' => 'Semi-Automatic']);

        $automaticVehicles = Vehicule::byTransmission('Automatic')->get();

        $this->assertCount(1, $automaticVehicles);
        $this->assertEquals('Automatic', $automaticVehicles->first()->transmission);
    }

    /** @test */
    public function search_scope_searches_brand_model_and_description()
    {
        Vehicule::factory()->create(['brand' => 'BMW', 'model' => 'X5', 'description' => 'Luxury SUV']);
        Vehicule::factory()->create(['brand' => 'Audi', 'model' => 'A4', 'description' => 'Compact sedan']);
        Vehicule::factory()->create(['brand' => 'Mercedes', 'model' => 'C-Class', 'description' => 'BMW competitor']);

        $searchResults = Vehicule::search('BMW')->get();

        $this->assertCount(2, $searchResults); // BMW brand + BMW in description
        $this->assertTrue($searchResults->contains(fn($v) => $v->brand === 'BMW'));
        $this->assertTrue($searchResults->contains(fn($v) => str_contains($v->description, 'BMW')));
    }

    /** @test */
    public function get_brands_returns_correct_brands()
    {
        $brands = Vehicule::getBrands();

        $this->assertIsArray($brands);
        $this->assertContains('BMW', $brands);
        $this->assertContains('Audi', $brands);
        $this->assertContains('Mercedes-Benz', $brands);
        $this->assertContains('Toyota', $brands);
    }

    /** @test */
    public function get_fuel_types_returns_correct_fuel_types()
    {
        $fuelTypes = Vehicule::getFuelTypes();

        $this->assertIsArray($fuelTypes);
        $this->assertContains('Gasoline', $fuelTypes);
        $this->assertContains('Diesel', $fuelTypes);
        $this->assertContains('Electric', $fuelTypes);
        $this->assertContains('Hybrid', $fuelTypes);
        $this->assertContains('LPG', $fuelTypes);
    }

    /** @test */
    public function get_transmission_types_returns_correct_transmission_types()
    {
        $transmissionTypes = Vehicule::getTransmissionTypes();

        $this->assertIsArray($transmissionTypes);
        $this->assertContains('Manual', $transmissionTypes);
        $this->assertContains('Automatic', $transmissionTypes);
        $this->assertContains('Semi-Automatic', $transmissionTypes);
        $this->assertContains('CVT', $transmissionTypes);
    }

    /** @test */
    public function photo_urls_attribute_returns_correct_urls()
    {
        $vehicle = Vehicule::factory()->create([
            'photos' => ['vehicles/photo1.jpg', 'vehicles/photo2.jpg']
        ]);

        $photoUrls = $vehicle->photo_urls;

        $this->assertIsArray($photoUrls);
        $this->assertCount(2, $photoUrls);
        $this->assertStringContains('vehicles/photo1.jpg', $photoUrls[0]);
        $this->assertStringContains('vehicles/photo2.jpg', $photoUrls[1]);
    }

    /** @test */
    public function photo_urls_attribute_returns_empty_array_when_no_photos()
    {
        $vehicle = Vehicule::factory()->create(['photos' => null]);

        $photoUrls = $vehicle->photo_urls;

        $this->assertIsArray($photoUrls);
        $this->assertEmpty($photoUrls);
    }
}
