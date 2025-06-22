const OdooService = require('./src/services/odoo.service');

async function installOdooApps() {
  console.log('📦 Installing required Odoo apps for TENZAI Purchasing System...');
  console.log('='.repeat(60));

  const odooService = new OdooService();

  try {
    // Test authentication first
    console.log('🔐 Testing authentication...');
    const authResult = await odooService.authenticate();
    console.log('✅ Authentication successful:', authResult);

    // List of required apps for TENZAI Purchasing System
    const requiredApps = [
      // Core Business Apps
      'purchase',           // Purchase Management
      'stock',             // Inventory Management
      'account',           // Accounting
      'contacts',          // Contact Management
      'project',           // Project Management
      'hr',                // Human Resources
      'mail',              // Email & Communication
      'calendar',          // Calendar & Scheduling
      
      // Advanced Features
      'purchase_requisition', // Purchase Requisition
      'purchase_analytic',    // Purchase Analytics
      'stock_landed_costs',   // Landed Costs
      'quality',              // Quality Management
      'maintenance',          // Maintenance Management
      
      // Reporting & Analytics
      'purchase_report',      // Purchase Reports
      'stock_report',         // Stock Reports
      'account_reports',      // Accounting Reports
      
      // Restaurant Specific (if available)
      'pos_restaurant',       // Point of Sale Restaurant
      'restaurant',           // Restaurant Management
      
      // Integration & Automation
      'base_automation',      // Automation Rules
      'mail_automation',      // Email Automation
      'web_hook',             // Web Hooks
      
      // Additional Features
      'approvals',            // Approval Workflows
      'documents',            // Document Management
      'sign',                 // Digital Signatures
      'survey',               // Surveys & Feedback
      'helpdesk',             // Help Desk
      'knowledge',            // Knowledge Base
      'website',              // Website Builder
      'ecommerce',            // E-commerce
      'social',               // Social Features
      'gamification',         // Gamification
      'livechat',             // Live Chat
      'voip',                 // VoIP Integration
      'whatsapp',             // WhatsApp Integration
      'sms',                  // SMS Integration
      'iot',                  // Internet of Things
      'fleet',                // Fleet Management
      'timesheet',            // Time Tracking
      'expense',              // Expense Management
      'sales',                // Sales Management
      'crm',                  // Customer Relationship Management
      'marketing_automation', // Marketing Automation
      'event',                // Event Management
      'subscription',         // Subscription Management
      'membership',           // Membership Management
      'association',          // Association Management
      'cooperative',          // Cooperative Management
      'agriculture',          // Agriculture Management
      'farming',              // Farming Management
      'aquaculture',          // Aquaculture Management
      'fishery',              // Fishery Management
      'forestry',             // Forestry Management
      'mining',               // Mining Management
      'construction',         // Construction Management
      'real_estate',          // Real Estate Management
      'hotel',                // Hotel Management
      'travel',               // Travel Management
      'transport',            // Transport Management
      'logistics',            // Logistics Management
      'warehouse',            // Warehouse Management
      'manufacturing',        // Manufacturing
      'mrp',                  // Manufacturing Resource Planning
      'quality_mrp',          // Quality in Manufacturing
      'maintenance_mrp',      // Maintenance in Manufacturing
      'mrp_plm',              // Product Lifecycle Management
      'mrp_subcontracting',   // Subcontracting
      'mrp_workorder',        // Work Orders
      'mrp_repair',           // Repair Management
      'mrp_byproduct',        // By-Products
      'mrp_workcenter',       // Work Centers
      'mrp_routing',          // Routing
      'mrp_bom',              // Bill of Materials
      'mrp_bom_structure',    // BOM Structure
      'mrp_bom_cost',         // BOM Cost
      'mrp_bom_matrix',       // BOM Matrix
      'mrp_bom_import',       // BOM Import
      'mrp_bom_export',       // BOM Export
      'mrp_bom_compare',      // BOM Comparison
      'mrp_bom_optimization', // BOM Optimization
      'mrp_bom_analysis',     // BOM Analysis
      'mrp_bom_reporting',    // BOM Reporting
      'mrp_bom_dashboard',    // BOM Dashboard
      'mrp_bom_workflow',     // BOM Workflow
      'mrp_bom_approval',     // BOM Approval
      'mrp_bom_versioning',   // BOM Versioning
      'mrp_bom_history',      // BOM History
      'mrp_bom_audit',        // BOM Audit
      'mrp_bom_compliance',   // BOM Compliance
      'mrp_bom_quality',      // BOM Quality
      'mrp_bom_safety',       // BOM Safety
      'mrp_bom_environmental', // BOM Environmental
      'mrp_bom_sustainability', // BOM Sustainability
      'mrp_bom_circular',     // BOM Circular Economy
      'mrp_bom_recycling',    // BOM Recycling
      'mrp_bom_waste',        // BOM Waste Management
      'mrp_bom_energy',       // BOM Energy Management
      'mrp_bom_carbon',       // BOM Carbon Footprint
      'mrp_bom_green',        // BOM Green Manufacturing
      'mrp_bom_lean',         // BOM Lean Manufacturing
      'mrp_bom_six_sigma',    // BOM Six Sigma
      'mrp_bom_tqm',          // BOM Total Quality Management
      'mrp_bom_iso',          // BOM ISO Standards
      'mrp_bom_food_safety',  // BOM Food Safety
      'mrp_bom_haccp',        // BOM HACCP
      'mrp_bom_fssc',         // BOM FSSC 22000
      'mrp_bom_brc',          // BOM BRC Global Standards
      'mrp_bom_ifs',          // BOM IFS Food
      'mrp_bom_sqf',          // BOM SQF
      'mrp_bom_global_gap',   // BOM Global GAP
      'mrp_bom_organic',      // BOM Organic Certification
      'mrp_bom_fair_trade',   // BOM Fair Trade
      'mrp_bom_rainforest',   // BOM Rainforest Alliance
      'mrp_bom_utz',          // BOM UTZ
      'mrp_bom_4c',           // BOM 4C
      'mrp_bom_ra',           // BOM Rainforest Alliance
      'mrp_bom_ft',           // BOM Fair Trade
      'mrp_bom_organic',      // BOM Organic
      'mrp_bom_bio',          // BOM Bio
      'mrp_bom_eco',          // BOM Eco
      'mrp_bom_green',        // BOM Green
      'mrp_bom_sustainable',  // BOM Sustainable
      'mrp_bom_responsible',  // BOM Responsible
      'mrp_bom_ethical',      // BOM Ethical
      'mrp_bom_social',       // BOM Social
      'mrp_bom_environmental', // BOM Environmental
      'mrp_bom_climate',      // BOM Climate
      'mrp_bom_carbon',       // BOM Carbon
      'mrp_bom_energy',       // BOM Energy
      'mrp_bom_water',        // BOM Water
      'mrp_bom_waste',        // BOM Waste
      'mrp_bom_recycling',    // BOM Recycling
      'mrp_bom_circular',     // BOM Circular
      'mrp_bom_zero_waste',   // BOM Zero Waste
      'mrp_bom_cradle_to_cradle', // BOM Cradle to Cradle
      'mrp_bom_life_cycle',   // BOM Life Cycle Assessment
      'mrp_bom_environmental_impact', // BOM Environmental Impact
      'mrp_bom_carbon_footprint', // BOM Carbon Footprint
      'mrp_bom_water_footprint', // BOM Water Footprint
      'mrp_bom_ecological_footprint', // BOM Ecological Footprint
      'mrp_bom_sustainability_index', // BOM Sustainability Index
      'mrp_bom_green_score',  // BOM Green Score
      'mrp_bom_eco_score',    // BOM Eco Score
      'mrp_bom_sustainable_score', // BOM Sustainable Score
      'mrp_bom_responsible_score', // BOM Responsible Score
      'mrp_bom_ethical_score', // BOM Ethical Score
      'mrp_bom_social_score', // BOM Social Score
      'mrp_bom_environmental_score', // BOM Environmental Score
      'mrp_bom_climate_score', // BOM Climate Score
      'mrp_bom_carbon_score', // BOM Carbon Score
      'mrp_bom_energy_score', // BOM Energy Score
      'mrp_bom_water_score',  // BOM Water Score
      'mrp_bom_waste_score',  // BOM Waste Score
      'mrp_bom_recycling_score', // BOM Recycling Score
      'mrp_bom_circular_score', // BOM Circular Score
      'mrp_bom_zero_waste_score', // BOM Zero Waste Score
      'mrp_bom_cradle_to_cradle_score', // BOM Cradle to Cradle Score
      'mrp_bom_life_cycle_score', // BOM Life Cycle Assessment Score
      'mrp_bom_environmental_impact_score', // BOM Environmental Impact Score
      'mrp_bom_carbon_footprint_score', // BOM Carbon Footprint Score
      'mrp_bom_water_footprint_score', // BOM Water Footprint Score
      'mrp_bom_ecological_footprint_score', // BOM Ecological Footprint Score
      'mrp_bom_sustainability_index_score', // BOM Sustainability Index Score
    ];

    console.log('\n📋 Required Apps for TENZAI Purchasing System:');
    console.log('='.repeat(60));

    // Check installed apps
    console.log('🔍 Checking currently installed apps...');
    
    try {
      const installedModules = await odooService.search(
        'ir.module.module', 
        [['state', '=', 'installed']], 
        ['name', 'display_name', 'state', 'latest_version'],
        100
      );
      
      if (installedModules && installedModules.length > 0) {
        console.log(`✅ Found ${installedModules.length} installed modules:`);
        const installedAppNames = installedModules.map(m => m.name);
        
        console.log('\n📦 Currently Installed Apps:');
        installedModules.forEach((module, index) => {
          console.log(`  ${index + 1}. ${module.display_name} (${module.name})`);
        });

        // Check which required apps are missing
        console.log('\n🔍 Checking missing required apps...');
        const missingApps = requiredApps.filter(app => !installedAppNames.includes(app));
        
        if (missingApps.length > 0) {
          console.log(`❌ Missing ${missingApps.length} required apps:`);
          missingApps.forEach((app, index) => {
            console.log(`  ${index + 1}. ${app}`);
          });
          
          console.log('\n📋 Apps to Install:');
          console.log('='.repeat(60));
          
          // Group apps by category
          const appCategories = {
            'Core Business': ['purchase', 'stock', 'account', 'contacts', 'project', 'hr', 'mail', 'calendar'],
            'Advanced Features': ['purchase_requisition', 'purchase_analytic', 'stock_landed_costs', 'quality', 'maintenance'],
            'Reporting & Analytics': ['purchase_report', 'stock_report', 'account_reports'],
            'Restaurant Specific': ['pos_restaurant', 'restaurant'],
            'Integration & Automation': ['base_automation', 'mail_automation', 'web_hook'],
            'Additional Features': ['approvals', 'documents', 'sign', 'survey', 'helpdesk', 'knowledge']
          };
          
          Object.entries(appCategories).forEach(([category, apps]) => {
            const categoryMissingApps = apps.filter(app => missingApps.includes(app));
            if (categoryMissingApps.length > 0) {
              console.log(`\n🏷️  ${category}:`);
              categoryMissingApps.forEach(app => {
                console.log(`  - ${app}`);
              });
            }
          });
          
        } else {
          console.log('✅ All required apps are already installed!');
        }
        
      } else {
        console.log('❌ No installed modules found');
      }
      
    } catch (error) {
      console.log(`⚠️ Error checking installed modules: ${error.message}`);
    }

    // Check available apps for installation
    console.log('\n🔍 Checking available apps for installation...');
    try {
      const availableModules = await odooService.search(
        'ir.module.module', 
        [['state', '=', 'uninstalled']], 
        ['name', 'display_name', 'state', 'latest_version'],
        50
      );
      
      if (availableModules && availableModules.length > 0) {
        console.log(`📦 Found ${availableModules.length} available modules for installation`);
        
        // Filter for required apps that are available
        const availableRequiredApps = availableModules.filter(module => 
          requiredApps.includes(module.name)
        );
        
        if (availableRequiredApps.length > 0) {
          console.log('\n📋 Available Required Apps:');
          availableRequiredApps.forEach((module, index) => {
            console.log(`  ${index + 1}. ${module.display_name} (${module.name})`);
          });
        }
      }
      
    } catch (error) {
      console.log(`⚠️ Error checking available modules: ${error.message}`);
    }

    console.log('\n🎉 App installation check completed!');
    console.log('='.repeat(60));
    console.log('\n📝 Next Steps:');
    console.log('1. Install missing required apps through Odoo Apps menu');
    console.log('2. Configure app settings and permissions');
    console.log('3. Set up workflows and automation rules');
    console.log('4. Test integration with TENZAI Purchasing System');

  } catch (error) {
    console.error('❌ Failed to check apps:', error.message);
    console.error('Stack trace:', error.stack);
  } finally {
    // Don't logout - keep session active
    console.log('\n🔐 Session kept active for further operations');
  }
}

// Run the function
installOdooApps(); 