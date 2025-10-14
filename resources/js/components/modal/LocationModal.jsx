import React from 'react';
import { X } from 'lucide-react';

const LocationModal = ({
    modalMode,
    formData,
    formErrors,
    formSubmitting,
    filterOptions,
    closeModal,
    handleChange,
    submitLocation,
    selectedLocation,
}) => {
    return (
        <div key={`modal-${modalMode}-${selectedLocation?.id || 'new'}`} className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Overlay */}
            <div className="absolute inset-0 bg-black/40" onClick={closeModal}></div>

            {/* Modal Content */}
            <div className="relative bg-white w-full max-w-4xl rounded-xl shadow-xl border p-6 mx-4 max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-semibold text-gray-900">
                        {modalMode === 'create' ? 'Ajouter une location' : 'Modifier la location'}
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

                <form onSubmit={submitLocation} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Titre */}
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Titre</label>
                            <input
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                required
                            />
                            {formErrors.title && formErrors.title.length > 0 && <p className="text-xs text-red-600 mt-1">{formErrors.title[0]}</p>}
                        </div>

                        {/* Localisation */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Localisation</label>
                            <input
                                name="location"
                                value={formData.location}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                required
                            />
                            {formErrors.location && formErrors.location.length > 0 && <p className="text-xs text-red-600 mt-1">{formErrors.location[0]}</p>}
                        </div>

                        {/* Prix */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Prix (€/mois)</label>
                            <input
                                type="number"
                                step="0.01"
                                name="price"
                                value={formData.price}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                required
                            />
                            {formErrors.price && formErrors.price.length > 0 && <p className="text-xs text-red-600 mt-1">{formErrors.price[0]}</p>}
                        </div>

                        {/* Type */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                            <select
                                name="type"
                                value={formData.type}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                required
                            >
                                <option value="">-- Sélectionnez un type --</option>
                                {filterOptions.types?.map((type) => (
                                    <option key={type} value={type}>
                                        {type.charAt(0).toUpperCase() + type.slice(1)}
                                    </option>
                                ))}
                            </select>
                            {formErrors.type && formErrors.type.length > 0 && <p className="text-xs text-red-600 mt-1">{formErrors.type[0]}</p>}
                        </div>

                        {/* Surface */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Surface (m²)</label>
                            <input
                                type="number"
                                step="0.01"
                                name="surface"
                                value={formData.surface}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                            {formErrors.surface && formErrors.surface.length > 0 && <p className="text-xs text-red-600 mt-1">{formErrors.surface[0]}</p>}
                        </div>

                        {/* Nombre de pièces */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Nombre de pièces</label>
                            <input
                                type="number"
                                name="rooms"
                                value={formData.rooms}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                            {formErrors.rooms && formErrors.rooms.length > 0 && <p className="text-xs text-red-600 mt-1">{formErrors.rooms[0]}</p>}
                        </div>

                        {/* Nombre de chambres */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Nombre de chambres</label>
                            <input
                                type="number"
                                name="bedrooms"
                                value={formData.bedrooms}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                            {formErrors.bedrooms && formErrors.bedrooms.length > 0 && <p className="text-xs text-red-600 mt-1">{formErrors.bedrooms[0]}</p>}
                        </div>

                        {/* Nombre de salles de bain */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Nombre de salles de bain</label>
                            <input
                                type="number"
                                name="bathrooms"
                                value={formData.bathrooms}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                            {formErrors.bathrooms && formErrors.bathrooms.length > 0 && <p className="text-xs text-red-600 mt-1">{formErrors.bathrooms[0]}</p>}
                        </div>

                        {/* Numéro de contact */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Numéro de contact</label>
                            <input
                                type="tel"
                                name="contact_number"
                                value={formData.contact_number}
                                onChange={handleChange}
                                placeholder="+253xxxxxxxx"
                                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                            {formErrors.contact_number && formErrors.contact_number.length > 0 && <p className="text-xs text-red-600 mt-1">{formErrors.contact_number[0]}</p>}
                        </div>

                        {/* Statut */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Statut</label>
                            <select
                                name="status"
                                value={formData.status}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                required
                            >
                                <option value="active">Disponible</option>
                                <option value="inactive">InDisponible</option>
                            </select>
                            {formErrors.status && formErrors.status.length > 0 && <p className="text-xs text-red-600 mt-1">{formErrors.status[0]}</p>}
                        </div>

                        {/* Description */}
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                rows={3}
                                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                            {formErrors.description && formErrors.description.length > 0 && <p className="text-xs text-red-600 mt-1">{formErrors.description[0]}</p>}
                        </div>

                        {/* Photos */}
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Photos (Max 10)
                            </label>
                            <input
                                type="file"
                                name="photos"
                                multiple
                                accept="image/*"
                                onChange={handleChange}
                                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                            {formErrors.photos && formErrors.photos.length > 0 && <p className="text-xs text-red-600 mt-1">{formErrors.photos[0]}</p>}
                        </div>
                    </div>

                    {/* Checkbox En vedette */}
                    <div className="flex items-center gap-2 mt-4">
                        <input
                            type="checkbox"
                            name="is_featured"
                            checked={formData.is_featured}
                            onChange={handleChange}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <label className="text-sm text-gray-700">En vedette</label>
                        {formErrors.is_featured && formErrors.is_featured.length > 0 && <p className="text-xs text-red-600 ml-2">{formErrors.is_featured[0]}</p>}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex justify-end gap-3 mt-6">
                        <button type="button" onClick={closeModal} className="px-4 py-2 border rounded-lg text-gray-700 hover:bg-gray-50" disabled={formSubmitting}>
                            Annuler
                        </button>
                        <button type="submit" disabled={formSubmitting} className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50">
                            {formSubmitting ? (
                                <>
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                    {modalMode === 'create' ? 'Ajout en cours...' : 'Modification...'}
                                </>
                            ) : (
                                modalMode === 'create' ? 'Ajouter' : 'Enregistrer'
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default LocationModal;
