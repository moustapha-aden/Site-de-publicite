import React from 'react';
import { X, User, Mail, Calendar, Shield, Edit } from 'lucide-react';

const ProfileDetailModal = ({ user, onClose, onEdit }) => {
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
            case 'active': return 'Disponible';
            case 'inactive': return 'InDisponible';
            case 'suspended': return 'Suspendu';
            default: return status;
        }
    };
    const handlupdate=()=>{
        onEdit();
        onClose();
    }
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-lg w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6 border-b border-gray-200 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-100 rounded-full">
                            <User className="h-6 w-6 text-blue-600" />
                        </div>
                        <h2 className="text-xl font-semibold">Mon Profil</h2>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <X className="h-6 w-6" />
                    </button>
                </div>

                <div className="p-6">
                    {/* Photo de profil et nom */}
                    <div className="text-center mb-6">
                        <div className="mx-auto w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                            <User className="h-12 w-12 text-blue-600" />
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
                    <div className="space-y-4 mb-6">
                        {/* Email */}
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <div className="flex items-center gap-2 mb-2">
                                <Mail className="h-5 w-5 text-gray-600" />
                                <span className="font-medium text-gray-900">Adresse email</span>
                            </div>
                            <p className="text-lg text-gray-700">{user.email || 'N/A'}</p>
                        </div>

                        {/* Statut */}
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <div className="flex items-center gap-2 mb-2">
                                <Shield className="h-5 w-5 text-gray-600" />
                                <span className="font-medium text-gray-900">Statut du compte</span>
                            </div>
                            <p className="text-lg text-gray-700">{getStatusLabel(user.status)}</p>
                        </div>

                        {/* Date d'inscription */}
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <div className="flex items-center gap-2 mb-2">
                                <Calendar className="h-5 w-5 text-gray-600" />
                                <span className="font-medium text-gray-900">Membre depuis</span>
                            </div>
                            <p className="text-lg text-gray-700">
                                {user.created_at ? new Date(user.created_at).toLocaleDateString('fr-FR') : 'N/A'}
                            </p>
                        </div>
                    </div>

                    {/* Dernière connexion */}
                    {user.last_login_at && (
                        <div className="bg-blue-50 p-4 rounded-lg mb-6">
                            <div className="flex items-center gap-2 mb-2">
                                <Calendar className="h-5 w-5 text-blue-600" />
                                <span className="font-medium text-gray-900">Dernière connexion</span>
                            </div>
                            <p className="text-lg text-blue-700">
                                {new Date(user.last_login_at).toLocaleDateString('fr-FR', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit'
                                })}
                            </p>
                        </div>
                    )}

                    {/* Actions */}
                    <div className="flex gap-3 justify-center">
                        <button
                            onClick={handlupdate}
                            className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            <Edit className="h-4 w-4" />
                            Modifier mon profil
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfileDetailModal;
