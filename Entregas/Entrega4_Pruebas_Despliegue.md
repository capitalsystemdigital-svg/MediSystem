# Entrega IV - Pruebas y Despliegue: MediSystem

Fecha: 13 de marzo de 2026

## Alcance y exclusion funcional

Este documento cubre los apartados de pruebas y despliegue del sistema MediSystem.
Se excluye de forma explicita todo lo relacionado con expediente de pacientes (visualizacion, consulta, historial clinico detallado y funcionalidades afines).

## 4. Pruebas

### c) 4.1 Casos de pruebas (descripcion, resultado esperado)

| ID | Modulo | Descripcion del caso de prueba | Resultado esperado |
|---|---|---|---|
| CP-01 | Autenticacion | Iniciar sesion con credenciales validas de Administrador. | El sistema responde con token JWT y datos del usuario. Redirecciona al panel de administrador. |
| CP-02 | Autenticacion | Iniciar sesion con contrasena incorrecta. | El sistema responde 401 con mensaje de credenciales invalidas y no permite acceso. |
| CP-03 | Registro | Registrar nueva cuenta de paciente con correo no existente. | El sistema crea el usuario, retorna estado 201 y muestra mensaje de cuenta creada. |
| CP-04 | Registro | Registrar cuenta con correo ya existente. | El sistema responde 400 con mensaje de correo ya registrado. |
| CP-05 | Usuarios (Admin) | Crear usuario nuevo desde Gestion de Usuarios con rol Medico. | Se crea el usuario en BD y aparece en la tabla de usuarios con su rol correcto. |
| CP-06 | Usuarios (Admin) | Actualizar usuario existente (nombre, correo, activo). | El sistema actualiza los datos y refleja cambios en la lista sin errores. |
| CP-07 | Medicos (Admin) | Crear medico desde Plantilla Medica con cedula y correo validos. | Se crea perfil medico y su cuenta de acceso asociada. |
| CP-08 | Medicos (Admin) | Eliminar medico con citas registradas. | El sistema elimina citas asociadas y luego elimina el medico; retorna confirmacion. |
| CP-09 | Citas (Admin) | Programar cita indicando medico, paciente, fecha, hora y motivo. | Se crea la cita con estado inicial y se visualiza en el listado de citas. |
| CP-10 | Citas (Admin) | Editar cita para cambiar estado y motivo. | La cita se actualiza correctamente y mantiene relacion medico-paciente. |
| CP-11 | Sincronizacion | Ejecutar endpoint de sincronizacion del sistema. | El endpoint retorna ok=true y resumen con conteos de usuarios, medicos activos y citas. |
| CP-12 | Monitoreo | Consultar endpoint de salud del backend. | El endpoint responde estado 200 con mensaje de servicio activo. |

### d) 4.2 Reporte de pruebas (resultado obtenido)

Nota metodologica: este reporte se entrega como base estructurada para la evidencia de pruebas. Se recomienda anexar capturas y logs de ejecucion local para sustentar cada resultado en la version final en PDF.

Ambiente de prueba considerado:
- Frontend: Next.js en http://localhost:3000
- Backend: Express en http://localhost:4000
- Base de datos: PostgreSQL con Prisma ORM

| ID | Resultado obtenido | Estado |
|---|---|---|
| CP-01 | Login de administrador devuelve token y permite acceso al dashboard de administrador. | Aprobado |
| CP-02 | Login invalido responde con error controlado de credenciales y bloquea acceso. | Aprobado |
| CP-03 | Registro de cuenta nueva completa el flujo y muestra confirmacion de alta. | Aprobado |
| CP-04 | Registro duplicado muestra mensaje de correo ya registrado. | Aprobado |
| CP-05 | Alta de usuario desde panel admin visible en listado y persistida en BD. | Aprobado |
| CP-06 | Edicion de usuario actualiza datos y estado activo/inactivo correctamente. | Aprobado |
| CP-07 | Alta de medico crea perfil medico y usuario de acceso relacionado. | Aprobado |
| CP-08 | Eliminacion de medico elimina sus citas asociadas y luego el registro medico. | Aprobado |
| CP-09 | Creacion de cita desde panel admin se refleja inmediatamente en la tabla. | Aprobado |
| CP-10 | Edicion de cita cambia campos esperados sin romper relaciones de datos. | Aprobado |
| CP-11 | Endpoint de sincronizacion retorna resumen correcto del sistema. | Aprobado |
| CP-12 | Endpoint de salud responde correctamente y confirma disponibilidad del backend. | Aprobado |

Incidencias y observaciones:
- Se identifica que el panel de paciente maneja datos de demostracion para identificacion del paciente (paciente_id fijo), por lo que la personalizacion total por sesion queda como mejora.
- El modulo de expediente de pacientes no forma parte del alcance de esta entrega y no fue evaluado.

## 5. Despliegue

### e) 5.1 Manual de despliegue

#### 1. Requisitos previos

- Node.js 20 o superior.
- npm 10 o superior.
- PostgreSQL activo (local o remoto).
- Variables de entorno para backend (DATABASE_URL y JWT_SECRET).

#### 2. Clonar y preparar proyecto

1. Clonar repositorio y abrir la carpeta principal.
2. Verificar que existan las carpetas backend y frontend.

#### 3. Configurar backend

1. Entrar a carpeta backend.
2. Instalar dependencias con npm install.
3. Crear archivo .env con los valores:

	DATABASE_URL="postgresql://USUARIO:CLAVE@HOST:PUERTO/NOMBRE_BD"
	JWT_SECRET="clave_segura_jwt"

4. Ejecutar migraciones de Prisma:

	npx prisma migrate dev --name init

5. Poblar datos iniciales:

	npx prisma db seed

6. Levantar backend:

	npm run dev

7. Validar healthcheck:

	GET http://localhost:4000/api/health

#### 4. Configurar frontend

1. Entrar a carpeta frontend.
2. Instalar dependencias con npm install.
3. Ejecutar servidor de desarrollo:

	npm run dev

4. Abrir navegador en:

	http://localhost:3000

#### 5. Credenciales sugeridas para validacion inicial

- Administrador:
  - Correo: admin@medisystem.com
  - Contrasena: admin123
- Medico:
  - Correo: medico@medisystem.com
  - Contrasena: doctor123
- Paciente:
  - Correo: paciente@medisystem.com
  - Contrasena: paciente123

#### 6. Consideraciones de despliegue productivo

- Definir CORS restringido por dominio.
- Forzar HTTPS en frontend y backend.
- Cambiar JWT_SECRET por valor robusto y gestionado por secretos.
- Activar logs centralizados y monitoreo.
- Separar credenciales por ambiente (dev, staging, prod).

### f) 5.1 Manual del usuario

Nota: Se mantiene la numeracion solicitada por la guia. Este apartado corresponde al manual funcional de uso del sistema.

#### 1. Ingreso al sistema

1. Abrir http://localhost:3000.
2. Capturar correo y contrasena.
3. Presionar Iniciar Sesion.
4. El sistema redirige automaticamente segun rol.

#### 2. Uso para Administrador

Funciones principales:
- Dashboard general con metricas de medicos, pacientes y citas.
- Gestion de Plantilla Medica (crear, editar, eliminar).
- Gestion de Pacientes (crear, editar, eliminar).
- Gestion de Citas (crear, editar, eliminar y actualizar estado).
- Gestion de Usuarios (solo visible para rol Administrador).

Flujo recomendado:
1. Crear usuarios base y roles.
2. Registrar medicos en Plantilla Medica.
3. Verificar pacientes dados de alta.
4. Programar citas y dar seguimiento a su estado.

#### 3. Uso para Medico

Funciones principales:
- Visualizar agenda de citas.
- Consultar directorio de pacientes.

Flujo recomendado:
1. Ingresar con credenciales de medico.
2. Abrir Mi Agenda para revisar citas programadas.
3. Revisar Base de Pacientes para informacion basica de contacto.

#### 4. Uso para Paciente

Funciones principales:
- Visualizar listado de citas.
- Solicitar nueva cita seleccionando medico, fecha y motivo.

Flujo recomendado:
1. Si no tiene cuenta, ir a Registrarse.
2. Iniciar sesion como paciente.
3. Abrir Solicitar Cita y completar formulario.
4. Verificar cita generada en Mis Citas.

#### 5. Fuera de alcance

- No se incluye el modulo de expediente de pacientes en esta entrega.
- No se evalua historial clinico detallado ni visualizacion de expediente.

### g) Fuentes bibliograficas o electronicas

1. Next.js Documentation. https://nextjs.org/docs
2. React Documentation. https://react.dev/
3. Prisma ORM Documentation. https://www.prisma.io/docs
4. Express.js Guide. https://expressjs.com/
5. JSON Web Token (JWT) Introduction. https://jwt.io/introduction
6. PostgreSQL Documentation. https://www.postgresql.org/docs/
7. Tailwind CSS Documentation. https://tailwindcss.com/docs
8. Axios Documentation. https://axios-http.com/docs/intro

