<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\BrandController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\ForgotPasswordController;
use App\Http\Controllers\VehiculeController;
use App\Http\Controllers\ParcelleController;
use App\Http\Controllers\LocationController;
use App\Http\Controllers\UserController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;


/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

// Public routes
Route::prefix('auth')->group(function () {
    Route::post('/login', [AuthController::class, 'login']);
    Route::post('/forgot-password', [ForgotPasswordController::class, 'sendResetLinkEmail']);
});

// Public vehicle routes (read-only)
Route::prefix('vehicles')->group(function () {
    Route::get('/', [VehiculeController::class, 'index']);
    Route::get('/{vehicule}', [VehiculeController::class, 'show']);
    Route::get('/filter/options', [VehiculeController::class, 'filterOptions']);
});

// Public parcelle routes (read-only)
Route::prefix('parcelles')->group(function () {
    Route::get('/', [ParcelleController::class, 'index']);
    Route::get('/{parcelle}', [ParcelleController::class, 'show']);
    Route::get('/filter/options', [ParcelleController::class, 'filterOptions']);
});

// Public location routes (read-only)
Route::prefix('locations')->group(function () {
    Route::get('/', [LocationController::class, 'index']);
    Route::get('/{location}', [LocationController::class, 'show']);
    Route::get('/filter/options', [LocationController::class, 'filterOptions']);
});

Route::get('/brand', [BrandController::class, 'index']); // ⬅️ DÉPLACER ICI

// Protected routes
Route::middleware('auth:sanctum')->group(function () {
    // Authentication routes
    Route::prefix('auth')->group(function () {
        Route::post('/logout', [AuthController::class, 'logout']);
        Route::post('/refresh', [AuthController::class, 'refresh']);
        Route::get('/me', [AuthController::class, 'me']);
        Route::put('/profile', [AuthController::class, 'profile']);
    });

    // User routes
    Route::get('/user', function (Request $request) {
        return $request->user();
    });

    // Dashboard routes
    Route::get('/dashboard', [DashboardController::class, 'index']);
    Route::apiResource('brands', BrandController::class);

    // Protected vehicle routes (full CRUD)
    Route::prefix('vehicles')->group(function () {
        Route::post('/', [VehiculeController::class, 'store']);
        Route::put('/{vehicule}', [VehiculeController::class, 'update']);
        Route::delete('/{vehicule}', [VehiculeController::class, 'destroy']);
    });

    // Protected parcelle routes (full CRUD)
    Route::prefix('parcelles')->group(function () {
        Route::post('/', [ParcelleController::class, 'store']);
        Route::put('/{parcelle}', [ParcelleController::class, 'update']);
        Route::delete('/{parcelle}', [ParcelleController::class, 'destroy']);
    });

    // Protected location routes (full CRUD)
    Route::prefix('locations')->group(function () {
        Route::post('/', [LocationController::class, 'store']);
        Route::put('/{location}', [LocationController::class, 'update']);
        Route::delete('/{location}', [LocationController::class, 'destroy']);
    });

    // Protected user routes (full CRUD)
    Route::prefix('users')->group(function () {
        Route::get('/', [UserController::class, 'index']);
        Route::post('/', [UserController::class, 'store']);
        Route::get('/{user}', [UserController::class, 'show']);
        Route::put('/{user}', [UserController::class, 'update']);
        Route::delete('/{user}', [UserController::class, 'destroy']);
    });

});
