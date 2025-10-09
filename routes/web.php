<?php

use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "web" middleware group. Make something great!
|
*/

// Route principale pour l'application React
Route::get('/', function () {
    return view('welcome');
});

// Catch-all route pour toutes les routes de l'application React
// Cette route doit être la dernière pour ne pas interférer avec les autres
Route::get('/{any}', function () {
    return view('welcome');
})->where('any', '.*');
