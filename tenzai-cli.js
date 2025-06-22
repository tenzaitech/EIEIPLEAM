#!/usr/bin/env node

/**
 * 🚀 TENZAI CLI - Command Line Interface
 * สำหรับจัดการ TENZAI Purchasing System
 * 
 * Usage:
 * node tenzai-cli.js [command] [options]
 * 
 * Commands:
 * - status: ตรวจสอบสถานะระบบ
 * - test: ทดสอบการเชื่อมต่อ
 * - crud: ทดสอบ CRUD operations
 * - validation: ทดสอบ field validation
 * - performance: ทดสอบ performance
 * - permissions: จัดการสิทธิ์
 * - user-roles: จัดการ user roles
 * - create-groups: สร้าง TENZAI groups
 * - assign-user: กำหนดสิทธิ์ให้ user
 * - full-test: ทดสอบทั้งหมด
 */

const TenzaiMasterToolkit = require('./master-toolkit.js');

async function runCLI() {
  const command = process.argv[2];
  const options = process.argv.slice(3);

  console.log('🚀 TENZAI CLI - Command Line Interface');
  console.log('='.repeat(60));

  if (!command) {
    showHelp();
    return;
  }

  const toolkit = new TenzaiMasterToolkit();

  try {
    switch (command.toLowerCase()) {
      case 'status':
        console.log('🔍 Checking system status...');
        await toolkit.getSystemStatus();
        break;

      case 'test':
        console.log('🧪 Running basic tests...');
        await toolkit.runFullSystemCheck();
        break;

      case 'crud':
        console.log('📦 Testing Advanced CRUD operations...');
        await toolkit.testAdvancedCRUD();
        break;

      case 'validation':
        console.log('🔍 Testing Field Validation...');
        await toolkit.testFieldValidation();
        break;

      case 'performance':
        console.log('📊 Testing Performance...');
        await toolkit.testPerformance();
        break;

      case 'permissions':
        console.log('🔐 Managing Permissions...');
        await toolkit.managePermissions();
        break;

      case 'user-roles':
        console.log('👤 Managing User Roles...');
        await toolkit.manageUserRoles();
        break;

      case 'create-groups':
        console.log('🔒 Creating TENZAI User Groups...');
        await toolkit.createTenzaiUserGroups();
        break;

      case 'assign-user':
        if (options.length < 2) {
          console.log('❌ Usage: assign-user <userId> <groupName>');
          console.log('Example: assign-user 1 "TENZAI Admin"');
          return;
        }
        console.log(`🔐 Assigning user ${options[0]} to ${options[1]}...`);
        await toolkit.assignUserToTenzaiGroup(parseInt(options[0]), options[1]);
        break;

      case 'create-demo-users':
        console.log('👥 Creating TENZAI Demo Users...');
        await toolkit.createTenzaiDemoUsers();
        break;

      case 'setup-tenzai-system':
        console.log('🔐 Setting up Complete TENZAI System...');
        await toolkit.setupCompleteTenzaiSystem();
        break;

      case 'full-test':
        console.log('🚀 Running Full Test Suite...');
        await runFullTestSuite(toolkit);
        break;

      case 'help':
        showHelp();
        break;

      default:
        console.log(`❌ Unknown command: ${command}`);
        showHelp();
        break;
    }

    console.log('\n✅ Command completed successfully!');

  } catch (error) {
    console.error('❌ Command failed:', error.message);
    process.exit(1);
  }
}

async function runFullTestSuite(toolkit) {
  console.log('🧪 TENZAI Full Test Suite');
  console.log('='.repeat(60));

  const results = {};

  // 1. System Status
  console.log('1️⃣ Checking System Status...');
  results.status = await toolkit.getSystemStatus();

  // 2. Advanced CRUD
  console.log('\n2️⃣ Testing Advanced CRUD...');
  results.crud = await toolkit.testAdvancedCRUD();

  // 3. Field Validation
  console.log('\n3️⃣ Testing Field Validation...');
  results.validation = await toolkit.testFieldValidation();

  // 4. Performance
  console.log('\n4️⃣ Testing Performance...');
  results.performance = await toolkit.testPerformance();

  // 5. Permissions
  console.log('\n5️⃣ Testing Permissions...');
  results.permissions = await toolkit.managePermissions();

  // 6. User Roles
  console.log('\n6️⃣ Testing User Roles...');
  results.userRoles = await toolkit.manageUserRoles();

  // 7. Create TENZAI Groups
  console.log('\n7️⃣ Creating TENZAI Groups...');
  results.tenzaiGroups = await toolkit.createTenzaiUserGroups();

  // Print Summary
  console.log('\n📋 Full Test Suite Results');
  console.log('='.repeat(60));
  
  console.log('✅ System Status:', results.status ? 'ONLINE' : 'OFFLINE');
  console.log('✅ Advanced CRUD:', results.crud?.productCRUD ? 'PASSED' : 'FAILED');
  console.log('✅ Field Validation:', results.validation?.requiredFields ? 'PASSED' : 'FAILED');
  console.log('✅ Performance:', results.performance?.summary ? 'PASSED' : 'FAILED');
  console.log('✅ Permissions:', results.permissions?.groups ? 'PASSED' : 'FAILED');
  console.log('✅ User Roles:', results.userRoles?.users ? 'PASSED' : 'FAILED');
  console.log('✅ TENZAI Groups:', results.tenzaiGroups?.length ? 'CREATED' : 'FAILED');

  console.log('\n🎉 Full test suite completed!');
}

function showHelp() {
  console.log('📋 Available Commands:');
  console.log('');
  console.log('🔍 System Commands:');
  console.log('  status          - ตรวจสอบสถานะระบบ');
  console.log('  test            - ทดสอบการเชื่อมต่อพื้นฐาน');
  console.log('  full-test       - ทดสอบทั้งหมด');
  console.log('');
  console.log('🧪 Testing Commands:');
  console.log('  crud            - ทดสอบ Advanced CRUD operations');
  console.log('  validation      - ทดสอบ Field Validation');
  console.log('  performance     - ทดสอบ Performance');
  console.log('');
  console.log('🔐 Permission Commands:');
  console.log('  permissions     - จัดการสิทธิ์และ access rights');
  console.log('  user-roles      - จัดการ user roles');
  console.log('  create-groups   - สร้าง TENZAI user groups');
  console.log('  assign-user     - กำหนดสิทธิ์ให้ user (userId groupName)');
  console.log('');
  console.log('👥 Demo Users:');
  console.log('  create-demo-users - สร้าง user ตัวอย่างทุกแผนก');
  console.log('  setup-tenzai-system - setup ระบบ TENZAI เต็มรูปแบบ');
  console.log('');
  console.log('❓ Help:');
  console.log('  help            - แสดงคำสั่งทั้งหมด');
  console.log('');
  console.log('📝 Examples:');
  console.log('  node tenzai-cli.js status');
  console.log('  node tenzai-cli.js crud');
  console.log('  node tenzai-cli.js assign-user 1 "TENZAI Admin"');
  console.log('  node tenzai-cli.js create-demo-users');
  console.log('  node tenzai-cli.js setup-tenzai-system');
  console.log('  node tenzai-cli.js full-test');
}

// Run CLI if this file is executed directly
if (require.main === module) {
  runCLI().catch(error => {
    console.error('❌ Fatal error:', error.message);
    process.exit(1);
  });
}

module.exports = { runCLI, showHelp }; 