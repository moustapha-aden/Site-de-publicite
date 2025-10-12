import React, { useEffect, useState } from 'react';
import { CheckCircle, XCircle, AlertCircle, Info, X } from 'lucide-react';

const Toast = ({
    isVisible,
    onClose,
    message,
    type = 'success', // success, error, warning, info
    duration = 5000
}) => {
    const [isAnimating, setIsAnimating] = useState(false);

    useEffect(() => {
        if (isVisible) {
            setIsAnimating(true);
            const timer = setTimeout(() => {
                handleClose();
            }, duration);

            return () => clearTimeout(timer);
        }
    }, [isVisible, duration]);

    const handleClose = () => {
        setIsAnimating(false);
        setTimeout(() => {
            onClose();
        }, 300); // Attendre la fin de l'animation
    };

    if (!isVisible) return null;

    const getTypeConfig = () => {
        switch (type) {
            case 'success':
                return {
                    icon: CheckCircle,
                    bgColor: 'bg-green-500',
                    iconColor: 'text-green-500',
                    borderColor: 'border-green-500',
                    textColor: 'text-green-800'
                };
            case 'error':
                return {
                    icon: XCircle,
                    bgColor: 'bg-red-500',
                    iconColor: 'text-red-500',
                    borderColor: 'border-red-500',
                    textColor: 'text-red-800'
                };
            case 'warning':
                return {
                    icon: AlertCircle,
                    bgColor: 'bg-yellow-500',
                    iconColor: 'text-yellow-500',
                    borderColor: 'border-yellow-500',
                    textColor: 'text-yellow-800'
                };
            case 'info':
                return {
                    icon: Info,
                    bgColor: 'bg-blue-500',
                    iconColor: 'text-blue-500',
                    borderColor: 'border-blue-500',
                    textColor: 'text-blue-800'
                };
            default:
                return {
                    icon: CheckCircle,
                    bgColor: 'bg-green-500',
                    iconColor: 'text-green-500',
                    borderColor: 'border-green-500',
                    textColor: 'text-green-800'
                };
        }
    };

    const config = getTypeConfig();
    const IconComponent = config.icon;

    return (
        <div className={`fixed top-4 right-4 z-50 transform transition-all duration-300 ${
            isAnimating ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
        }`}>
            <div className={`bg-white border-l-4 ${config.borderColor} rounded-lg shadow-lg p-4 max-w-sm w-full`}>
                <div className="flex items-start gap-3">
                    <IconComponent className={`h-6 w-6 ${config.iconColor} flex-shrink-0 mt-0.5`} />
                    <div className="flex-1">
                        <p className={`text-sm font-medium ${config.textColor}`}>
                            {message}
                        </p>
                    </div>
                    <button
                        onClick={handleClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors flex-shrink-0"
                    >
                        <X className="h-4 w-4" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Toast;
