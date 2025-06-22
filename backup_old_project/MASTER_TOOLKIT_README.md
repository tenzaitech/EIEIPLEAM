# 🎯 TENZAI Purchasing System - Master Toolkit

> **Comprehensive ERP Management Toolkit based on Odoo 18.0 Documentation**

[![Odoo Version](https://img.shields.io/badge/Odoo-18.0-blue.svg)](https://www.odoo.com/documentation/18.0/)
[![TENZAI Version](https://img.shields.io/badge/TENZAI-2.5-green.svg)](https://github.com/tenzai-group)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

## 📚 Overview

**TENZAI Master Toolkit** เป็นเครื่องมือครบวงจรสำหรับจัดการระบบ ERP ที่สร้างบน Odoo 18.0 โดยเฉพาะสำหรับร้านอาหารญี่ปุ่นและธุรกิจบริการอาหาร ครอบคลุมทุกฟังก์ชันตาม [Odoo 18.0 Documentation](https://www.odoo.com/documentation/18.0/)

## 🚀 Features

### 🔍 System Management
- **System Status Check** - ตรวจสอบสถานะระบบ
- **Full System Analysis** - วิเคราะห์ระบบครบถ้วน
- **Data Cleanup** - ทำความสะอาดข้อมูล
- **Health Monitoring** - ตรวจสอบสุขภาพระบบ

### 🏢 Organization Management
- **Company Management** - จัดการบริษัทและ Multi-Company
- **User Management** - จัดการผู้ใช้และสิทธิ์การเข้าถึง
- **Module Management** - จัดการโมดูลและแอปพลิเคชัน
- **Access Rights** - จัดการสิทธิ์และกลุ่มผู้ใช้

### 🛒 Operations Management
- **Product Management** - จัดการสินค้าและหมวดหมู่
- **Project Management** - จัดการโปรเจคและงาน
- **Finance & Accounting** - จัดการบัญชีและการเงิน
- **Sales & CRM** - จัดการการขายและลูกค้า
- **Purchase & Procurement** - จัดการการจัดซื้อจัดจ้าง
- **Manufacturing** - จัดการการผลิต

## 📦 Installation

```bash
# Clone repository
git clone <repository-url>
cd Express_v1_tztech

# Install dependencies
npm install

# Configure environment
cp config.env.example config.env
# Edit config.env with your Odoo credentials
```

## 🎮 Usage

### Interactive Mode (Recommended)

```bash
# Start interactive CLI
node tenzai-cli.js
```

### Direct Command Mode

```bash
# System status
node tenzai-cli.js status

# Full system check
node tenzai-cli.js full-check

# Module management
node tenzai-cli.js modules

# Product management
node tenzai-cli.js products

# Project management
node tenzai-cli.js projects
```

### Quick Commands (Legacy)

```bash
# Using existing quick-commands.js
node quick-commands.js status
node quick-commands.js projects
node quick-commands.js modules
```

## 📋 Available Commands

### 🔍 System Management
| Command | Description | Example |
|---------|-------------|---------|
| `status` | System status check | `node tenzai-cli.js status` |
| `full-check` | Complete system analysis | `node tenzai-cli.js full-check` |
| `cleanup` | Data cleanup & maintenance | `node tenzai-cli.js cleanup` |

### 🏢 Organization
| Command | Description | Example |
|---------|-------------|---------|
| `companies` | Company management | `node tenzai-cli.js companies` |
| `users` | User management | `node tenzai-cli.js users` |
| `modules` | Module management | `node tenzai-cli.js modules` |

### 🛒 Operations
| Command | Description | Example |
|---------|-------------|---------|
| `products` | Product management | `node tenzai-cli.js products` |
| `projects` | Project management | `node tenzai-cli.js projects` |
| `finance` | Finance & accounting | `node tenzai-cli.js finance` |
| `sales` | Sales & CRM | `node tenzai-cli.js sales` |
| `purchases` | Purchase & procurement | `node tenzai-cli.js purchases` |
| `manufacturing` | Manufacturing | `node tenzai-cli.js manufacturing` |

## 🎯 TENZAI Required Apps

ระบบจะตรวจสอบและติดตั้งแอปพลิเคชันที่จำเป็นสำหรับ TENZAI Purchasing System:

### Core Apps (18 แอป)
- ✅ **purchase** - การจัดซื้อจัดจ้าง
- ✅ **account** - บัญชีและการเงิน
- ✅ **contacts** - จัดการลูกค้าและคู่ค้า
- ✅ **pos_restaurant** - Point of Sale สำหรับร้านอาหาร
- ✅ **purchase_requisition** - คำขอจัดซื้อ
- ✅ **quality** - ระบบคุณภาพ
- ✅ **maintenance** - การบำรุงรักษา
- ✅ **approvals** - ระบบอนุมัติ
- ✅ **documents** - จัดการเอกสาร
- ✅ **helpdesk** - ศูนย์ช่วยเหลือ
- ✅ **crm** - การจัดการลูกค้า
- ✅ **mrp** - การผลิต
- ✅ **marketing_automation** - การตลาดอัตโนมัติ
- ✅ **social** - โซเชียลมีเดีย
- ✅ **fleet** - จัดการยานพาหนะ
- ✅ **iot** - Internet of Things
- ✅ **voip** - โทรศัพท์ผ่านอินเทอร์เน็ต
- ✅ **whatsapp** - WhatsApp Integration

## 🏗️ Architecture

```
TENZAI Master Toolkit
├── 🎮 tenzai-cli.js          # Enhanced CLI Interface
├── 🛠️ master-toolkit.js      # Core Toolkit Engine
├── 🔧 quick-commands.js      # Legacy Quick Commands
├── 📦 odoo-toolkit.js        # Odoo Service Wrapper
└── 📁 src/
    ├── config/
    │   └── odoo.config.js    # Configuration
    ├── services/
    │   └── odoo.service.js   # Odoo API Service
    └── routes/
        └── odoo.routes.js    # API Routes
```

## 🔧 Configuration

### Environment Variables (`config.env`)

```env
# Odoo Connection
ODOO_URL=https://your-odoo-instance.com
ODOO_DB=your_database_name
ODOO_USERNAME=Tenzaigroup.tech@gmail.com
ODOO_PASSWORD=Tenzai.5678tZ.

# API Settings
ODOO_PORT=8069
ODOO_PROTOCOL=https
```

### Authentication

ระบบใช้ Session-based Authentication:
- **Username**: Tenzaigroup.tech@gmail.com
- **Password**: Tenzai.5678tZ.
- **Database**: ตามที่กำหนดใน config.env

## 📊 System Requirements

### Software Requirements
- **Node.js**: v16.0.0 หรือสูงกว่า
- **Odoo**: v18.0 หรือสูงกว่า
- **PostgreSQL**: v12.0 หรือสูงกว่า
- **npm**: v8.0.0 หรือสูงกว่า

### Hardware Requirements
- **RAM**: 4GB (ขั้นต่ำ), 8GB (แนะนำ)
- **Storage**: 10GB (ขั้นต่ำ), 50GB (แนะนำ)
- **CPU**: 2 cores (ขั้นต่ำ), 4 cores (แนะนำ)

## 🔍 Monitoring & Analytics

### System Health Metrics
- **Module Installation Status**
- **Database Performance**
- **User Activity**
- **Data Integrity**
- **API Response Times**

### Business Metrics
- **Product Count & Categories**
- **Project Status & Progress**
- **Financial Reports**
- **Sales Performance**
- **Purchase Efficiency**
- **Manufacturing Output**

## 🛠️ Development

### Adding New Commands

```javascript
// ใน master-toolkit.js
async newCommand() {
  if (!this.isAuthenticated) await this.authenticate();
  
  console.log('🆕 New Command');
  console.log('='.repeat(60));
  
  try {
    // Your logic here
    const result = await this.odooService.search('model.name', [], ['field1', 'field2'], 100);
    return result;
  } catch (error) {
    console.error('❌ Command failed:', error.message);
    return null;
  }
}

// เพิ่มใน runCommand method
case 'new-command':
  return await this.newCommand();
```

### Testing

```bash
# Test authentication
node tenzai-cli.js status

# Test specific module
node tenzai-cli.js modules

# Test full system
node tenzai-cli.js full-check
```

## 📚 Documentation

### External Resources
- **[Odoo 18.0 Documentation](https://www.odoo.com/documentation/18.0/)** - คู่มือหลัก
- **[TENZAI Roadmap](ROADMAP_RESTAURANT_NATIONAL.md)** - แผนการพัฒนา
- **[Tools Reference](ALL_1_TOOLS.md)** - รายการเครื่องมือ
- **[Coding Guidelines](prompts/10coding)** - แนวทางการเขียนโค้ด

### API Reference
- **OdooService**: `src/services/odoo.service.js`
- **MasterToolkit**: `master-toolkit.js`
- **CLI Interface**: `tenzai-cli.js`

## 🚀 Quick Start

```bash
# 1. ตรวจสอบสถานะระบบ
node tenzai-cli.js status

# 2. ตรวจสอบโมดูลที่ติดตั้ง
node tenzai-cli.js modules

# 3. ตรวจสอบสินค้าและหมวดหมู่
node tenzai-cli.js products

# 4. ตรวจสอบโปรเจคและงาน
node tenzai-cli.js projects

# 5. ตรวจสอบระบบครบถ้วน
node tenzai-cli.js full-check
```

## 🎯 Use Cases

### สำหรับร้านอาหารญี่ปุ่น
1. **จัดการเมนูและสินค้า** - สร้างและจัดการเมนูอาหารญี่ปุ่น
2. **การจัดซื้อวัตถุดิบ** - จัดการการสั่งซื้อวัตถุดิบจากซัพพลายเออร์
3. **การผลิตอาหาร** - จัดการสูตรอาหารและการผลิต
4. **การขายและบริการ** - จัดการการขายผ่าน POS และออนไลน์
5. **การบัญชีและการเงิน** - จัดการบัญชีและการเงินของร้าน

### สำหรับธุรกิจบริการอาหาร
1. **การจัดการหลายสาขา** - จัดการหลายร้านและสาขา
2. **การจัดการพนักงาน** - จัดการพนักงานและตารางงาน
3. **การจัดการลูกค้า** - จัดการข้อมูลลูกค้าและโปรแกรมสมาชิก
4. **การรายงานและวิเคราะห์** - สร้างรายงานและวิเคราะห์ข้อมูล
5. **การจัดการคุณภาพ** - จัดการคุณภาพอาหารและบริการ

## 🔒 Security

### Authentication & Authorization
- **Session-based Authentication**
- **Role-based Access Control**
- **Secure API Communication**
- **Data Encryption**

### Best Practices
- เปลี่ยนรหัสผ่านเป็นประจำ
- ใช้ HTTPS สำหรับการเชื่อมต่อ
- จำกัดการเข้าถึงตามความจำเป็น
- สำรองข้อมูลเป็นประจำ

## 🆘 Support

### Troubleshooting

**ปัญหาการเชื่อมต่อ:**
```bash
# ตรวจสอบการเชื่อมต่อ
node tenzai-cli.js status

# ตรวจสอบ config.env
cat config.env
```

**ปัญหาการติดตั้งโมดูล:**
```bash
# ตรวจสอบโมดูลที่ติดตั้ง
node tenzai-cli.js modules

# ติดตั้งโมดูลที่ขาด
node quick-commands.js install [module_id]
```

### Contact
- **Email**: Tenzaigroup.tech@gmail.com
- **Documentation**: [Odoo 18.0 Docs](https://www.odoo.com/documentation/18.0/)
- **Issues**: GitHub Issues

## 📄 License

MIT License - ดูรายละเอียดใน [LICENSE](LICENSE) file

## 🎉 Contributing

เรายินดีรับการสนับสนุนจากชุมชน! กรุณาอ่าน [CONTRIBUTING.md](CONTRIBUTING.md) สำหรับรายละเอียด

---

**🎯 TENZAI Purchasing System v2.5** - *Empowering Japanese Restaurant Management with Odoo 18.0* 