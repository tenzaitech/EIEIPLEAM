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
      // Get projects
      const projects = await this.odooService.search('project.project', [], [
        'id', 'name', 'partner_id', 'user_id', 'date_start', 'date', 'state', 'privacy_visibility'
      ], 100);

      // Get tasks
      const tasks = await this.odooService.search('project.task', [], [
        'id', 'name', 'project_id', 'user_id', 'stage_id', 'priority', 'date_deadline', 'state'
      ], 200);

      console.log(`📊 Project Statistics:`);
      console.log(`   🏗️ Projects: ${projects.length}`);
      console.log(`   📋 Tasks: ${tasks.length}`);

      // Project states
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
            await this.odooService.unlink('res.partner', supplier.id);
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
      
      default:
        console.log('❌ Unknown command:', command);
        console.log('📋 Available commands:');
        console.log('  Odoo: status, companies, users, modules, products, projects, finance, sales, purchases, manufacturing, cleanup, full-check, create-suppliers, delete-duplicate-suppliers');
        console.log('  🍣 Ocha: ocha-init, ocha-test, ocha-sync, ocha-analytics, ocha-inventory, ocha-purchase-report, ocha-processing-report');
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
        const updateResult = await this.updateOchaProduct(createResult.data.id, {
          name: 'Updated Test Product',
          list_price: 129.99
        });
        if (updateResult.success) {
          console.log('✅ Product update successful');
          
          // Test delete
          const deleteResult = await this.deleteOchaProduct(createResult.data.id);
          if (deleteResult.success) {
            console.log('✅ Product delete successful');
          }
        }
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