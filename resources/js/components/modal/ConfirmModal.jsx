import React from 'react';
import { X, AlertTriangle } from 'lucide-react';

const ConfirmModal = ({ 
    isOpen, 
    onClose, 
    onConfirm, 
    title = "Confirmer la suppression",
    message = "Êtes-vous sûr de vouloir supprimer cet élément ?",
    confirmText = "Supprimer",
    cancelText = "Annuler",
    type = "danger" // danger, warning, info
}) => {
    if (!isOpen) return null;

    const getTypeColors = () => {
        switch (type) {
            case 'danger':
                return {
                    iconBg: 'bg-red-100',
                    iconColor: 'text-red-600',
                    confirmBg: 'bg-red-600 hover:bg-red-700',
                    confirmText: 'text-white'
                };
            case 'warning':
                return {
                    iconBg: 'bg-yellow-100',
                    iconColor: 'text-yellow-600',
                    confirmBg: 'bg-yellow-600 hover:bg-yellow-700',
                    confirmText: 'text-white'
                };
            case 'info':
                return {
                    iconBg: 'bg-blue-100',
                    iconColor: 'text-blue-600',
                    confirmBg: 'bg-blue-600 hover:bg-blue-700',
                    confirmText: 'text-white'
                };
            default:
                return {
                    iconBg: 'bg-red-100',
                    iconColor: 'text-red-600',
                    confirmBg: 'bg-red-600 hover:bg-red-700',
                    confirmText: 'text-white'
                };
        }
    };

    const colors = getTypeColors();

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-md w-full">
                <div className="p-6">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-full ${colors.iconBg}`}>
                                <AlertTriangle className={`h-6 w-6 ${colors.iconColor}`} />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
                        </div>
                        <button 
                            onClick={onClose} 
                            className="text-gray-400 hover:text-gray-600 transition-colors"
                        >
                            <X className="h-6 w-6" />
                        </button>
                    </div>

                    {/* Message */}
                    <div className="mb-6">
                        <p className="text-gray-600 leading-relaxed">{message}</p>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3 justify-end">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                            {cancelText}
                        </button>
                        <button
                            onClick={onConfirm}
                            className={`px-4 py-2 rounded-lg transition-colors ${colors.confirmBg} ${colors.confirmText}`}
                        >
                            {confirmText}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ConfirmModal;
