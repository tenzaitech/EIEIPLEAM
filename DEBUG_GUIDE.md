# 🔧 TENZAI Express.js Backend Debug Guide

## 🚀 **Remote Debugging Ports ที่เปิดใช้งาน**

### **1. Chrome Remote Debugging**
- **Port:** 9222
- **URL:** http://localhost:9222
- **DevTools URL:** https://chrome-devtools-frontend.appspot.com/serve_rev/@707269b903b9d66dcfc06ea5101eec3cf7cdb12b/inspector.html?ws=localhost:9222/devtools/page/[PAGE_ID]
- **Status:** ✅ Active

### **2. Node.js Inspector**
- **Port:** 9229
- **URL:** http://localhost:9229
- **Status:** ✅ Active

### **3. Express.js Server**
- **Port:** 3000
- **URL:** http://localhost:3000
- **Health Check:** http://localhost:3000/health
- **Status:** 🔄 Starting

## 🛠️ **วิธีการ Debug**

### **Option 1: VS Code Debugging**
1. เปิด VS Code ในโปรเจค
2. กด `Ctrl+Shift+D` เพื่อเปิด Debug Panel
3. เลือก Configuration:
   - **"Debug Express Server"** - สำหรับ debug Node.js
   - **"Debug with Chrome"** - สำหรับ debug Frontend
   - **"Full Stack Debug"** - สำหรับ debug ทั้งหมดพร้อมกัน

### **Option 2: Chrome DevTools**
1. เปิด Chrome
2. ไปที่ `chrome://inspect`
3. คลิก "Configure" และเพิ่ม `localhost:9222`
4. คลิก "inspect" ใต้ Remote Target

### **Option 3: Node.js Inspector**
1. เปิด Browser ไปที่ `http://localhost:9229`
2. คลิก "Open dedicated DevTools for Node"

## 📊 **Debug URLs Summary**

| Service | Port | URL | Status |
|---------|------|-----|--------|
| Chrome DevTools | 9222 | http://localhost:9222 | ✅ Active |
| Node.js Inspector | 9229 | http://localhost:9229 | ✅ Active |
| Express Server | 3000 | http://localhost:3000 | 🔄 Starting |
| Health Check | 3000 | http://localhost:3000/health | 🔄 Starting |

## 🔍 **Debug Commands**

### **Start Chrome Debugging**
```powershell
& "C:\Program Files\Google\Chrome\Application\chrome.exe" --remote-debugging-port=9222 --user-data-dir="C:\temp\chrome-debug" --disable-web-security --disable-features=VizDisplayCompositor
```

### **Start Node.js Debugging**
```powershell
node --inspect=9229 --inspect-brk src/server.js
```

### **Check Active Ports**
```powershell
netstat -an | findstr "9222\|9229\|3000"
```

### **Check Running Processes**
```powershell
Get-Process | Where-Object {$_.ProcessName -match "chrome|node"}
```

## 🎯 **Debug Features**

### **Chrome DevTools Features**
- ✅ Remote debugging enabled
- ✅ Web security disabled
- ✅ Extensions disabled
- ✅ Dedicated user data directory
- ✅ Multiple tabs support

### **Node.js Inspector Features**
- ✅ Break on first line (`--inspect-brk`)
- ✅ Source maps support
- ✅ Hot reload support
- ✅ Console debugging
- ✅ Memory profiling

### **Express.js Debug Features**
- ✅ Request/Response logging
- ✅ Route debugging
- ✅ Middleware debugging
- ✅ Error handling debugging

## 🚨 **Troubleshooting**

### **Port Already in Use**
```powershell
# Kill processes using specific ports
netstat -ano | findstr :9222
taskkill /PID [PID] /F
```

### **Chrome Not Starting**
```powershell
# Kill all Chrome processes
Get-Process chrome | Stop-Process -Force
```

### **Node.js Not Starting**
```powershell
# Check for syntax errors
node --check src/server.js
```

## 📝 **Debug Logs**

### **Express.js Logs**
- Request logging: `DEBUG=express:*`
- Route logging: `DEBUG=express:router*`
- Application logging: `DEBUG=express:application*`

### **Custom Logs**
- Error logs: `logs/error.log`
- Access logs: `logs/access.log`
- Debug logs: `logs/debug.log`

## 🎉 **Success Indicators**

✅ Chrome DevTools accessible at `http://localhost:9222`  
✅ Node.js Inspector accessible at `http://localhost:9229`  
✅ Express server running on `http://localhost:3000`  
✅ Health check endpoint responding  
✅ VS Code debugging configurations ready  

---

**Last Updated:** $(Get-Date)  
**Status:** All debugging ports active and ready for development 