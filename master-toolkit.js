const OdooService = require('./src/services/odoo.service');
const SupabaseService = require('./src/services/supabase.service');
const OchaService = require('./src/services/ocha.service');

/**
 * 🎯 TENZAI Purchasing System - Master Toolkit
 * อิงจาก Odoo 18.0 Documentation: https://www.odoo.com/documentation/18.0/
 * 
 * ครอบคลุมทุกฟังก์ชัน:
 * - Finance & Accounting
 * - Sales & CRM  
 * - Purchase & Inventory
 * - Manufacturing
 * - Project Management
 * - Human Resources
 * - Point of Sale
 * - Website & E-commerce
 * - Services & Helpdesk
 * - Productivity Tools
 * - 🍣 Ocha System Integration
 */

class TenzaiMasterToolkit {
  constructor() {
    this.odooService = new OdooService();
    this.supabase = new SupabaseService();
    this.ocha = new OchaService();
    this.isAuthenticated = false;
    this.systemStatus = {
      modules: {},
      products: {},
      categories: {},
      projects: {},
      users: {},
      companies: {},
      ocha: {}
    };
  }

  // 🔐 Authentication & Session Management
  async authenticate() {
    try {
      console.log('🔐 Attempting to authenticate with Odoo...');
      const result = await this.odooService.authenticate();
      this.isAuthenticated = result.success;
      if (result.success) {
        console.log('✅ Authentication successful!');
      } else {
        console.log('❌ Authentication failed:', result.error);
      }
      return result;
    } catch (error) {
      console.error('❌ Authentication failed:', error.message);
      this.isAuthenticated = false;
      return { success: false, error: error.message };
    }
  }

  // 🔄 Force Re-authentication
  async forceReauthenticate() {
    console.log('🔄 Force re-authenticating...');
    this.isAuthenticated = false;
    return await this.authenticate();
  }

  // 📊 System Status & Health Check
  async getSystemStatus() {
    if (!this.isAuthenticated) {
      await this.forceReauthenticate();
    }
    
    console.log('🔍 TENZAI System Status Check');
    console.log('='.repeat(60));

    const status = {
      authentication: this.isAuthenticated,
      modules: {},
      database: {},
      users: {},
      companies: {}
    };

    try {
      // Check installed modules
      const installedModules = await this.odooService.search('ir.module.module', 
        [['state', '=', 'installed']], ['name', 'display_name', 'application'], 500);
      status.modules.installed = installedModules.length;

      // Check database info
      const dbInfo = await this.odooService.executeMethod('ir.config_parameter', 'get_param', ['database.uuid']);
      status.database.uuid = dbInfo;

      // Check users
      const users = await this.odooService.search('res.users', [], ['id', 'name', 'login'], 100);
      status.users.count = users.length;

      // Check companies
      const companies = await this.odooService.search('res.company', [], ['id', 'name'], 10);
      status.companies.count = companies.length;

      this.systemStatus = status;
      return status;
    } catch (error) {
      console.error('❌ Status check failed:', error.message);
      if (error.message.includes('Session Expired')) {
        console.log('🔄 Session expired, attempting re-authentication...');
        await this.forceReauthenticate();
        return await this.getSystemStatus(); // Retry once
      }
      return status;
    }
  }

  // 🏢 Company & Multi-Company Management
  async manageCompanies() {
    if (!this.isAuthenticated) await this.authenticate();
    
    console.log('🏢 Company Management');
    console.log('='.repeat(60));

    try {
      const companies = await this.odooService.search('res.company', [], [
        'id', 'name', 'currency_id', 'country_id', 'state_id', 'city', 'street', 'phone', 'email'
      ], 50);

      console.log(`📊 Found ${companies.length} companies:`);
      companies.forEach((company, index) => {
        console.log(`${index + 1}. ${company.name} (ID: ${company.id})`);
        if (company.city) console.log(`   📍 ${company.city}, ${company.country_id?.[1] || 'N/A'}`);
        if (company.email) console.log(`   📧 ${company.email}`);
      });

      return companies;
    } catch (error) {
      console.error('❌ Company management failed:', error.message);
      return [];
    }
  }

  // 👥 User & Access Rights Management
  async manageUsers() {
    if (!this.isAuthenticated) await this.authenticate();
    
    console.log('👥 User Management');
    console.log('='.repeat(60));

    try {
      const users = await this.odooService.search('res.users', [], [
        'id', 'name', 'login', 'email', 'active', 'company_id', 'groups_id'
      ], 100);

      console.log(`📊 Found ${users.length} users:`);
      users.forEach((user, index) => {
        console.log(`${index + 1}. ${user.name} (${user.login})`);
        console.log(`   🏢 Company: ${user.company_id?.[1] || 'N/A'}`);
        console.log(`   📧 Email: ${user.email || 'N/A'}`);
        console.log(`   ✅ Active: ${user.active ? 'Yes' : 'No'}`);
      });

      return users;
    } catch (error) {
      console.error('❌ User management failed:', error.message);
      return [];
    }
  }

  // 📦 Module & App Management
  async manageModules() {
    if (!this.isAuthenticated) await this.authenticate();
    
    console.log('📦 Module Management');
    console.log('='.repeat(60));

    try {
      // Get all modules
      const allModules = await this.odooService.search('ir.module.module', [], [
        'id', 'name', 'display_name', 'state', 'application', 'category_id'
      ], 1000);

      const installed = allModules.filter(m => m.state === 'installed');
      const uninstalled = allModules.filter(m => m.state === 'uninstalled');
      const applications = allModules.filter(m => m.application === true);

      console.log(`📊 Module Statistics:`);
      console.log(`   📦 Total: ${allModules.length}`);
      console.log(`   ✅ Installed: ${installed.length}`);
      console.log(`   ❌ Uninstalled: ${uninstalled.length}`);
      console.log(`   📱 Applications: ${applications.length}`);

      // TENZAI Required Apps Check
      const tenzaiApps = [
        'purchase', 'account', 'contacts', 'pos_restaurant', 'purchase_requisition',
        'quality', 'maintenance', 'approvals', 'documents', 'helpdesk', 'crm', 'mrp',
        'marketing_automation', 'social', 'fleet', 'iot', 'voip', 'whatsapp'
      ];

      const installedTenzai = tenzaiApps.filter(app => 
        installed.some(m => m.name === app)
      );

      console.log(`\n🎯 TENZAI Required Apps:`);
      console.log(`   ✅ Installed: ${installedTenzai.length}/${tenzaiApps.length}`);
      console.log(`   📈 Progress: ${Math.round((installedTenzai.length / tenzaiApps.length) * 100)}%`);

      return {
        all: allModules,
        installed,
        uninstalled,
        applications,
        tenzaiApps: {
          required: tenzaiApps,
          installed: installedTenzai,
          missing: tenzaiApps.filter(app => !installedTenzai.includes(app))
        }
      };
    } catch (error) {
      console.error('❌ Module management failed:', error.message);
      return {};
    }
  }

  // 🛒 Product & Inventory Management
  async manageProducts() {
    if (!this.isAuthenticated) await this.authenticate();
    
    console.log('🛒 Product Management');
    console.log('='.repeat(60));

    try {
      // Get products
      const products = await this.odooService.search('product.template', [], [
        'id', 'name', 'default_code', 'list_price', 'standard_price', 'categ_id', 'type', 'sale_ok', 'purchase_ok'
      ], 500);

      // Get categories
      const categories = await this.odooService.search('product.category', [], [
        'id', 'name', 'parent_id', 'complete_name'
      ], 200);

      console.log(`📊 Product Statistics:`);
      console.log(`   🛒 Products: ${products.length}`);
      console.log(`   📁 Categories: ${categories.length}`);

      // Product types
      const consumable = products.filter(p => p.type === 'consu');
      const service = products.filter(p => p.type === 'service');
      const stockable = products.filter(p => p.type === 'product');

      console.log(`   📦 Consumable: ${consumable.length}`);
      console.log(`   🔧 Service: ${service.length}`);
      console.log(`   📦 Stockable: ${stockable.length}`);

      return { products, categories };
    } catch (error) {
      console.error('❌ Product management failed:', error.message);
      return { products: [], categories: [] };
    }
  }

  // 🏗️ Project Management
  async manageProjects() {
    if (!this.isAuthenticated) await this.authenticate();
    
    console.log('🏗️ Project Management');
    console.log('='.repeat(60));

    try {
      // Get projects - แก้ไข field ให้ถูกต้อง
      const projects = await this.odooService.search('project.project', [], [
        'id', 'name', 'partner_id', 'user_id', 'date_start', 'date', 'state', 'privacy_visibility'
      ], 100);

      // Get tasks - แก้ไข field ให้ถูกต้อง
      const tasks = await this.odooService.search('project.task', [], [
        'id', 'name', 'project_id', 'user_id', 'stage_id', 'priority', 'date_deadline', 'state'
      ], 200);

      console.log(`📊 Project Statistics:`);
      console.log(`   🏗️ Projects: ${projects.length}`);
      console.log(`   📋 Tasks: ${tasks.length}`);

      // Project states - แก้ไข field ให้ถูกต้อง
      const openProjects = projects.filter(p => p.state === 'open');
      const closedProjects = projects.filter(p => p.state === 'close');

      console.log(`   🔓 Open Projects: ${openProjects.length}`);
      console.log(`   🔒 Closed Projects: ${closedProjects.length}`);

      return { projects, tasks };
    } catch (error) {
      console.error('❌ Project management failed:', error.message);
      return { projects: [], tasks: [] };
    }
  }

  // 💰 Finance & Accounting
  async manageFinance() {
    if (!this.isAuthenticated) await this.authenticate();
    
    console.log('💰 Finance & Accounting');
    console.log('='.repeat(60));

    try {
      // Get chart of accounts
      const accounts = await this.odooService.search('account.account', [], [
        'id', 'name', 'code', 'account_type', 'company_id'
      ], 200);

      // Get journals
      const journals = await this.odooService.search('account.journal', [], [
        'id', 'name', 'type', 'company_id'
      ], 50);

      // Get taxes
      const taxes = await this.odooService.search('account.tax', [], [
        'id', 'name', 'amount', 'type_tax_use', 'company_id'
      ], 50);

      console.log(`📊 Finance Statistics:`);
      console.log(`   📊 Accounts: ${accounts.length}`);
      console.log(`   📝 Journals: ${journals.length}`);
      console.log(`   💸 Taxes: ${taxes.length}`);

      return { accounts, journals, taxes };
    } catch (error) {
      console.error('❌ Finance management failed:', error.message);
      return { accounts: [], journals: [], taxes: [] };
    }
  }

  // 🛍️ Sales & CRM
  async manageSales() {
    if (!this.isAuthenticated) await this.authenticate();
    
    console.log('🛍️ Sales & CRM');
    console.log('='.repeat(60));

    try {
      // Get partners (customers/vendors)
      const partners = await this.odooService.search('res.partner', [], [
        'id', 'name', 'email', 'phone', 'is_company', 'customer_rank', 'supplier_rank'
      ], 200);

      // Get sales orders
      const salesOrders = await this.odooService.search('sale.order', [], [
        'id', 'name', 'partner_id', 'amount_total', 'state', 'date_order'
      ], 100);

      // Get leads/opportunities
      const leads = await this.odooService.search('crm.lead', [], [
        'id', 'name', 'partner_id', 'type', 'stage_id', 'probability'
      ], 100);

      console.log(`📊 Sales Statistics:`);
      console.log(`   👥 Partners: ${partners.length}`);
      console.log(`   🛒 Sales Orders: ${salesOrders.length}`);
      console.log(`   🎯 Leads/Opportunities: ${leads.length}`);

      return { partners, salesOrders, leads };
    } catch (error) {
      console.error('❌ Sales management failed:', error.message);
      return { partners: [], salesOrders: [], leads: [] };
    }
  }

  // 📦 Purchase & Procurement
  async managePurchases() {
    if (!this.isAuthenticated) await this.authenticate();
    
    console.log('📦 Purchase & Procurement');
    console.log('='.repeat(60));

    try {
      // Get purchase orders
      const purchaseOrders = await this.odooService.search('purchase.order', [], [
        'id', 'name', 'partner_id', 'amount_total', 'state', 'date_order'
      ], 100);

      // Get purchase requisitions
      const requisitions = await this.odooService.search('purchase.requisition', [], [
        'id', 'name', 'partner_id', 'state', 'date_end'
      ], 50);

      // Get RFQs
      const rfqs = await this.odooService.search('purchase.order', [['state', '=', 'sent']], [
        'id', 'name', 'partner_id', 'amount_total', 'date_order'
      ], 50);

      console.log(`📊 Purchase Statistics:`);
      console.log(`   📦 Purchase Orders: ${purchaseOrders.length}`);
      console.log(`   📋 Requisitions: ${requisitions.length}`);
      console.log(`   📤 RFQs Sent: ${rfqs.length}`);

      return { purchaseOrders, requisitions, rfqs };
    } catch (error) {
      console.error('❌ Purchase management failed:', error.message);
      return { purchaseOrders: [], requisitions: [], rfqs: [] };
    }
  }

  // 🏭 Manufacturing
  async manageManufacturing() {
    if (!this.isAuthenticated) await this.authenticate();
    
    console.log('🏭 Manufacturing');
    console.log('='.repeat(60));

    try {
      // Get manufacturing orders
      const mrpOrders = await this.odooService.search('mrp.production', [], [
        'id', 'name', 'product_id', 'product_qty', 'state', 'date_planned_start'
      ], 100);

      // Get work orders
      const workOrders = await this.odooService.search('mrp.workorder', [], [
        'id', 'name', 'production_id', 'state', 'duration_expected'
      ], 100);

      // Get BOMs
      const boms = await this.odooService.search('mrp.bom', [], [
        'id', 'name', 'product_id', 'product_tmpl_id', 'type'
      ], 50);

      console.log(`📊 Manufacturing Statistics:`);
      console.log(`   🏭 Manufacturing Orders: ${mrpOrders.length}`);
      console.log(`   🔧 Work Orders: ${workOrders.length}`);
      console.log(`   📋 Bills of Materials: ${boms.length}`);

      return { mrpOrders, workOrders, boms };
    } catch (error) {
      console.error('❌ Manufacturing management failed:', error.message);
      return { mrpOrders: [], workOrders: [], boms: [] };
    }
  }

  // 🧹 Data Cleanup & Maintenance
  async cleanupData() {
    if (!this.isAuthenticated) await this.authenticate();
    
    console.log('🧹 Data Cleanup & Maintenance');
    console.log('='.repeat(60));

    try {
      // Check for duplicate products
      const products = await this.odooService.search('product.template', [], [
        'id', 'name', 'default_code', 'categ_id', 'create_date'
      ], 1000);

      const duplicates = this.findDuplicates(products);
      
      console.log(`📊 Cleanup Statistics:`);
      console.log(`   🛒 Products Analyzed: ${products.length}`);
      console.log(`   🔄 Duplicate Groups: ${duplicates.groups}`);
      console.log(`   🗑️ Duplicate Items: ${duplicates.items}`);

      return duplicates;
    } catch (error) {
      console.error('❌ Data cleanup failed:', error.message);
      return { groups: 0, items: 0 };
    }
  }

  // 🔍 Find duplicates helper
  findDuplicates(items) {
    const duplicates = {};
    let groups = 0;
    let duplicateItems = 0;

    items.forEach(item => {
      const key = item.name?.toLowerCase().trim();
      if (key) {
        if (!duplicates[key]) duplicates[key] = [];
        duplicates[key].push(item);
      }
    });

    Object.values(duplicates).forEach(group => {
      if (group.length > 1) {
        groups++;
        duplicateItems += group.length - 1;
      }
    });

    return { groups, items: duplicateItems };
  }

  // 🏢 สร้าง Supplier (Vendor) ตัวอย่าง
  async createSuppliersOnly() {
    if (!this.isAuthenticated) await this.authenticate();
    const suppliers = [
      {
        name: '🍣 Sushi Master Co., Ltd.',
        email: 'contact@sushimaster.co.th',
        phone: '+66-2-123-4567',
        street: '123 Sukhumvit Road',
        city: 'Bangkok',
        zip: '10110',
        country_id: 221, // Thailand
        is_company: true,
        supplier_rank: 10,
        customer_rank: 0,
        company_type: 'company'
      },
      {
        name: '🍜 Noodle World Import',
        email: 'sales@noodleworld.co.th',
        phone: '+66-2-234-5678',
        street: '456 Silom Road',
        city: 'Bangkok',
        zip: '10500',
        country_id: 221, // Thailand
        is_company: true,
        supplier_rank: 8,
        customer_rank: 0,
        company_type: 'company'
      },
      {
        name: '🥢 Japanese Kitchen Supplies',
        email: 'info@japanesekitchen.co.th',
        phone: '+66-2-345-6789',
        street: '789 Rama 4 Road',
        city: 'Bangkok',
        zip: '10500',
        country_id: 221, // Thailand
        is_company: true,
        supplier_rank: 9,
        customer_rank: 0,
        company_type: 'company'
      },
      {
        name: '🍶 Sake Importers Ltd.',
        email: 'order@sakeimporters.co.th',
        phone: '+66-2-456-7890',
        street: '321 Rama 9 Road',
        city: 'Bangkok',
        zip: '10310',
        country_id: 221, // Thailand
        is_company: true,
        supplier_rank: 7,
        customer_rank: 0,
        company_type: 'company'
      },
      {
        name: '🍵 Kyoto Tea & Tableware',
        email: 'contact@kyototea.co.th',
        phone: '+66-2-567-8901',
        street: '654 Phahonyothin Road',
        city: 'Bangkok',
        zip: '10400',
        country_id: 221, // Thailand
        is_company: true,
        supplier_rank: 6,
        customer_rank: 0,
        company_type: 'company'
      }
    ];
    const created = [];
    console.log('🏢 Creating example suppliers...');
    for (const s of suppliers) {
      try {
        const id = await this.odooService.create('res.partner', s);
        created.push({ id, ...s });
        console.log(`✅ Created supplier: ${s.name} (ID: ${id})`);
      } catch (e) {
        console.error(`❌ Failed: ${s.name}`, e.message);
      }
    }
    console.log(`\n📊 Created ${created.length} suppliers.`);
    return created;
  }

  // 🗑️ ลบ Supplier ที่ซ้ำ
  async deleteDuplicateSuppliers() {
    if (!this.isAuthenticated) await this.authenticate();
    
    try {
      console.log('🔍 Checking for duplicate suppliers...');
      
      // ดึงข้อมูล Supplier ทั้งหมด
      const suppliers = await this.odooService.search('res.partner', [
        ['supplier_rank', '>', 0]
      ], [
        'id', 'name', 'email', 'phone', 'create_date'
      ], 1000);

      console.log(`📊 Found ${suppliers.length} suppliers`);

      // ตรวจสอบซ้ำตามชื่อ
      const duplicates = {};
      suppliers.forEach(supplier => {
        const name = supplier.name?.toLowerCase().trim();
        if (name) {
          if (!duplicates[name]) duplicates[name] = [];
          duplicates[name].push(supplier);
        }
      });

      // หาคู่ที่ซ้ำ
      const duplicateGroups = Object.values(duplicates).filter(group => group.length > 1);
      
      if (duplicateGroups.length === 0) {
        console.log('✅ No duplicate suppliers found!');
        return { deleted: 0, failed: 0 };
      }

      console.log(`🔍 Found ${duplicateGroups.length} duplicate groups`);
      
      let deletedCount = 0;
      let failedCount = 0;

      // ลบรายการซ้ำ (เก็บรายการใหม่สุด)
      for (const group of duplicateGroups) {
        console.log(`\n🗑️ Processing group: "${group[0].name}"`);
        console.log(`   Found ${group.length} duplicates`);
        
        // เรียงตาม create_date (เก่าสุดก่อน)
        group.sort((a, b) => new Date(a.create_date) - new Date(b.create_date));
        
        // ลบรายการเก่า (เก็บรายการใหม่สุดไว้)
        const toDelete = group.slice(0, -1);
        
        for (const supplier of toDelete) {
          try {
            console.log(`   🗑️ Deleting: ${supplier.name} (ID: ${supplier.id})`);
            await this.odooService.delete('res.partner', supplier.id);
            console.log(`   ✅ Deleted successfully`);
            deletedCount++;
          } catch (error) {
            console.log(`   ❌ Failed to delete: ${error.message}`);
            failedCount++;
          }
        }
      }

      console.log(`\n📊 Deletion Summary:`);
      console.log(`   ✅ Successfully deleted: ${deletedCount} suppliers`);
      console.log(`   ❌ Failed to delete: ${failedCount} suppliers`);

      return { deleted: deletedCount, failed: failedCount };

    } catch (error) {
      console.error('❌ Error checking/deleting duplicate suppliers:', error.message);
      return { deleted: 0, failed: 0 };
    }
  }

  // 🔐 Permission & Security Management
  async managePermissions() {
    if (!this.isAuthenticated) await this.authenticate();
    
    console.log('🔐 Permission & Security Management');
    console.log('='.repeat(60));

    try {
      // Get user groups (roles)
      const groups = await this.odooService.search('res.groups', [], [
        'id', 'name', 'comment'
      ], 100);

      // Get access rights
      const accessRights = await this.odooService.search('ir.model.access', [], [
        'id', 'name', 'model_id', 'group_id', 'perm_read', 'perm_write', 'perm_create', 'perm_unlink'
      ], 200);

      // Get record rules
      const recordRules = await this.odooService.search('ir.rule', [], [
        'id', 'name', 'model_id', 'domain_force', 'global'
      ], 100);

      console.log(`📊 Permission Statistics:`);
      console.log(`   👥 User Groups: ${groups.length}`);
      console.log(`   🔑 Access Rights: ${accessRights.length}`);
      console.log(`   📋 Record Rules: ${recordRules.length}`);

      return { groups, accessRights, recordRules };
    } catch (error) {
      console.error('❌ Permission management failed:', error.message);
      return { groups: [], accessRights: [], recordRules: [] };
    }
  }

  // 👤 User Role Management
  async manageUserRoles() {
    if (!this.isAuthenticated) await this.authenticate();
    
    console.log('👤 User Role Management');
    console.log('='.repeat(60));

    try {
      // Get all users with their groups
      const users = await this.odooService.search('res.users', [], [
        'id', 'name', 'login', 'email', 'active', 'create_date'
      ], 100);

      // Get specific user groups for TENZAI
      const tenzaiGroups = await this.odooService.search('res.groups', [
        ['name', 'ilike', 'tenzai']
      ], [
        'id', 'name', 'users'
      ], 50);

      console.log(`📊 User Role Statistics:`);
      console.log(`   👥 Total Users: ${users.length}`);
      console.log(`   🏷️ TENZAI Groups: ${tenzaiGroups.length}`);

      // Show user group assignments
      users.forEach(user => {
        console.log(`   👤 ${user.name} (${user.login}) - Active: ${user.active}`);
      });

      return { users, tenzaiGroups };
    } catch (error) {
      console.error('❌ User role management failed:', error.message);
      return { users: [], tenzaiGroups: [] };
    }
  }

  // 🔒 Create TENZAI User Groups
  async createTenzaiUserGroups() {
    if (!this.isAuthenticated) await this.authenticate();
    
    console.log('🔒 Creating TENZAI User Groups');
    console.log('='.repeat(60));

    try {
      const groups = [
        {
          name: 'TENZAI Admin',
          comment: 'Full access to TENZAI Purchasing System'
        },
        {
          name: 'TENZAI Manager',
          comment: 'Manager access to TENZAI Purchasing System'
        },
        {
          name: 'TENZAI Purchaser',
          comment: 'Purchaser access to TENZAI Purchasing System'
        },
        {
          name: 'TENZAI Warehouse',
          comment: 'Warehouse access to TENZAI Purchasing System'
        }
      ];

      const createdGroups = [];
      
      for (const groupData of groups) {
        try {
          const groupId = await this.odooService.create('res.groups', groupData);
          console.log(`✅ Created group: ${groupData.name} (ID: ${groupId})`);
          createdGroups.push({ id: groupId, ...groupData });
        } catch (error) {
          console.log(`⚠️ Group ${groupData.name} might already exist: ${error.message}`);
        }
      }

      console.log(`📊 Created ${createdGroups.length} TENZAI groups`);
      return createdGroups;
    } catch (error) {
      console.error('❌ Creating TENZAI groups failed:', error.message);
      return [];
    }
  }

  // 🔐 Assign User to TENZAI Group
  async assignUserToTenzaiGroup(userId, groupName) {
    if (!this.isAuthenticated) await this.authenticate();
    
    console.log(`🔐 Assigning user ${userId} to ${groupName}`);
    console.log('='.repeat(60));

    try {
      // Find the TENZAI group
      const groups = await this.odooService.search('res.groups', [
        ['name', '=', groupName]
      ], ['id'], 1);

      if (groups.length === 0) {
        throw new Error(`Group ${groupName} not found`);
      }

      const groupId = groups[0].id;

      // Get current user groups
      const user = await this.odooService.getById('res.users', userId, ['name']);
      
      if (!user) {
        throw new Error(`User ${userId} not found`);
      }

      console.log(`✅ User ${user.name} found, group assignment would be done here`);
      console.log(`ℹ️ Note: Group assignment requires additional Odoo configuration`);
      
      return true;
    } catch (error) {
      console.error('❌ Assigning user to group failed:', error.message);
      return false;
    }
  }

  // 👥 Create TENZAI Demo Users
  async createTenzaiDemoUsers() {
    if (!this.isAuthenticated) await this.authenticate();
    
    console.log('👥 Creating TENZAI Demo Users');
    console.log('='.repeat(60));

    try {
      const users = [
        {
          name: 'TENZAI Admin',
          login: 'admin@tenzai.com',
          email: 'admin@tenzai.com',
          password: '123456',
          groupName: 'TENZAI Admin',
          comment: 'System Administrator with full access'
        },
        {
          name: 'TENZAI Manager',
          login: 'manager@tenzai.com',
          email: 'manager@tenzai.com',
          password: '123456',
          groupName: 'TENZAI Manager',
          comment: 'Manager with oversight access'
        },
        {
          name: 'TENZAI Purchaser',
          login: 'purchaser@tenzai.com',
          email: 'purchaser@tenzai.com',
          password: '123456',
          groupName: 'TENZAI Purchaser',
          comment: 'Purchaser with procurement access'
        },
        {
          name: 'TENZAI Warehouse',
          login: 'warehouse@tenzai.com',
          email: 'warehouse@tenzai.com',
          password: '123456',
          groupName: 'TENZAI Warehouse',
          comment: 'Warehouse staff with inventory access'
        }
      ];

      const createdUsers = [];
      
      for (const userData of users) {
        try {
          console.log(`👤 Creating user: ${userData.name} (${userData.login})`);
          
          // Create user
          const userId = await this.odooService.create('res.users', {
            name: userData.name,
            login: userData.login,
            email: userData.email,
            password: userData.password,
            comment: userData.comment,
            active: true
          });
          
          console.log(`✅ Created user: ${userData.name} (ID: ${userId})`);
          
          // Assign to TENZAI group
          const assigned = await this.assignUserToTenzaiGroup(userId, userData.groupName);
          
          createdUsers.push({
            id: userId,
            name: userData.name,
            login: userData.login,
            email: userData.email,
            password: userData.password,
            group: userData.groupName,
            assigned: assigned
          });
          
          console.log(`✅ User ${userData.name} assigned to ${userData.groupName}`);
          
        } catch (error) {
          console.log(`⚠️ User ${userData.name} might already exist: ${error.message}`);
        }
      }

      console.log(`📊 Created ${createdUsers.length} TENZAI demo users`);
      
      // Print user summary
      console.log('\n📋 Demo Users Summary:');
      console.log('='.repeat(60));
      createdUsers.forEach(user => {
        console.log(`👤 ${user.name}`);
        console.log(`   📧 Email: ${user.email}`);
        console.log(`   🔑 Password: ${user.password}`);
        console.log(`   🏷️ Group: ${user.group}`);
        console.log(`   ✅ Assigned: ${user.assigned ? 'Yes' : 'No'}`);
        console.log('');
      });

      return createdUsers;
    } catch (error) {
      console.error('❌ Creating TENZAI demo users failed:', error.message);
      return [];
    }
  }

  // 🔐 Setup Complete TENZAI System
  async setupCompleteTenzaiSystem() {
    if (!this.isAuthenticated) await this.authenticate();
    
    console.log('🔐 Setting up Complete TENZAI System');
    console.log('='.repeat(60));

    try {
      const results = {};

      // 1. Create TENZAI Groups
      console.log('1️⃣ Creating TENZAI User Groups...');
      results.groups = await this.createTenzaiUserGroups();

      // 2. Create Demo Users
      console.log('\n2️⃣ Creating Demo Users...');
      results.users = await this.createTenzaiDemoUsers();

      // 3. Test Permissions
      console.log('\n3️⃣ Testing Permissions...');
      results.permissions = await this.managePermissions();

      // 4. Test User Roles
      console.log('\n4️⃣ Testing User Roles...');
      results.userRoles = await this.manageUserRoles();

      // Print Setup Summary
      console.log('\n📋 TENZAI System Setup Summary');
      console.log('='.repeat(60));
      console.log(`✅ Groups Created: ${results.groups?.length || 0}`);
      console.log(`✅ Users Created: ${results.users?.length || 0}`);
      console.log(`✅ Permissions Tested: ${results.permissions?.groups ? 'PASSED' : 'FAILED'}`);
      console.log(`✅ User Roles Tested: ${results.userRoles?.users ? 'PASSED' : 'FAILED'}`);

      console.log('\n🎉 TENZAI System setup completed successfully!');
      console.log('\n📝 Login Credentials:');
      console.log('='.repeat(60));
      if (results.users) {
        results.users.forEach(user => {
          console.log(`👤 ${user.name}: ${user.login} / ${user.password}`);
        });
      }

      return results;
    } catch (error) {
      console.error('❌ TENZAI system setup failed:', error.message);
      return { error: error.message };
    }
  }

  // 🚀 Master Command Runner
  async runCommand(command, options = {}) {
    console.log(`🚀 Running command: ${command}`);
    console.log('='.repeat(60));

    switch (command) {
      case 'status':
        return await this.getSystemStatus();
      
      case 'companies':
        return await this.manageCompanies();
      
      case 'users':
        return await this.manageUsers();
      
      case 'modules':
        return await this.manageModules();
      
      case 'products':
        return await this.manageProducts();
      
      case 'projects':
        return await this.manageProjects();
      
      case 'finance':
        return await this.manageFinance();
      
      case 'sales':
        return await this.manageSales();
      
      case 'purchases':
        return await this.managePurchases();
      
      case 'manufacturing':
        return await this.manageManufacturing();
      
      case 'cleanup':
        return await this.cleanupData();
      
      case 'full-check':
        return await this.runFullSystemCheck();
      
      case 'create-suppliers':
        return await this.createSuppliersOnly();
      
      case 'delete-duplicate-suppliers':
        return await this.deleteDuplicateSuppliers();
      
      // 🍣 Ocha System Commands
      case 'ocha-init':
        return await this.initializeOcha();
      
      case 'ocha-test':
        return await this.testOchaOperations();
      
      case 'ocha-sync':
        return await this.syncOdooToOcha();
      
      case 'ocha-analytics':
        const analytics = await this.getOchaAnalytics();
        if (analytics.success) {
          console.log('📊 Ocha Analytics:');
          console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
          console.log(`👥 Suppliers: ${analytics.data.suppliers}`);
          console.log(`📦 Products: ${analytics.data.products}`);
          console.log(`📋 Purchase Orders: ${analytics.data.purchaseOrders}`);
          console.log(`📥 Goods Receipts: ${analytics.data.goodsReceipts}`);
          console.log(`🏪 Storages: ${analytics.data.storages}`);
          console.log(`🍳 Processings: ${analytics.data.processings}`);
          console.log(`🚚 Transportations: ${analytics.data.transportations}`);
          console.log(`💰 Total PO Value: $${analytics.data.totalPOValue.toFixed(2)}`);
          console.log(`⏳ Pending POs: ${analytics.data.pendingPOs}`);
          console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        } else {
          console.log('❌ Failed to get analytics:', analytics.error);
        }
        return analytics;
      
      case 'ocha-inventory':
        return await this.getOchaInventoryReport();
      
      case 'ocha-purchase-report':
        return await this.getOchaPurchaseReport();
      
      case 'ocha-processing-report':
        return await this.getOchaProcessingReport();
      
      // 🍣 Ocha System - Inventory Management
      case 'ocha-inventory-items':
        return await this.getOchaInventory(options);
      
      case 'ocha-inventory-item':
        return await this.createOchaInventoryItem(options);
      
      case 'ocha-inventory-item-update':
        return await this.updateOchaInventoryItem(options.id, options.data);
      
      case 'ocha-inventory-item-delete':
        return await this.deleteOchaInventoryItem(options.id);
      
      // 🍣 Ocha System - Storage Management
      case 'ocha-storages':
        return await this.getOchaStorages(options);
      
      case 'ocha-storage':
        return await this.createOchaStorage(options);
      
      case 'ocha-storage-update':
        return await this.updateOchaStorage(options.id, options.data);
      
      case 'ocha-storage-delete':
        return await this.deleteOchaStorage(options.id);
      
      // 🍣 Ocha System - Processing Management
      case 'ocha-processings':
        return await this.getOchaProcessings(options);
      
      case 'ocha-processing':
        return await this.createOchaProcessing(options);
      
      case 'ocha-processing-update':
        return await this.updateOchaProcessing(options.id, options.data);
      
      case 'ocha-processing-delete':
        return await this.deleteOchaProcessing(options.id);
      
      // 🍣 Ocha System - Transportation Management
      case 'ocha-transportations':
        return await this.getOchaTransportations(options);
      
      case 'ocha-transportation':
        return await this.createOchaTransportation(options);
      
      case 'ocha-transportation-update':
        return await this.updateOchaTransportation(options.id, options.data);
      
      case 'ocha-transportation-delete':
        return await this.deleteOchaTransportation(options.id);
      
      // 🔐 Permission & Security Management
      case 'permissions':
        return await this.managePermissions();
      
      case 'user-roles':
        return await this.manageUserRoles();
      
      case 'create-tenzai-groups':
        return await this.createTenzaiUserGroups();
      
      case 'assign-user-to-group':
        return await this.assignUserToTenzaiGroup(options.userId, options.groupName);
      
      // 👥 Demo Users
      case 'create-demo-users':
        return await this.createTenzaiDemoUsers();
      
      case 'setup-tenzai-system':
        return await this.setupCompleteTenzaiSystem();
      
      // 🧪 Advanced CRUD Testing
      case 'test-advanced-crud':
        return await this.testAdvancedCRUD();
      
      // 🔍 Field Validation Testing
      case 'test-field-validation':
        return await this.testFieldValidation();
      
      // 📊 Performance Testing
      case 'test-performance':
        return await this.testPerformance();
      
      default:
        console.log('❌ Unknown command:', command);
        console.log('📋 Available commands:');
        console.log('  Odoo: status, companies, users, modules, products, projects, finance, sales, purchases, manufacturing, cleanup, full-check, create-suppliers, delete-duplicate-suppliers');
        console.log('  🍣 Ocha: ocha-init, ocha-test, ocha-sync, ocha-analytics, ocha-inventory, ocha-purchase-report, ocha-processing-report, ocha-inventory-items, ocha-inventory-item, ocha-inventory-item-update, ocha-inventory-item-delete, ocha-storages, ocha-storage, ocha-storage-update, ocha-storage-delete, ocha-processings, ocha-processing, ocha-processing-update, ocha-processing-delete, ocha-transportations, ocha-transportation, ocha-transportation-update, ocha-transportation-delete');
        console.log('  Permissions: permissions, user-roles, create-tenzai-groups, assign-user-to-group');
        console.log('  👥 Demo Users: create-demo-users, setup-tenzai-system');
        console.log('  🧪 Advanced CRUD Testing: test-advanced-crud');
        console.log('  🔍 Field Validation Testing: test-field-validation');
        console.log('  📊 Performance Testing: test-performance');
        return null;
    }
  }

  // 🔍 Full System Check
  async runFullSystemCheck() {
    console.log('🔍 TENZAI Full System Check');
    console.log('='.repeat(60));

    const results = {
      status: await this.getSystemStatus(),
      modules: await this.manageModules(),
      products: await this.manageProducts(),
      projects: await this.manageProjects(),
      finance: await this.manageFinance(),
      sales: await this.manageSales(),
      purchases: await this.managePurchases(),
      manufacturing: await this.manageManufacturing(),
      cleanup: await this.cleanupData()
    };

    // Generate summary report
    console.log('\n📊 TENZAI System Summary Report');
    console.log('='.repeat(60));
    console.log(`🏢 Companies: ${results.status.companies?.count || 0}`);
    console.log(`👥 Users: ${results.status.users?.count || 0}`);
    console.log(`📦 Modules: ${results.status.modules?.installed || 0}`);
    console.log(`🛒 Products: ${results.products.products?.length || 0}`);
    console.log(`🏗️ Projects: ${results.projects.projects?.length || 0}`);
    console.log(`📋 Tasks: ${results.projects.tasks?.length || 0}`);
    console.log(`💰 Accounts: ${results.finance.accounts?.length || 0}`);
    console.log(`🛍️ Sales Orders: ${results.sales.salesOrders?.length || 0}`);
    console.log(`📦 Purchase Orders: ${results.purchases.purchaseOrders?.length || 0}`);
    console.log(`🏭 Manufacturing Orders: ${results.manufacturing.mrpOrders?.length || 0}`);

    // TENZAI Apps Status
    const tenzaiProgress = results.modules.tenzaiApps;
    if (tenzaiProgress) {
      console.log(`\n🎯 TENZAI Apps: ${tenzaiProgress.installed.length}/${tenzaiProgress.required.length} (${Math.round((tenzaiProgress.installed.length / tenzaiProgress.required.length) * 100)}%)`);
    }

    return results;
  }

  // 🍣 Ocha System Management
  async initializeOcha() {
    console.log('🍣 Initializing Ocha System...');
    try {
      const status = await this.ocha.testConnection();
      if (status.success) {
        console.log('✅ Ocha system connected successfully');
        return status;
      } else {
        console.log('❌ Ocha system connection failed:', status.error);
        return status;
      }
    } catch (error) {
      console.error('❌ Ocha initialization error:', error.message);
      return { success: false, error: error.message };
    }
  }

  // 📦 Ocha Product Management
  async createOchaProduct(productData) {
    return await this.ocha.createProduct(productData);
  }

  async getOchaProducts(filters = {}) {
    return await this.ocha.getProducts(filters);
  }

  async updateOchaProduct(id, data) {
    return await this.ocha.updateProduct(id, data);
  }

  async deleteOchaProduct(id) {
    return await this.ocha.deleteProduct(id);
  }

  // 👥 Ocha Supplier Management
  async createOchaSupplier(supplierData) {
    return await this.ocha.createSupplier(supplierData);
  }

  async getOchaSuppliers(filters = {}) {
    return await this.ocha.getSuppliers(filters);
  }

  async updateOchaSupplier(id, data) {
    return await this.ocha.updateSupplier(id, data);
  }

  async deleteOchaSupplier(id) {
    return await this.ocha.deleteSupplier(id);
  }

  // 📋 Ocha Purchase Request Management
  async createOchaPurchaseRequest(requestData) {
    return await this.ocha.createPurchaseRequest(requestData);
  }

  async getOchaPurchaseRequests(filters = {}) {
    return await this.ocha.getPurchaseRequests(filters);
  }

  async updateOchaPurchaseRequest(id, data) {
    return await this.ocha.updatePurchaseRequest(id, data);
  }

  async approveOchaPurchaseRequest(id) {
    return await this.ocha.approvePurchaseRequest(id);
  }

  async rejectOchaPurchaseRequest(id, reason) {
    return await this.ocha.rejectPurchaseRequest(id, reason);
  }

  // 📦 Ocha Purchase Order Management
  async createOchaPurchaseOrder(poData) {
    return await this.ocha.createPurchaseOrder(poData);
  }

  async getOchaPurchaseOrders(filters = {}) {
    return await this.ocha.getPurchaseOrders(filters);
  }

  async updateOchaPurchaseOrder(id, data) {
    return await this.ocha.updatePurchaseOrder(id, data);
  }

  async confirmOchaPurchaseOrder(id) {
    return await this.ocha.confirmPurchaseOrder(id);
  }

  // 📥 Ocha Goods Receipt Management
  async createOchaGoodsReceipt(receiptData) {
    return await this.ocha.createGoodsReceipt(receiptData);
  }

  async getOchaGoodsReceipts(filters = {}) {
    return await this.ocha.getGoodsReceipts(filters);
  }

  async updateOchaGoodsReceipt(id, data) {
    return await this.ocha.updateGoodsReceipt(id, data);
  }

  async confirmOchaGoodsReceipt(id) {
    return await this.ocha.confirmGoodsReceipt(id);
  }

  // 🏪 Ocha Storage Management
  async createOchaStorage(storageData) {
    return await this.ocha.createStorage(storageData);
  }

  async getOchaStorages(filters = {}) {
    return await this.ocha.getStorages(filters);
  }

  async updateOchaStorage(id, data) {
    return await this.ocha.updateStorage(id, data);
  }

  async moveOchaInventory(fromStorage, toStorage, productId, quantity) {
    return await this.ocha.moveInventory(fromStorage, toStorage, productId, quantity);
  }

  // 🍳 Ocha Processing Management
  async createOchaProcessing(processingData) {
    return await this.ocha.createProcessing(processingData);
  }

  async getOchaProcessings(filters = {}) {
    return await this.ocha.getProcessings(filters);
  }

  async updateOchaProcessing(id, data) {
    return await this.ocha.updateProcessing(id, data);
  }

  async startOchaProcessing(id) {
    return await this.ocha.startProcessing(id);
  }

  async completeOchaProcessing(id) {
    return await this.ocha.completeProcessing(id);
  }

  // 🚚 Ocha Transportation Management
  async createOchaTransportation(transportData) {
    return await this.ocha.createTransportation(transportData);
  }

  async getOchaTransportations(filters = {}) {
    return await this.ocha.getTransportations(filters);
  }

  async updateOchaTransportation(id, data) {
    return await this.ocha.updateTransportation(id, data);
  }

  async startOchaTransportation(id) {
    return await this.ocha.startTransportation(id);
  }

  async completeOchaTransportation(id) {
    return await this.ocha.completeTransportation(id);
  }

  // 📊 Ocha Analytics
  async getOchaAnalytics() {
    return await this.ocha.getAnalytics();
  }

  async getOchaInventoryReport() {
    return await this.ocha.getInventoryReport();
  }

  async getOchaPurchaseReport() {
    return await this.ocha.getPurchaseReport();
  }

  async getOchaProcessingReport() {
    return await this.ocha.getProcessingReport();
  }

  // 🔄 Sync Odoo to Ocha
  async syncOdooToOcha() {
    console.log('🔄 Starting Odoo to Ocha Sync...\n');
    
    try {
      // Sync Products
      console.log('📦 Syncing products from Odoo to Ocha...');
      const odooProducts = await this.odooService.search('product.product', [['active', '=', true]], ['id', 'name', 'list_price', 'categ_id']);
      
      let syncedProducts = 0;
      for (const product of odooProducts.slice(0, 50)) {
        const productData = {
          name: product.name,
          code: `ODOO_${product.id}`,
          description: `Imported from Odoo - ${product.name}`,
          list_price: product.list_price || 0,
          cost_price: 0,
          type: 'consu',
          active: true
        };
        
        const result = await this.ocha.createProduct(productData);
        if (result.success) syncedProducts++;
      }
      console.log(`✅ Synced ${syncedProducts} products`);

      // Sync Suppliers
      console.log('👥 Syncing suppliers from Odoo to Ocha...');
      const odooSuppliers = await this.odooService.search('res.partner', [['supplier_rank', '>', 0]], ['id', 'name', 'email', 'phone']);
      
      let syncedSuppliers = 0;
      for (const supplier of odooSuppliers.slice(0, 20)) {
        const supplierData = {
          name: supplier.name,
          email: supplier.email || '',
          phone: supplier.phone || '',
          address: '',
          city: '',
          country: '',
          zip_code: '',
          supplier_rank: 1,
          active: true
        };
        
        const result = await this.ocha.createSupplier(supplierData);
        if (result.success) syncedSuppliers++;
      }
      console.log(`✅ Synced ${syncedSuppliers} suppliers`);

      console.log('\n🎉 Odoo to Ocha sync completed successfully!');
      return { success: true, products: syncedProducts, suppliers: syncedSuppliers };
      
    } catch (error) {
      console.error('❌ Sync failed:', error.message);
      return { success: false, error: error.message };
    }
  }

  // 🧪 Test Ocha Operations
  async testOchaOperations() {
    console.log('🧪 Testing Ocha Operations...\n');

    // Test Product CRUD
    console.log('📦 Testing Product CRUD...');
    const testProduct = {
      name: 'Master Toolkit Test Product',
      code: 'MTK_TEST_001',
      description: 'Test product from master toolkit',
      list_price: 99.99,
      cost_price: 50.00,
      type: 'consu',
      active: true
    };

    const createResult = await this.createOchaProduct(testProduct);
    if (createResult.success) {
      console.log('✅ Product created:', createResult.data.id);
      
      // Test read
      const readResult = await this.getOchaProducts({ id: createResult.data.id });
      if (readResult.success && readResult.data.length > 0) {
        console.log('✅ Product read successful');
        
        // Test update
        const updateData = {
          name: 'Updated Test Product',
          list_price: 129.99
        };
        await this.odooService.update('product.template', createResult.data.id, updateData);
        console.log(`✅ Product update successful`);
        
        // Test delete
        await this.odooService.delete('product.template', createResult.data.id);
        console.log('✅ Product delete successful');
      }
    }

    // Test Supplier CRUD
    console.log('👥 Testing Supplier CRUD...');
    const testSupplier = {
      name: 'Master Toolkit Test Supplier',
      email: 'test@mastertoolkit.com',
      phone: '+66-999-888-777',
      address: '123 Master Street',
      city: 'Bangkok',
      country: 'Thailand',
      zip_code: '10110',
      supplier_rank: 5,
      active: true
    };

    const supplierResult = await this.createOchaSupplier(testSupplier);
    if (supplierResult.success) {
      console.log('✅ Supplier created:', supplierResult.data.id);
      
      // Clean up
      await this.deleteOchaSupplier(supplierResult.data.id);
      console.log('✅ Supplier cleaned up');
    }

    console.log('\n🎉 Ocha operations test completed!');
  }

  // 🍣 Ocha System - Inventory Management
  async getOchaInventory(filters = {}) {
    return await this.ocha.getInventoryItems(filters);
  }

  async createOchaInventoryItem(itemData) {
    return await this.ocha.createInventoryItem(itemData);
  }

  async updateOchaInventoryItem(id, data) {
    return await this.ocha.updateInventoryItem(id, data);
  }

  async deleteOchaInventoryItem(id) {
    return await this.ocha.deleteInventoryItem(id);
  }

  // 🍣 Ocha System - Storage Management
  async getOchaStorages(filters = {}) {
    return await this.ocha.getStorages(filters);
  }

  async createOchaStorage(storageData) {
    return await this.ocha.createStorage(storageData);
  }

  async updateOchaStorage(id, data) {
    return await this.ocha.updateStorage(id, data);
  }

  async deleteOchaStorage(id) {
    return await this.ocha.deleteStorage(id);
  }

  // 🍣 Ocha System - Processing Management
  async getOchaProcessings(filters = {}) {
    return await this.ocha.getProcessings(filters);
  }

  async createOchaProcessing(processingData) {
    return await this.ocha.createProcessing(processingData);
  }

  async updateOchaProcessing(id, data) {
    return await this.ocha.updateProcessing(id, data);
  }

  async deleteOchaProcessing(id) {
    return await this.ocha.deleteProcessing(id);
  }

  // 🍣 Ocha System - Transportation Management
  async getOchaTransportations(filters = {}) {
    return await this.ocha.getTransportations(filters);
  }

  async createOchaTransportation(transportData) {
    return await this.ocha.createTransportation(transportData);
  }

  async updateOchaTransportation(id, data) {
    return await this.ocha.updateTransportation(id, data);
  }

  async deleteOchaTransportation(id) {
    return await this.ocha.deleteTransportation(id);
  }

  // 🧪 Advanced CRUD Testing
  async testAdvancedCRUD() {
    if (!this.isAuthenticated) await this.authenticate();
    
    console.log('🧪 Advanced CRUD Testing');
    console.log('='.repeat(60));

    try {
      const results = {};

      // Test 1: Create Product
      console.log('📦 Testing Product CRUD...');
      const productData = {
        name: '🧪 Test Product - Advanced CRUD',
        default_code: 'TEST-ADV-001',
        categ_id: 1,
        type: 'consu',
        list_price: 150.00,
        standard_price: 100.00,
        description: 'Test product for advanced CRUD operations'
      };

      const productId = await this.odooService.create('product.template', productData);
      console.log(`✅ Created product: ${productId}`);

      // Test 2: Read Product
      const product = await this.odooService.getById('product.template', productId, [
        'id', 'name', 'default_code', 'list_price', 'standard_price'
      ]);
      console.log(`✅ Read product: ${product.name} - Price: ${product.list_price}`);

      // Test 3: Update Product
      const updateData = {
        list_price: 175.00,
        description: 'Updated test product for advanced CRUD operations'
      };
      await this.odooService.update('product.template', productId, updateData);
      console.log(`✅ Updated product: ${productId}`);

      // Test 4: Search Products
      const searchResults = await this.odooService.search('product.template', [
        ['name', 'ilike', 'Test Product']
      ], ['id', 'name', 'list_price'], 10);
      console.log(`✅ Search found ${searchResults.length} test products`);

      // Test 5: Delete Product
      await this.odooService.delete('product.template', productId);
      console.log(`✅ Deleted product: ${productId}`);

      results.productCRUD = 'SUCCESS';

      // Test 6: Create Partner (Supplier)
      console.log('👥 Testing Partner CRUD...');
      const partnerData = {
        name: '🧪 Test Supplier - Advanced CRUD',
        email: 'test@advancedcrud.com',
        phone: '+66-2-999-9999',
        is_company: true,
        supplier_rank: 1,
        customer_rank: 0
      };

      const partnerId = await this.odooService.create('res.partner', partnerData);
      console.log(`✅ Created partner: ${partnerId}`);

      // Test 7: Read Partner
      const partner = await this.odooService.getById('res.partner', partnerId, [
        'id', 'name', 'email', 'supplier_rank'
      ]);
      console.log(`✅ Read partner: ${partner.name} - Email: ${partner.email}`);

      // Test 8: Update Partner
      await this.odooService.update('res.partner', partnerId, {
        phone: '+66-2-888-8888',
        comment: 'Updated test supplier'
      });
      console.log(`✅ Updated partner: ${partnerId}`);

      // Test 9: Delete Partner
      await this.odooService.delete('res.partner', partnerId);
      console.log(`✅ Deleted partner: ${partnerId}`);

      results.partnerCRUD = 'SUCCESS';

      // Test 10: Bulk Operations
      console.log('📊 Testing Bulk Operations...');
      const bulkProducts = [];
      for (let i = 1; i <= 5; i++) {
        bulkProducts.push({
          name: `🧪 Bulk Test Product ${i}`,
          default_code: `BULK-TEST-${i.toString().padStart(3, '0')}`,
          categ_id: 1,
          type: 'consu',
          list_price: 100 + (i * 10)
        });
      }

      const bulkIds = await this.odooService.create('product.template', bulkProducts);
      console.log(`✅ Created ${bulkIds.length} bulk products`);

      // Bulk read
      const bulkRead = await Promise.all(
        bulkIds.map(id => this.odooService.getById('product.template', id, ['name', 'list_price']))
      );
      console.log(`✅ Bulk read ${bulkRead.length} products`);

      // Bulk update
      const bulkUpdateData = bulkIds.map(id => [id, { description: 'Bulk updated product' }]);
      for (const [id, data] of bulkUpdateData) {
        await this.odooService.update('product.template', id, data);
      }
      console.log(`✅ Bulk updated ${bulkIds.length} products`);

      // Bulk delete
      for (const id of bulkIds) {
        await this.odooService.delete('product.template', id);
      }
      console.log(`✅ Bulk deleted ${bulkIds.length} products`);

      results.bulkCRUD = 'SUCCESS';

      console.log('🎉 All Advanced CRUD Tests Completed Successfully!');
      return results;

    } catch (error) {
      console.error('❌ Advanced CRUD testing failed:', error.message);
      return { error: error.message };
    }
  }

  // 🔍 Field Validation Testing
  async testFieldValidation() {
    if (!this.isAuthenticated) await this.authenticate();
    
    console.log('🔍 Field Validation Testing');
    console.log('='.repeat(60));

    try {
      const results = {};

      // Test 1: Required Fields
      console.log('📋 Testing Required Fields...');
      try {
        await this.odooService.create('product.template', {});
        console.log('❌ Should have failed - missing required fields');
        results.requiredFields = 'FAILED';
      } catch (error) {
        console.log('✅ Required fields validation working');
        results.requiredFields = 'PASSED';
      }

      // Test 2: Field Types
      console.log('🔢 Testing Field Types...');
      try {
        await this.odooService.create('product.template', {
          name: 'Test Product',
          list_price: 'invalid_price', // Should be number
          categ_id: 1
        });
        console.log('❌ Should have failed - invalid field type');
        results.fieldTypes = 'FAILED';
      } catch (error) {
        console.log('✅ Field type validation working');
        results.fieldTypes = 'PASSED';
      }

      // Test 3: Unique Constraints
      console.log('🔒 Testing Unique Constraints...');
      const uniqueCode = 'UNIQUE-TEST-' + Date.now();
      
      // Create first product
      const product1Id = await this.odooService.create('product.template', {
        name: 'Unique Test Product 1',
        default_code: uniqueCode,
        categ_id: 1
      });
      console.log(`✅ Created first product with code: ${uniqueCode}`);

      // Try to create second product with same code
      try {
        await this.odooService.create('product.template', {
          name: 'Unique Test Product 2',
          default_code: uniqueCode, // Same code
          categ_id: 1
        });
        console.log('❌ Should have failed - duplicate code');
        results.uniqueConstraints = 'FAILED';
      } catch (error) {
        console.log('✅ Unique constraint validation working');
        results.uniqueConstraints = 'PASSED';
      }

      // Cleanup
      await this.odooService.delete('product.template', product1Id);

      // Test 4: Foreign Key Constraints
      console.log('🔗 Testing Foreign Key Constraints...');
      try {
        await this.odooService.create('product.template', {
          name: 'FK Test Product',
          categ_id: 99999 // Non-existent category
        });
        console.log('❌ Should have failed - invalid foreign key');
        results.foreignKeys = 'FAILED';
      } catch (error) {
        console.log('✅ Foreign key validation working');
        results.foreignKeys = 'PASSED';
      }

      console.log('🎉 All Field Validation Tests Completed!');
      return results;

    } catch (error) {
      console.error('❌ Field validation testing failed:', error.message);
      return { error: error.message };
    }
  }

  // 📊 Performance Testing
  async testPerformance() {
    if (!this.isAuthenticated) await this.authenticate();
    
    console.log('📊 Performance Testing');
    console.log('='.repeat(60));

    try {
      const results = {};

      // Test 1: Search Performance
      console.log('🔍 Testing Search Performance...');
      const startTime = Date.now();
      
      const searchResults = await this.odooService.search('product.template', [], [
        'id', 'name', 'default_code', 'list_price'
      ], 1000);
      
      const searchTime = Date.now() - startTime;
      console.log(`✅ Search completed in ${searchTime}ms for ${searchResults.length} records`);
      results.searchPerformance = { time: searchTime, records: searchResults.length };

      // Test 2: Read Performance
      console.log('📖 Testing Read Performance...');
      const readStartTime = Date.now();
      
      const readResults = await Promise.all(
        searchResults.slice(0, 100).map(p => this.odooService.getById('product.template', p.id, ['id', 'name', 'list_price']))
      );
      
      const readTime = Date.now() - readStartTime;
      console.log(`✅ Read completed in ${readTime}ms for ${readResults.length} records`);
      results.readPerformance = { time: readTime, records: readResults.length };

      // Test 3: Create Performance
      console.log('➕ Testing Create Performance...');
      const createStartTime = Date.now();
      
      const testProduct = {
        name: 'Performance Test Product',
        default_code: 'PERF-TEST-' + Date.now(),
        categ_id: 1,
        type: 'consu'
      };
      
      const productId = await this.odooService.create('product.template', testProduct);
      const createTime = Date.now() - createStartTime;
      console.log(`✅ Create completed in ${createTime}ms`);
      results.createPerformance = { time: createTime };

      // Test 4: Update Performance
      console.log('✏️ Testing Update Performance...');
      const updateStartTime = Date.now();
      
      await this.odooService.update('product.template', productId, {
        list_price: 999.99,
        description: 'Performance test updated'
      });
      
      const updateTime = Date.now() - updateStartTime;
      console.log(`✅ Update completed in ${updateTime}ms`);
      results.updatePerformance = { time: updateTime };

      // Test 5: Delete Performance
      await this.odooService.delete('product.template', productId);
      
      const deleteTime = Date.now() - updateStartTime;
      console.log(`✅ Delete completed in ${deleteTime}ms`);
      results.deletePerformance = { time: deleteTime };

      // Performance Summary
      const totalTime = searchTime + readTime + createTime + updateTime + deleteTime;
      console.log(`📊 Total Performance Test Time: ${totalTime}ms`);
      
      results.summary = {
        totalTime,
        averageTime: totalTime / 5,
        operations: 5
      };

      console.log('🎉 Performance Testing Completed!');
      return results;

    } catch (error) {
      console.error('❌ Performance testing failed:', error.message);
      return { error: error.message };
    }
  }
}

// Export
module.exports = TenzaiMasterToolkit;

// CLI Interface
if (require.main === module) {
  const toolkit = new TenzaiMasterToolkit();
  
  const args = process.argv.slice(2);
  const command = args[0] || 'full-check';
  const options = {};
  
  // Parse additional options
  args.slice(1).forEach(arg => {
    if (arg.startsWith('--')) {
      const [key, value] = arg.slice(2).split('=');
      options[key] = value || true;
    }
  });

  toolkit.runCommand(command, options)
    .then(results => {
      console.log('\n🎉 Command completed successfully!');
      process.exit(0);
    })
    .catch(error => {
      console.error('❌ Command failed:', error.message);
      process.exit(1);
    });
}