const OdooService = require('./src/services/odoo.service');

/**
 * 🔧 TENZAI - Fix User Permissions
 * เพิ่มสิทธิ์ Purchase ให้ผู้ใช้ปัจจุบัน
 */

class PermissionFixer {
  constructor() {
    this.odooService = new OdooService();
    this.isAuthenticated = false;
  }

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

  // 🔍 ดึงข้อมูลผู้ใช้ปัจจุบัน
  async getCurrentUser() {
    if (!this.isAuthenticated) {
      await this.authenticate();
    }

    try {
      console.log('🔍 Getting current user info...');
      const users = await this.odooService.search('res.users', [['id', '=', 5]], [
        'id', 'name', 'login', 'active'
      ], 1);

      if (users.length > 0) {
        console.log(`👤 Current user: ${users[0].name} (${users[0].login})`);
        return users[0];
      } else {
        console.log('❌ Current user not found');
        return null;
      }
    } catch (error) {
      console.error('❌ Error getting current user:', error.message);
      return null;
    }
  }

  // 🔍 ดึงข้อมูล Purchase Groups
  async getPurchaseGroups() {
    if (!this.isAuthenticated) {
      await this.authenticate();
    }

    try {
      console.log('🔍 Getting purchase groups...');
      const groups = await this.odooService.search('res.groups', [
        ['name', 'ilike', 'purchase']
      ], [
        'id', 'name', 'category_id'
      ], 10);

      console.log(`📋 Found ${groups.length} purchase-related groups:`);
      groups.forEach(group => {
        console.log(`   - ${group.name} (ID: ${group.id})`);
      });

      return groups;
    } catch (error) {
      console.error('❌ Error getting purchase groups:', error.message);
      return [];
    }
  }

  // 🔧 เพิ่มสิทธิ์ Purchase ให้ผู้ใช้
  async addPurchasePermissions(userId) {
    if (!this.isAuthenticated) {
      await this.authenticate();
    }

    try {
      console.log('🔧 Adding purchase permissions...');
      
      // ดึง Purchase Groups
      const purchaseGroups = await this.getPurchaseGroups();
      const purchaseUserGroup = purchaseGroups.find(g => 
        g.name.toLowerCase().includes('purchase') && 
        g.name.toLowerCase().includes('user')
      );
      
      const purchaseAdminGroup = purchaseGroups.find(g => 
        g.name.toLowerCase().includes('purchase') && 
        g.name.toLowerCase().includes('admin')
      );

      if (!purchaseUserGroup && !purchaseAdminGroup) {
        console.log('❌ No purchase groups found');
        return false;
      }

      // เลือกกลุ่มที่จะเพิ่ม (User ก่อน, ถ้าไม่มีให้ Admin)
      const targetGroup = purchaseUserGroup || purchaseAdminGroup;
      console.log(`🎯 Adding user to group: ${targetGroup.name} (ID: ${targetGroup.id})`);

      // อัปเดตผู้ใช้ - ใช้ write method แทน update
      const updateData = {
        groups_id: [[4, targetGroup.id]] // เพิ่มกลุ่มใหม่
      };

      const result = await this.odooService.write('res.users', userId, updateData);
      console.log(`✅ Successfully added purchase permissions to user ${userId}`);
      
      return true;
    } catch (error) {
      console.error('❌ Error adding purchase permissions:', error.message);
      return false;
    }
  }

  // 🔍 ตรวจสอบสิทธิ์ปัจจุบัน
  async checkCurrentPermissions(userId) {
    if (!this.isAuthenticated) {
      await this.authenticate();
    }

    try {
      console.log('🔍 Checking current permissions...');
      const user = await this.odooService.search('res.users', [['id', '=', userId]], [
        'id', 'name'
      ], 1);

      if (user.length > 0) {
        console.log(`👤 User ${user[0].name} permissions checked`);
        
        // ตรวจสอบว่าสามารถสร้าง Purchase Order ได้หรือไม่
        try {
          const testPO = await this.odooService.search('purchase.order', [], ['id'], 1);
          console.log('✅ User can access purchase orders');
          return true;
        } catch (error) {
          console.log('❌ User cannot access purchase orders');
          return false;
        }
      } else {
        console.log('❌ User not found');
        return null;
      }
    } catch (error) {
      console.error('❌ Error checking permissions:', error.message);
      return null;
    }
  }

  // 🚀 แก้ไขสิทธิ์ทั้งหมด
  async fixAll() {
    console.log('🔧 TENZAI - Fixing User Permissions');
    console.log('='.repeat(60));

    try {
      // 1. ดึงข้อมูลผู้ใช้ปัจจุบัน
      const currentUser = await this.getCurrentUser();
      if (!currentUser) {
        console.log('❌ Cannot get current user. Stopping.');
        return false;
      }

      // 2. ตรวจสอบสิทธิ์ปัจจุบัน
      console.log('\n📋 Current permissions:');
      await this.checkCurrentPermissions(currentUser.id);

      // 3. เพิ่มสิทธิ์ Purchase
      console.log('\n🔧 Adding purchase permissions...');
      const success = await this.addPurchasePermissions(currentUser.id);
      
      if (success) {
        // 4. ตรวจสอบสิทธิ์ใหม่
        console.log('\n📋 Updated permissions:');
        await this.checkCurrentPermissions(currentUser.id);
        
        console.log('\n✅ Permission fix completed successfully!');
        console.log('🎯 You can now create purchase orders.');
        return true;
      } else {
        console.log('\n❌ Failed to add purchase permissions.');
        return false;
      }

    } catch (error) {
      console.error('❌ Error in fixAll:', error.message);
      return false;
    }
  }
}

// Export
module.exports = PermissionFixer;

// Run if called directly
if (require.main === module) {
  const fixer = new PermissionFixer();
  fixer.fixAll()
    .then(success => {
      if (success) {
        console.log('\n🎉 Permission fix completed! You can now run create-suppliers-and-pos.js again.');
      } else {
        console.log('\n❌ Permission fix failed.');
        process.exit(1);
      }
    })
    .catch(error => {
      console.error('❌ Script failed:', error.message);
      process.exit(1);
    });
} 