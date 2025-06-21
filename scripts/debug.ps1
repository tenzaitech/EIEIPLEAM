# TENZAI Debug Script
# PowerShell script for debugging TENZAI Express.js Backend

Write-Host "🚀 Starting TENZAI Debug Environment..." -ForegroundColor Green

# Kill existing processes
Write-Host "🔄 Stopping existing processes..." -ForegroundColor Yellow
Get-Process | Where-Object {$_.ProcessName -match "chrome|node"} | Stop-Process -Force -ErrorAction SilentlyContinue

# Start Chrome with remote debugging
Write-Host "🌐 Starting Chrome with remote debugging..." -ForegroundColor Cyan
Start-Process -FilePath "C:\Program Files\Google\Chrome\Application\chrome.exe" -ArgumentList @(
    "--remote-debugging-port=9222",
    "--user-data-dir=C:\temp\chrome-debug",
    "--disable-web-security",
    "--disable-features=VizDisplayCompositor",
    "--disable-extensions",
    "--no-first-run",
    "--no-default-browser-check"
) -WindowStyle Minimized

# Wait for Chrome to start
Start-Sleep -Seconds 3

# Start Node.js with debugging
Write-Host "🔧 Starting Node.js with debugging..." -ForegroundColor Cyan
$env:DEBUG = "express:*"
$env:NODE_ENV = "development"

# Start server with debugging
Start-Process -FilePath "node" -ArgumentList @(
    "--inspect=9229",
    "--inspect-brk",
    "src/server.js"
) -WindowStyle Normal

Write-Host "✅ Debug environment started!" -ForegroundColor Green
Write-Host "📊 Debug URLs:" -ForegroundColor Yellow
Write-Host "   Chrome DevTools: http://localhost:9222" -ForegroundColor White
Write-Host "   Node.js Inspector: http://localhost:9229" -ForegroundColor White
Write-Host "   Express Server: http://localhost:3000" -ForegroundColor White
Write-Host "   Health Check: http://localhost:3000/health" -ForegroundColor White
Write-Host ""
Write-Host "🔍 To attach debugger:" -ForegroundColor Cyan
Write-Host "   1. Open VS Code" -ForegroundColor White
Write-Host "   2. Go to Run and Debug (Ctrl+Shift+D)" -ForegroundColor White
Write-Host "   3. Select 'Attach to Node.js' or 'Attach to Chrome'" -ForegroundColor White
Write-Host ""
Write-Host "Press any key to stop debugging..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown") 