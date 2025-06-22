const OdooService = require('./src/services/odoo.service');

class OdooToolkit {
  constructor() {
    this.odooService = new OdooService();
    this.isAuthenticated = false;
  }

  // 🔐 Authentication
  async authenticate() {
    try {
      const result = await this.odooService.authenticate();
      this.isAuthenticated = result.success;
      return result;
    } catch (error) {
      console.error('❌ Authentication failed:', error.message);
      return { success: false, error: error.message };
    }
  }

  // 📦 Quick App Installation
  async installApp(appName, appId) {
    if (!this.isAuthenticated) {
      await this.authenticate();
    }
    
    try {
      console.log(`📦 Installing ${appName}...`);
      const result = await this.odooService.executeMethod(
        'ir.module.module',
        'button_immediate_install',
        [[appId]]
      );
      console.log(`✅ ${appName} installed successfully!`);
      return { success: true, result };
    } catch (error) {
      console.log(`❌ Failed to install ${appName}: ${error.message}`);
      return { success: false, error: error.message };
    }
  }

  // 🔍 Quick Status Check
  async checkStatus() {
    if (!this.isAuthenticated) {
      await this.authenticate();
    }

    try {
      const installedModules = await this.odooService.search(
        'ir.module.module', 
        [['state', '=', 'installed']], 
        ['name', 'display_name', 'state'],
        500
      );

      const applicationModules = installedModules.filter(m => m.application === true);
      
      return {
        totalModules: installedModules.length,
        applicationModules: applicationModules.length,
        installedApps: applicationModules.map(m => ({ name: m.name, displayName: m.display_name }))
      };
    } catch (error) {
      return { error: error.message };
    }
  }

  // 🎯 TENZAI Status Check
  async checkTenzaiStatus() {
    const status = await this.checkStatus();
    if (status.error) return status;

    const tenzaiApps = [
      'purchase', 'account', 'contacts', 'pos_restaurant', 'purchase_requisition_sale', 
      'purchase_requisition_stock', 'quality', 'maintenance', 'approvals', 'documents', 
      'helpdesk', 'crm', 'mrp', 'marketing_automation', 'social', 'fleet', 'iot', 'voip', 'whatsapp'
    ];

    const installedAppNames = status.installedApps.map(app => app.name);
    const installedTenzaiApps = tenzaiApps.filter(app => 
      installedAppNames.includes(app) || 
      installedAppNames.includes('purchase_requisition_sale') ||
      installedAppNames.includes('purchase_requisition_stock')
    );

    return {
      totalRequired: tenzaiApps.length,
      installed: installedTenzaiApps.length,
      missing: tenzaiApps.length - installedTenzaiApps.length,
      progress: Math.round((installedTenzaiApps.length / tenzaiApps.length) * 100),
      installedApps: installedTenzaiApps,
      missingApps: tenzaiApps.filter(app => !installedAppNames.includes(app))
    };
  }

  // 🚀 Quick Project Search
  async searchProjects(searchTerm = '') {
    if (!this.isAuthenticated) {
      await this.authenticate();
    }

    try {
      const filters = searchTerm ? [['name', 'ilike', searchTerm]] : [];
      const projects = await this.odooService.search(
        'project.project',
        filters,
        ['name', 'partner_id', 'user_id', 'date_start', 'date', 'stage_id', 'privacy_visibility', 'alias_name', 'description'],
        50
      );
      return { success: true, projects };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // 📋 Quick Task Search
  async searchTasks(searchTerm = '') {
    if (!this.isAuthenticated) {
      await this.authenticate();
    }

    try {
      const filters = searchTerm ? [['name', 'ilike', searchTerm]] : [];
      const tasks = await this.odooService.search(
        'project.task',
        filters,
        ['name', 'project_id', 'assignee_ids', 'stage_id', 'priority', 'date_deadline', 'create_date', 'write_date'],
        50
      );
      return { success: true, tasks };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // 🔧 Quick Module Search
  async searchModules(searchTerm = '', state = 'installed') {
    if (!this.isAuthenticated) {
      await this.authenticate();
    }

    try {
      const filters = [['state', '=', state]];
      if (searchTerm) {
        filters.push(['name', 'ilike', searchTerm]);
      }
      
      const modules = await this.odooService.search(
        'ir.module.module',
        filters,
        ['name', 'display_name', 'state', 'application'],
        100
      );
      return { success: true, modules };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // ⚡ Quick Execute Method
  async executeMethod(model, method, args = []) {
    if (!this.isAuthenticated) {
      await this.authenticate();
    }

    try {
      const result = await this.odooService.executeMethod(model, method, args);
      return { success: true, result };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // 📊 Quick Search
  async search(model, filters = [], fields = [], limit = 100) {
    if (!this.isAuthenticated) {
      await this.authenticate();
    }

    try {
      const result = await this.odooService.search(model, filters, fields, limit);
      return { success: true, result };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // 🆕 NEW: Advanced Project Management Functions

  // 📊 Get Project Stages
  async getProjectStages() {
    if (!this.isAuthenticated) {
      await this.authenticate();
    }

    try {
      const stages = await this.odooService.search(
        'project.task.type',
        [],
        ['name', 'sequence', 'description', 'fold', 'mail_template_id'],
        50
      );
      return { success: true, stages };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // 👥 Get Project Users
  async getProjectUsers() {
    if (!this.isAuthenticated) {
      await this.authenticate();
    }

    try {
      const users = await this.odooService.search(
        'res.users',
        [['active', '=', true]],
        ['name', 'login', 'email', 'groups_id', 'signature'],
        50
      );
      return { success: true, users };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // 📈 Get Project Analytics
  async getProjectAnalytics() {
    if (!this.isAuthenticated) {
      await this.authenticate();
    }

    try {
      // Get all projects
      const projects = await this.searchProjects();
      if (!projects.success) return projects;

      // Get all tasks
      const tasks = await this.searchTasks();
      if (!tasks.success) return tasks;

      // Get stages
      const stages = await this.getProjectStages();
      if (!stages.success) return stages;

      // Calculate analytics
      const analytics = {
        totalProjects: projects.projects.length,
        totalTasks: tasks.tasks.length,
        totalStages: stages.stages.length,
        projects: projects.projects.map(p => ({
          id: p.id,
          name: p.name,
          tasks: tasks.tasks.filter(t => t.project_id && t.project_id[0] === p.id).length,
          partner: p.partner_id ? p.partner_id[1] : null,
          user: p.user_id ? p.user_id[1] : null
        })),
        stages: stages.stages.map(s => ({
          id: s.id,
          name: s.name,
          sequence: s.sequence,
          tasks: tasks.tasks.filter(t => t.stage_id && t.stage_id[0] === s.id).length,
          fold: s.fold
        })),
        taskPriorities: {
          '0': tasks.tasks.filter(t => t.priority === '0').length,
          '1': tasks.tasks.filter(t => t.priority === '1').length,
          '2': tasks.tasks.filter(t => t.priority === '2').length,
          '3': tasks.tasks.filter(t => t.priority === '3').length,
          '4': tasks.tasks.filter(t => t.priority === '4').length
        }
      };

      return { success: true, analytics };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // 🔄 Get Project Workflow
  async getProjectWorkflow() {
    if (!this.isAuthenticated) {
      await this.authenticate();
    }

    try {
      const stages = await this.getProjectStages();
      if (!stages.success) return stages;

      const workflow = {
        stages: stages.stages.map(s => ({
          id: s.id,
          name: s.name,
          sequence: s.sequence,
          fold: s.fold,
          description: s.description,
          mailTemplate: s.mail_template_id ? s.mail_template_id[1] : null
        })).sort((a, b) => a.sequence - b.sequence)
      };

      return { success: true, workflow };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // 📋 Get Tasks by Stage
  async getTasksByStage(stageId = null) {
    if (!this.isAuthenticated) {
      await this.authenticate();
    }

    try {
      const filters = stageId ? [['stage_id', '=', parseInt(stageId)]] : [];
      const tasks = await this.odooService.search(
        'project.task',
        filters,
        ['name', 'project_id', 'stage_id', 'priority', 'date_deadline', 'assignee_ids', 'create_date', 'write_date'],
        100
      );
      return { success: true, tasks };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // 🎯 Get Project Dashboard
  async getProjectDashboard() {
    if (!this.isAuthenticated) {
      await this.authenticate();
    }

    try {
      const analytics = await this.getProjectAnalytics();
      const workflow = await this.getProjectWorkflow();
      const recentTasks = await this.odooService.search(
        'project.task',
        [],
        ['name', 'project_id', 'stage_id', 'priority', 'date_deadline', 'create_date'],
        10
      );

      const dashboard = {
        analytics: analytics.success ? analytics.analytics : null,
        workflow: workflow.success ? workflow.workflow : null,
        recentTasks: recentTasks,
        summary: {
          totalProjects: analytics.success ? analytics.analytics.totalProjects : 0,
          totalTasks: analytics.success ? analytics.analytics.totalTasks : 0,
          totalStages: analytics.success ? analytics.analytics.totalStages : 0,
          recentTaskCount: recentTasks.length
        }
      };

      return { success: true, dashboard };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // 🔧 Get System Configuration
  async getSystemConfig() {
    if (!this.isAuthenticated) {
      await this.authenticate();
    }

    try {
      const config = await this.odooService.search(
        'ir.config_parameter',
        [],
        ['key', 'value'],
        100
      );
      return { success: true, config };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // 📊 Get User Permissions
  async getUserPermissions() {
    if (!this.isAuthenticated) {
      await this.authenticate();
    }

    try {
      const users = await this.getProjectUsers();
      if (!users.success) return users;

      const groups = await this.odooService.search(
        'res.groups',
        [],
        ['name', 'category_id', 'users'],
        100
      );

      const userPerms = users.users.map(user => ({
        id: user.id,
        name: user.name,
        login: user.login,
        email: user.email,
        groups: user.groups_id || []
      }));

      return { success: true, users: userPerms, groups };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // 🆕 NEW: Task Management Functions

  // ➕ Create Task
  async createTask(taskData) {
    if (!this.isAuthenticated) {
      await this.authenticate();
    }

    try {
      const taskId = await this.odooService.create('project.task', taskData);
      return { success: true, taskId };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // ✏️ Update Task
  async updateTask(taskId, taskData) {
    if (!this.isAuthenticated) {
      await this.authenticate();
    }

    try {
      const result = await this.odooService.update('project.task', taskId, taskData);
      return { success: true, result };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // 🗑️ Delete Task
  async deleteTask(taskId) {
    if (!this.isAuthenticated) {
      await this.authenticate();
    }

    try {
      const result = await this.odooService.delete('project.task', taskId);
      return { success: true, result };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // 🆕 NEW: Project Management Functions

  // ➕ Create Project
  async createProject(projectData) {
    if (!this.isAuthenticated) {
      await this.authenticate();
    }

    try {
      const projectId = await this.odooService.create('project.project', projectData);
      return { success: true, projectId };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // ✏️ Update Project
  async updateProject(projectId, projectData) {
    if (!this.isAuthenticated) {
      await this.authenticate();
    }

    try {
      const result = await this.odooService.update('project.project', projectId, projectData);
      return { success: true, result };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // 🗑️ Delete Project
  async deleteProject(projectId) {
    if (!this.isAuthenticated) {
      await this.authenticate();
    }

    try {
      const result = await this.odooService.delete('project.project', projectId);
      return { success: true, result };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // 🎯 TENZAI Quick Actions
  async tenzaiQuickActions() {
    console.log('🎯 TENZAI Purchasing System Quick Actions:');
    console.log('='.repeat(50));
    console.log('1. Check system status');
    console.log('2. Search projects');
    console.log('3. Search tasks');
    console.log('4. Install missing apps');
    console.log('5. Search modules');
    console.log('6. Execute custom method');
    console.log('7. Quick search');
    console.log('8. Project analytics');
    console.log('9. Project workflow');
    console.log('10. Project dashboard');
  }
}

// Export the toolkit
module.exports = OdooToolkit;

// Quick usage examples
if (require.main === module) {
  const toolkit = new OdooToolkit();
  
  async function quickDemo() {
    console.log('🚀 Odoo Toolkit Demo');
    console.log('='.repeat(50));
    
    // Check status
    const status = await toolkit.checkStatus();
    console.log('📊 System Status:', status);
    
    // Check TENZAI status
    const tenzaiStatus = await toolkit.checkTenzaiStatus();
    console.log('🎯 TENZAI Status:', tenzaiStatus);
    
    // Search projects
    const projects = await toolkit.searchProjects('test');
    console.log('📋 Projects:', projects);
    
    // Get project analytics
    const analytics = await toolkit.getProjectAnalytics();
    console.log('📈 Analytics:', analytics);
  }
  
  quickDemo().catch(console.error);
} 