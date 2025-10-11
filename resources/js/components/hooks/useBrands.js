import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

export const useBrands = (API_BASE_URL, token) => {
    const [brands, setBrands] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formErrors, setFormErrors] = useState({});

    // ----------------------------------------------------
    // 1. Fetching (READ)
    // ----------------------------------------------------
    const fetchBrands = useCallback(async () => {
        setLoading(true);
        try {
            // NOTE: On suppose que cette route n'a pas besoin d'être authentifiée (public)
            const response = await axios.get(`${API_BASE_URL}/brands`);
            // L'API devrait retourner un tableau simple d'objets marque: [{ id: 1, name: 'BMW' }, ...]
            setBrands(response.data.data || response.data);
            setError(null);
        } catch (err) {
            console.error("Error fetching brands:", err);
            setError("Impossible de charger la liste des marques.");
        } finally {
            setLoading(false);
        }
    }, [API_BASE_URL]);


    // ----------------------------------------------------
    // 2. Submitting (CREATE)
    // ----------------------------------------------------
    const createBrand = async (brandName) => {
        if (!token) {
            setFormErrors({ name: ["Vous devez être connecté (token manquant)"] });
            return;
        }

        setIsSubmitting(true);
        setFormErrors({});

        try {
            // L'API POST doit être protégée (avec le 'token' d'authentification)
            const response = await axios.post(`${API_BASE_URL}/brands`,
                { name: brandName },
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Accept': 'application/json',
                    },
                }
            );

            if (response.data.success) {
                // Actualiser la liste après succès
                await fetchBrands();
                return { success: true, message: "Marque ajoutée avec succès." };
            } else {
                 throw new Error(response.data.message || "Erreur de soumission (côté API).");
            }

        } catch (err) {
            console.error("Error submitting brand:", err);
            const status = err.response?.status;

            if (status === 422) {
                // Erreurs de validation Laravel
                setFormErrors(err.response.data.errors);
            } else if (status === 401) {
                // Erreur d'authentification (votre 401!)
                setFormErrors({ name: ["Token invalide ou expiré. Veuillez vous reconnecter."] });
            } else {
                setFormErrors({ name: [err.message || "Erreur de connexion au serveur."] });
            }
            return { success: false, message: "Échec de l'ajout." };

        } finally {
            setIsSubmitting(false);
        }
    };

    // ----------------------------------------------------
    // 3. Delete (DELETE - OPTIONNEL)
    // ----------------------------------------------------
    const deleteBrand = async (brandId) => {
        if (!token) {
            alert("Opération non autorisée: Token manquant.");
            return;
        }
        if (!window.confirm("Êtes-vous sûr de vouloir supprimer cette marque ?")) return;

        try {
            setLoading(true); // On met un chargement général pendant la suppression
            await axios.delete(`${API_BASE_URL}/brands/${brandId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            // Actualiser la liste sans recharger complètement
            setBrands(prev => prev.filter(brand => brand.id !== brandId));

        } catch (err) {
            console.error("Error deleting brand:", err);
            alert("Erreur lors de la suppression de la marque.");
        } finally {
            setLoading(false);
        }
    };


    useEffect(() => {
        fetchBrands();
    }, [fetchBrands]);

    return {
        brands, loading, error, isSubmitting, formErrors,
        fetchBrands, createBrand, deleteBrand
    };
};
