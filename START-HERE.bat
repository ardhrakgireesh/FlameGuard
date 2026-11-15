@echo off
title FlameGuard
echo ============================================
echo   FlameGuard - installing and starting...
echo ============================================
cd /d "%~dp0"
where node >nul 2>nul
if errorlevel 1 (
  echo.
  echo Node.js is not installed. Install the LTS version from https://nodejs.org
  echo then double-click this file again.
  pause
  exit /b
)
if not exist node_modules (
  echo Installing packages, this takes a minute the first time...
  call npm install
)
echo.
echo Starting the website. Your browser will open by itself.
echo Close this window to stop the site.
call npm run dev
pause
