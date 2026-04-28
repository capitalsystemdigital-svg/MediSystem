@echo off
echo ========================================================
echo        MediSystem - Setup Environment (Windows)
echo ========================================================
echo.

cd backend
echo [*] Instalando dependencias del Backend...
call npm install

echo [*] Configurando variables de entorno (.env)...
if not exist .env (
    copy .env.example .env
    echo [OK] Archivo .env creado. Por favor, edita tu cadena de conexion a MySQL.
) else (
    echo [!] El archivo .env ya existe. Omitiendo.
)

echo [*] Generando cliente de Prisma...
call npx prisma generate

echo.
echo ========================================================
echo    Setup completado. Para iniciar, ejecuta:
echo    cd backend ^&^& npm run dev
echo ========================================================
pause