@echo off
echo ========================================
echo AgenticSDLC - Start Testing
echo ========================================
echo.

REM Check PostgreSQL
echo [1/4] Checking PostgreSQL...
sc query | findstr /i "postgresql" > nul
if %errorlevel% equ 0 (
    echo     [OK] PostgreSQL is running
) else (
    echo     [WARNING] PostgreSQL not running
    echo     Starting PostgreSQL...
    net start postgresql* 2>nul
)

echo.
echo [2/4] Testing database connection...
cd backend
node test-db-simple.cjs
if %errorlevel% neq 0 (
    echo.
    echo [ERROR] Database connection failed!
    echo Please fix the connection before continuing.
    pause
    exit /b 1
)

echo.
echo [3/4] Starting Backend Server...
echo     Backend will start in a new window
echo     URL: http://localhost:3001
start cmd /k "cd /d %CD% && npm run dev"

timeout /t 3 > nul

echo.
echo [4/4] Starting Frontend...
echo     Frontend will start in a new window
echo     URL: http://localhost:5173
cd ..
start cmd /k "npm run dev"

echo.
echo ========================================
echo [SUCCESS] Both servers are starting!
echo ========================================
echo.
echo Backend:  http://localhost:3001/health
echo Frontend: http://localhost:5173
echo.
echo Two new windows will open for each server.
echo Keep them running while testing.
echo.
echo Press any key to open the browser...
pause > nul

start http://localhost:5173

echo.
echo Happy testing!
echo Close this window when done.
echo.
