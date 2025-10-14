import React from 'react';
import { X, Upload } from 'lucide-react';

const ParcelleModal = ({
    modalMode,
    formData,
    formErrors,
    formSubmitting,
    filterOptions,
    closeModal,
    handleChange,
    submitParcelle,
}) => {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6 border-b border-gray-200 flex items-center justify-between">
                    <h2 className="text-xl font-semibold">
                        {modalMode === 'create' ? 'Ajouter une parcelle' : 'Modifier la parcelle'}
                    </h2>
                    <button onClick={closeModal} className="text-gray-400 hover:text-gray-600">
                        <X className="h-6 w-6" />
                    </button>
                </div>

                <form onSubmit={submitParcelle} className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                            {formErrors.title && <p className="text-xs text-red-600 mt-1">{formErrors.title[0]}</p>}
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
                            {formErrors.location && <p className="text-xs text-red-600 mt-1">{formErrors.location[0]}</p>}
                        </div>

                        {/* Prix */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Prix (fdj)</label>
                            <input
                                type="number"
                                name="price"
                                value={formData.price}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                required
                            />
                            {formErrors.price && <p className="text-xs text-red-600 mt-1">{formErrors.price[0]}</p>}
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
                                <option value="">Sélectionner</option>
                                {filterOptions.types?.map((type) => (
                                    <option key={type} value={type}>
                                        {type.charAt(0).toUpperCase() + type.slice(1)}
                                    </option>
                                ))}
                            </select>
                            {formErrors.type && <p className="text-xs text-red-600 mt-1">{formErrors.type[0]}</p>}
                        </div>

                        {/* Surface */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Surface (m²)</label>
                            <input
                                type="number"
                                name="surface"
                                value={formData.surface}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                            {formErrors.surface && <p className="text-xs text-red-600 mt-1">{formErrors.surface[0]}</p>}
                        </div>

                        {/* Pièces */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Nombre de pièces</label>
                            <input
                                type="number"
                                name="rooms"
                                value={formData.rooms}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                            {formErrors.rooms && <p className="text-xs text-red-600 mt-1">{formErrors.rooms[0]}</p>}
                        </div>

                        {/* Chambres */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Chambres</label>
                            <input
                                type="number"
                                name="bedrooms"
                                value={formData.bedrooms}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                            {formErrors.bedrooms && <p className="text-xs text-red-600 mt-1">{formErrors.bedrooms[0]}</p>}
                        </div>

                        {/* Salles de bain */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Salles de bain</label>
                            <input
                                type="number"
                                name="bathrooms"
                                value={formData.bathrooms}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                            {formErrors.bathrooms && <p className="text-xs text-red-600 mt-1">{formErrors.bathrooms[0]}</p>}
                        </div>

                        {/* Numéro de contact */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Numéro de contact
                            </label>
                            <input
                                type="tel"
                                name="contact_number"
                                value={formData.contact_number || ''}
                                onChange={handleChange}
                                placeholder="+253xxxxxxxx"
                                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                            {formErrors.contact_number && (
                                <p className="text-xs text-red-600 mt-1">{formErrors.contact_number[0]}</p>
                            )}
                        </div>

                        {/* Statut */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Statut</label>
                            <select
                                name="status"
                                value={formData.status || 'active'}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <option value="active">Disponible</option>
                                <option value="inactive">InDisponible</option>
                            </select>
                            {formErrors.status && <p className="text-xs text-red-600 mt-1">{formErrors.status[0]}</p>}
                        </div>

                        {/* En vedette */}
                        <div className="md:col-span-2">
                            <label className="flex items-center">
                                <input
                                    type="checkbox"
                                    name="is_featured"
                                    checked={formData.is_featured}
                                    onChange={handleChange}
                                    className="mr-2"
                                />
                                <span className="text-sm font-medium text-gray-700">Mettre en vedette</span>
                            </label>
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
                            {formErrors.description && <p className="text-xs text-red-600 mt-1">{formErrors.description[0]}</p>}
                        </div>

                        {/* Photos */}
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Photos</label>
                            <input
                                type="file"
                                name="images"
                                multiple
                                accept="image/*"
                                onChange={handleChange}
                                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                            {formErrors.photos && <p className="text-xs text-red-600 mt-1">{formErrors.photos[0]}</p>}
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div className="mt-6 flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={closeModal}
                            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                            Annuler
                        </button>
                        <button
                            type="submit"
                            disabled={formSubmitting}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                        >
                            {formSubmitting ? (
                                <>
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                    Enregistrement...
                                </>
                            ) : (
                                <>
                                    <Upload className="h-4 w-4" />
                                    {modalMode === 'create' ? 'Ajouter' : 'Modifier'}
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ParcelleModal;
