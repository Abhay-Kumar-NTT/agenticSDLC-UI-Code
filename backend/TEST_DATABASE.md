# PostgreSQL Database Connection Test Guide

This guide helps you verify your PostgreSQL installation and connectivity.

## Quick Test Methods

### Method 1: Windows Batch Script (Easiest)

```cmd
cd backend
test-db.bat
```

This will:
- ✅ Check if PostgreSQL service is running
- ✅ Prompt for password
- ✅ Test connection using psql
- ✅ Show database version and time

### Method 2: Node.js Simple Test

```bash
cd backend

# Install pg module (if not already installed)
npm install pg

# Run simple test
node test-db-simple.cjs
```

**Before running, edit `test-db-simple.cjs` and update:**
```javascript
const dbConfig = {
  host: 'localhost',
  port: 5432,
  database: 'postgres',
  user: 'postgres',
  password: 'YOUR_PASSWORD_HERE', // ← Change this!
};
```

### Method 3: Full Test with ES Modules

```bash
cd backend

# Make sure package.json has "type": "module"
node test-db-connection.js
```

Update password in the file first.

### Method 4: Using psql Command Line

```bash
# Test connection
psql -U postgres -d postgres

# You should see:
# psql (16.x)
# Type "help" for help.
# postgres=#

# Test queries
SELECT version();
SELECT NOW();

# Exit
\q
```

## Step-by-Step Testing

### 1. Check PostgreSQL Installation

**Windows:**
```powershell
# Check if PostgreSQL is installed
Get-Service postgresql*

# Or
sc query | findstr /i "postgresql"
```

**Expected output:**
```
SERVICE_NAME: postgresql-x64-16
STATE: 4 RUNNING
```

### 2. Check if PostgreSQL is Running

**Windows:**
```powershell
# Check service status
net start | findstr postgres

# Start if not running
net start postgresql-x64-16
```

**Linux/Mac:**
```bash
# Check status
sudo systemctl status postgresql

# Start if needed
sudo systemctl start postgresql
```

### 3. Test Connection with psql

```bash
psql -U postgres -h localhost -p 5432 -d postgres
```

If prompted for password, enter your postgres password.

### 4. Check Port 5432 is Listening

**Windows:**
```cmd
netstat -ano | findstr :5432
```

**Linux/Mac:**
```bash
sudo lsof -i :5432
```

Expected: You should see PostgreSQL listening on port 5432.

### 5. List Databases

```bash
psql -U postgres -l
```

Or in psql shell:
```sql
\l
```

### 6. Create Test Database

```bash
psql -U postgres
```

In psql:
```sql
-- Create database
CREATE DATABASE agenticsdlc_dev;

-- List databases to verify
\l

-- Connect to new database
\c agenticsdlc_dev

-- Exit
\q
```

### 7. Run Node.js Test

```bash
cd backend

# Update password in test-db-simple.cjs
# Then run:
node test-db-simple.cjs
```

**Expected Output:**
```
Testing PostgreSQL Connection...
Config: { host: 'localhost', port: 5432, ... }

Connecting...
✅ Connected successfully!
✅ Database time: 2026-05-29T...
✅ PostgreSQL version: PostgreSQL 16.x

📋 Available databases:
  • postgres
  • agenticsdlc_dev

✅ CONNECTION TEST PASSED!
```

## Troubleshooting

### Error: "Connection refused"

**Cause:** PostgreSQL is not running

**Fix:**
```bash
# Windows
net start postgresql-x64-16

# Linux
sudo systemctl start postgresql

# Mac
brew services start postgresql
```

### Error: "Authentication failed"

**Cause:** Wrong password

**Fix:**
1. Reset postgres password:
```sql
-- In psql as admin
ALTER USER postgres PASSWORD 'new_password';
```

2. Or find password in installation notes

3. Or reinstall PostgreSQL

### Error: "Database does not exist"

**Cause:** Database 'agenticsdlc_dev' not created

**Fix:**
```bash
psql -U postgres
CREATE DATABASE agenticsdlc_dev;
\q
```

### Error: "psql command not found"

**Cause:** PostgreSQL bin not in PATH

**Fix (Windows):**
1. Find PostgreSQL bin folder:
   - Usually: `C:\Program Files\PostgreSQL\16\bin`

2. Add to PATH:
   - Search "Environment Variables"
   - Edit "Path" variable
   - Add PostgreSQL bin folder
   - Restart terminal

### Error: "Port 5432 already in use"

**Cause:** Another service using port 5432

**Fix:**
```bash
# Windows - Find process using port
netstat -ano | findstr :5432

# Kill process (replace PID)
taskkill /PID <PID> /F

# Or change PostgreSQL port in postgresql.conf
```

### Error: "Could not connect to server"

**Cause:** PostgreSQL not listening on localhost

**Fix:**
Check `postgresql.conf`:
```bash
# Find config file location
psql -U postgres -c "SHOW config_file"

# Edit postgresql.conf
# Ensure: listen_addresses = 'localhost'
```

Restart PostgreSQL after changes.

## Verification Checklist

Use this checklist to verify everything is working:

- [ ] PostgreSQL service is running
- [ ] Port 5432 is listening
- [ ] psql command works
- [ ] Can connect with correct password
- [ ] Database 'postgres' exists
- [ ] Database 'agenticsdlc_dev' created
- [ ] Node.js test script passes
- [ ] Can query SELECT NOW()
- [ ] Can query SELECT version()

## Full Test Script Output

When everything works, you should see:

```
╔════════════════════════════════════════╗
║   PostgreSQL Connection Test          ║
╚════════════════════════════════════════╝

Testing connection with:
  Host:     localhost
  Port:     5432
  Database: agenticsdlc_dev
  User:     postgres

⏳ Connecting to database...
✅ Connection established successfully!

📊 Running test queries...
✓ Current database time: 2026-05-29 10:30:45.123+00
✓ PostgreSQL version: PostgreSQL 16.2

📋 Tables in database:
  ✓ workflows
  ✓ workflow_nodes
  ✓ workflow_edges
  ✓ workflow_executions

📊 Workflow count: 0 workflows in database

═══════════════════════════════════════
✅ DATABASE CONNECTION TEST PASSED!
═══════════════════════════════════════

Next steps:
1. Update backend/.env with your database credentials
2. Start the backend server: npm run dev
```

## Next Steps After Successful Test

1. **Create .env file:**
```bash
cd backend
cp .env.example .env
```

2. **Update .env with your credentials:**
```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=agenticsdlc_dev
DB_USER=postgres
DB_PASSWORD=your_actual_password
```

3. **Run database schema:**
```bash
psql -U postgres -d agenticsdlc_dev -f db/schema.sql
```

4. **Install backend dependencies:**
```bash
npm install
```

5. **Start backend server:**
```bash
npm run dev
```

6. **Verify backend health:**
```bash
curl http://localhost:3001/health
```

## Common PostgreSQL Commands Reference

```sql
-- List databases
\l

-- Connect to database
\c database_name

-- List tables
\dt

-- Describe table
\d table_name

-- List users
\du

-- Show current database
SELECT current_database();

-- Show current user
SELECT current_user;

-- Show server version
SELECT version();

-- Show current time
SELECT NOW();

-- Exit psql
\q
```

## Need More Help?

1. Check PostgreSQL logs:
   - Windows: `C:\Program Files\PostgreSQL\16\data\log\`
   - Linux: `/var/log/postgresql/`
   - Mac: `/usr/local/var/log/`

2. Check PostgreSQL documentation:
   - https://www.postgresql.org/docs/

3. Test with simple SQL client:
   - pgAdmin (GUI): https://www.pgadmin.org/
   - DBeaver (GUI): https://dbeaver.io/

4. Verify PostgreSQL installation:
   ```bash
   postgres --version
   psql --version
   ```
