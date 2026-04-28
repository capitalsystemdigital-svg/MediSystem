@echo off
setlocal

set ROOT_DIR=%~dp0..\

echo Instalando dependencias del backend...
pushd "%ROOT_DIR%backend"
call npm install
if errorlevel 1 goto :error
popd

echo Instalando dependencias del frontend...
pushd "%ROOT_DIR%frontend"
call npm install
if errorlevel 1 goto :error
popd

echo Setup completado. Configure backend\.env a partir de .env.example y ejecute las migraciones de Prisma.
goto :eof

:error
echo Ocurrio un error durante la instalacion.
exit /b 1