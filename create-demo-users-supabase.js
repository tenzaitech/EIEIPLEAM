const { createClient } = require('@supabase/supabase-js');
const SUPABASE_CONFIG = require('./supabase.config');

/**
 * 🎯 TENZAI - Demo Users Creator for Supabase
 * สร้าง user demo สำหรับทุกตำแหน่งในแอปพลิเคชัน
 */

class DemoUsersCreator {
  constructor() {
    this.client = null;
    this.isConnected = false;
    this.init();
  }

  // 🔧 Initialize Supabase Client
  init() {
    try {
      this.client = createClient(
        SUPABASE_CONFIG.url,
        SUPABASE_CONFIG.serviceKey,
        {
          auth: {
            autoRefreshToken: true,
            persistSession: false
          },
          db: {
            schema: 'public'
          }
        }
      );
      this.isConnected = true;
      console.log('✅ Supabase client initialized');
    } catch (error) {
      console.error('❌ Failed to initialize Supabase client:', error.message);
      this.isConnected = false;
    }
  }

  // 🔍 Test Connection
  async testConnection() {
    if (!this.isConnected) {
      return { success: false, error: 'Supabase client not initialized' };
    }

    try {
      const { data, error } = await this.client
        .from('users')
        .select('*')
        .limit(1);

      if (error) {
        console.log('⚠️ Users table might not exist, will create it');
        return { success: true, message: 'Connection successful, will create tables if needed' };
      }

      return { success: true, message: 'Connection successful' };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // 🏗️ Create Database Tables
  async createTables() {
    try {
      console.log('🏗️ Creating database tables...');

      // Create users table
      const { error: usersError } = await this.client.rpc('exec_sql', {
        sql: `
          CREATE TABLE IF NOT EXISTS users (
            id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
            email VARCHAR(255) UNIQUE NOT NULL,
            password_hash VARCHAR(255) NOT NULL,
            full_name VARCHAR(255) NOT NULL,
            role VARCHAR(50) NOT NULL,
            department VARCHAR(100),
            position VARCHAR(100),
            phone VARCHAR(20),
            avatar_url TEXT,
            is_active BOOLEAN DEFAULT true,
            last_login TIMESTAMP WITH TIME ZONE,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
          );
        `
      });

      if (usersError) {
        console.log('⚠️ Users table might already exist');
      } else {
        console.log('✅ Users table created');
      }

      // Create user_sessions table
      const { error: sessionsError } = await this.client.rpc('exec_sql', {
        sql: `
          CREATE TABLE IF NOT EXISTS user_sessions (
            id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
            user_id UUID REFERENCES users(id) ON DELETE CASCADE,
            session_token VARCHAR(255) UNIQUE NOT NULL,
            expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
          );
        `
      });

      if (sessionsError) {
        console.log('⚠️ User sessions table might already exist');
      } else {
        console.log('✅ User sessions table created');
      }

      // Create user_permissions table
      const { error: permissionsError } = await this.client.rpc('exec_sql', {
        sql: `
          CREATE TABLE IF NOT EXISTS user_permissions (
            id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
            user_id UUID REFERENCES users(id) ON DELETE CASCADE,
            permission_name VARCHAR(100) NOT NULL,
            granted BOOLEAN DEFAULT true,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            UNIQUE(user_id, permission_name)
          );
        `
      });

      if (permissionsError) {
        console.log('⚠️ User permissions table might already exist');
      } else {
        console.log('✅ User permissions table created');
      }

      return { success: true, message: 'Tables created successfully' };
    } catch (error) {
      console.error('❌ Error creating tables:', error.message);
      return { success: false, error: error.message };
    }
  }

  // 🔐 Hash Password (Simple implementation)
  hashPassword(password) {
    // ใน production ควรใช้ bcrypt หรือ argon2
    return Buffer.from(password).toString('base64');
  }

  // 👥 Create Demo Users
  async createDemoUsers() {
    try {
      console.log('👥 Creating demo users for all positions...');

      const demoUsers = [
        // 🏢 Management Level
        {
          email: 'admin@tenzai.com',
          password: 'admin123',
          full_name: 'Tenzai Admin',
          role: 'admin',
          department: 'Management',
          position: 'System Administrator',
          phone: '+66-2-123-4567',
          permissions: ['all']
        },
        {
          email: 'ceo@tenzai.com',
          password: 'ceo123',
          full_name: 'CEO Tenzai',
          role: 'ceo',
          department: 'Executive',
          position: 'Chief Executive Officer',
          phone: '+66-2-123-4568',
          permissions: ['all', 'financial_reports', 'strategic_planning']
        },
        {
          email: 'manager@tenzai.com',
          password: 'manager123',
          full_name: 'Tenzai Manager',
          role: 'manager',
          department: 'Operations',
          position: 'Operations Manager',
          phone: '+66-2-123-4569',
          permissions: ['purchase_approval', 'inventory_management', 'reports']
        },

        // 📦 Purchasing Department
        {
          email: 'purchaser@tenzai.com',
          password: 'purchaser123',
          full_name: 'Tenzai Purchaser',
          role: 'purchaser',
          department: 'Purchasing',
          position: 'Senior Purchaser',
          phone: '+66-2-123-4570',
          permissions: ['create_purchase_orders', 'manage_suppliers', 'view_inventory']
        },
        {
          email: 'buyer@tenzai.com',
          password: 'buyer123',
          full_name: 'Tenzai Buyer',
          role: 'buyer',
          department: 'Purchasing',
          position: 'Buyer',
          phone: '+66-2-123-4571',
          permissions: ['create_purchase_orders', 'view_suppliers', 'view_inventory']
        },
        {
          email: 'procurement@tenzai.com',
          password: 'procurement123',
          full_name: 'Tenzai Procurement',
          role: 'procurement',
          department: 'Purchasing',
          position: 'Procurement Specialist',
          phone: '+66-2-123-4572',
          permissions: ['procurement_planning', 'supplier_evaluation', 'cost_analysis']
        },

        // 🏪 Warehouse & Inventory
        {
          email: 'warehouse@tenzai.com',
          password: 'warehouse123',
          full_name: 'Tenzai Warehouse',
          role: 'warehouse',
          department: 'Warehouse',
          position: 'Warehouse Manager',
          phone: '+66-2-123-4573',
          permissions: ['inventory_management', 'goods_receipt', 'storage_management']
        },
        {
          email: 'inventory@tenzai.com',
          password: 'inventory123',
          full_name: 'Tenzai Inventory',
          role: 'inventory',
          department: 'Warehouse',
          position: 'Inventory Controller',
          phone: '+66-2-123-4574',
          permissions: ['inventory_tracking', 'stock_counting', 'inventory_reports']
        },
        {
          email: 'forklift@tenzai.com',
          password: 'forklift123',
          full_name: 'Tenzai Forklift',
          role: 'forklift',
          department: 'Warehouse',
          position: 'Forklift Operator',
          phone: '+66-2-123-4575',
          permissions: ['goods_movement', 'storage_operations']
        },

        // 🍳 Kitchen & Processing
        {
          email: 'chef@tenzai.com',
          password: 'chef123',
          full_name: 'Tenzai Chef',
          role: 'chef',
          department: 'Kitchen',
          position: 'Head Chef',
          phone: '+66-2-123-4576',
          permissions: ['food_processing', 'recipe_management', 'quality_control']
        },
        {
          email: 'cook@tenzai.com',
          password: 'cook123',
          full_name: 'Tenzai Cook',
          role: 'cook',
          department: 'Kitchen',
          position: 'Cook',
          phone: '+66-2-123-4577',
          permissions: ['food_preparation', 'recipe_following']
        },
        {
          email: 'prep@tenzai.com',
          password: 'prep123',
          full_name: 'Tenzai Prep',
          role: 'prep',
          department: 'Kitchen',
          position: 'Prep Cook',
          phone: '+66-2-123-4578',
          permissions: ['food_preparation', 'ingredient_prep']
        },

        // 🚚 Transportation & Delivery
        {
          email: 'driver@tenzai.com',
          password: 'driver123',
          full_name: 'Tenzai Driver',
          role: 'driver',
          department: 'Transportation',
          position: 'Delivery Driver',
          phone: '+66-2-123-4579',
          permissions: ['delivery_management', 'route_planning', 'delivery_reports']
        },
        {
          email: 'logistics@tenzai.com',
          password: 'logistics123',
          full_name: 'Tenzai Logistics',
          role: 'logistics',
          department: 'Transportation',
          position: 'Logistics Coordinator',
          phone: '+66-2-123-4580',
          permissions: ['logistics_planning', 'route_optimization', 'transport_reports']
        },

        // 💰 Finance & Accounting
        {
          email: 'accountant@tenzai.com',
          password: 'accountant123',
          full_name: 'Tenzai Accountant',
          role: 'accountant',
          department: 'Finance',
          position: 'Accountant',
          phone: '+66-2-123-4581',
          permissions: ['financial_records', 'invoice_processing', 'financial_reports']
        },
        {
          email: 'finance@tenzai.com',
          password: 'finance123',
          full_name: 'Tenzai Finance',
          role: 'finance',
          department: 'Finance',
          position: 'Finance Manager',
          phone: '+66-2-123-4582',
          permissions: ['budget_management', 'financial_analysis', 'approval_workflows']
        },

        // 📊 Quality Control
        {
          email: 'quality@tenzai.com',
          password: 'quality123',
          full_name: 'Tenzai Quality',
          role: 'quality',
          department: 'Quality Control',
          position: 'Quality Control Manager',
          phone: '+66-2-123-4583',
          permissions: ['quality_inspection', 'quality_reports', 'quality_standards']
        },
        {
          email: 'inspector@tenzai.com',
          password: 'inspector123',
          full_name: 'Tenzai Inspector',
          role: 'inspector',
          department: 'Quality Control',
          position: 'Quality Inspector',
          phone: '+66-2-123-4584',
          permissions: ['quality_inspection', 'quality_records']
        },

        // 🛒 Sales & Customer Service
        {
          email: 'sales@tenzai.com',
          password: 'sales123',
          full_name: 'Tenzai Sales',
          role: 'sales',
          department: 'Sales',
          position: 'Sales Manager',
          phone: '+66-2-123-4585',
          permissions: ['sales_management', 'customer_relations', 'sales_reports']
        },
        {
          email: 'customer@tenzai.com',
          password: 'customer123',
          full_name: 'Tenzai Customer',
          role: 'customer_service',
          department: 'Customer Service',
          position: 'Customer Service Representative',
          phone: '+66-2-123-4586',
          permissions: ['customer_support', 'order_tracking', 'customer_feedback']
        },

        // 🔧 IT & Technical Support
        {
          email: 'it@tenzai.com',
          password: 'it123',
          full_name: 'Tenzai IT',
          role: 'it',
          department: 'Information Technology',
          position: 'IT Administrator',
          phone: '+66-2-123-4587',
          permissions: ['system_administration', 'technical_support', 'system_reports']
        },
        {
          email: 'support@tenzai.com',
          password: 'support123',
          full_name: 'Tenzai Support',
          role: 'support',
          department: 'Information Technology',
          position: 'Technical Support',
          phone: '+66-2-123-4588',
          permissions: ['technical_support', 'user_management', 'system_monitoring']
        },

        // 📋 HR & Administration
        {
          email: 'hr@tenzai.com',
          password: 'hr123',
          full_name: 'Tenzai HR',
          role: 'hr',
          department: 'Human Resources',
          position: 'HR Manager',
          phone: '+66-2-123-4589',
          permissions: ['employee_management', 'hr_reports', 'policy_management']
        },
        {
          email: 'reception@tenzai.com',
          password: 'reception123',
          full_name: 'Tenzai Reception',
          role: 'reception',
          department: 'Administration',
          position: 'Receptionist',
          phone: '+66-2-123-4590',
          permissions: ['visitor_management', 'general_administration']
        }
      ];

      const createdUsers = [];
      const failedUsers = [];

      for (const userData of demoUsers) {
        try {
          console.log(`👤 Creating user: ${userData.full_name} (${userData.email})`);

          // Create user
          const { data: user, error: userError } = await this.client
            .from('users')
            .insert({
              email: userData.email,
              password_hash: this.hashPassword(userData.password),
              full_name: userData.full_name,
              role: userData.role,
              department: userData.department,
              position: userData.position,
              phone: userData.phone,
              is_active: true
            })
            .select()
            .single();

          if (userError) {
            console.log(`⚠️ User ${userData.email} might already exist: ${userError.message}`);
            failedUsers.push({ ...userData, error: userError.message });
            continue;
          }

          // Create permissions
          if (userData.permissions && userData.permissions.length > 0) {
            const permissions = userData.permissions.map(permission => ({
              user_id: user.id,
              permission_name: permission,
              granted: true
            }));

            const { error: permError } = await this.client
              .from('user_permissions')
              .insert(permissions);

            if (permError) {
              console.log(`⚠️ Failed to create permissions for ${userData.email}: ${permError.message}`);
            }
          }

          createdUsers.push({
            id: user.id,
            email: user.email,
            full_name: user.full_name,
            role: user.role,
            department: user.department,
            position: user.position,
            password: userData.password
          });

          console.log(`✅ Created user: ${userData.full_name} (ID: ${user.id})`);

        } catch (error) {
          console.error(`❌ Failed to create user ${userData.email}:`, error.message);
          failedUsers.push({ ...userData, error: error.message });
        }
      }

      // Print Summary
      console.log('\n📊 Demo Users Creation Summary');
      console.log('='.repeat(60));
      console.log(`✅ Successfully created: ${createdUsers.length} users`);
      console.log(`❌ Failed to create: ${failedUsers.length} users`);

      if (createdUsers.length > 0) {
        console.log('\n👥 Created Users:');
        console.log('='.repeat(60));
        createdUsers.forEach(user => {
          console.log(`👤 ${user.full_name}`);
          console.log(`   📧 Email: ${user.email}`);
          console.log(`   🔑 Password: ${user.password}`);
          console.log(`   🏷️ Role: ${user.role}`);
          console.log(`   🏢 Department: ${user.department}`);
          console.log(`   📋 Position: ${user.position}`);
          console.log('');
        });
      }

      if (failedUsers.length > 0) {
        console.log('\n❌ Failed Users:');
        console.log('='.repeat(60));
        failedUsers.forEach(user => {
          console.log(`❌ ${user.full_name} (${user.email}): ${user.error}`);
        });
      }

      return {
        success: true,
        created: createdUsers,
        failed: failedUsers,
        total: demoUsers.length
      };

    } catch (error) {
      console.error('❌ Error creating demo users:', error.message);
      return { success: false, error: error.message };
    }
  }

  // 🔍 Get All Users
  async getAllUsers() {
    try {
      const { data: users, error } = await this.client
        .from('users')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      console.log(`📊 Found ${users.length} users in database`);
      return { success: true, data: users };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // 🔐 Get User Permissions
  async getUserPermissions(userId) {
    try {
      const { data: permissions, error } = await this.client
        .from('user_permissions')
        .select('*')
        .eq('user_id', userId);

      if (error) throw error;

      return { success: true, data: permissions };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // 🗑️ Clean Up Demo Users
  async cleanupDemoUsers() {
    try {
      console.log('🗑️ Cleaning up demo users...');

      const { data: users, error: usersError } = await this.client
        .from('users')
        .select('id')
        .like('email', '%@tenzai.com');

      if (usersError) throw usersError;

      if (users.length === 0) {
        console.log('✅ No demo users to clean up');
        return { success: true, deleted: 0 };
      }

      const userIds = users.map(user => user.id);

      // Delete permissions first
      const { error: permError } = await this.client
        .from('user_permissions')
        .delete()
        .in('user_id', userIds);

      if (permError) {
        console.log(`⚠️ Error deleting permissions: ${permError.message}`);
      }

      // Delete sessions
      const { error: sessionError } = await this.client
        .from('user_sessions')
        .delete()
        .in('user_id', userIds);

      if (sessionError) {
        console.log(`⚠️ Error deleting sessions: ${sessionError.message}`);
      }

      // Delete users
      const { error: deleteError } = await this.client
        .from('users')
        .delete()
        .in('id', userIds);

      if (deleteError) throw deleteError;

      console.log(`✅ Cleaned up ${users.length} demo users`);
      return { success: true, deleted: users.length };

    } catch (error) {
      console.error('❌ Error cleaning up demo users:', error.message);
      return { success: false, error: error.message };
    }
  }

  // 📊 Generate User Report
  async generateUserReport() {
    try {
      console.log('📊 Generating user report...');

      const { data: users, error: usersError } = await this.client
        .from('users')
        .select('*')
        .order('department', { ascending: true });

      if (usersError) throw usersError;

      // Group by department
      const departmentGroups = {};
      users.forEach(user => {
        if (!departmentGroups[user.department]) {
          departmentGroups[user.department] = [];
        }
        departmentGroups[user.department].push(user);
      });

      console.log('\n📋 User Report by Department');
      console.log('='.repeat(60));

      Object.entries(departmentGroups).forEach(([department, deptUsers]) => {
        console.log(`\n🏢 ${department} (${deptUsers.length} users):`);
        deptUsers.forEach(user => {
          console.log(`   👤 ${user.full_name} - ${user.position} (${user.role})`);
        });
      });

      // Role statistics
      const roleStats = {};
      users.forEach(user => {
        roleStats[user.role] = (roleStats[user.role] || 0) + 1;
      });

      console.log('\n📊 Role Statistics:');
      console.log('='.repeat(60));
      Object.entries(roleStats).forEach(([role, count]) => {
        console.log(`   ${role}: ${count} users`);
      });

      return { success: true, data: { users, departmentGroups, roleStats } };

    } catch (error) {
      console.error('❌ Error generating user report:', error.message);
      return { success: false, error: error.message };
    }
  }
}

// CLI Interface
async function main() {
  const creator = new DemoUsersCreator();

  const args = process.argv.slice(2);
  const command = args[0] || 'create';

  console.log('🎯 TENZAI Demo Users Creator');
  console.log('='.repeat(60));

  try {
    // Test connection first
    const connectionTest = await creator.testConnection();
    if (!connectionTest.success) {
      console.error('❌ Connection failed:', connectionTest.error);
      process.exit(1);
    }

    console.log('✅ Connection successful');

    switch (command) {
      case 'create':
        // Create tables first
        await creator.createTables();
        // Create demo users
        await creator.createDemoUsers();
        break;

      case 'list':
        await creator.getAllUsers();
        break;

      case 'report':
        await creator.generateUserReport();
        break;

      case 'cleanup':
        await creator.cleanupDemoUsers();
        break;

      case 'test':
        console.log('✅ Connection test passed');
        break;

      default:
        console.log('❌ Unknown command:', command);
        console.log('📋 Available commands: create, list, report, cleanup, test');
        break;
    }

    console.log('\n🎉 Command completed successfully!');
    process.exit(0);

  } catch (error) {
    console.error('❌ Command failed:', error.message);
    process.exit(1);
  }
}

// Export for use in other modules
module.exports = DemoUsersCreator;

// Run if called directly
if (require.main === module) {
  main();
} 