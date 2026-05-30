# Quick Test: Workflow Save to Database

## 🚀 Quick Start (3 Steps)

### 1. Start Backend
```bash
cd backend
npm run dev
```
Wait for: `✅ Database connected successfully`

### 2. Start Frontend (New Terminal)
```bash
npm run dev
```
Wait for: `Local: http://localhost:5173/`

### 3. Test in Browser

1. **Open:** http://localhost:5173
2. **Click:** "Workflows" (left sidebar)
3. **Click:** "Workflow Designer" tab
4. **Drag:** 2-3 elements from palette to canvas
5. **Connect:** Click output port → target node
6. **Click:** "+ Save Workflow" button
7. **Enter:** "My Test Workflow"
8. **Click:** "Save"

---

## ✅ Success Looks Like:

```
Alert: ✅ Workflow "My Test Workflow" saved successfully to database!
       Workflow ID: a1b2c3d4-...
```

**And in "Saved Workflows" tab:**
- Your workflow appears at the top
- Shows node count and edge count

---

## 🔍 Verify in Database:

```bash
psql -U postgres -d agenticsdlc_dev
SELECT name, status, created_at FROM workflows;
\q
```

**Or:**
```bash
cd backend
node test-db-simple.cjs
```

---

## ❌ If It Fails:

### Backend Not Starting?
```bash
# Check if PostgreSQL is running
Get-Service postgresql*

# If stopped:
net start postgresql*
```

### Alert Shows Error?
```
Check:
1. Backend console for errors
2. Browser DevTools (F12) → Console tab
3. Password in backend/.env has quotes: "Nttdata#123"
```

### Workflow Not Saving?
```bash
# Test database connection
cd backend
node test-db-simple.cjs

# Should show:
# ✅ Connected successfully!
```

---

## 📊 Expected Console Output

**Browser Console (F12):**
```
Saving workflow to database...
Workflow saved: {id: "...", name: "My Test Workflow", nodes: [...], edges: [...]}
```

**Backend Console:**
```
POST /api/workflows
📊 Query executed: INSERT INTO workflows...
201 Created
```

---

## 🎯 Complete Test Checklist

- [ ] Backend starts without errors
- [ ] Database connection successful
- [ ] Frontend loads at localhost:5173
- [ ] Can create workflow on canvas
- [ ] "+ Save Workflow" button works
- [ ] Success alert appears with ID
- [ ] Workflow appears in Saved Workflows
- [ ] Data exists in database
- [ ] Workflow loads after page refresh

---

## 📞 Quick Help

| Problem | Solution |
|---------|----------|
| Backend won't start | Use Command Prompt instead of PowerShell |
| Connection refused | Start PostgreSQL: `net start postgresql*` |
| Wrong password | Quote in .env: `DB_PASSWORD="Nttdata#123"` |
| Module not found | Run: `cd backend && npm install` |
| Frontend error | Restart: Ctrl+C, then `npm run dev` |

---

## 🔗 Full Documentation

See: [WORKFLOW_SAVE_TEST.md](WORKFLOW_SAVE_TEST.md) for complete testing guide
