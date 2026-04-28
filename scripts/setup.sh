#!/bin/bash

echo "========================================================"
echo "       MediSystem - Setup Environment (Mac/Linux)       "
echo "========================================================"
echo ""

cd backend || exit
echo "[*] Instalando dependencias del Backend..."
npm install

echo "[*] Configurando variables de entorno (.env)..."
if [ ! -f .env ]; then
    cp .env.example .env
    echo "[OK] Archivo .env creado. Por favor, edita tu cadena de conexion a MySQL en backend/.env"
else
    echo "[!] El archivo .env ya existe. Omitiendo."
fi

echo "[*] Generando cliente de Prisma..."
npx prisma generate

echo ""
echo "========================================================"
echo "    Setup completado. Para iniciar, ejecuta:"
echo "    cd backend && npm run dev"
echo "========================================================"