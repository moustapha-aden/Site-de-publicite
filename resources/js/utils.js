// /src/utils.js (ou selon la structure de votre projet)

import { Droplet, Plug, Zap, Leaf, Truck } from 'lucide-react';

/**
 * Formate un nombre en chaîne de caractères représentant un prix en euros.
 * @param {number} price - Le prix à formater.
 * @returns {string} Le prix formaté (ex: 15 000 €).
 */
export const formatPrice = (price) => {
    if (price === undefined || price === null) {
        return '-';
    }
    // Utilisez Intl.NumberFormat pour un formatage localisé, y compris l'espace pour les milliers.
    return new Intl.NumberFormat('fr-FR', {
        style: 'currency',
        currency: 'EUR',
        maximumFractionDigits: 0, // Pas de décimales pour les prix de voitures
    }).format(price);
};

/**
 * Retourne l'icône Lucide correspondante au type de carburant.
 * @param {string} fuelType - Le type de carburant (Diesel, Essence, Électrique, Hybride...).
 * @returns {React.Component} Le composant icône Lucide.
 */
export const getFuelIcon = (fuelType) => {
    switch (String(fuelType).toLowerCase()) {
        case 'diesel':
            return Droplet; // Goutte pour le diesel/essence
        case 'essence':
        case 'gazole': // Au cas où l'API utilise "gazole"
            return Droplet;
        case 'electrique':
        case 'électrique':
            return Zap; // Éclair
        case 'hybride':
            return Leaf; // Feuille (souvent utilisé pour l'hybride/écologie)
        default:
            return Truck; // Icône générique si le type n'est pas reconnu
    }
};
