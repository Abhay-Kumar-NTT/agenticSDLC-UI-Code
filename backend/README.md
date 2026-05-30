# AgenticSDLC Backend API

Backend server for the AgenticSDLC Workflow Designer with PostgreSQL database integration.

## Features

- ✅ RESTful API for workflow management
- ✅ PostgreSQL database with connection pooling
- ✅ Environment-based configuration (dev/staging/prod)
- ✅ Transaction support for data integrity
- ✅ CORS enabled for frontend integration
- ✅ Comprehensive error handling
- ✅ Request logging

## Prerequisites

- Node.js 16+ 
- PostgreSQL 12+
- npm or yarn

## Installation

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Setup PostgreSQL Database

Create a database:

```sql
CREATE DATABASE agenticsdlc_dev;
```

Run the schema:

```bash
psql -U postgres -d agenticsdlc_dev -f db/schema.sql
```

### 3. Configure Environment

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

Update `.env` with your database credentials:

```env
NODE_ENV=development
DB_HOST=localhost
DB_PORT=5432
DB_NAME=agenticsdlc_dev
DB_USER=postgres
DB_PASSWORD=your_password
PORT=3001
CORS_ORIGIN=http://localhost:5173
```

### 4. Start the Server

**Development mode** (with auto-reload):
```bash
npm run dev
```

**Production mode**:
```bash
npm start
```

The server will start on `http://localhost:3001`

## API Endpoints

### Health Check
```
GET /health
```

### Workflows

#### Create Workflow
```
POST /api/workflows
Content-Type: application/json

{
  "name": "My Workflow",
  "description": "Optional description",
  "status": "draft",
  "nodes": [
    {
      "id": "node-1",
      "type": "product-vision",
      "label": "Product Vision",
      "category": "Strategic",
      "color": "#6366f1",
      "x": 100,
      "y": 100
    }
  ],
  "edges": [
    {
      "id": "edge-1",
      "fromId": "node-1",
      "toId": "node-2",
      "relationship": "generates"
    }
  ],
  "createdBy": "user@example.com",
  "metadata": {}
}
```

#### Get All Workflows
```
GET /api/workflows?status=draft&limit=50&offset=0
```

#### Get Workflow by ID
```
GET /api/workflows/:id
```

#### Update Workflow Metadata
```
PUT /api/workflows/:id
Content-Type: application/json

{
  "name": "Updated Name",
  "status": "active"
}
```

#### Update Workflow Content
```
PUT /api/workflows/:id/content
Content-Type: application/json

{
  "nodes": [...],
  "edges": [...]
}
```

#### Delete Workflow
```
DELETE /api/workflows/:id
```

## Database Schema

### Tables

**workflows**
- `id` (UUID, primary key)
- `name` (VARCHAR)
- `description` (TEXT)
- `status` (VARCHAR: draft/active/paused/archived)
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)
- `created_by` (VARCHAR)
- `version` (INTEGER)
- `metadata` (JSONB)

**workflow_nodes**
- `id` (UUID, primary key)
- `workflow_id` (UUID, foreign key)
- `node_id` (VARCHAR, client ID)
- `node_type` (VARCHAR)
- `label` (VARCHAR)
- `category` (VARCHAR)
- `color` (VARCHAR)
- `position_x` (NUMERIC)
- `position_y` (NUMERIC)
- `config` (JSONB)

**workflow_edges**
- `id` (UUID, primary key)
- `workflow_id` (UUID, foreign key)
- `edge_id` (VARCHAR, client ID)
- `from_node_id` (VARCHAR)
- `to_node_id` (VARCHAR)
- `relationship` (VARCHAR)
- `config` (JSONB)

**workflow_executions**
- Tracks workflow execution history

## Configuration Files

### `config/database.config.js`

Environment-specific database configurations:
- **Development**: Local PostgreSQL
- **Staging**: Staging database with SSL
- **Production**: Production database with strict SSL

Switch environments using `NODE_ENV`:
```bash
NODE_ENV=production npm start
```

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NODE_ENV` | Environment (development/staging/production) | development |
| `DB_HOST` | Database host | localhost |
| `DB_PORT` | Database port | 5432 |
| `DB_NAME` | Database name | agenticsdlc_dev |
| `DB_USER` | Database user | postgres |
| `DB_PASSWORD` | Database password | postgres |
| `PORT` | Server port | 3001 |
| `CORS_ORIGIN` | Allowed CORS origin | http://localhost:5173 |

## Project Structure

```
backend/
├── config/
│   └── database.config.js    # Environment-based DB config
├── db/
│   ├── connection.js          # PostgreSQL connection pool
│   └── schema.sql             # Database schema
├── models/
│   └── workflow.model.js      # Workflow data access layer
├── routes/
│   └── workflow.routes.js     # API route handlers
├── server.js                  # Express server setup
├── package.json
├── .env.example
└── README.md
```

## Error Handling

All API responses follow this format:

**Success:**
```json
{
  "success": true,
  "data": { ... },
  "message": "Optional message"
}
```

**Error:**
```json
{
  "success": false,
  "error": "Error description",
  "message": "Detailed error message"
}
```

## Database Connection Pooling

The application uses `pg` connection pooling for efficient database access:

- **Development**: Max 20 connections
- **Staging**: Max 50 connections
- **Production**: Max 100 connections

Connections are automatically released back to the pool.

## Testing

### Test Database Connection

```bash
node -e "import('./db/connection.js')"
```

### Test API Endpoints

```bash
# Health check
curl http://localhost:3001/health

# Create workflow
curl -X POST http://localhost:3001/api/workflows \
  -H "Content-Type: application/json" \
  -d '{"name":"Test Workflow","nodes":[],"edges":[]}'
```

## Deployment

### Using PM2 (Production)

```bash
npm install -g pm2

pm2 start server.js --name agenticsdlc-backend
pm2 save
pm2 startup
```

### Using Docker

Create `Dockerfile`:
```dockerfile
FROM node:18
WORKDIR /app
COPY package*.json ./
RUN npm install --production
COPY . .
EXPOSE 3001
CMD ["npm", "start"]
```

Build and run:
```bash
docker build -t agenticsdlc-backend .
docker run -p 3001:3001 --env-file .env agenticsdlc-backend
```

## Security Considerations

- ✅ Environment variables for sensitive data
- ✅ SQL injection protection (parameterized queries)
- ✅ CORS configuration
- ✅ SSL enforcement in production
- ⚠️ Add authentication/authorization as needed
- ⚠️ Implement rate limiting for production
- ⚠️ Add input validation middleware

## Troubleshooting

### Connection Refused
- Check if PostgreSQL is running
- Verify database credentials
- Check firewall settings

### Port Already in Use
- Change `PORT` in `.env`
- Kill existing process: `lsof -ti:3001 | xargs kill`

### SSL Connection Error (Production)
- Verify SSL certificate path
- Check `DB_SSL_CA` environment variable

## License

[Your License]
