#!/usr/bin/env node

const TenzaiMasterToolkit = require('./master-toolkit');
const readline = require('readline');

/**
 * 🎯 TENZAI Purchasing System - Enhanced CLI Interface
 * อิงจาก Odoo 18.0 Documentation: https://www.odoo.com/documentation/18.0/
 */

class TenzaiCLI {
  constructor() {
    this.toolkit = new TenzaiMasterToolkit();
    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
  }

  // 🎨 Display Banner
  showBanner() {
    console.clear();
    console.log('🎯 TENZAI Purchasing System v2.5');
    console.log('='.repeat(60));
    console.log('📚 Based on Odoo 18.0 Documentation');
    console.log('🔗 https://www.odoo.com/documentation/18.0/');
    console.log('='.repeat(60));
    console.log('');
  }

  // 📋 Show Main Menu
  showMainMenu() {
    console.log('📋 MAIN MENU - Choose an option:');
    console.log('');
    console.log('🔍 SYSTEM MANAGEMENT:');
    console.log('  1. System Status Check');
    console.log('  2. Full System Check');
    console.log('  3. Data Cleanup');
    console.log('');
    console.log('🏢 ORGANIZATION:');
    console.log('  4. Company Management');
    console.log('  5. User Management');
    console.log('  6. Module Management');
    console.log('');
    console.log('🛒 OPERATIONS:');
    console.log('  7. Product Management');
    console.log('  8. Project Management');
    console.log('  9. Finance & Accounting');
    console.log('  10. Sales & CRM');
    console.log('  11. Purchase & Procurement');
    console.log('  12. Manufacturing');
    console.log('');
    console.log('⚙️ TOOLS:');
    console.log('  13. Quick Commands');
    console.log('  14. Help & Documentation');
    console.log('  0. Exit');
    console.log('');
  }

  // 🚀 Run Command
  async runCommand(command) {
    try {
      console.log(`🚀 Executing: ${command}`);
      console.log('='.repeat(60));
      
      const result = await this.toolkit.runCommand(command);
      
      console.log('\n✅ Command completed successfully!');
      return result;
    } catch (error) {
      console.error('❌ Command failed:', error.message);
      return null;
    }
  }

  // 🔧 Quick Commands Menu
  showQuickCommands() {
    console.log('🔧 QUICK COMMANDS:');
    console.log('');
    console.log('📊 Status & Health:');
    console.log('  status          - System status check');
    console.log('  full-check      - Complete system analysis');
    console.log('  cleanup         - Data cleanup & maintenance');
    console.log('');
    console.log('🏢 Organization:');
    console.log('  companies       - Company management');
    console.log('  users           - User management');
    console.log('  modules         - Module management');
    console.log('');
    console.log('🛒 Operations:');
    console.log('  products        - Product management');
    console.log('  projects        - Project management');
    console.log('  finance         - Finance & accounting');
    console.log('  sales           - Sales & CRM');
    console.log('  purchases       - Purchase & procurement');
    console.log('  manufacturing   - Manufacturing');
    console.log('');
    console.log('💡 Usage: node tenzai-cli.js [command]');
    console.log('💡 Example: node tenzai-cli.js status');
    console.log('');
  }

  // 📚 Help & Documentation
  showHelp() {
    console.log('📚 TENZAI Purchasing System - Help & Documentation');
    console.log('='.repeat(60));
    console.log('');
    console.log('🎯 ABOUT:');
    console.log('  TENZAI Purchasing System is a comprehensive ERP solution');
    console.log('  built on Odoo 18.0, designed for restaurant and food service');
    console.log('  businesses with advanced purchasing and inventory management.');
    console.log('');
    console.log('📦 FEATURES:');
    console.log('  • Finance & Accounting Management');
    console.log('  • Sales & CRM Operations');
    console.log('  • Purchase & Procurement Automation');
    console.log('  • Manufacturing & Production Control');
    console.log('  • Project & Task Management');
    console.log('  • Inventory & Product Management');
    console.log('  • Multi-Company Support');
    console.log('  • User & Access Rights Management');
    console.log('');
    console.log('🔗 RESOURCES:');
    console.log('  • Odoo Documentation: https://www.odoo.com/documentation/18.0/');
    console.log('  • TENZAI Roadmap: ROADMAP_RESTAURANT_NATIONAL.md');
    console.log('  • Tools Reference: ALL_1_TOOLS.md');
    console.log('  • Coding Guidelines: prompts/10coding');
    console.log('');
    console.log('🛠️ TECHNICAL:');
    console.log('  • Framework: Odoo 18.0');
    console.log('  • API: JSON-RPC');
    console.log('  • Database: PostgreSQL');
    console.log('  • Authentication: Session-based');
    console.log('');
  }

  // 🎮 Interactive Menu
  async showInteractiveMenu() {
    this.showBanner();
    this.showMainMenu();

    return new Promise((resolve) => {
      this.rl.question('Enter your choice (0-14): ', async (choice) => {
        console.log('');
        
        switch (choice.trim()) {
          case '0':
            console.log('👋 Goodbye! Thank you for using TENZAI Purchasing System.');
            this.rl.close();
            resolve();
            break;
            
          case '1':
            await this.runCommand('status');
            break;
            
          case '2':
            await this.runCommand('full-check');
            break;
            
          case '3':
            await this.runCommand('cleanup');
            break;
            
          case '4':
            await this.runCommand('companies');
            break;
            
          case '5':
            await this.runCommand('users');
            break;
            
          case '6':
            await this.runCommand('modules');
            break;
            
          case '7':
            await this.runCommand('products');
            break;
            
          case '8':
            await this.runCommand('projects');
            break;
            
          case '9':
            await this.runCommand('finance');
            break;
            
          case '10':
            await this.runCommand('sales');
            break;
            
          case '11':
            await this.runCommand('purchases');
            break;
            
          case '12':
            await this.runCommand('manufacturing');
            break;
            
          case '13':
            this.showQuickCommands();
            break;
            
          case '14':
            this.showHelp();
            break;
            
          default:
            console.log('❌ Invalid choice. Please try again.');
            break;
        }
        
        if (choice.trim() !== '0') {
          console.log('\n' + '='.repeat(60));
          this.rl.question('Press Enter to continue...', () => {
            this.showInteractiveMenu().then(resolve);
          });
        }
      });
    });
  }

  // 🚀 Direct Command Execution
  async executeDirectCommand(command) {
    this.showBanner();
    console.log(`🚀 Direct Command Execution: ${command}`);
    console.log('='.repeat(60));
    
    const result = await this.runCommand(command);
    
    if (result) {
      console.log('\n✅ Command executed successfully!');
    } else {
      console.log('\n❌ Command execution failed!');
      process.exit(1);
    }
  }

  // 🎯 Main Entry Point
  async run() {
    const args = process.argv.slice(2);
    
    if (args.length === 0) {
      // Interactive mode
      await this.showInteractiveMenu();
    } else {
      // Direct command mode
      const command = args[0];
      await this.executeDirectCommand(command);
    }
  }
}

// 🚀 Start CLI
if (require.main === module) {
  const cli = new TenzaiCLI();
  cli.run().catch(error => {
    console.error('❌ CLI Error:', error.message);
    process.exit(1);
  });
}

module.exports = TenzaiCLI; 