# 🍜 TENZAI Purchasing System

ระบบจัดการการสั่งซื้อสำหรับร้านอาหารญี่ปุ่น ที่เชื่อมต่อระหว่าง Supabase, Odoo และ Vercel

## 🚀 ฟีเจอร์หลัก

### 📊 **Dashboard & Analytics**
- แสดงสถิติและข้อมูลสำคัญของธุรกิจ
- กราฟและชาร์ตแบบ Real-time
- การแจ้งเตือนสินค้าใกล้หมด

### 🛍️ **การจัดการสินค้า**
- เพิ่ม/แก้ไข/ลบสินค้า
- จัดการสต๊อกและราคา
- แยกประเภทสินค้า (วัตถุดิบ, สินค้าสำเร็จรูป, บริการ)

### 🏢 **การจัดการผู้จำหน่าย**
- ข้อมูลผู้จำหน่ายครบถ้วน
- ระบบจัดอันดับผู้จำหน่าย (A, B, C)
- ประวัติการสั่งซื้อ

### 📋 **ระบบใบสั่งซื้อ**
- ใบขอซื้อ (Purchase Request)
- ใบสั่งซื้อ (Purchase Order)
- ใบรับสินค้า (Goods Receipt)

### 📦 **การจัดการคลังสินค้า**
- ติดตามสต๊อกแบบ Real-time
- จัดการพื้นที่จัดเก็บ
- ระบบแจ้งเตือนสต๊อกต่ำ

### 🔄 **การซิงค์ข้อมูล**
- เชื่อมต่อกับ Odoo ERP
- ซิงค์ข้อมูลระหว่าง Supabase และ Odoo
- ระบบตรวจสอบสถานะการเชื่อมต่อ

## 🛠️ เทคโนโลยีที่ใช้

### **Frontend**
- **React 18** + **TypeScript**
- **Vite** (Build Tool)
- **Tailwind CSS** (Styling)
- **React Router DOM** (Routing)
- **Recharts** (Charts)
- **Lucide React** (Icons)

### **Backend**
- **Express.js** (API Server)
- **Supabase** (Database & Auth)
- **Odoo XML-RPC** (ERP Integration)
- **JWT** (Authentication)

### **Deployment**
- **Vercel** (Frontend + Backend API)
- **Supabase** (Database Hosting)

## 📋 การติดตั้ง

### 1. **Clone Repository**
```bash
git clone <repository-url>
cd project
```

### 2. **ติดตั้ง Dependencies**
```bash
# Frontend dependencies
npm install

# Backend dependencies
cd backend-api
npm install
cd ..
```

### 3. **ตั้งค่า Environment Variables**

#### Frontend (.env)
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_API_URL=https://your-api-domain.vercel.app
```

#### Backend (backend-api/.env)
```env
# Supabase Configuration
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Odoo Configuration
ODOO_URL=https://your-odoo-instance.com
ODOO_DB=your_database_name
ODOO_USERNAME=your_username
ODOO_PASSWORD=your_password

# JWT Configuration
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=24h

# Server Configuration
NODE_ENV=production
PORT=3001
CORS_ORIGIN=https://your-frontend-domain.vercel.app
```

### 4. **ตั้งค่า Database**

#### Supabase Setup
1. สร้างโปรเจคใหม่ใน Supabase
2. รัน SQL script จาก `database-schema.sql`
3. ตั้งค่า RLS (Row Level Security)
4. สร้าง Service Role Key

#### Odoo Setup
1. เปิดใช้งาน XML-RPC ใน Odoo
2. สร้าง API user
3. ตั้งค่าสิทธิ์การเข้าถึง

### 5. **Development**
```bash
# Frontend development
npm run dev

# Backend development
cd backend-api
npm run dev
```

### 6. **Production Deployment**

#### Vercel Deployment
1. เชื่อมต่อ GitHub repository กับ Vercel
2. ตั้งค่า Environment Variables ใน Vercel
3. Deploy อัตโนมัติ

## 🔧 การใช้งาน

### **การเข้าสู่ระบบ**
- **Admin**: admin@tenzai.com / admin123
- **Purchasing**: purchasing@tenzai.com / purchasing123
- **Warehouse**: warehouse@tenzai.com / warehouse123

### **การซิงค์ข้อมูล**
1. เข้าไปที่หน้า "สถานะระบบ"
2. ตรวจสอบการเชื่อมต่อ Supabase และ Odoo
3. เลือกประเภทข้อมูลที่ต้องการซิงค์
4. กดปุ่ม "ซิงค์" เพื่อเริ่มกระบวนการ

### **การจัดการสิทธิ์**
ระบบมี 5 ระดับสิทธิ์:
- **Admin**: เข้าถึงทุกฟีเจอร์
- **Purchasing**: จัดการการสั่งซื้อ
- **Warehouse**: จัดการคลังสินค้า
- **Processing**: จัดการการแปรรูป
- **Transport**: จัดการการขนส่ง

## 📊 API Endpoints

### **Authentication**
- `POST /api/auth/login` - เข้าสู่ระบบ
- `POST /api/auth/logout` - ออกจากระบบ
- `GET /api/auth/profile` - ข้อมูลผู้ใช้

### **Products**
- `GET /api/products` - รายการสินค้า
- `POST /api/products` - เพิ่มสินค้า
- `PUT /api/products/:id` - แก้ไขสินค้า
- `DELETE /api/products/:id` - ลบสินค้า

### **Suppliers**
- `GET /api/suppliers` - รายการผู้จำหน่าย
- `POST /api/suppliers` - เพิ่มผู้จำหน่าย
- `PUT /api/suppliers/:id` - แก้ไขผู้จำหน่าย
- `DELETE /api/suppliers/:id` - ลบผู้จำหน่าย

### **Odoo Integration**
- `GET /api/odoo/products` - สินค้าจาก Odoo
- `GET /api/odoo/suppliers` - ผู้จำหน่ายจาก Odoo
- `GET /api/odoo/orders` - คำสั่งซื้อจาก Odoo
- `POST /api/odoo/sync` - ซิงค์ข้อมูลกับ Odoo

### **Sync Operations**
- `GET /api/sync/test` - ทดสอบการเชื่อมต่อ
- `POST /api/sync/products` - ซิงค์สินค้า
- `POST /api/sync/suppliers` - ซิงค์ผู้จำหน่าย
- `POST /api/sync/purchase-orders` - ซิงค์คำสั่งซื้อ
- `POST /api/sync/full` - ซิงค์ทั้งหมด

## 🔒 ความปลอดภัย

- **JWT Authentication** สำหรับ API
- **Row Level Security (RLS)** ใน Supabase
- **CORS Protection** สำหรับ Frontend
- **Rate Limiting** ป้องกันการโจมตี
- **Input Validation** ทุก endpoint

## 📈 การติดตามและ Monitoring

- **Health Check**: `/health` endpoint
- **Error Logging**: ระบบบันทึก error อัตโนมัติ
- **Performance Monitoring**: Vercel Analytics
- **Database Monitoring**: Supabase Dashboard

## 🤝 การสนับสนุน

### **ทีมพัฒนา**
- **TENZAITECH** - พัฒนาระบบหลัก
- **Email**: support@tenzai.com
- **Documentation**: [Wiki](https://github.com/tenzai/purchasing-system/wiki)

### **การรายงานปัญหา**
1. สร้าง Issue ใน GitHub
2. อธิบายปัญหาอย่างละเอียด
3. แนบ Screenshot (ถ้ามี)
4. ระบุ Environment (Development/Production)

## 📄 License

MIT License - ดูรายละเอียดใน [LICENSE](LICENSE) file

---

**TENZAI Purchasing System** - ระบบจัดการการสั่งซื้อที่ครบครันสำหรับร้านอาหารญี่ปุ่น 🍜 