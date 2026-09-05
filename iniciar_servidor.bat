@echo off
title RED VELVET — Servidor Autonomo de Produccion
color 0C

echo ========================================================
echo    RED VELVET -- PLATAFORMA AUTONOMA Y SUITE EJECUTIVA
echo ========================================================
echo.

where node >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] Node.js no esta instalado en este equipo.
    echo Por favor instala Node.js desde: https://nodejs.org
    pause
    exit /b
)

if not exist node_modules (
    echo [*] Primera ejecucion detectada: Instalando dependencias necesarias...
    call npm install
)

echo [*] Iniciando servidor y base de datos persistente...
echo [*] Acceso publico:    http://localhost:8000
echo [*] Suite Direccion:   http://localhost:8000/admin.html
echo.

start http://localhost:8000
node server/server.js
pause
