# 🔑 API Keys Summary - TPS V2.5 Tools Directory

## 📍 **ไฟล์ที่พบ API Keys**

### **1. Supabase Configuration**
- **URL:** `https://uwbkcflneknwuetpkoau.supabase.co`
- **Service Role Key:** `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV3YmtjZmxuZWtud3VldHBrb2F1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MDE1ODEzMiwiZXhwIjoyMDY1NzM0MTMyfQ.V-T04aUsgt4WyiKHHbKK1i9aLd-uSs7-D7odYM2HMZE`
- **Anon Key:** `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV3YmtjZmxuZWtud3VldHBrb2F1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAxNTgxMzIsImV4cCI6MjA2NTczNDEzMn0.rYFDSKIF47e2_c80mCvAxV96PuXOeYg9rus83NbXowA`

### **2. N8N Configuration**
- **Base URL:** `https://n8n-tpsserver.onrender.com`
- **API Key:** `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIyOWUxYTFjYi0zOTIyLTQxMzktOTc4MC0zMDA5YTg2YjFjODIiLCJpc3MiOiJuOG4iLCJhdWQiOiJwdWJsaWMtYXBpIiwiaWF0IjoxNzUwNDI3ODg1LCJleHAiOjE3NTI5ODQwMDB9.8vl34UiWrhLxcp-MRzDADpasbJ37brfoRjWrzUPOHCk`
- **Webhook URL:** `https://n8n-tpsserver.onrender.com/webhook/purchase-request-created`

## 📁 **ไฟล์ที่มี API Keys**

### **Vector Search Tools:**
- `tools/vector-search/vector_test_pgvector.js`
- `tools/vector-search/vector_test.js`
- `tools/vector-search/vector_documents_test.js`
- `tools/vector-search/setup_pgvector.js`
- `tools/vector-search/create_table_simple.js`

### **Testing Tools:**
- `tools/testing/test-supabase-connection.js`
- `tools/testing/test-complete-system.html`

### **Database Tools:**
- `tools/database/create-tps-workflow.mjs`
- `tools/database/create-tps-workflow.js`
- `tools/database/create-tps-workflow-simple.mjs`
- `tools/database/create-tps-workflow-final.mjs`
- `tools/database/create-tps-workflow-correct.mjs`

## ⚠️ **Security Warning**

**API Keys เหล่านี้ถูก hardcode ไว้ในไฟล์ ซึ่งไม่ปลอดภัย**

### **คำแนะนำ:**
1. **ย้ายไปใช้ Environment Variables**
2. **ไม่ commit API keys ลง Git**
3. **ใช้ .env files สำหรับ local development**
4. **ใช้ Vercel Environment Variables สำหรับ production**

## 🔧 **Environment Variables Template**

```env
# Supabase Configuration
VITE_SUPABASE_URL=https://uwbkcflneknwuetpkoau.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV3YmtjZmxuZWtud3VldHBrb2F1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAxNTgxMzIsImV4cCI6MjA2NTczNDEzMn0.rYFDSKIF47e2_c80mCvAxV96PuXOeYg9rus83NbXowA
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV3YmtjZmxuZWtud3VldHBrb2F1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MDE1ODEzMiwiZXhwIjoyMDY1NzM0MTMyfQ.V-T04aUsgt4WyiKHHbKK1i9aLd-uSs7-D7odYM2HMZE

# N8N Configuration
VITE_N8N_BASE_URL=https://n8n-tpsserver.onrender.com
VITE_N8N_API_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIyOWUxYTFjYi0zOTIyLTQxMzktOTc4MC0zMDA5YTg2YjFjODIiLCJpc3MiOiJuOG4iLCJhdWQiOiJwdWJsaWMtYXBpIiwiaWF0IjoxNzUwNDI3ODg1LCJleHAiOjE3NTI5ODQwMDB9.8vl34UiWrhLxcp-MRzDADpasbJ37brfoRjWrzUPOHCk
VITE_N8N_WEBHOOK_SECRET=your_webhook_secret
```

## 📅 **Created:** 2025-01-20
## 🔄 **Last Updated:** 2025-01-20 