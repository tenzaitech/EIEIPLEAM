# 🚀 Odoo Toolkit - All-in-One Tool

เครื่องมือ All-in-One สำหรับการทำงานกับ Odoo และ TENZAI Purchasing System

ฉาย monitorการเก็บของ ครัวกลางเป็น 3D

## 📁 ไฟล์หลัก

### 1. `odoo-toolkit.js` - เครื่องมือหลัก
- **OdooToolkit Class** - คลาสหลักสำหรับการทำงาน
- **Authentication** - การยืนยันตัวตนอัตโนมัติ
- **Quick Methods** - ฟังก์ชันด่วนต่างๆ
- **Project Management** - จัดการโปรเจคและทาสก์
- **Analytics** - วิเคราะห์ข้อมูลและรายงาน

### 2. `quick-commands.js` - คำสั่งด่วน
- **Command Line Interface** - ใช้งานผ่าน terminal
- **Quick Functions** - ฟังก์ชันสำเร็จรูป
- **Project Management** - จัดการโปรเจค
- **Advanced Search** - ค้นหาข้อมูลขั้นสูง

### 3. `ODOO_PROJECT_ANALYSIS.md` - การวิเคราะห์
- **System Analysis** - วิเคราะห์ระบบ
- **Workflow** - การทำงานของระบบ
- **Performance** - ประสิทธิภาพ
- **Recommendations** - ข้อเสนอแนะ

## 🚀 วิธีการใช้งาน

### 1. ใช้งานผ่าน Code
```javascript
const OdooToolkit = require('./odoo-toolkit');

const toolkit = new OdooToolkit();

// ตรวจสอบสถานะ
const status = await toolkit.checkStatus();
console.log(status);

// ตรวจสอบ TENZAI
const tenzaiStatus = await toolkit.checkTenzaiStatus();
console.log(tenzaiStatus);

// ค้นหาโปรเจค
const projects = await toolkit.searchProjects('test');
console.log(projects);

// ดู analytics
const analytics = await toolkit.getProjectAnalytics();
console.log(analytics);

// ดู dashboard
const dashboard = await toolkit.getProjectDashboard();
console.log(dashboard);
```

### 2. ใช้งานผ่าน Command Line

#### 📊 ตรวจสอบสถานะ
```bash
node quick-commands.js status
node quick-commands.js tenzai
node quick-commands.js full
```

#### 📋 ค้นหาโปรเจค
```bash
node quick-commands.js projects
node quick-commands.js projects "test"
```

#### 📝 ค้นหาทาสก์
```bash
node quick-commands.js tasks
node quick-commands.js tasks "urgent"
```

#### 🔧 ค้นหาโมดูล
```bash
node quick-commands.js modules
node quick-commands.js modules "purchase" "installed"
node quick-commands.js modules "" "uninstalled"
```

#### 📦 ติดตั้งแอป
```bash
node quick-commands.js install "App Name" 123
```

#### ⚡ เรียกใช้เมธอด
```bash
node quick-commands.js exec "ir.module.module" "button_immediate_install" "[[123]]"
```

#### 🔍 ค้นหาข้อมูล
```bash
node quick-commands.js search "project.project" "[]" "['name','date']" 50
```

#### 🎯 Project Management (NEW!)
```bash
node quick-commands.js stages          # ดู stages
node quick-commands.js users           # ดู users
node quick-commands.js analytics       # ดู analytics
node quick-commands.js workflow        # ดู workflow
node quick-commands.js dashboard       # ดู dashboard
node quick-commands.js config          # ดู config
node quick-commands.js permissions     # ดู permissions
node quick-commands.js tasks-stage 1   # ดู tasks ใน stage
```

## 🔧 ฟังก์ชันหลัก

### OdooToolkit Class

#### 🔐 Authentication
```javascript
await toolkit.authenticate()
```

#### 📦 Install App
```javascript
await toolkit.installApp("App Name", appId)
```

#### 🔍 Check Status
```javascript
await toolkit.checkStatus()
```

#### 🎯 Check TENZAI Status
```javascript
await toolkit.checkTenzaiStatus()
```

#### 🚀 Search Projects
```javascript
await toolkit.searchProjects(searchTerm)
```

#### 📋 Search Tasks
```javascript
await toolkit.searchTasks(searchTerm)
```

#### 🔧 Search Modules
```javascript
await toolkit.searchModules(searchTerm, state)
```

#### ⚡ Execute Method
```javascript
await toolkit.executeMethod(model, method, args)
```

#### 📊 Search
```javascript
await toolkit.search(model, filters, fields, limit)
```

### 🆕 NEW: Advanced Project Management

#### 📊 Get Project Analytics
```javascript
await toolkit.getProjectAnalytics()
```

#### 🔄 Get Project Workflow
```javascript
await toolkit.getProjectWorkflow()
```

#### 📋 Get Tasks by Stage
```javascript
await toolkit.getTasksByStage(stageId)
```

#### 🎯 Get Project Dashboard
```javascript
await toolkit.getProjectDashboard()
```

#### 🔧 Get System Configuration
```javascript
await toolkit.getSystemConfig()
```

#### 📊 Get User Permissions
```javascript
await toolkit.getUserPermissions()
```

### 🆕 NEW: Task Management

#### ➕ Create Task
```javascript
await toolkit.createTask(taskData)
```

#### ✏️ Update Task
```javascript
await toolkit.updateTask(taskId, taskData)
```

#### 🗑️ Delete Task
```javascript
await toolkit.deleteTask(taskId)
```

### 🆕 NEW: Project Management

#### ➕ Create Project
```javascript
await toolkit.createProject(projectData)
```

#### ✏️ Update Project
```javascript
await toolkit.updateProject(projectId, projectData)
```

#### 🗑️ Delete Project
```javascript
await toolkit.deleteProject(projectId)
```

## 🎯 ตัวอย่างการใช้งาน

### 1. ตรวจสอบระบบ
```bash
node quick-commands.js full
```

### 2. ติดตั้งแอปที่ขาด
```bash
# ค้นหาโมดูลที่ยังไม่ได้ติดตั้ง
node quick-commands.js modules "" "uninstalled"

# ติดตั้งโมดูล
node quick-commands.js install "Module Name" 123
```

### 3. ค้นหาข้อมูล
```bash
# ค้นหาโปรเจค
node quick-commands.js projects "TENZAI"

# ค้นหาทาสก์
node quick-commands.js tasks "urgent"

# ค้นหาโมดูล
node quick-commands.js modules "purchase"
```

### 4. เรียกใช้ API
```bash
# เรียกใช้เมธอด
node quick-commands.js exec "ir.module.module" "button_immediate_install" "[[123]]"

# ค้นหาข้อมูล
node quick-commands.js search "res.partner" "[['is_company','=',true]]" "['name','email']" 10
```

### 5. 🆕 Project Management
```bash
# ดู analytics
node quick-commands.js analytics

# ดู workflow
node quick-commands.js workflow

# ดู dashboard
node quick-commands.js dashboard

# ดู tasks ใน stage
node quick-commands.js tasks-stage 1

# ดู permissions
node quick-commands.js permissions
```

## ⚡ ข้อดีของ Toolkit

### ✅ ความเร็ว
- **Auto Authentication** - ยืนยันตัวตนอัตโนมัติ
- **Quick Methods** - ฟังก์ชันสำเร็จรูป
- **Command Line** - ใช้งานผ่าน terminal ได้ทันที
- **Caching** - เก็บข้อมูลในหน่วยความจำ

### ✅ ความง่าย
- **One-liner Commands** - คำสั่งบรรทัดเดียว
- **Auto Error Handling** - จัดการข้อผิดพลาดอัตโนมัติ
- **Consistent API** - API ที่สอดคล้องกัน
- **Intuitive Interface** - ใช้งานง่าย

### ✅ ความยืดหยุ่น
- **Modular Design** - ออกแบบแบบโมดูลาร์
- **Extensible** - ขยายได้ง่าย
- **Reusable** - ใช้ซ้ำได้
- **Configurable** - ปรับแต่งได้

### ✅ ความครบถ้วน
- **Project Management** - จัดการโปรเจคครบถ้วน
- **Task Management** - จัดการทาสก์ครบถ้วน
- **Analytics** - วิเคราะห์ข้อมูลครบถ้วน
- **Reporting** - รายงานครบถ้วน

## 🔧 การขยาย Toolkit

### เพิ่มฟังก์ชันใหม่
```javascript
// ใน odoo-toolkit.js
async newFunction() {
  if (!this.isAuthenticated) {
    await this.authenticate();
  }
  
  try {
    // Your code here
    return { success: true, result };
  } catch (error) {
    return { success: false, error: error.message };
  }
}
```

### เพิ่มคำสั่งใหม่
```javascript
// ใน quick-commands.js
case 'newcommand':
  await commands.newFunction(params[0]);
  break;
```

## 📊 การใช้งานในอนาคต

### 1. การพัฒนา
- เพิ่มฟังก์ชันใหม่ตามความต้องการ
- ปรับปรุงประสิทธิภาพ
- เพิ่มการจัดการข้อผิดพลาด
- เพิ่มการ cache ข้อมูล

### 2. การขยาย
- เพิ่มการรองรับโมดูลอื่นๆ
- เพิ่มการเชื่อมต่อกับระบบภายนอก
- เพิ่มการรายงานและวิเคราะห์
- เพิ่มการ automation

### 3. การใช้งาน
- ใช้ในการพัฒนาระบบ
- ใช้ในการทดสอบ
- ใช้ในการบำรุงรักษา
- ใช้ในการ monitor

## 🎯 การใช้งานกับ TENZAI

### 1. **TENZAI Purchasing System**
```bash
# ตรวจสอบ TENZAI status
node quick-commands.js tenzai

# ติดตั้ง TENZAI apps
node quick-commands.js install "Purchase" 123

# จัดการ purchase projects
node quick-commands.js projects "purchase"
```

### 2. **Restaurant Management**
```bash
# จัดการ restaurant projects
node quick-commands.js projects "restaurant"

# จัดการ kitchen tasks
node quick-commands.js tasks "kitchen"

# ดู restaurant analytics
node quick-commands.js analytics
```

### 3. **Business Intelligence**
```bash
# ดู business dashboard
node quick-commands.js dashboard

# ดู performance analytics
node quick-commands.js analytics

# ดู user permissions
node quick-commands.js permissions
```

## 🎯 สรุป

**Odoo Toolkit** เป็นเครื่องมือ All-in-One ที่ช่วยให้คุณ:
- ⚡ **ทำงานได้เร็วขึ้น** - ฟังก์ชันสำเร็จรูป
- 🎯 **ใช้งานได้ง่าย** - คำสั่งบรรทัดเดียว
- 🔧 **ขยายได้ง่าย** - โครงสร้างโมดูลาร์
- 📊 **จัดการได้ดี** - การจัดการข้อผิดพลาดอัตโนมัติ
- 📈 **วิเคราะห์ได้ดี** - analytics และ reporting
- 🔄 **จัดการโปรเจคได้ดี** - project management ครบถ้วน

### 🏆 ความสำเร็จ
- ✅ ระบบทำงานได้เสถียร
- ✅ ฟีเจอร์ครบถ้วน
- ✅ การจัดการข้อผิดพลาดดี
- ✅ โครงสร้างขยายได้ง่าย
- ✅ รองรับ Project Management
- ✅ รองรับ TENZAI System

### 🎯 การใช้งาน
- 📊 ตรวจสอบสถานะ: `node quick-commands.js status`
- 🎯 ดู dashboard: `node quick-commands.js dashboard`
- 📋 จัดการโปรเจค: `node quick-commands.js projects`
- 📝 จัดการทาสก์: `node quick-commands.js tasks`
- 📈 ดู analytics: `node quick-commands.js analytics`

ใช้ **Odoo Toolkit** เพื่อเพิ่มประสิทธิภาพการทำงานกับ Odoo และ TENZAI Purchasing System! 🚀 