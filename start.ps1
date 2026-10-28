$env:PATH = "C:\Users\dharu\.local\bin;C:\Users\dharu\.local\node;C:\Users\dharu\AppData\Roaming\uv\python\cpython-3.11-windows-x86_64-none;" + $env:PATH

Write-Host "===================================================" -ForegroundColor Green
Write-Host "Starting AI Fitness & Food Nutrition Scanner System" -ForegroundColor Green
Write-Host "===================================================" -ForegroundColor Green

Write-Host "Launching Backend on http://localhost:8000 ..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "`$env:PATH = 'C:\Users\dharu\.local\bin;C:\Users\dharu\.local\node;C:\Users\dharu\AppData\Roaming\uv\python\cpython-3.11-windows-x86_64-none;' + `$env:PATH; cd '$PSScriptRoot\backend'; ..\.venv\Scripts\python.exe -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload"

Start-Sleep -Seconds 2

Write-Host "Launching Frontend on http://localhost:5173 ..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "`$env:PATH = 'C:\Users\dharu\.local\bin;C:\Users\dharu\.local\node;C:\Users\dharu\AppData\Roaming\uv\python\cpython-3.11-windows-x86_64-none;' + `$env:PATH; cd '$PSScriptRoot\frontend'; npm run dev"

Write-Host "`nApp successfully launched!" -ForegroundColor Green
Write-Host "Frontend: http://localhost:5173" -ForegroundColor Yellow
Write-Host "API Docs: http://localhost:8000/docs" -ForegroundColor Yellow

