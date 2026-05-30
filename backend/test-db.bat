@echo off
echo ========================================
echo PostgreSQL Connection Test
echo ========================================
echo.

REM Check if PostgreSQL is running
echo Checking PostgreSQL service status...
sc query | findstr /i "postgresql" > nul
if %errorlevel% equ 0 (
    echo [OK] PostgreSQL service found
) else (
    echo [WARNING] PostgreSQL service not found or not running
    echo Please start PostgreSQL service first
    pause
    exit /b 1
)

echo.
echo Checking if psql command is available...
where psql > nul 2>&1
if %errorlevel% equ 0 (
    echo [OK] psql command found
    echo.

    REM Prompt for password
    set /p DB_PASSWORD="Enter postgres password: "

    echo.
    echo Testing connection with psql...
    echo.

    REM Test connection using psql
    set PGPASSWORD=%DB_PASSWORD%
    psql -U postgres -d postgres -c "SELECT version();" -c "SELECT NOW() as current_time;"

    if %errorlevel% equ 0 (
        echo.
        echo ========================================
        echo [SUCCESS] Database connection working!
        echo ========================================
        echo.
        echo Next steps:
        echo 1. Create agenticsdlc_dev database
        echo 2. Run schema.sql to create tables
        echo 3. Test with Node.js script
    ) else (
        echo.
        echo ========================================
        echo [FAILED] Could not connect to database
        echo ========================================
        echo.
        echo Possible issues:
        echo - Wrong password
        echo - PostgreSQL not running
        echo - Port 5432 blocked
    )

) else (
    echo [WARNING] psql command not found in PATH
    echo.
    echo Please add PostgreSQL bin directory to PATH:
    echo Example: C:\Program Files\PostgreSQL\16\bin
    echo.
    echo Or test using Node.js script:
    echo   npm install pg
    echo   node test-db-simple.cjs
)

echo.
pause
