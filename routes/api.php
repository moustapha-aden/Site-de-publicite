<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\BrandController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\VehiculeController;
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
});

// Public vehicle routes (read-only)
Route::prefix('vehicles')->group(function () {
    Route::get('/', [VehiculeController::class, 'index']);
    Route::get('/{vehicule}', [VehiculeController::class, 'show']);
    Route::get('/filter/options', [VehiculeController::class, 'filterOptions']);
});
Route::get('/brand', [BrandController::class, 'index']); // ⬅️ DÉPLACER ICI

// Protected routes
Route::middleware('auth:sanctum')->group(function () {
    // Authentication routes
    Route::prefix('auth')->group(function () {
        Route::post('/logout', [AuthController::class, 'logout']);
        Route::post('/refresh', [AuthController::class, 'refresh']);
        Route::get('/me', [AuthController::class, 'me']);
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
});
