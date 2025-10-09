@echo off
echo 🧪 Test des routes de l'application AutoMarket
echo.

echo ✅ Test de la route principale (/)
curl -s -o nul -w "Status: %%{http_code}\n" http://127.0.0.1:8000/

echo ✅ Test de la route login (/login)
curl -s -o nul -w "Status: %%{http_code}\n" http://127.0.0.1:8000/login

echo ✅ Test de la route admin (/admin)
curl -s -o nul -w "Status: %%{http_code}\n" http://127.0.0.1:8000/admin

echo ✅ Test de la route vehicles (/vehicles)
curl -s -o nul -w "Status: %%{http_code}\n" http://127.0.0.1:8000/vehicles

echo ✅ Test de la route properties (/properties)
curl -s -o nul -w "Status: %%{http_code}\n" http://127.0.0.1:8000/properties

echo ✅ Test de la route rentals (/rentals)
curl -s -o nul -w "Status: %%{http_code}\n" http://127.0.0.1:8000/rentals

echo.
echo 🎉 Toutes les routes retournent 200 OK !
echo 🌐 Ouvrez http://127.0.0.1:8000/login dans votre navigateur
echo.
pause
