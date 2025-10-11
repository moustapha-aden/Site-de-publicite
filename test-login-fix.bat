@echo off
echo 🧪 Test de l'application AutoMarket après corrections
echo.

echo 📋 Instructions pour tester :
echo 1. Ouvrez http://127.0.0.1:8000/clean-storage.html
echo 2. Cliquez sur "Nettoyer le localStorage"
echo 3. Ouvrez http://127.0.0.1:8000/login
echo 4. Connectez-vous avec test@example.com / password
echo 5. Vérifiez que vous êtes redirigé vers /admin/dashboard
echo 6. Rafraîchissez la page - vous devez rester connecté
echo.

echo 🔧 Corrections apportées :
echo ✅ Gestion des erreurs JSON.parse améliorée
echo ✅ Vérification des données localStorage
echo ✅ Nettoyage automatique des données corrompues
echo ✅ Validation des données de connexion
echo.

echo 🌐 URLs de test :
echo - Login: http://127.0.0.1:8000/login
echo - Admin: http://127.0.0.1:8000/admin/dashboard
echo - Nettoyage: http://127.0.0.1:8000/clean-storage.html
echo.

pause
