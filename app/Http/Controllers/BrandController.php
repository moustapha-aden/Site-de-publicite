<?php

namespace App\Http\Controllers;

use App\Models\Brand;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class BrandController extends Controller
{
    /**
     * ✅ Liste de toutes les marques
     */
    public function index()
    {
        $brands = Brand::all();

        return response()->json([
            'success' => true,
            'data' => $brands
        ]);
    }

    /**
     * ✅ Création d'une nouvelle marque
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255|unique:brands,name',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        $brand = Brand::create([
            'name' => $request->name,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Marque créée avec succès',
            'data' => $brand
        ], 201);
    }

    /**
     * ✅ Afficher une seule marque
     */
    public function show($id)
    {
        $brand = Brand::find($id);

        if (!$brand) {
            return response()->json([
                'success' => false,
                'message' => 'Marque non trouvée'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $brand
        ]);
    }

    /**
     * ✅ Mise à jour d'une marque existante
     */
    public function update(Request $request, $id)
    {
        $brand = Brand::find($id);

        if (!$brand) {
            return response()->json([
                'success' => false,
                'message' => 'Marque non trouvée'
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255|unique:brands,name,' . $id,
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        $brand->update([
            'name' => $request->name,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Marque mise à jour avec succès',
            'data' => $brand
        ]);
    }

    /**
     * ✅ Suppression d'une marque
     */
    public function destroy($id)
    {
        $brand = Brand::find($id);

        if (!$brand) {
            return response()->json([
                'success' => false,
                'message' => 'Marque non trouvée'
            ], 404);
        }

        $brand->delete();

        return response()->json([
            'success' => true,
            'message' => 'Marque supprimée avec succès'
        ]);
    }
}
