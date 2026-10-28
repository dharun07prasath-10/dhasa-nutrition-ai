@echo off
echo ===================================================
echo Starting AI Fitness & Food Nutrition Scanner System
echo ===================================================

set "PATH=C:\Users\dharu\.local\bin;C:\Users\dharu\.local\node;C:\Users\dharu\AppData\Roaming\uv\python\cpython-3.11-windows-x86_64-none;%PATH%"

echo Starting FastAPI Backend on http://localhost:8000 ...
start "AI Fitness Backend" cmd /k "cd /d %~dp0\backend && ..\.venv\Scripts\python.exe -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload"

timeout /t 2 /nobreak >nul

echo Starting Vite React Frontend on http://localhost:5173 ...
start "AI Fitness Frontend" cmd /k "cd /d %~dp0\frontend && npm run dev"

echo.
echo Application launched!
echo Open your browser at: http://localhost:5173
echo Backend API Docs at:  http://localhost:8000/docs
echo ===================================================

