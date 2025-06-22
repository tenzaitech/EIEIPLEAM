const fs = require('fs');
const path = require('path');
const SupabaseService = require('./src/services/supabase.service');

/**
 * 🗄️ Database Setup Script สำหรับ TENZAI Ocha System
 * สร้างตารางทั้งหมดใน Supabase ตาม schema ที่กำหนด
 */

class DatabaseSetup {
  constructor() {
    this.supabase = new SupabaseService();
  }

  async setupDatabase() {
    console.log('🚀 เริ่มต้นการ Setup Database...');
    
    try {
      // อ่าน SQL schema
      const schemaPath = path.join(__dirname, 'ocha-database-schema.sql');
      const schemaSQL = fs.readFileSync(schemaPath, 'utf8');
      
      console.log('📋 อ่าน Schema SQL สำเร็จ');
      
      // แยก SQL statements
      const statements = schemaSQL
        .split(';')
        .map(stmt => stmt.trim())
        .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));
      
      console.log(`📊 พบ SQL statements: ${statements.length} รายการ`);
      
      // Execute แต่ละ statement
      for (let i = 0; i < statements.length; i++) {
        const statement = statements[i];
        if (statement.trim()) {
          console.log(`⚡ Executing statement ${i + 1}/${statements.length}...`);
          
          try {
            const { data, error } = await this.supabase.client.rpc('exec_sql', {
              sql_query: statement
            });
            
            if (error) {
              console.log(`⚠️  Warning on statement ${i + 1}:`, error.message);
            } else {
              console.log(`✅ Statement ${i + 1} executed successfully`);
            }
          } catch (err) {
            console.log(`❌ Error on statement ${i + 1}:`, err.message);
          }
        }
      }
      
      console.log('🎉 Database setup completed!');
      
      // ทดสอบการเชื่อมต่อ
      await this.testTables();
      
    } catch (error) {
      console.error('❌ Database setup failed:', error.message);
      throw error;
    }
  }

  async testTables() {
    console.log('\n🧪 ทดสอบการเชื่อมต่อตาราง...');
    
    const testTables = [
      'users',
      'products', 
      'suppliers',
      'purchase_requests',
      'purchase_orders',
      'purchase_order_items',
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

  async createSampleData() {
    console.log('\n📝 สร้างข้อมูลตัวอย่าง...');
    
    try {
      // สร้าง Categories
      const categories = [
        { name: 'เนื้อสัตว์', description: 'เนื้อสัตว์สดและแช่แข็ง' },
        { name: 'ผักผลไม้', description: 'ผักผลไม้สด' },
        { name: 'เครื่องปรุง', description: 'เครื่องปรุงรสและเครื่องเทศ' },
        { name: 'อาหารแห้ง', description: 'อาหารแห้งและบรรจุภัณฑ์' }
      ];
      
      for (const category of categories) {
        const { error } = await this.supabase.client
          .from('categories')
          .insert(category);
        
        if (error) {
          console.log(`⚠️  Category ${category.name}: ${error.message}`);
        } else {
          console.log(`✅ Category ${category.name} created`);
        }
      }
      
      // สร้าง Suppliers
      const suppliers = [
        {
          name: 'บริษัท เนื้อสด จำกัด',
          email: 'contact@meatsupplier.com',
          phone: '02-123-4567',
          address: '123 ถนนสุขุมวิท กรุงเทพฯ',
          city: 'กรุงเทพฯ',
          supplier_rank: 5
        },
        {
          name: 'ฟาร์มผักสด',
          email: 'info@freshveg.com',
          phone: '02-987-6543',
          address: '456 ถนนรัชดาภิเษก กรุงเทพฯ',
          city: 'กรุงเทพฯ',
          supplier_rank: 4
        }
      ];
      
      for (const supplier of suppliers) {
        const { error } = await this.supabase.client
          .from('suppliers')
          .insert(supplier);
        
        if (error) {
          console.log(`⚠️  Supplier ${supplier.name}: ${error.message}`);
        } else {
          console.log(`✅ Supplier ${supplier.name} created`);
        }
      }
      
      // สร้าง Storage Locations
      const locations = [
        {
          name: 'ตู้เย็นหลัก',
          temperature: 4.0,
          capacity: 1000,
          location_type: 'refrigerator',
          notes: 'ตู้เย็นสำหรับเก็บเนื้อสัตว์และผักสด'
        },
        {
          name: 'ตู้แช่แข็ง',
          temperature: -18.0,
          capacity: 500,
          location_type: 'freezer',
          notes: 'ตู้แช่แข็งสำหรับเก็บอาหารแช่แข็ง'
        },
        {
          name: 'คลังแห้ง',
          temperature: 25.0,
          capacity: 2000,
          location_type: 'dry_storage',
          notes: 'คลังเก็บอาหารแห้งและเครื่องปรุง'
        }
      ];
      
      for (const location of locations) {
        const { error } = await this.supabase.client
          .from('storage_locations')
          .insert(location);
        
        if (error) {
          console.log(`⚠️  Location ${location.name}: ${error.message}`);
        } else {
          console.log(`✅ Location ${location.name} created`);
        }
      }
      
      console.log('🎉 Sample data created successfully!');
      
    } catch (error) {
      console.error('❌ Sample data creation failed:', error.message);
    }
  }
}

// Main execution
async function main() {
  const setup = new DatabaseSetup();
  
  try {
    await setup.setupDatabase();
    await setup.createSampleData();
    console.log('\n🎊 Database setup completed successfully!');
  } catch (error) {
    console.error('\n💥 Database setup failed:', error.message);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = DatabaseSetup; 