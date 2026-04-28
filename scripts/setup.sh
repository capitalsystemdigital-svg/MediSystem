#!/bin/bash
set -e

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"

echo "Instalando dependencias del backend..."
cd "$ROOT_DIR/backend"
npm install

echo "Instalando dependencias del frontend..."
cd "$ROOT_DIR/frontend"
npm install

echo "Setup completado. Configure backend/.env a partir de .env.example y luego ejecute las migraciones de Prisma."