# 🤖 Odoo Auto-App Installation Scripts

สคริปต์สำหรับติดตั้งแอปพลิเคชัน Odoo อัตโนมัติสำหรับ TENZAI Purchasing System

## 📁 ไฟล์สคริปต์

### 1. `auto-install-apps.js`
- สคริปต์หลักสำหรับติดตั้งแอปทั้งหมด
- ใช้ชื่อโมดูล (ไม่แนะนำ - มีปัญหา)

### 2. `auto-install-apps-fixed.js` ⭐ **แนะนำ**
- สคริปต์ที่แก้ไขแล้ว ใช้ ID ของโมดูล
- ติดตั้งแอปตามลำดับความสำคัญ
- รองรับการจัดการข้อผิดพลาด

### 3. `install-remaining-apps.js`
- สคริปต์สำหรับติดตั้งแอปที่เหลือ
- ใช้เวลารอระหว่างการติดตั้งนานขึ้น
- สำหรับแอปที่ติดตั้งไม่สำเร็จในครั้งแรก

## 🚀 วิธีการใช้งาน

### การติดตั้งครั้งแรก
```bash
node auto-install-apps-fixed.js
```

### การติดตั้งแอปที่เหลือ
```bash
node install-remaining-apps.js
```

## 📦 แอปที่ติดตั้ง

### 🔥 Priority 1 (Critical)
- **Purchase Management** - ระบบจัดซื้อ
- **Accounting** - ระบบบัญชี
- **Contact Management** - จัดการผู้ติดต่อ
- **Restaurant Management** - จัดการร้านอาหาร

### 🔥 Priority 2 (Advanced Features)
- **Purchase Requisition** - คำขอจัดซื้อ
- **Quality Management** - จัดการคุณภาพ
- **Maintenance Management** - จัดการบำรุงรักษา
- **Approval Workflows** - ระบบอนุมัติ

### 🔥 Priority 3 (Additional Features)
- **Document Management** - จัดการเอกสาร
- **Help Desk** - ศูนย์ช่วยเหลือ
- **Customer Relationship Management (CRM)** - จัดการลูกค้า
- **Manufacturing (MRP)** - การผลิต

### 🔥 Priority 4 (Integration & Automation)
- **Marketing Automation** - การตลาดอัตโนมัติ
- **Social Marketing** - การตลาดโซเชียล
- **Fleet Management** - จัดการยานพาหนะ
- **Internet of Things (IoT)** - อินเทอร์เน็ตของสรรพสิ่ง
- **VoIP Integration** - การรวม VoIP
- **WhatsApp Messaging** - ข้อความ WhatsApp

## ✅ ผลการติดตั้งปัจจุบัน

### ติดตั้งสำเร็จ (9 แอป)
1. ✅ Approval Workflows
2. ✅ Document Management
3. ✅ Help Desk
4. ✅ Customer Relationship Management (CRM)
5. ✅ Manufacturing (MRP)
6. ✅ Marketing Automation
7. ✅ Internet of Things (IoT)
8. ✅ VoIP Integration
9. ✅ WhatsApp Messaging

### ยังไม่ได้ติดตั้ง (8 แอป)
1. ❌ Purchase Management (timeout)
2. ❌ Accounting (ระบบกำลังประมวลผล)
3. ❌ Contact Management (ระบบกำลังประมวลผล)
4. ❌ Restaurant Management (ระบบกำลังประมวลผล)
5. ❌ Quality Management (ระบบกำลังประมวลผล)
6. ❌ Maintenance Management (ระบบกำลังประมวลผล)
7. ❌ Social Marketing (scheduled action)
8. ❌ Fleet Management (scheduled action)

## 🔧 การตั้งค่าหลังการติดตั้ง

### 1. ตั้งค่าสิทธิ์ผู้ใช้
- กำหนดสิทธิ์การเข้าถึงสำหรับแต่ละโมดูล
- สร้างกลุ่มผู้ใช้ตามหน้าที่

### 2. ตั้งค่าระบบอนุมัติ
- กำหนด workflow สำหรับคำขอจัดซื้อ
- ตั้งค่าผู้มีสิทธิ์อนุมัติ

### 3. ตั้งค่าคุณภาพ
- กำหนดกระบวนการควบคุมคุณภาพ
- ตั้งค่าเกณฑ์การตรวจสอบ

### 4. ตั้งค่าบำรุงรักษา
- กำหนดตารางการบำรุงรักษา
- ตั้งค่าการแจ้งเตือน

### 5. ตั้งค่าจัดการเอกสาร
- กำหนดโครงสร้างโฟลเดอร์
- ตั้งค่าสิทธิ์การเข้าถึงเอกสาร

### 6. ตั้งค่า CRM
- กำหนด pipeline การขาย
- ตั้งค่าการติดตามลูกค้า

### 7. ตั้งค่าการผลิต
- กำหนดกระบวนการผลิต
- ตั้งค่าการวางแผนการผลิต

### 8. ตั้งค่าอัตโนมัติ
- กำหนดกฎการทำงานอัตโนมัติ
- ตั้งค่าการแจ้งเตือน

### 9. ตั้งค่าแดชบอร์ด
- สร้างรายงานที่จำเป็น
- ตั้งค่า KPI

### 10. ทดสอบการรวมระบบ
- ทดสอบการเชื่อมต่อกับ TENZAI Purchasing System
- ตรวจสอบการทำงานของ API

## ⚠️ ข้อควรระวัง

1. **การติดตั้งพร้อมกัน**: Odoo ไม่รองรับการติดตั้งหลายโมดูลพร้อมกัน
2. **เวลาในการติดตั้ง**: บางโมดูลใช้เวลาติดตั้งนาน
3. **การสำรองข้อมูล**: ควรสำรองข้อมูลก่อนการติดตั้ง
4. **การทดสอบ**: ทดสอบในสภาพแวดล้อมทดสอบก่อน

## 🛠️ การแก้ไขปัญหา

### ปัญหา: "Odoo is currently processing another module operation"
**วิธีแก้**: รอสักครู่แล้วลองใหม่ หรือใช้สคริปต์ `install-remaining-apps.js`

### ปัญหา: "timeout exceeded"
**วิธีแก้**: เพิ่มเวลา timeout หรือติดตั้งทีละโมดูล

### ปัญหา: "Module not found"
**วิธีแก้**: ตรวจสอบว่าโมดูลมีอยู่ใน Odoo App Store หรือไม่

## 📞 การสนับสนุน

หากมีปัญหาในการติดตั้ง กรุณาติดต่อ:
- **Email**: tenzaigroup.tech@gmail.com
- **System**: TENZAI Purchasing System v2.5

---

**หมายเหตุ**: สคริปต์เหล่านี้ถูกออกแบบมาเพื่อ TENZAI Purchasing System โดยเฉพาะ และอาจต้องปรับแต่งสำหรับระบบอื่น 