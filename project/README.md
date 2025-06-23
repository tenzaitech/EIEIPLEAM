# 🍣 TENZAI Purchasing System

ระบบจัดการการจัดซื้อสำหรับร้านอาหารญี่ปุ่น ที่พัฒนาด้วย React + TypeScript + Supabase

## 🚀 Features

- **📦 Product Management** - จัดการสินค้าและวัตถุดิบ
- **👥 Supplier Management** - จัดการซัพพลายเออร์
- **📋 Purchase Requests** - คำขอจัดซื้อ
- **📦 Purchase Orders** - ใบสั่งซื้อ
- **📥 Goods Receipt** - ใบรับสินค้า
- **🏪 Storage Management** - จัดการคลังสินค้า
- **🍳 Processing Records** - บันทึกการแปรรูป
- **🚚 Transportation** - จัดการการขนส่ง
- **📊 Analytics & Reports** - วิเคราะห์และรายงาน
- **🌐 Multi-language Support** - รองรับหลายภาษา (ไทย, อังกฤษ, เมียนมาร์)

## 🛠️ Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **UI Framework**: Tailwind CSS
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Deployment**: Vercel
- **Icons**: Lucide React
- **Charts**: Recharts
- **Forms**: React Hook Form

## 📋 Prerequisites

- Node.js 18+ 
- npm หรือ yarn
- Supabase account
- Vercel account (สำหรับ deployment)

## 🔧 Installation

### 1. Clone Repository
```bash
git clone <repository-url>
cd project
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Variables
สร้างไฟล์ `.env.local` ในโฟลเดอร์ `project/`:

```env
# Supabase Configuration
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# Odoo Configuration (Backend API)
VITE_ODOO_URL=https://tztech.odoo.com
VITE_ODOO_DATABASE=tztech
VITE_ODOO_USERNAME=pleamnm@gmail.com
VITE_ODOO_PASSWORD=pleam5678
VITE_ODOO_API_KEY=74d3f3c7141b16b5c7e8d44d0092668518400722

# App Configuration
VITE_APP_NAME=TENZAI Purchasing System
VITE_APP_VERSION=1.0.0
VITE_API_BASE_URL=https://express-v1-jhig9wg95-tenzaitech.vercel.app
```

### 4. Supabase Setup

#### 4.1 สร้าง Supabase Project
1. ไปที่ [supabase.com](https://supabase.com)
2. สร้าง project ใหม่
3. เก็บ URL และ anon key

#### 4.2 สร้าง Database Tables
รัน SQL script ต่อไปนี้ใน Supabase SQL Editor:

```sql
-- Products Table
CREATE TABLE products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  code TEXT UNIQUE NOT NULL,
  description TEXT,
  list_price DECIMAL(10,2) NOT NULL DEFAULT 0,
  cost_price DECIMAL(10,2) NOT NULL DEFAULT 0,
  type TEXT CHECK (type IN ('raw_material', 'finished_product', 'service')) NOT NULL,
  category_id UUID,
  unit_of_measure TEXT NOT NULL DEFAULT 'kg',
  minimum_stock INTEGER NOT NULL DEFAULT 0,
  maximum_stock INTEGER NOT NULL DEFAULT 0,
  current_stock INTEGER NOT NULL DEFAULT 0,
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Suppliers Table
CREATE TABLE suppliers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  address TEXT,
  city TEXT,
  country TEXT,
  zip_code TEXT,
  supplier_rank TEXT CHECK (supplier_rank IN ('A', 'B', 'C')) NOT NULL DEFAULT 'B',
  payment_terms TEXT,
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Purchase Requests Table
CREATE TABLE purchase_requests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  pr_number TEXT UNIQUE NOT NULL,
  requester_id UUID NOT NULL,
  department TEXT NOT NULL,
  priority TEXT CHECK (priority IN ('low', 'medium', 'high', 'urgent')) NOT NULL DEFAULT 'medium',
  expected_date DATE NOT NULL,
  notes TEXT,
  status TEXT CHECK (status IN ('draft', 'pending', 'approved', 'rejected', 'cancelled')) NOT NULL DEFAULT 'draft',
  total_amount DECIMAL(10,2) NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  approved_at TIMESTAMP WITH TIME ZONE,
  approved_by UUID
);

-- Purchase Orders Table
CREATE TABLE purchase_orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  po_number TEXT UNIQUE NOT NULL,
  request_id UUID REFERENCES purchase_requests(id),
  supplier_id UUID NOT NULL REFERENCES suppliers(id),
  order_date DATE NOT NULL,
  expected_date DATE NOT NULL,
  status TEXT CHECK (status IN ('draft', 'sent', 'confirmed', 'partially_received', 'received', 'cancelled')) NOT NULL DEFAULT 'draft',
  total_amount DECIMAL(10,2) NOT NULL DEFAULT 0,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID NOT NULL
);

-- Goods Receipts Table
CREATE TABLE goods_receipts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  gr_number TEXT UNIQUE NOT NULL,
  po_id UUID NOT NULL REFERENCES purchase_orders(id),
  received_by UUID NOT NULL,
  verified_by UUID,
  notes TEXT,
  status TEXT CHECK (status IN ('draft', 'received', 'verified', 'discrepancy')) NOT NULL DEFAULT 'draft',
  received_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  verified_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Storage Locations Table
CREATE TABLE storage_locations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  code TEXT UNIQUE NOT NULL,
  temperature DECIMAL(5,2),
  humidity DECIMAL(5,2),
  capacity INTEGER NOT NULL,
  location_type TEXT CHECK (location_type IN ('warehouse', 'cold_storage', 'dry_storage', 'freezer')) NOT NULL,
  notes TEXT,
  current_usage INTEGER NOT NULL DEFAULT 0,
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Processing Records Table
CREATE TABLE processing_records (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  batch_number TEXT UNIQUE NOT NULL,
  product_id UUID NOT NULL REFERENCES products(id),
  input_quantity INTEGER NOT NULL,
  output_quantity INTEGER,
  process_type TEXT CHECK (process_type IN ('preparation', 'cooking', 'packaging', 'quality_control')) NOT NULL,
  processed_by UUID NOT NULL,
  notes TEXT,
  status TEXT CHECK (status IN ('planned', 'in_progress', 'completed', 'cancelled')) NOT NULL DEFAULT 'planned',
  started_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Transportation Orders Table
CREATE TABLE transportation_orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  transport_number TEXT UNIQUE NOT NULL,
  from_location TEXT NOT NULL,
  to_location TEXT NOT NULL,
  driver_id UUID,
  vehicle_id UUID,
  expected_departure TIMESTAMP WITH TIME ZONE NOT NULL,
  expected_arrival TIMESTAMP WITH TIME ZONE NOT NULL,
  actual_departure TIMESTAMP WITH TIME ZONE,
  actual_arrival TIMESTAMP WITH TIME ZONE,
  status TEXT CHECK (status IN ('scheduled', 'in_transit', 'delivered', 'cancelled')) NOT NULL DEFAULT 'scheduled',
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID NOT NULL
);

-- Users Table (for authentication)
CREATE TABLE users (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT NOT NULL,
  name TEXT NOT NULL,
  role TEXT CHECK (role IN ('admin', 'manager', 'purchaser', 'warehouse')) NOT NULL DEFAULT 'purchaser',
  department TEXT,
  avatar TEXT,
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE suppliers ENABLE ROW LEVEL SECURITY;
ALTER TABLE purchase_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE purchase_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE goods_receipts ENABLE ROW LEVEL SECURITY;
ALTER TABLE storage_locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE processing_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE transportation_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Create RLS Policies (basic - allow all for now)
CREATE POLICY "Allow all operations for authenticated users" ON products FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Allow all operations for authenticated users" ON suppliers FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Allow all operations for authenticated users" ON purchase_requests FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Allow all operations for authenticated users" ON purchase_orders FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Allow all operations for authenticated users" ON goods_receipts FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Allow all operations for authenticated users" ON storage_locations FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Allow all operations for authenticated users" ON processing_records FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Allow all operations for authenticated users" ON transportation_orders FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Allow all operations for authenticated users" ON users FOR ALL USING (auth.role() = 'authenticated');
```

### 5. Development
```bash
npm run dev
```

เปิดเบราว์เซอร์ไปที่ `http://localhost:5173`

### 6. Build
```bash
npm run build
```

## 🚀 Deployment (Vercel)

### 1. Push to GitHub
```bash
git add .
git commit -m "Initial commit"
git push origin main
```

### 2. Deploy to Vercel
1. ไปที่ [vercel.com](https://vercel.com)
2. Import project จาก GitHub
3. ตั้งค่า Environment Variables:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   - `VITE_ODOO_URL`
   - `VITE_ODOO_DATABASE`
   - `VITE_ODOO_USERNAME`
   - `VITE_ODOO_PASSWORD`
   - `VITE_ODOO_API_KEY`
   - `VITE_API_BASE_URL`

### 3. Deploy
Vercel จะ deploy อัตโนมัติเมื่อ push code ใหม่

## 🔐 Authentication

### Demo Credentials
- **Email**: `admin@tenzai.com`
- **Password**: `admin123`

### User Roles
- **Admin**: เข้าถึงทุกฟีเจอร์
- **Manager**: จัดการและอนุมัติ
- **Purchaser**: จัดการการจัดซื้อ
- **Warehouse**: จัดการคลังสินค้า

## 📁 Project Structure

```
src/
├── components/          # Reusable components
├── contexts/           # React contexts
├── hooks/              # Custom hooks
├── lib/                # External libraries config
├── pages/              # Page components
├── services/           # API services
├── types/              # TypeScript types
└── utils/              # Utility functions
```

## 🧪 Testing

```bash
# Run linter
npm run lint

# Build for production
npm run build

# Preview production build
npm run preview
```

## 📊 Features Overview

### Dashboard
- สรุปข้อมูลการจัดซื้อ
- กราฟและสถิติ
- การแจ้งเตือน

### Products
- จัดการสินค้าและวัตถุดิบ
- ตั้งค่าสต๊อก
- ราคาและต้นทุน

### Suppliers
- จัดการซัพพลายเออร์
- ระบบจัดอันดับ
- ข้อมูลติดต่อ

### Purchase Management
- คำขอจัดซื้อ
- ใบสั่งซื้อ
- ใบรับสินค้า

### Inventory
- จัดการคลังสินค้า
- ตำแหน่งจัดเก็บ
- การเคลื่อนไหวสินค้า

### Processing
- บันทึกการแปรรูป
- ควบคุมคุณภาพ
- การผลิต

### Transportation
- จัดการการขนส่ง
- ติดตามสถานะ
- กำหนดเส้นทาง

## 🤝 Contributing

1. Fork the project
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

หากมีปัญหาหรือคำถาม:
- สร้าง Issue ใน GitHub
- ติดต่อทีมพัฒนา
- ดู Documentation เพิ่มเติม

## 🔄 Updates

- **v1.0.0** - Initial release
- Multi-language support
- Complete CRUD operations
- Real-time updates
- Responsive design

---

**🍣 TENZAI Purchasing System** - ระบบจัดการการจัดซื้อที่ครบครันสำหรับร้านอาหารญี่ปุ่น #   F o r c e   r e d e p l o y   -   0 6 / 2 3 / 2 0 2 5   1 7 : 4 6 : 0 0  
 