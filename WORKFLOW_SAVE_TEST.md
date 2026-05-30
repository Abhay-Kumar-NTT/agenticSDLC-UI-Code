# Workflow Save to Database - Test Guide

This guide walks you through testing the workflow save functionality with PostgreSQL database.

## Prerequisites Checklist

Before testing, ensure:

- [ ] PostgreSQL is running
- [ ] Database `agenticsdlc_dev` is created
- [ ] Schema is loaded (tables created)
- [ ] Backend `.env` is configured with correct password
- [ ] Backend server is running on port 3001
- [ ] Frontend is running on port 5173

## Quick Setup (If Not Done)

### 1. Start Backend Server

```bash
# Terminal 1
cd backend
npm run dev
```

**Expected output:**
```
✅ Database connected successfully
🚀 Server running on: http://localhost:3001
```

### 2. Start Frontend

```bash
# Terminal 2 (new terminal)
npm run dev
```

**Expected output:**
```
➜  Local:   http://localhost:5173/
```

---

## Test Steps

### Test 1: Save a Simple Workflow

1. **Open Browser**
   - Navigate to: http://localhost:5173

2. **Go to Workflow Designer**
   - Click "Workflows" in left sidebar
   - Select "Workflow Designer" tab

3. **Create a Simple Workflow**
   - Drag "Product Vision" from palette to canvas
   - Drag "PRD" from palette to canvas
   - Click the output port (▶) on Product Vision
   - Click on PRD node to connect them

4. **Save Workflow**
   - Click "+ Save Workflow" button (top toolbar)
   - Enter name: `Test Workflow 1`
   - Click "Save"

5. **Expected Result:**
   - ✅ Success alert: "Workflow saved successfully to database!"
   - ✅ Workflow ID displayed in alert
   - ✅ Workflow appears in "Saved Workflows" tab

### Test 2: Verify in Database

**Option A: Using psql**
```bash
psql -U postgres -d agenticsdlc_dev

-- Check workflow saved
SELECT id, name, status, created_at FROM workflows;

-- Check nodes saved
SELECT node_id, label, category FROM workflow_nodes;

-- Check edges saved
SELECT edge_id, from_node_id, to_node_id, relationship FROM workflow_edges;

-- Exit
\q
```

**Option B: Using Node.js script**
```bash
cd backend
node -e "
const { query } = require('./db/connection.js');
query('SELECT * FROM workflows').then(r => console.log(r.rows));
"
```

**Expected Result:**
- ✅ 1 workflow record
- ✅ 2 node records (Product Vision, PRD)
- ✅ 1 edge record (connection)

### Test 3: Save Multiple Workflows

Repeat Test 1 with different names:
- `Test Workflow 2` - with 3 nodes
- `Test Workflow 3` - with 5 nodes and 4 connections

**Expected Result:**
- ✅ All workflows appear in "Saved Workflows" list
- ✅ Each has correct node/edge count
- ✅ All are in database

### Test 4: Reload Page (Persistence Test)

1. **Refresh browser** (F5)
2. **Go to Workflow Designer**
3. **Check "Saved Workflows" tab**

**Expected Result:**
- ✅ All saved workflows still appear
- ✅ Loaded from database (not defaults)
- ✅ Console shows: "Loaded X workflows from database"

### Test 5: Load and Edit Workflow

1. **In "Saved Workflows" tab:**
   - Click "Load" on a saved workflow

2. **Verify:**
   - ✅ Nodes appear on canvas
   - ✅ Edges are connected correctly
   - ✅ Can add more nodes
   - ✅ Can save again (creates new workflow)

### Test 6: API Health Check

**Test backend API directly:**

```bash
# Health check
curl http://localhost:3001/health

# Get all workflows
curl http://localhost:3001/api/workflows

# Get specific workflow (replace ID)
curl http://localhost:3001/api/workflows/YOUR-WORKFLOW-ID
```

**Expected Result:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid-here",
      "name": "Test Workflow 1",
      "status": "draft",
      "nodes": [...],
      "edges": [...]
    }
  ]
}
```

---

## Troubleshooting

### Issue: "Failed to save workflow: Connection refused"

**Cause:** Backend not running

**Fix:**
```bash
cd backend
npm run dev
```

### Issue: "Failed to save workflow: 500 Internal Server Error"

**Cause:** Database connection issue

**Fix:**
1. Check backend console for errors
2. Verify database password in `backend/.env`
3. Test connection: `cd backend && node test-db-simple.cjs`

### Issue: No alert appears when clicking Save

**Cause:** JavaScript error

**Fix:**
1. Open browser DevTools (F12)
2. Check Console tab for errors
3. Look for red error messages

### Issue: Workflows not loading after refresh

**Cause:** Database query failing

**Fix:**
1. Check backend console logs
2. Run: `psql -U postgres -d agenticsdlc_dev -c "SELECT * FROM workflows;"`
3. Verify tables exist

### Issue: "Cannot find module '../services/workflow.service'"

**Cause:** TypeScript/build issue

**Fix:**
1. Restart frontend: Ctrl+C, then `npm run dev`
2. Check file exists: `src/services/workflow.service.ts`

---

## Verification Checklist

After testing, verify:

- [ ] Workflows save to database (check psql)
- [ ] Success alert appears with workflow ID
- [ ] Workflows appear in Saved Workflows list
- [ ] Workflows persist after page refresh
- [ ] Multiple workflows can be saved
- [ ] Nodes and edges save correctly
- [ ] Load workflow restores canvas correctly

---

## Browser Console Output

When saving successfully, you should see:

```
Saving workflow to database...
Workflow saved: {id: "uuid", name: "Test Workflow 1", ...}
```

When loading on page load:

```
Loading workflows from database...
Loaded 3 workflows from database
```

---

## Database Queries for Testing

```sql
-- Count workflows
SELECT COUNT(*) FROM workflows;

-- Count nodes
SELECT COUNT(*) FROM workflow_nodes;

-- Count edges
SELECT COUNT(*) FROM workflow_edges;

-- View workflow with details
SELECT 
  w.id,
  w.name,
  w.status,
  COUNT(DISTINCT wn.id) as node_count,
  COUNT(DISTINCT we.id) as edge_count
FROM workflows w
LEFT JOIN workflow_nodes wn ON w.id = wn.workflow_id
LEFT JOIN workflow_edges we ON w.id = we.workflow_id
GROUP BY w.id, w.name, w.status;

-- Delete test workflows (if needed)
DELETE FROM workflows WHERE name LIKE 'Test Workflow%';
```

---

## Success Criteria

✅ **Test Passed If:**
1. Workflow saves to database
2. UUID returned from database
3. Data persists after refresh
4. Nodes and edges stored correctly
5. Multiple workflows supported
6. No console errors

❌ **Test Failed If:**
- Error alert appears
- Console shows errors
- No data in database
- Workflows disappear on refresh

---

## Next Steps After Successful Test

1. ✅ Add delete functionality
2. ✅ Add edit/update functionality
3. ✅ Add workflow version control
4. ✅ Add user authentication
5. ✅ Add workflow sharing
6. ✅ Add workflow templates

---

## Performance Test (Optional)

Test with large workflow:
- Create workflow with 20+ nodes
- Save to database
- Check save time (should be < 2 seconds)
- Reload and check load time

---

## Security Test (Optional)

Verify:
- SQL injection prevention (try special characters in name)
- XSS prevention (try HTML in name)
- CORS configured correctly
- No sensitive data in client-side logs

---

## Test Report Template

```
Test Date: ___________
Tester: ___________

✅ Backend running: Yes/No
✅ Database connected: Yes/No
✅ Workflow saved: Yes/No
✅ Workflow ID: ___________
✅ Data in database: Yes/No
✅ Load after refresh: Yes/No

Issues found:
___________

Notes:
___________
```
