import React from 'react';
import { X } from 'lucide-react';

const VehicleModal = ({
    modalMode,
    formData,
    formErrors,
    formSubmitting,
    filterOptions,
    closeModal,
    handleChange,
    submitVehicle,
}) => {

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Overlay */}
            <div className="absolute inset-0 bg-black/40" onClick={closeModal}></div>

            {/* Modal Content */}
            <div className="relative bg-white w-full max-w-2xl rounded-xl shadow-xl border p-6 mx-4">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-semibold text-gray-900">
                        {modalMode === 'create' ? 'Ajouter un véhicule' : 'Éditer le véhicule'}
                    </h3>
                    <button onClick={closeModal} className="p-2 rounded-lg hover:bg-gray-100">
                        <X className="h-5 w-5 text-gray-500" />
                    </button>
                </div>

                {/* General Form Error Display */}
                {formErrors.general && (
                    <div className="mb-4 bg-red-50 border border-red-200 text-red-700 rounded-lg p-3 text-sm">
                        {Array.isArray(formErrors.general) ? formErrors.general.join(' ') : String(formErrors.general)}
                    </div>
                )}

                <form onSubmit={submitVehicle} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Marque */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Marque</label>
                            <input name="brand" value={formData.brand} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" required />
                            {formErrors.brand && <p className="text-xs text-red-600 mt-1">{formErrors.brand[0]}</p>}
                        </div>

                        {/* Modèle */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Modèle</label>
                            <input name="model" value={formData.model} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" required />
                            {formErrors.model && <p className="text-xs text-red-600 mt-1">{formErrors.model[0]}</p>}
                        </div>

                        {/* Année */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Année</label>
                            <input type="number" name="year" value={formData.year} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" required />
                            {formErrors.year && <p className="text-xs text-red-600 mt-1">{formErrors.year[0]}</p>}
                        </div>

                        {/* Prix */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Prix (€)</label>
                            <input type="number" name="price" value={formData.price} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" required />
                            {formErrors.price && <p className="text-xs text-red-600 mt-1">{formErrors.price[0]}</p>}
                        </div>

                        {/* Kilométrage */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Kilométrage</label>
                            <input type="number" name="mileage" value={formData.mileage} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                            {formErrors.mileage && <p className="text-xs text-red-600 mt-1">{formErrors.mileage[0]}</p>}
                        </div>

                        {/* Carburant */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Carburant</label>
                            <select name="fuel" value={formData.fuel} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                                <option value="">Sélectionner</option>
                                {filterOptions.fuel_types.map((f) => (
                                    <option key={f} value={f}>{f}</option>
                                ))}
                            </select>
                            {formErrors.fuel && <p className="text-xs text-red-600 mt-1">{formErrors.fuel[0]}</p>}
                        </div>

                        {/* Transmission */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Transmission</label>
                            <select name="transmission" value={formData.transmission} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                                <option value="">Sélectionner</option>
                                {filterOptions.transmission_types.map((t) => (
                                    <option key={t} value={t}>{t}</option>
                                ))}
                            </select>
                            {formErrors.transmission && <p className="text-xs text-red-600 mt-1">{formErrors.transmission[0]}</p>}
                        </div>

                        {/* Couleur */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Couleur</label>
                            <input name="color" value={formData.color} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                            {formErrors.color && <p className="text-xs text-red-600 mt-1">{formErrors.color[0]}</p>}
                        </div>

                        {/* Description */}
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                            <textarea name="description" value={formData.description} onChange={handleChange} rows={3} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                            {formErrors.description && <p className="text-xs text-red-600 mt-1">{formErrors.description[0]}</p>}
                        </div>

                        {/* AJOUT: Champ Photos du véhicule (multi-colonnes) */}
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Photos du véhicule (Max 5)
                            </label>
                            <input
                                type="file"
                                name="images"
                                onChange={handleChange}
                                multiple // Permet la sélection de plusieurs fichiers
                                accept="image/*"
                                className="w-full text-sm text-gray-500
                                           file:mr-4 file:py-2 file:px-4
                                           file:rounded-lg file:border-0
                                           file:text-sm file:font-semibold
                                           file:bg-blue-50 file:text-blue-700
                                           hover:file:bg-blue-100"
                            />
                            {formErrors.images && <p className="text-xs text-red-600 mt-1">{formErrors.images[0]}</p>}
                        </div>
                    </div>

                    {/* Checkboxes */}
                    <div className="flex items-center gap-6 mt-2">
                        <label className="inline-flex items-center gap-2 text-sm text-gray-700">
                            <input type="checkbox" name="is_featured" checked={!!formData.is_featured} onChange={handleChange} className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                            En vedette
                        </label>
                        <label className="inline-flex items-center gap-2 text-sm text-gray-700">
                            <input type="checkbox" name="is_new" checked={!!formData.is_new} onChange={handleChange} className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                            Neuf
                        </label>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex justify-end gap-3 mt-6">
                        <button type="button" onClick={closeModal} className="px-4 py-2 border rounded-lg text-gray-700 hover:bg-gray-50" disabled={formSubmitting}>
                            Annuler
                        </button>
                        <button type="submit" disabled={formSubmitting} className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50">
                            {modalMode === 'create' ? 'Ajouter' : 'Enregistrer'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default VehicleModal;
