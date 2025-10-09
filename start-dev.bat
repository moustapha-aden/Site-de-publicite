@echo off
echo 🚀 Démarrage de l'application AutoMarket
echo.

echo 📦 Installation des dépendances...
call npm install

echo.
echo 🗄️ Vérification de la base de données...
php artisan migrate:status

echo.
echo 🌐 Démarrage du serveur Laravel...
start "Laravel Server" cmd /k "php artisan serve --host=127.0.0.1 --port=8000"

echo.
echo ⚡ Démarrage de Vite pour le frontend...
start "Vite Dev Server" cmd /k "npm run dev"

echo.
echo ✅ Application démarrée !
echo 🌐 Frontend: http://localhost:5173
echo 🔧 Backend: http://127.0.0.1:8000
echo 📊 API: http://127.0.0.1:8000/api/vehicles
echo.
echo Appuyez sur une touche pour fermer...
pause
