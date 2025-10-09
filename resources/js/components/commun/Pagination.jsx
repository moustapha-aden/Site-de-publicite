import React from 'react';

const Pagination = ({ pagination, fetchVehicles }) => {

    const { current_page, last_page } = pagination;

    // N'affiche la pagination que si il y a plus d'une page
    if (last_page <= 1) {
        return null;
    }

    return (
        <div className="flex justify-center items-center gap-2">
            {/* Bouton Précédent */}
            <button
                onClick={() => fetchVehicles(current_page - 1)}
                disabled={current_page === 1}
                className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                Précédent
            </button>

            {/* Numéros de page (Afficher max 5 pages ou le total) */}
            <div className="flex gap-1">
                {Array.from({ length: Math.min(5, last_page) }, (_, i) => {
                    // Calculer le décalage pour centrer les pages autour de la page courante si nécessaire
                    let page = i + 1;
                    if (last_page > 5) {
                        if (current_page > 3 && current_page < last_page - 1) {
                            page = current_page - 2 + i;
                        } else if (current_page >= last_page - 1) {
                            page = last_page - 4 + i;
                        }
                    }

                    // S'assurer que la page est valide (utile pour les cas d'arrondi)
                    if (page < 1 || page > last_page) return null;

                    return (
                        <button
                            key={page}
                            onClick={() => fetchVehicles(page)}
                            className={`px-3 py-2 text-sm font-medium rounded-lg ${
                                page === current_page
                                    ? 'bg-blue-600 text-white'
                                    : 'text-gray-500 bg-white border border-gray-300 hover:bg-gray-50'
                            }`}
                        >
                            {page}
                        </button>
                    );
                })}
            </div>

            {/* Bouton Suivant */}
            <button
                onClick={() => fetchVehicles(current_page + 1)}
                disabled={current_page === last_page}
                className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                Suivant
            </button>
        </div>
    );
};

export default Pagination;
