import React, { useState } from 'react';
import { Plus, Trash2, Tag, Loader2 } from 'lucide-react';
import { useBrands } from './hooks/useBrands'; // Assurez-vous que le chemin est correct

const BrandManagement = ({ API_BASE_URL, token }) => {
    // Utilisation du hook
    const {
        brands, loading, error, isSubmitting, formErrors,
        createBrand, deleteBrand
    } = useBrands(API_BASE_URL, token);

    const [newBrandName, setNewBrandName] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!newBrandName.trim()) {
            return;
        }

        const result = await createBrand(newBrandName);

        if (result.success) {
            setNewBrandName(''); // Vider le champ après succès
        }
    };

    return (
        <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                <Tag className="h-5 w-5 text-gray-700" />
                Gestion des Marques ({brands.length})
            </h2>

            {error && (
                <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
                    {error}
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* COLONNE 1 : Formulaire d'ajout */}
                <div className="lg:col-span-1 border-r pr-6">
                    <h3 className="text-lg font-medium mb-4 border-b pb-2">Ajouter une nouvelle Marque</h3>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label htmlFor="brandName" className="block text-sm font-medium text-gray-700 mb-1">
                                Nom de la Marque
                            </label>
                            <input
                                id="brandName"
                                type="text"
                                value={newBrandName}
                                onChange={(e) => setNewBrandName(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Ex: Renault, BMW, Audi..."
                                required
                            />
                            {formErrors.name && (
                                <p className="text-sm text-red-600 mt-1">{formErrors.name[0]}</p>
                            )}
                        </div>

                        <button
                            type="submit"
                            disabled={isSubmitting || loading}
                            className="inline-flex items-center justify-center w-full px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-green-600 hover:bg-green-700 disabled:opacity-50 transition"
                        >
                            {isSubmitting ? (
                                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                            ) : (
                                <Plus className="h-4 w-4 mr-2" />
                            )}
                            {isSubmitting ? 'Ajout en cours...' : 'Ajouter la Marque'}
                        </button>
                    </form>
                </div>


                {/* COLONNE 2 : Liste des Marques */}
                <div className="lg:col-span-2">
                    <h3 className="text-lg font-medium mb-4 border-b pb-2">Marques existantes</h3>

                    {loading && (
                        <div className="flex items-center justify-center p-4">
                            <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
                        </div>
                    )}

                    {!loading && (
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                            {brands.map((brand) => (
                                <div key={brand.id} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg border">
                                    <p className="font-medium text-gray-800 truncate">{brand.name}</p>
                                    <button
                                        onClick={() => deleteBrand(brand.id)}
                                        className="text-red-500 hover:text-red-700 transition p-1 rounded-full hover:bg-red-100"
                                        title="Supprimer la marque"
                                        disabled={loading}
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}

                    {!loading && brands.length === 0 && (
                        <p className="text-gray-500 italic">Aucune marque n'a été trouvée.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default BrandManagement;
