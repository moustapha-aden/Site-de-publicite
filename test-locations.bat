@echo off
echo Testing Location API endpoints...
echo.

echo 1. Testing GET /api/locations (should return paginated locations)
curl -s "http://127.0.0.1:8000/api/locations" | jq .
echo.

echo 2. Testing GET /api/locations with filters
curl -s "http://127.0.0.1:8000/api/locations?type=maison&min_price=100&max_price=1000" | jq .
echo.

echo 3. Testing GET /api/locations/filter/options
curl -s "http://127.0.0.1:8000/api/locations/filter/options" | jq .
echo.

echo 4. Testing GET /api/locations/1 (should return specific location)
curl -s "http://127.0.0.1:8000/api/locations/1" | jq .
echo.

echo All tests completed!
pause
