const MasterToolkit = require('./master-toolkit');

// 🚀 Quick Command Functions
class QuickCommands {
  constructor() {
    this.toolkit = new MasterToolkit();
  }

  // 📊 Quick Status
  async status() {
    console.log('📊 Checking Odoo Status...');
    const status = await this.toolkit.checkStatus();
    console.log('✅ Status:', status);
    return status;
  }

  // 🎯 TENZAI Status
  async tenzai() {
    console.log('🎯 Checking TENZAI Status...');
    const status = await this.toolkit.checkTenzaiStatus();
    console.log('✅ TENZAI Status:', status);
    return status;
  }

  // 📋 Search Projects
  async projects(searchTerm = '') {
    console.log(`📋 Searching projects: ${searchTerm || 'all'}`);
    const result = await this.toolkit.searchProjects(searchTerm);
    console.log('✅ Projects:', result);
    return result;
  }

  // 📝 Search Tasks
  async tasks(searchTerm = '') {
    console.log(`📝 Searching tasks: ${searchTerm || 'all'}`);
    const result = await this.toolkit.searchTasks(searchTerm);
    console.log('✅ Tasks:', result);
    return result;
  }

  // 🔧 Search Modules
  async modules(searchTerm = '', state = 'installed') {
    console.log(`🔧 Searching modules: ${searchTerm || 'all'} (${state})`);
    const result = await this.toolkit.searchModules(searchTerm, state);
    console.log('✅ Modules:', result);
    return result;
  }

  // 📦 Install App
  async install(appName, appId) {
    console.log(`📦 Installing ${appName}...`);
    const result = await this.toolkit.installApp(appName, appId);
    console.log('✅ Install Result:', result);
    return result;
  }

  // ⚡ Execute Method
  async exec(model, method, args = []) {
    console.log(`⚡ Executing ${model}.${method}...`);
    const result = await this.toolkit.executeMethod(model, method, args);
    console.log('✅ Execute Result:', result);
    return result;
  }

  // 🔍 Quick Search
  async search(model, filters = [], fields = [], limit = 100) {
    console.log(`🔍 Searching ${model}...`);
    const result = await this.toolkit.search(model, filters, fields, limit);
    console.log('✅ Search Result:', result);
    return result;
  }

  // 🎯 Full System Check
  async fullCheck() {
    console.log('🎯 Full System Check...');
    console.log('='.repeat(50));
    
    const status = await this.status();
    const tenzaiStatus = await this.tenzai();
    const projects = await this.projects();
    const tasks = await this.tasks();
    
    console.log('='.repeat(50));
    console.log('📊 Summary:');
    console.log(`- Total Modules: ${status.totalModules}`);
    console.log(`- Application Modules: ${status.applicationModules}`);
    console.log(`- TENZAI Progress: ${tenzaiStatus.progress}%`);
    console.log(`- Projects: ${projects.success ? projects.projects.length : 0}`);
    console.log(`- Tasks: ${tasks.success ? tasks.tasks.length : 0}`);
    
    return { status, tenzaiStatus, projects, tasks };
  }

  // 🆕 NEW: Project Management Functions

  // 📊 Get Project Stages
  async projectStages() {
    console.log('📊 Getting project stages...');
    const result = await this.toolkit.search(
      'project.task.type',
      [],
      ['name', 'sequence', 'description', 'fold'],
      50
    );
    console.log('✅ Project Stages:', result);
    return result;
  }

  // 👥 Get Project Users
  async projectUsers() {
    console.log('👥 Getting project users...');
    const result = await this.toolkit.search(
      'res.users',
      [['active', '=', true]],
      ['name', 'login', 'email', 'groups_id'],
      50
    );
    console.log('✅ Project Users:', result);
    return result;
  }

  // 📈 Get Project Analytics
  async projectAnalytics() {
    console.log('📈 Getting project analytics...');
    
    // Get all projects
    const projects = await this.toolkit.searchProjects();
    if (!projects.success) return projects;

    // Get all tasks
    const tasks = await this.toolkit.searchTasks();
    if (!tasks.success) return tasks;

    // Get stages
    const stages = await this.projectStages();
    if (!stages.success) return stages;

    const analytics = {
      totalProjects: projects.projects.length,
      totalTasks: tasks.tasks.length,
      totalStages: stages.result.length,
      projects: projects.projects.map(p => ({
        id: p.id,
        name: p.name,
        tasks: tasks.tasks.filter(t => t.project_id && t.project_id[0] === p.id).length
      })),
      stages: stages.result.map(s => ({
        id: s.id,
        name: s.name,
        tasks: tasks.tasks.filter(t => t.stage_id && t.stage_id[0] === s.id).length
      }))
    };

    console.log('✅ Project Analytics:', analytics);
    return { success: true, analytics };
  }

  // 🔄 Get Project Workflow
  async projectWorkflow() {
    console.log('🔄 Getting project workflow...');
    
    const stages = await this.projectStages();
    if (!stages.success) return stages;

    const workflow = {
      stages: stages.result.map(s => ({
        id: s.id,
        name: s.name,
        sequence: s.sequence,
        fold: s.fold,
        description: s.description
      })).sort((a, b) => a.sequence - b.sequence)
    };

    console.log('✅ Project Workflow:', workflow);
    return { success: true, workflow };
  }

  // 📋 Get Project Tasks by Stage
  async tasksByStage(stageId = null) {
    console.log(`📋 Getting tasks by stage: ${stageId || 'all'}`);
    
    const filters = stageId ? [['stage_id', '=', parseInt(stageId)]] : [];
    const result = await this.toolkit.search(
      'project.task',
      filters,
      ['name', 'project_id', 'stage_id', 'priority', 'date_deadline', 'assignee_ids'],
      100
    );
    
    console.log('✅ Tasks by Stage:', result);
    return result;
  }

  // 🎯 Get Project Dashboard
  async projectDashboard() {
    console.log('🎯 Getting project dashboard...');
    
    const analytics = await this.projectAnalytics();
    const workflow = await this.projectWorkflow();
    const recentTasks = await this.toolkit.search(
      'project.task',
      [],
      ['name', 'project_id', 'stage_id', 'priority', 'date_deadline'],
      10
    );

    const dashboard = {
      analytics: analytics.success ? analytics.analytics : null,
      workflow: workflow.success ? workflow.workflow : null,
      recentTasks: recentTasks.success ? recentTasks.result : null,
      summary: {
        totalProjects: analytics.success ? analytics.analytics.totalProjects : 0,
        totalTasks: analytics.success ? analytics.analytics.totalTasks : 0,
        totalStages: analytics.success ? analytics.analytics.totalStages : 0,
        recentTaskCount: recentTasks.success ? recentTasks.result.length : 0
      }
    };

    console.log('✅ Project Dashboard:', dashboard);
    return { success: true, dashboard };
  }

  // 🔧 Get System Configuration
  async systemConfig() {
    console.log('🔧 Getting system configuration...');
    
    const config = await this.toolkit.search(
      'ir.config_parameter',
      [],
      ['key', 'value'],
      100
    );

    console.log('✅ System Configuration:', config);
    return config;
  }

  // 📊 Get User Permissions
  async userPermissions() {
    console.log('📊 Getting user permissions...');
    
    const users = await this.projectUsers();
    if (!users.success) return users;

    const permissions = await this.toolkit.search(
      'res.groups',
      [],
      ['name', 'category_id', 'users'],
      100
    );

    const userPerms = users.result.map(user => ({
      id: user.id,
      name: user.name,
      login: user.login,
      groups: user.groups_id || []
    }));

    console.log('✅ User Permissions:', { users: userPerms, groups: permissions.result });
    return { success: true, users: userPerms, groups: permissions.result };
  }

  // Supabase Commands
  async supabaseStatus() {
    await this.toolkit.initializeSupabase();
  }
  
  async supabaseTest() {
    await this.toolkit.testSupabaseOperations();
  }
  
  async supabaseAnalytics() {
    await this.toolkit.getSupabaseAnalytics();
  }
  
  async supabaseSync() {
    await this.toolkit.syncFromOdoo();
  }
  
  async supabaseProducts() {
    const products = await this.toolkit.getSupabaseProducts();
    if (products.success) {
      console.log(`📦 Found ${products.data.length} products in Supabase`);
      products.data.slice(0, 10).forEach(product => {
        console.log(`   - ${product.name}: $${product.list_price}`);
      });
    } else {
      console.log('❌ Failed to get products:', products.error);
    }
  }
  
  async supabaseSuppliers() {
    const suppliers = await this.toolkit.getSupabaseSuppliers();
    if (suppliers.success) {
      console.log(`👥 Found ${suppliers.data.length} suppliers in Supabase`);
      suppliers.data.slice(0, 10).forEach(supplier => {
        console.log(`   - ${supplier.name}: ${supplier.email}`);
      });
    } else {
      console.log('❌ Failed to get suppliers:', suppliers.error);
    }
  }
  
  async supabaseSearch(table, filters, fields, limit) {
    if (params.length < 2) {
      console.log('Usage: node quick-commands.js supabase-search <table> <filters> [fields] [limit]');
      return;
    }
    
    const result = await this.toolkit.searchSupabase(table, filters, fields, limit);
    if (result.success) {
      console.log(`🔍 Found ${result.data.length} records in ${table}`);
      console.log(JSON.stringify(result.data, null, 2));
    } else {
      console.log('❌ Search failed:', result.error);
    }
  }
}

// Export for use
module.exports = QuickCommands;

// Command line interface
if (require.main === module) {
  const commands = new QuickCommands();
  const args = process.argv.slice(2);
  const command = args[0];
  const params = args.slice(1);

  async function runCommand() {
    switch (command) {
      case 'status':
        await commands.status();
        break;
      case 'tenzai':
        await commands.tenzai();
        break;
      case 'projects':
        await commands.projects(params[0]);
        break;
      case 'tasks':
        await commands.tasks(params[0]);
        break;
      case 'modules':
        await commands.modules(params[0], params[1]);
        break;
      case 'install':
        await commands.install(params[0], parseInt(params[1]));
        break;
      case 'exec':
        await commands.exec(params[0], params[1], params.slice(2));
        break;
      case 'search':
        // Fixed JSON parsing issue
        let filters = [];
        let fields = [];
        let limit = 100;
        
        if (params[1]) {
          try {
            filters = JSON.parse(params[1]);
          } catch (e) {
            console.log('⚠️ Invalid filters JSON, using empty array');
          }
        }
        
        if (params[2]) {
          try {
            fields = JSON.parse(params[2]);
          } catch (e) {
            console.log('⚠️ Invalid fields JSON, using empty array');
          }
        }
        
        if (params[3]) {
          limit = parseInt(params[3]) || 100;
        }
        
        await commands.search(params[0], filters, fields, limit);
        break;
      case 'full':
        await commands.fullCheck();
        break;
      // 🆕 NEW: Project Management Commands
      case 'stages':
        await commands.projectStages();
        break;
      case 'users':
        await commands.projectUsers();
        break;
      case 'analytics':
        await commands.projectAnalytics();
        break;
      case 'workflow':
        await commands.projectWorkflow();
        break;
      case 'tasks-stage':
        await commands.tasksByStage(params[0]);
        break;
      case 'dashboard':
        await commands.projectDashboard();
        break;
      case 'config':
        await commands.systemConfig();
        break;
      case 'permissions':
        await commands.userPermissions();
        break;
      case 'supabase-status':
        await commands.supabaseStatus();
        break;
      case 'supabase-test':
        await commands.supabaseTest();
        break;
      case 'supabase-analytics':
        await commands.supabaseAnalytics();
        break;
      case 'supabase-sync':
        await commands.supabaseSync();
        break;
      case 'supabase-products':
        await commands.supabaseProducts();
        break;
      case 'supabase-suppliers':
        await commands.supabaseSuppliers();
        break;
      case 'supabase-search':
        await commands.supabaseSearch(params[0], params[1], params[2], params[3]);
        break;
      default:
        console.log('🚀 Quick Commands Usage:');
        console.log('='.repeat(50));
        console.log('📊 Basic Commands:');
        console.log('  node quick-commands.js status');
        console.log('  node quick-commands.js tenzai');
        console.log('  node quick-commands.js projects [searchTerm]');
        console.log('  node quick-commands.js tasks [searchTerm]');
        console.log('  node quick-commands.js modules [searchTerm] [state]');
        console.log('  node quick-commands.js install [appName] [appId]');
        console.log('  node quick-commands.js exec [model] [method] [args...]');
        console.log('  node quick-commands.js search [model] [filters] [fields] [limit]');
        console.log('  node quick-commands.js full');
        console.log('');
        console.log('🎯 Project Management:');
        console.log('  node quick-commands.js stages');
        console.log('  node quick-commands.js users');
        console.log('  node quick-commands.js analytics');
        console.log('  node quick-commands.js workflow');
        console.log('  node quick-commands.js tasks-stage [stageId]');
        console.log('  node quick-commands.js dashboard');
        console.log('  node quick-commands.js config');
        console.log('  node quick-commands.js permissions');
        console.log('🎯 Supabase Commands:');
        console.log('  node quick-commands.js supabase-status');
        console.log('  node quick-commands.js supabase-test');
        console.log('  node quick-commands.js supabase-analytics');
        console.log('  node quick-commands.js supabase-sync');
        console.log('  node quick-commands.js supabase-products');
        console.log('  node quick-commands.js supabase-suppliers');
        console.log('  node quick-commands.js supabase-search <table> <filters> [fields] [limit]');
    }
  }

  runCommand().catch(console.error);
} 