import React from 'react';
import { X, Loader2 } from 'lucide-react';

const UserModal = ({
    modalMode,
    formData,
    formErrors,
    formSubmitting,
    closeModal,
    handleChange,
    submitUser
}) => {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6 border-b border-gray-200 flex items-center justify-between">
                    <h2 className="text-xl font-semibold">
                        {modalMode === 'create' ? 'Ajouter un utilisateur' : 'Modifier l\'utilisateur'}
                    </h2>
                    <button onClick={closeModal} className="text-gray-400 hover:text-gray-600">
                        <X className="h-6 w-6" />
                    </button>
                </div>

                <form onSubmit={submitUser} className="p-6 space-y-4">
                    {/* Nom */}
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                            Nom complet *
                        </label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name || ''}
                            onChange={handleChange}
                            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                                formErrors.name ? 'border-red-500' : 'border-gray-300'
                            }`}
                            placeholder="Entrez le nom complet"
                        />
                        {formErrors.name && (
                            <p className="mt-1 text-sm text-red-600">{formErrors.name[0]}</p>
                        )}
                    </div>

                    {/* Email */}
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                            Email *
                        </label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email || ''}
                            onChange={handleChange}
                            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                                formErrors.email ? 'border-red-500' : 'border-gray-300'
                            }`}
                            placeholder="Entrez l'adresse email"
                        />
                        {formErrors.email && (
                            <p className="mt-1 text-sm text-red-600">{formErrors.email[0]}</p>
                        )}
                    </div>

                    {/* Mot de passe */}
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                            Mot de passe {modalMode === 'create' ? '*' : '(laisser vide pour ne pas changer)'}
                        </label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password || ''}
                            onChange={handleChange}
                            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                                formErrors.password ? 'border-red-500' : 'border-gray-300'
                            }`}
                            placeholder="Entrez le mot de passe"
                        />
                        {formErrors.password && (
                            <p className="mt-1 text-sm text-red-600">{formErrors.password[0]}</p>
                        )}
                    </div>

                    {/* Confirmation mot de passe */}
                    <div>
                        <label htmlFor="password_confirmation" className="block text-sm font-medium text-gray-700 mb-1">
                            Confirmer le mot de passe {modalMode === 'create' ? '*' : '(laisser vide pour ne pas changer)'}
                        </label>
                        <input
                            type="password"
                            id="password_confirmation"
                            name="password_confirmation"
                            value={formData.password_confirmation || ''}
                            onChange={handleChange}
                            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                                formErrors.password_confirmation ? 'border-red-500' : 'border-gray-300'
                            }`}
                            placeholder="Confirmez le mot de passe"
                        />
                        {formErrors.password_confirmation && (
                            <p className="mt-1 text-sm text-red-600">{formErrors.password_confirmation[0]}</p>
                        )}
                    </div>

                    {/* Statut */}
                    <div>
                        <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                            Statut *
                        </label>
                        <select
                            id="status"
                            name="status"
                            value={formData.status || 'active'}
                            onChange={handleChange}
                            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                                formErrors.status ? 'border-red-500' : 'border-gray-300'
                            }`}
                        >
                            <option value="active">Disponible</option>
                            <option value="inactive">InDisponible</option>
                            <option value="suspended">Suspendu</option>
                        </select>
                        {formErrors.status && (
                            <p className="mt-1 text-sm text-red-600">{formErrors.status[0]}</p>
                        )}
                    </div>

                    {/* Erreurs générales */}
                    {formErrors.general && (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                            {formErrors.general.map((error, index) => (
                                <p key={index} className="text-sm">{error}</p>
                            ))}
                        </div>
                    )}

                    {/* Boutons */}
                    <div className="flex gap-3 pt-4">
                        <button
                            type="button"
                            onClick={closeModal}
                            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                            Annuler
                        </button>
                        <button
                            type="submit"
                            disabled={formSubmitting}
                            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
                        >
                            {formSubmitting ? (
                                <>
                                    <Loader2 className="animate-spin h-4 w-4 mr-2" />
                                    {modalMode === 'create' ? 'Ajout...' : 'Modification...'}
                                </>
                            ) : (
                                modalMode === 'create' ? 'Ajouter' : 'Modifier'
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default UserModal;
