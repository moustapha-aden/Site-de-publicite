@echo off
echo Testing French validation messages...
echo.

echo 1. Testing POST /api/locations with invalid data (should return French validation errors)
curl -s -X POST "http://127.0.0.1:8000/api/locations" \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d "{\"title\":\"\",\"location\":\"\",\"price\":-100,\"type\":\"invalid_type\"}" | jq .
echo.

echo 2. Testing POST /api/locations with valid data (should succeed)
curl -s -X POST "http://127.0.0.1:8000/api/locations" \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d "{\"title\":\"Test Location Française\",\"location\":\"Paris, France\",\"price\":500,\"type\":\"appartement\",\"surface\":60,\"rooms\":3,\"bedrooms\":2,\"bathrooms\":1,\"description\":\"Appartement de test avec messages en français\",\"contact_number\":\"77123456\",\"status\":\"active\",\"is_featured\":false}" | jq .
echo.

echo Validation tests completed!
pause
