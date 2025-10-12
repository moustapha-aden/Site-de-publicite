@echo off
echo Testing Location CRUD operations...
echo.

echo 1. Testing GET /api/locations (should return paginated locations)
curl -s "http://127.0.0.1:8000/api/locations" | jq .
echo.

echo 2. Testing GET /api/locations/filter/options
curl -s "http://127.0.0.1:8000/api/locations/filter/options" | jq .
echo.

echo 3. Testing POST /api/locations (create new location)
curl -s -X POST "http://127.0.0.1:8000/api/locations" \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d "{\"title\":\"Test Location\",\"location\":\"Test City\",\"price\":500,\"type\":\"appartement\",\"surface\":60,\"rooms\":3,\"bedrooms\":2,\"bathrooms\":1,\"description\":\"Test description\",\"contact_number\":\"77123456\",\"status\":\"active\",\"is_featured\":false}" | jq .
echo.

echo 4. Testing GET /api/locations/1 (should return specific location)
curl -s "http://127.0.0.1:8000/api/locations/1" | jq .
echo.

echo All CRUD tests completed!
pause
