# Complete Setup Guide - AgenticSDLC with PostgreSQL

This guide walks you through setting up the complete stack: React frontend, Node.js backend, and PostgreSQL database.

## Architecture Overview

```
┌─────────────────┐      HTTP/REST      ┌─────────────────┐      SQL      ┌──────────────┐
│  React Frontend │ ──────────────────> │  Node.js Backend│ ──────────────>│  PostgreSQL  │
│  (Port 5173)    │                     │  (Port 3001)    │                │  (Port 5432) │
└─────────────────┘                     └─────────────────┘                └──────────────┘
```

## Prerequisites

Install the following software:

- **Node.js 16+**: [Download](https://nodejs.org/)
- **PostgreSQL 12+**: [Download](https://www.postgresql.org/download/)
- **Git**: [Download](https://git-scm.com/)

## Step 1: PostgreSQL Setup

### Windows

1. **Install PostgreSQL**
   - Download installer from https://www.postgresql.org/download/windows/
   - During installation, remember your postgres password
   - Default port: 5432

2. **Verify Installation**
   ```powershell
   psql --version
   ```

3. **Create Database**
   ```powershell
   # Open psql
   psql -U postgres

   # In psql shell:
   CREATE DATABASE agenticsdlc_dev;
   \q
   ```

4. **Run Schema**
   ```powershell
   cd backend
   psql -U postgres -d agenticsdlc_dev -f db/schema.sql
   ```

### Linux/Mac

1. **Install PostgreSQL**
   ```bash
   # Ubuntu/Debian
   sudo apt update
   sudo apt install postgresql postgresql-contrib

   # Mac (Homebrew)
   brew install postgresql
   ```

2. **Start PostgreSQL**
   ```bash
   # Ubuntu/Debian
   sudo systemctl start postgresql

   # Mac
   brew services start postgresql
   ```

3. **Create Database**
   ```bash
   sudo -u postgres psql
   CREATE DATABASE agenticsdlc_dev;
   \q
   ```

4. **Run Schema**
   ```bash
   cd backend
   psql -U postgres -d agenticsdlc_dev -f db/schema.sql
   ```

### Verify Database Setup

```sql
-- Connect to database
psql -U postgres -d agenticsdlc_dev

-- List tables
\dt

-- You should see:
-- workflows
-- workflow_nodes
-- workflow_edges
-- workflow_executions

-- Exit
\q
```

## Step 2: Backend Setup

### 1. Navigate to Backend Directory

```bash
cd backend
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment

```bash
# Windows PowerShell
Copy-Item .env.example .env

# Linux/Mac
cp .env.example .env
```

### 4. Edit .env File

Open `.env` and update:

```env
NODE_ENV=development

# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=agenticsdlc_dev
DB_USER=postgres
DB_PASSWORD=your_postgres_password_here

# API Configuration
PORT=3001
CORS_ORIGIN=http://localhost:5173
```

### 5. Start Backend Server

```bash
# Development mode (with auto-reload)
npm run dev

# Or production mode
npm start
```

You should see:
```
╔════════════════════════════════════════╗
║   AgenticSDLC Backend Server Started   ║
╚════════════════════════════════════════╝

🚀 Server running on: http://localhost:3001
🔌 Database pool created for environment: development
✅ Database connected successfully
```

### 6. Test Backend

Open another terminal:

```bash
# Health check
curl http://localhost:3001/health

# Expected response:
# {"status":"healthy","environment":"development","timestamp":"..."}
```

## Step 3: Frontend Setup

### 1. Navigate to Project Root

```bash
cd ..  # Go back to project root
```

### 2. Install Frontend Dependencies

```bash
npm install
```

### 3. Configure Frontend Environment

```bash
# Windows PowerShell
Copy-Item .env.example .env

# Linux/Mac
cp .env.example .env
```

### 4. Edit Frontend .env

```env
VITE_API_BASE_URL=http://localhost:3001
VITE_ENV=development
```

### 5. Start Frontend

```bash
npm run dev
```

You should see:
```
  VITE v6.x.x  ready in XXX ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
  ➜  press h + enter to show help
```

### 6. Open Browser

Navigate to: http://localhost:5173

## Step 4: Test the Complete Stack

### 1. Create a Test Workflow

1. Open the application: http://localhost:5173
2. Navigate to "Workflow Designer" tab
3. Drag elements from the palette onto the canvas
4. Connect nodes by clicking output ports
5. Click "Save Workflow" button
6. Enter a workflow name (e.g., "Test Workflow")
7. Click "Save"

### 2. Verify in Database

```sql
psql -U postgres -d agenticsdlc_dev

-- Check workflows
SELECT id, name, status, created_at FROM workflows;

-- Check nodes
SELECT node_id, label, category FROM workflow_nodes;

-- Check edges  
SELECT edge_id, from_node_id, to_node_id, relationship FROM workflow_edges;

\q
```

### 3. Test API Directly

```bash
# Get all workflows
curl http://localhost:3001/api/workflows

# Get specific workflow
curl http://localhost:3001/api/workflows/<workflow-id>
```

## Folder Structure

```
agenticSDLC-UI-Code/
├── backend/                      # Backend API
│   ├── config/
│   │   └── database.config.js    # DB config per environment
│   ├── db/
│   │   ├── connection.js         # PostgreSQL connection
│   │   └── schema.sql            # Database schema
│   ├── models/
│   │   └── workflow.model.js     # Data access layer
│   ├── routes/
│   │   └── workflow.routes.js    # API routes
│   ├── server.js                 # Express server
│   ├── package.json
│   ├── .env                      # Environment config (create this)
│   └── .env.example              # Environment template
│
├── src/                          # Frontend React app
│   ├── app/
│   │   ├── App.tsx               # Main app component
│   │   └── components/
│   ├── services/
│   │   ├── api.config.ts         # API configuration
│   │   └── workflow.service.ts   # Workflow API calls
│   ├── main.tsx
│   └── styles/
│
├── .env                          # Frontend env config (create this)
├── .env.example                  # Frontend env template
├── package.json                  # Frontend dependencies
├── vite.config.ts
└── SETUP_GUIDE.md                # This file
```

## Environment-Specific Configurations

### Development
- Frontend: http://localhost:5173
- Backend: http://localhost:3001
- Database: localhost:5432
- CORS: Enabled for localhost

### Staging
Update `backend/.env`:
```env
NODE_ENV=staging
DB_HOST=staging-db.example.com
DB_NAME=agenticsdlc_staging
DB_SSL_CA=/path/to/ca-cert.crt
```

### Production
Update `backend/.env`:
```env
NODE_ENV=production
DB_HOST=prod-db.example.com
DB_NAME=agenticsdlc_prod
DB_SSL_CA=/path/to/ca-cert.crt
CORS_ORIGIN=https://your-domain.com
```

## Common Issues & Solutions

### Issue: "Connection refused" to database

**Solution:**
```bash
# Check if PostgreSQL is running
# Windows
Get-Service postgresql*

# Linux
sudo systemctl status postgresql

# Mac
brew services list
```

### Issue: "Port 3001 already in use"

**Solution:**
```bash
# Windows
netstat -ano | findstr :3001
taskkill /PID <PID> /F

# Linux/Mac
lsof -ti:3001 | xargs kill
```

### Issue: "Cannot connect to backend API"

**Solution:**
1. Check backend is running: `curl http://localhost:3001/health`
2. Verify CORS_ORIGIN in backend/.env
3. Check frontend VITE_API_BASE_URL in .env

### Issue: "Database authentication failed"

**Solution:**
1. Verify postgres password
2. Check pg_hba.conf for authentication method
3. Ensure database exists: `psql -U postgres -l`

### Issue: "Module not found" errors

**Solution:**
```bash
# Backend
cd backend
rm -rf node_modules
npm install

# Frontend
cd ..
rm -rf node_modules
npm install
```

## Development Workflow

### Making Changes

1. **Backend Changes**:
   - Edit files in `backend/`
   - Server auto-reloads with `npm run dev`
   
2. **Frontend Changes**:
   - Edit files in `src/`
   - Vite auto-reloads in browser

3. **Database Changes**:
   - Modify `backend/db/schema.sql`
   - Apply changes: `psql -U postgres -d agenticsdlc_dev -f backend/db/schema.sql`

### Testing API with Postman/Insomnia

Create requests:

**Create Workflow**
```
POST http://localhost:3001/api/workflows
Headers: Content-Type: application/json
Body:
{
  "name": "API Test Workflow",
  "nodes": [
    {
      "id": "test-node-1",
      "type": "product-vision",
      "label": "Test Node",
      "category": "Strategic",
      "color": "#6366f1",
      "x": 100,
      "y": 100
    }
  ],
  "edges": []
}
```

## Production Deployment

### Backend (Node.js)

```bash
# Using PM2
npm install -g pm2
cd backend
pm2 start server.js --name agenticsdlc-api
pm2 save
pm2 startup
```

### Frontend (Static Build)

```bash
npm run build
# Serve dist/ folder with nginx/apache
```

### Database Backup

```bash
pg_dump -U postgres agenticsdlc_dev > backup.sql
```

## Security Checklist

- [ ] Change default postgres password
- [ ] Use strong passwords in .env
- [ ] Add .env to .gitignore (already done)
- [ ] Enable SSL for production database
- [ ] Implement API authentication
- [ ] Add rate limiting
- [ ] Use environment-specific CORS origins
- [ ] Regular database backups

## Next Steps

- [ ] Add user authentication
- [ ] Implement role-based access control
- [ ] Add workflow execution engine
- [ ] Set up monitoring (e.g., Prometheus)
- [ ] Configure CI/CD pipeline
- [ ] Add unit and integration tests

## Support

For issues or questions:
- Check logs: Backend console and browser console
- Review this setup guide
- Check backend/README.md for API documentation

## Useful Commands Reference

```bash
# PostgreSQL
psql -U postgres                          # Connect to postgres
\l                                        # List databases
\c agenticsdlc_dev                       # Connect to database
\dt                                       # List tables
\d workflows                              # Describe table
SELECT * FROM workflows;                  # Query data

# Backend
cd backend
npm run dev                               # Start with auto-reload
npm start                                 # Start production mode
node server.js                            # Direct start

# Frontend
npm run dev                               # Start dev server
npm run build                             # Build for production
npm run preview                           # Preview production build

# Both
npm install                               # Install dependencies
npm list                                  # List installed packages
```
