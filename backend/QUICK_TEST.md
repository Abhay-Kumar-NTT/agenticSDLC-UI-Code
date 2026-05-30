# Quick Database Connection Test

## 🚀 Fastest Way to Test (Windows)

### Option 1: Double-click Batch File
```
1. Open: backend/test-db.bat
2. Enter your postgres password
3. Done!
```

### Option 2: One Command Test
```powershell
cd backend
node test-db-simple.cjs
```

**⚠️ First, edit `test-db-simple.cjs` line 9:**
```javascript
password: 'YOUR_PASSWORD',  // ← Change this!
```

---

## 📝 What You Need

1. **PostgreSQL installed** ✓
2. **Your postgres password** ✓
3. **Node.js installed** (for Node test)

---

## ✅ Success Looks Like:

```
✅ Connected successfully!
✅ Database time: 2026-05-29...
✅ PostgreSQL version: PostgreSQL 16.x
✅ CONNECTION TEST PASSED!
```

---

## ❌ If It Fails:

### "Connection refused"
```powershell
# Start PostgreSQL
net start postgresql*
```

### "Wrong password"
```powershell
# Connect and reset
psql -U postgres
ALTER USER postgres PASSWORD 'new_password';
```

### "Database not found"
```powershell
psql -U postgres
CREATE DATABASE agenticsdlc_dev;
\q
```

---

## 🎯 After Successful Test:

```bash
# 1. Create database (if not exists)
psql -U postgres
CREATE DATABASE agenticsdlc_dev;
\q

# 2. Run schema
cd backend
psql -U postgres -d agenticsdlc_dev -f db/schema.sql

# 3. Configure .env
cp .env.example .env
# Edit .env with your password

# 4. Start server
npm install
npm run dev
```

---

## 📞 Still Need Help?

See: [TEST_DATABASE.md](TEST_DATABASE.md) for detailed guide
