import React from 'react';
import { X, User, Mail, Lock, Eye, EyeOff } from 'lucide-react';

const ProfileModal = ({
    isOpen,
    onClose,
    user,
    formData,
    formErrors,
    formSubmitting,
    handleChange,
    submitProfile
}) => {
    const [showCurrentPassword, setShowCurrentPassword] = React.useState(false);
    const [showNewPassword, setShowNewPassword] = React.useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6 border-b border-gray-200 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-100 rounded-full">
                            <User className="h-6 w-6 text-blue-600" />
                        </div>
                        <h2 className="text-xl font-semibold">Modifier mon profil</h2>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <X className="h-6 w-6" />
                    </button>
                </div>

                <form onSubmit={submitProfile} className="p-6 space-y-6">
                    {/* Informations personnelles */}
                    <div className="bg-gray-50 p-4 rounded-lg">
                        <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
                            <User className="h-5 w-5" />
                            Informations personnelles
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                                    placeholder="Votre nom complet"
                                />
                                {formErrors.name && (
                                    <p className="mt-1 text-sm text-red-600">{formErrors.name[0]}</p>
                                )}
                            </div>

                            {/* Email */}
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                                    Adresse email *
                                </label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        value={formData.email || ''}
                                        onChange={handleChange}
                                        className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                                            formErrors.email ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                        placeholder="votre@email.com"
                                    />
                                </div>
                                {formErrors.email && (
                                    <p className="mt-1 text-sm text-red-600">{formErrors.email[0]}</p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Changement de mot de passe */}
                    <div className="bg-gray-50 p-4 rounded-lg">
                        <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
                            <Lock className="h-5 w-5" />
                            Changer le mot de passe
                        </h3>
                        <p className="text-sm text-gray-600 mb-4">
                            Laissez les champs de mot de passe vides si vous ne souhaitez pas le changer.
                        </p>

                        <div className="space-y-4">
                            {/* Mot de passe actuel */}
                            <div>
                                <label htmlFor="current_password" className="block text-sm font-medium text-gray-700 mb-1">
                                    Mot de passe actuel
                                </label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                                    <input
                                        type={showCurrentPassword ? 'text' : 'password'}
                                        id="current_password"
                                        name="current_password"
                                        value={formData.current_password || ''}
                                        onChange={handleChange}
                                        className={`w-full pl-10 pr-10 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                                            formErrors.current_password ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                        placeholder="Votre mot de passe actuel"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                    >
                                        {showCurrentPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                    </button>
                                </div>
                                {formErrors.current_password && (
                                    <p className="mt-1 text-sm text-red-600">{formErrors.current_password[0]}</p>
                                )}
                            </div>

                            {/* Nouveau mot de passe */}
                            <div>
                                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                                    Nouveau mot de passe
                                </label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                                    <input
                                        type={showNewPassword ? 'text' : 'password'}
                                        id="password"
                                        name="password"
                                        value={formData.password || ''}
                                        onChange={handleChange}
                                        className={`w-full pl-10 pr-10 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                                            formErrors.password ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                        placeholder="Nouveau mot de passe"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowNewPassword(!showNewPassword)}
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                    >
                                        {showNewPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                    </button>
                                </div>
                                {formErrors.password && (
                                    <p className="mt-1 text-sm text-red-600">{formErrors.password[0]}</p>
                                )}
                            </div>

                            {/* Confirmation du nouveau mot de passe */}
                            <div>
                                <label htmlFor="password_confirmation" className="block text-sm font-medium text-gray-700 mb-1">
                                    Confirmer le nouveau mot de passe
                                </label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                                    <input
                                        type={showConfirmPassword ? 'text' : 'password'}
                                        id="password_confirmation"
                                        name="password_confirmation"
                                        value={formData.password_confirmation || ''}
                                        onChange={handleChange}
                                        className={`w-full pl-10 pr-10 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                                            formErrors.password_confirmation ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                        placeholder="Confirmer le nouveau mot de passe"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                    >
                                        {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                    </button>
                                </div>
                                {formErrors.password_confirmation && (
                                    <p className="mt-1 text-sm text-red-600">{formErrors.password_confirmation[0]}</p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Erreurs générales */}
                    {formErrors.general && (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                            {formErrors.general.map((error, index) => (
                                <p key={index} className="text-sm">{error}</p>
                            ))}
                        </div>
                    )}

                    {/* Boutons d'action */}
                    <div className="flex gap-3 justify-end pt-4 border-t border-gray-200">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                            Annuler
                        </button>
                        <button
                            type="submit"
                            disabled={formSubmitting}
                            className={`px-6 py-2 rounded-lg transition-colors ${
                                formSubmitting
                                    ? 'bg-gray-400 text-white cursor-not-allowed'
                                    : 'bg-blue-600 text-white hover:bg-blue-700'
                            }`}
                        >
                            {formSubmitting ? 'Enregistrement...' : 'Enregistrer les modifications'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ProfileModal;
