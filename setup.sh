#!/bin/bash
set -e

# Setup variables
FRONTEND_DIR="frontend"
BACKEND_DIR="backend"

echo "⚙️ Configurando Backend..."
mkdir -p $BACKEND_DIR
cd $BACKEND_DIR
npm init -y > /dev/null
npm install express cors helmet morgan body-parser @prisma/client bcrypt jsonwebtoken dotenv > /dev/null
npm install -D typescript tsx ts-node @types/express @types/cors @types/morgan @types/node @types/bcrypt @types/jsonwebtoken prisma > /dev/null
npx tsc --init > /dev/null
npx prisma init > /dev/null
cd ..

echo "⚙️ Configurando Frontend..."
npx create-next-app@14.2.4 $FRONTEND_DIR --ts --tailwind --eslint --app --src-dir --import-alias "@/*" --use-npm --yes > /dev/null 2>&1
cd $FRONTEND_DIR
npm install @mui/material @mui/x-data-grid @emotion/react @emotion/styled lucide-react @reduxjs/toolkit react-redux redux-persist axios recharts tw-colors > /dev/null
cd ..

echo "✅ Estructura base completada"
