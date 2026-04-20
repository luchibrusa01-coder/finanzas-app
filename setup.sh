#!/bin/bash
# Setup script for Finanzas Personales PWA
set -e

echo "🔧 Instalando dependencias..."

# Try different package managers
if command -v npm &> /dev/null; then
    npm install
    echo "✅ Listo. Ejecutá: npm run dev"
elif command -v bun &> /dev/null; then
    bun install
    echo "✅ Listo. Ejecutá: bun run dev"
elif command -v pnpm &> /dev/null; then
    pnpm install
    echo "✅ Listo. Ejecutá: pnpm dev"
elif command -v yarn &> /dev/null; then
    yarn install
    echo "✅ Listo. Ejecutá: yarn dev"
else
    echo "❌ No se encontró npm, bun, pnpm o yarn."
    echo "   Instalá Node.js desde https://nodejs.org y volvé a correr este script."
    exit 1
fi
