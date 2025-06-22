# 🚀 Odoo Express Connector

API สำหรับเชื่อมต่อกับระบบ Odoo ERP ของ Tenzai Tech

## 📋 คุณสมบัติ

- ✅ เชื่อมต่อกับ Odoo ERP ผ่าน JSON-RPC API
- ✅ จัดการข้อมูล Partners (ลูกค้า/ซัพพลายเออร์)
- ✅ จัดการข้อมูล Sales Orders
- ✅ จัดการข้อมูล Products
- ✅ Generic CRUD operations สำหรับทุก model
- ✅ Authentication และ Session management
- ✅ Error handling และ logging
- ✅ Security middleware (Helmet, CORS)

## 🛠️ การติดตั้ง

### 1. ติดตั้ง Dependencies

```bash
npm install
```

### 2. ตั้งค่า Environment Variables

ไฟล์ `config.env` จะถูกสร้างขึ้นแล้วพร้อมข้อมูลการเชื่อมต่อ:

```env
# Odoo Connection Configuration
ODOO_URL=https://tztech.odoo.com
ODOO_DATABASE=tenzaitech
ODOO_USERNAME=tenzaigroup.tech@gmail.com
ODOO_PASSWORD=Tenzai.5678.tZ.
ODOO_API_KEY=74d3f3c7141b16b5c7e8d44d0092668518400722

# Server Configuration
PORT=3000
NODE_ENV=development
```

### 3. รันเซิร์ฟเวอร์

```bash
# Development mode
npm run dev

# Production mode
npm start
```

## 🔗 API Endpoints

### Health Check
```
GET /health
```

### Odoo Connection Test
```
GET /api/odoo/test
```

### Partners (ลูกค้า/ซัพพลายเออร์)
```
GET    /api/odoo/partners          # ดึงรายการ partners
GET    /api/odoo/partners/:id      # ดึง partner ตาม ID
POST   /api/odoo/partners          # สร้าง partner ใหม่
PUT    /api/odoo/partners/:id      # อัปเดต partner
```

### Sales Orders
```
GET    /api/odoo/sales-orders      # ดึงรายการ sales orders
```

### Products
```
GET    /api/odoo/products          # ดึงรายการ products
```

### Generic Operations
```
POST   /api/odoo/search            # ค้นหาข้อมูลทั่วไป
POST   /api/odoo/create            # สร้างข้อมูลทั่วไป
PUT    /api/odoo/update/:model/:id # อัปเดตข้อมูลทั่วไป
```

### Authentication
```
POST   /api/odoo/logout            # ออกจากระบบ
```

## 📝 ตัวอย่างการใช้งาน

### 1. ทดสอบการเชื่อมต่อ

```bash
curl http://localhost:3000/api/odoo/test
```

### 2. ดึงรายการ Partners

```bash
curl http://localhost:3000/api/odoo/partners
```

### 3. สร้าง Partner ใหม่

```bash
curl -X POST http://localhost:3000/api/odoo/partners \
  -H "Content-Type: application/json" \
  -d '{
    "name": "บริษัท ตัวอย่าง จำกัด",
    "email": "contact@example.com",
    "phone": "02-123-4567",
    "is_company": true
  }'
```

### 4. ค้นหาข้อมูลทั่วไป

```bash
curl -X POST http://localhost:3000/api/odoo/search \
  -H "Content-Type: application/json" \
  -d '{
    "model": "res.partner",
    "domain": [["is_company", "=", true]],
    "fields": ["id", "name", "email"],
    "limit": 10
  }'
```

## 🏗️ โครงสร้างโปรเจค

```
├── src/
│   ├── config/
│   │   └── odoo.config.js      # การตั้งค่า Odoo
│   ├── services/
│   │   └── odoo.service.js     # Service class สำหรับ Odoo
│   └── routes/
│       └── odoo.routes.js      # API routes
├── server.js                   # Express server หลัก
├── package.json               # Dependencies
├── config.env                 # Environment variables
└── README.md                  # เอกสารนี้
```

## 🔧 การพัฒนา

### การรันในโหมด Development

```bash
npm run dev
```

### การทดสอบ

```bash
npm test
```

## 🛡️ Security

- ใช้ Helmet สำหรับ security headers
- CORS configuration
- Input validation
- Error handling ที่ปลอดภัย

## 📊 การ Monitor

- Health check endpoint: `/health`
- Logging ด้วย Morgan
- Error tracking

## 🚀 การ Deploy

### Production Environment

1. ตั้งค่า `NODE_ENV=production`
2. เปลี่ยน `JWT_SECRET` ใน config.env
3. ตั้งค่า CORS origins ที่เหมาะสม
4. ใช้ PM2 หรือ Docker สำหรับ deployment

### Docker (Optional)

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 3000
CMD ["npm", "start"]
```

## 📞 การสนับสนุน

หากมีปัญหาหรือคำถาม กรุณาติดต่อ:
- Email: tenzaigroup.tech@gmail.com
- Odoo Instance: https://tztech.odoo.com

## 📄 License

MIT License - ดูรายละเอียดในไฟล์ LICENSE 