const SupabaseService = require('./src/services/supabase.service');

/**
 * 🗄️ Create Tables Script สำหรับ TENZAI Ocha System
 * สร้างตารางทีละตัวใน Supabase
 */

class TableCreator {
  constructor() {
    this.supabase = new SupabaseService();
  }

  async createTables() {
    console.log('🚀 เริ่มต้นการสร้างตาราง...');
    
    const tables = [
      {
        name: 'purchase_requests',
        sql: `
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
        `
      },
      {
        name: 'storage_locations',
        sql: `
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
        `
      },
      {
        name: 'inventory_items',
        sql: `
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
        `
      },
      {
        name: 'goods_receipts',
        sql: `
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
        `
      },
      {
        name: 'processing_records',
        sql: `
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
        `
      },
      {
        name: 'transportation_orders',
        sql: `
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
        `
      },
      {
        name: 'branches',
        sql: `
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
        `
      },
      {
        name: 'notifications',
        sql: `
          CREATE TABLE IF NOT EXISTS notifications (
            id SERIAL PRIMARY KEY,
            user_id UUID,
            type VARCHAR(100) NOT NULL,
            reference_id INTEGER,
            message TEXT NOT NULL,
            read BOOLEAN DEFAULT false,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
          );
        `
      }
    ];

    for (const table of tables) {
      console.log(`📋 สร้างตาราง ${table.name}...`);
      
      try {
        // ใช้ raw SQL query ผ่าน Supabase
        const { data, error } = await this.supabase.client.rpc('exec_sql', {
          sql_query: table.sql
        });
        
        if (error) {
          console.log(`⚠️  Warning: ${error.message}`);
          // ลองสร้างผ่าน SQL Editor แทน
          console.log(`💡 ลองสร้างตาราง ${table.name} ผ่าน Supabase SQL Editor`);
        } else {
          console.log(`✅ ตาราง ${table.name} สร้างสำเร็จ`);
        }
      } catch (err) {
        console.log(`❌ Error creating ${table.name}: ${err.message}`);
      }
    }
    
    console.log('🎉 การสร้างตารางเสร็จสิ้น!');
  }

  async testTables() {
    console.log('\n🧪 ทดสอบการเชื่อมต่อตาราง...');
    
    const testTables = [
      'purchase_requests',
      'storage_locations',
      'inventory_items',
      'goods_receipts',
      'processing_records',
      'transportation_orders',
      'branches',
      'notifications'
    ];
    
    for (const tableName of testTables) {
      try {
        const { data, error } = await this.supabase.client
          .from(tableName)
          .select('*')
          .limit(1);
        
        if (error) {
          console.log(`❌ ${tableName}: ${error.message}`);
        } else {
          console.log(`✅ ${tableName}: Connected successfully`);
        }
      } catch (err) {
        console.log(`❌ ${tableName}: ${err.message}`);
      }
    }
  }
}

// Main execution
async function main() {
  const creator = new TableCreator();
  
  try {
    await creator.createTables();
    await creator.testTables();
    console.log('\n🎊 Table creation completed!');
  } catch (error) {
    console.error('\n💥 Table creation failed:', error.message);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = TableCreator; 