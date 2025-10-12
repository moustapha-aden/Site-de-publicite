import React from 'react';
import { X, User, Mail, Shield, Calendar, Phone } from 'lucide-react';

const UserDetailModal = ({ user, onClose }) => {
    if (!user) return null;

    const getStatusColor = (status) => {
        switch (status) {
            case 'active': return 'bg-green-100 text-green-800';
            case 'inactive': return 'bg-gray-100 text-gray-800';
            case 'suspended': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getStatusLabel = (status) => {
        switch (status) {
            case 'active': return 'Actif';
            case 'inactive': return 'Inactif';
            case 'suspended': return 'Suspendu';
            default: return status;
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-lg w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6 border-b border-gray-200 flex items-center justify-between">
                    <h2 className="text-xl font-semibold">Détails de l'utilisateur</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <X className="h-6 w-6" />
                    </button>
                </div>

                <div className="p-6">
                    {/* Avatar et nom */}
                    <div className="text-center mb-6">
                        <div className="mx-auto w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                            <User className="h-10 w-10 text-blue-600" />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900">{user.name || 'N/A'}</h3>
                        <div className="flex items-center justify-center gap-2 mt-2">
                            <span className={`px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(user.status)}`}>
                                {getStatusLabel(user.status)}
                            </span>
                            <span className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full">
                                ID: {user.id}
                            </span>
                        </div>
                    </div>

                    {/* Informations détaillées */}
                    <div className="space-y-4">
                        {/* Email */}
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <div className="flex items-center gap-2 mb-2">
                                <Mail className="h-5 w-5 text-gray-600" />
                                <span className="font-medium text-gray-900">Email</span>
                            </div>
                            <p className="text-lg text-gray-700">{user.email || 'N/A'}</p>
                        </div>

                        {/* Statut */}
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <div className="flex items-center gap-2 mb-2">
                                <Shield className="h-5 w-5 text-gray-600" />
                                <span className="font-medium text-gray-900">Statut</span>
                            </div>
                            <p className="text-lg text-gray-700">{getStatusLabel(user.status)}</p>
                        </div>

                        {/* Date d'inscription */}
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <div className="flex items-center gap-2 mb-2">
                                <Calendar className="h-5 w-5 text-gray-600" />
                                <span className="font-medium text-gray-900">Date d'inscription</span>
                            </div>
                            <p className="text-lg text-gray-700">
                                {user.created_at ? new Date(user.created_at).toLocaleDateString('fr-FR', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit'
                                }) : 'N/A'}
                            </p>
                        </div>

                        {/* Dernière mise à jour */}
                        {user.updated_at && user.updated_at !== user.created_at && (
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <div className="flex items-center gap-2 mb-2">
                                    <Calendar className="h-5 w-5 text-gray-600" />
                                    <span className="font-medium text-gray-900">Dernière mise à jour</span>
                                </div>
                                <p className="text-lg text-gray-700">
                                    {new Date(user.updated_at).toLocaleDateString('fr-FR', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit'
                                    })}
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Informations supplémentaires */}
                    {user.phone && (
                        <div className="mt-6 bg-gray-50 p-4 rounded-lg">
                            <div className="flex items-center gap-2 mb-2">
                                <Phone className="h-5 w-5 text-gray-600" />
                                <span className="font-medium text-gray-900">Téléphone</span>
                            </div>
                            <p className="text-lg text-gray-700">{user.phone}</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default UserDetailModal;
