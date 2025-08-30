@echo off
echo ========================================
echo    FAGO'S BOOKING SYSTEM - TEST SETUP
echo ========================================
echo.

echo 1. Installing dependencies...
call npm install
if %errorlevel% neq 0 (
    echo ERROR: Failed to install dependencies
    pause
    exit /b 1
)

echo.
echo 2. Validating system files...
node validate-booking.js

echo.
echo 3. Testing booking system...
node test-booking.js

echo.
echo 4. Starting the server...
echo.
echo ========================================
echo    SERVER STARTING ON PORT 3000
echo ========================================
echo.
echo Visit: http://localhost:3000
echo.
echo BOOKING FLOW TEST STEPS:
echo 1. Go to Hotels page
echo 2. Click on any hotel
echo 3. Select room and dates
echo 4. Click "Book Now"
echo 5. Login/Register if needed
echo 6. Fill guest details
echo 7. Complete payment
echo 8. View confirmation
echo.
echo Press Ctrl+C to stop the server
echo ========================================
echo.

npm run dev