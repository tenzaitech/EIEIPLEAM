-- 🗄️ Create Missing Tables for TENZAI Ocha System
-- รันใน Supabase SQL Editor

-- 1. Purchase Requests
CREATE TABLE IF NOT EXISTS purchase_requests (
  id SERIAL PRIMARY KEY,
  requester_id UUID,
  items JSONB NOT NULL,
  priority VARCHAR(20) DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
  expected_date DATE NOT NULL,
  notes TEXT,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'cancelled')),
  approved_by UUID,
  approved_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Storage Locations
CREATE TABLE IF NOT EXISTS storage_locations (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  temperature DECIMAL(5,2),
  capacity DECIMAL(10,2),
  location_type VARCHAR(50) DEFAULT 'refrigerator' CHECK (location_type IN ('refrigerator', 'freezer', 'dry_storage', 'counter')),
  current_usage DECIMAL(10,2) DEFAULT 0,
  notes TEXT,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Inventory Items
CREATE TABLE IF NOT EXISTS inventory_items (
  id SERIAL PRIMARY KEY,
  product_id INTEGER REFERENCES products(id),
  location_id INTEGER REFERENCES storage_locations(id),
  quantity DECIMAL(10,2) NOT NULL DEFAULT 0,
  unit_price DECIMAL(10,2) DEFAULT 0,
  expiry_date DATE,
  batch_number VARCHAR(100),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Goods Receipts
CREATE TABLE IF NOT EXISTS goods_receipts (
  id SERIAL PRIMARY KEY,
  po_id INTEGER REFERENCES purchase_orders(id),
  received_by UUID,
  verified_by UUID,
  items JSONB NOT NULL,
  notes TEXT,
  status VARCHAR(20) DEFAULT 'pending_verification' CHECK (status IN ('pending_verification', 'verified', 'rejected')),
  received_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  verified_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Processing Records
CREATE TABLE IF NOT EXISTS processing_records (
  id SERIAL PRIMARY KEY,
  product_id INTEGER REFERENCES products(id),
  quantity DECIMAL(10,2) NOT NULL,
  process_type VARCHAR(100) NOT NULL,
  output_quantity DECIMAL(10,2) NOT NULL,
  output_product_id INTEGER REFERENCES products(id),
  output_location_id INTEGER REFERENCES storage_locations(id),
  processed_by UUID,
  notes TEXT,
  processed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. Transportation Orders
CREATE TABLE IF NOT EXISTS transportation_orders (
  id SERIAL PRIMARY KEY,
  from_location INTEGER REFERENCES storage_locations(id),
  to_location INTEGER REFERENCES storage_locations(id),
  items JSONB NOT NULL,
  driver_id UUID,
  vehicle_id VARCHAR(100),
  expected_departure TIMESTAMP WITH TIME ZONE,
  expected_arrival TIMESTAMP WITH TIME ZONE,
  actual_departure TIMESTAMP WITH TIME ZONE,
  actual_arrival TIMESTAMP WITH TIME ZONE,
  status VARCHAR(20) DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'in_transit', 'delivered', 'cancelled')),
  notes TEXT,
  created_by UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. Branches
CREATE TABLE IF NOT EXISTS branches (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  address TEXT,
  city VARCHAR(100),
  phone VARCHAR(50),
  email VARCHAR(255),
  manager_id UUID,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 8. Notifications
CREATE TABLE IF NOT EXISTS notifications (
  id SERIAL PRIMARY KEY,
  user_id UUID,
  type VARCHAR(100) NOT NULL,
  reference_id INTEGER,
  message TEXT NOT NULL,
  read BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- สร้าง Indexes
CREATE INDEX IF NOT EXISTS idx_purchase_requests_status ON purchase_requests(status);
CREATE INDEX IF NOT EXISTS idx_purchase_requests_requester ON purchase_requests(requester_id);
CREATE INDEX IF NOT EXISTS idx_inventory_items_product ON inventory_items(product_id);
CREATE INDEX IF NOT EXISTS idx_inventory_items_location ON inventory_items(location_id);
CREATE INDEX IF NOT EXISTS idx_goods_receipts_po ON goods_receipts(po_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON notifications(read);

-- สร้าง Trigger function สำหรับ updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- สร้าง Triggers
CREATE TRIGGER update_purchase_requests_updated_at BEFORE UPDATE ON purchase_requests FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_storage_locations_updated_at BEFORE UPDATE ON storage_locations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_inventory_items_updated_at BEFORE UPDATE ON inventory_items FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_transportation_orders_updated_at BEFORE UPDATE ON transportation_orders FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_branches_updated_at BEFORE UPDATE ON branches FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- เพิ่มข้อมูลตัวอย่าง Storage Locations
INSERT INTO storage_locations (name, temperature, capacity, location_type, notes) VALUES
('ตู้เย็นหลัก', 4.0, 1000, 'refrigerator', 'ตู้เย็นสำหรับเก็บเนื้อสัตว์และผักสด'),
('ตู้แช่แข็ง', -18.0, 500, 'freezer', 'ตู้แช่แข็งสำหรับเก็บอาหารแช่แข็ง'),
('คลังแห้ง', 25.0, 2000, 'dry_storage', 'คลังเก็บอาหารแห้งและเครื่องปรุง')
ON CONFLICT DO NOTHING;

-- เพิ่มข้อมูลตัวอย่าง Branches
INSERT INTO branches (name, address, city, phone, email) VALUES
('สาขาหลัก', '123 ถนนสุขุมวิท กรุงเทพฯ', 'กรุงเทพฯ', '02-123-4567', 'main@tenzai.com'),
('สาขารัชดา', '456 ถนนรัชดาภิเษก กรุงเทพฯ', 'กรุงเทพฯ', '02-987-6543', 'ratchada@tenzai.com')
ON CONFLICT DO NOTHING; 