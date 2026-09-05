#!/usr/bin/env bash
# RED VELVET — Autonomous Server Launcher (Linux / macOS)

set -e

echo "========================================================"
echo "   RED VELVET -- PLATAFORMA AUTÓNOMA Y SUITE EJECUTIVA"
echo "========================================================"

if ! command -v node &> /dev/null; then
    echo "[ERROR] Node.js no está instalado."
    exit 1
fi

if [ ! -d "node_modules" ]; then
    echo "[*] Instalando dependencias de producción..."
    npm install
fi

echo "[*] Iniciando servidor en puerto ${PORT:-8000}..."
echo "[*] Acceso Público:    http://localhost:${PORT:-8000}"
echo "[*] Suite Dirección:   http://localhost:${PORT:-8000}/admin.html"

node server/server.js
