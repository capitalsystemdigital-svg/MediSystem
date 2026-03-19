# Entrega II - Ingeniería de Requerimientos: MediSystem

Fecha: 20 de marzo de 2026

---

## 2.1 Documento de Requerimientos (SRS - Software Requirements Specification)

### Introducción

Este documento especifica formalmente los requerimientos funcionales y no funcionales de MediSystem, una plataforma web para la gestión integral de usuarios, médicos, pacientes y citas en entornos clínicos.

**Versión:** 1.0  
**Fecha de creación:** 20 de marzo de 2026  
**Audiencia objetivo:** Equipo de desarrollo, stakeholders del proyecto, área de aseguramiento de calidad.

### Objetivo del documento

Establecer una especificación clara, completa y verificable de las capacidades y restricciones del sistema para alinear las expectativas de todos los interesados y guiar la construcción y validación del producto.

### Alcance

MediSystem incluye módulos de autenticación, gestión de usuarios, médicos, pacientes y citas para roles diferenciados (Administrador, Médico, Paciente). Excluye expediente completo, facturación e integraciones externas.

### Definiciones, acrónimos y abreviaturas

| Término | Definición |
|---------|-----------|
| JWT | JSON Web Token; estándar de autenticación sin estado. |
| CRUD | Create, Read, Update, Delete; operaciones básicas de persistencia. |
| SRS | Software Requirements Specification. |
| RF | Requerimiento Funcional. |
| RNF | Requerimiento No Funcional. |
| API | Application Programming Interface. |
| BD | Base de Datos. |
| ORM | Object-Relational Mapping; Prisma en este proyecto. |
| Rol | Definición de permiso o perfil de usuario (Administrador, Médico, Paciente). |

---

## 2.2 Historias de Usuario

Las historias de usuario se organizan por rol principal. Cada una sigue el formato: "Como [rol] deseo [acción] para [beneficio]".

### 2.2.1 Historias del Administrador

**HU-ADM-01: Iniciar sesión como administrador**  
Como administrador deseo iniciar sesión con correo y contraseña para acceder a los módulos de gestión.  
Criterios de aceptación:
- El sistema valida credenciales contra la BD.
- Si son válidas, genera token JWT válido por 8 horas.
- Si son inválidas, muestra mensaje de error sin exponer detalles.
- El dashboard de administración es accesible tras login exitoso.

**HU-ADM-02: Crear nuevo usuario**  
Como administrador deseo crear usuarios (médicos y pacientes) asignando rol y credenciales en la plataforma.  
Criterios de aceptación:
- El formulario requiere nombre, correo y contraseña.
- El sistema valida unicidad de correo.
- La contraseña se almacena con hash bcrypt.
- El usuario es asignado a un rol válido.
- Se muestra confirmación de alta exitosa.

**HU-ADM-03: Consultar listado de usuarios**  
Como administrador deseo ver un listado de todos los usuarios activos e inactivos con detalles de rol y estado.  
Criterios de aceptación:
- La tabla muestra nombre, correo, rol y estado activo/inactivo.
- Existe opción de filtrar por rol o estado.
- Los datos se actualizan al crear/modificar/eliminar usuarios.
- La paginación es opcional inicialmente.

**HU-ADM-04: Actualizar datos de usuario**  
Como administrador deseo editar datos de users existentes (nombre, correo, estado activo).  
Criterios de aceptación:
- Los campos editables son nombre, correo, rol, y estado.
- El sistema valida cambios sin romper integridad referencial.
- Se muestra confirmación tras actualización.
- Si el usuario cuenta con expedientes/citas, permanecen intactos.

**HU-ADM-05: Crear médico en plantilla médica**  
Como administrador deseo registrar un médico con especialidad, cédula profesional y contacto.  
Criterios de aceptación:
- El formulario requiere nombre, especialidad y cédula única.
- Opcionalmente se ingresan teléfono y correo.
- Se crea un usuario asociado con rol "Médico" automáticamente.
- La cédula es validada como única en la BD.

**HU-ADM-06: Consultar plantilla médica**  
Como administrador deseo visualizar el listado de médicos con especialidad, cédula y estado actividad.  
Criterios de aceptación:
- La tabla muestra nombre, especialidad, cédula, teléfono, correo y estado.
- Los datos están sincronizados con la tabla de usuarios (médicos con rol Médico).
- Existe filtro por especialidad o estado activo.

**HU-ADM-07: Actualizar datos de médico**  
Como administrador deseo editar especialidad, teléfono y correo de un médico registrado.  
Criterios de aceptación:
- Los cambios se reflejan en tabla médicos y en el usuario asociado.
- La cédula no es editable (campo único).
- Las citas del médico permanecen intactas tras edición.
- Se muestra confirmación de cambios aplicados.

**HU-ADM-08: Crear paciente**  
Como administrador deseo registrar un paciente con datos básicos (nombre, fecha nacimiento, tipo sangre, alergias).  
Criterios de aceptación:
- El formulario requiere nombre y fecha de nacimiento.
- Opcionalmente se ingresan teléfono, tipo de sangre y alergias.
- Se crea un usuario base con rol "Paciente" asociado.
- Los datos quedan persistidos en la tabla pacientes.

**HU-ADM-09: Consultar listado de pacientes**  
Como administrador deseo ver todos los pacientes con datos básicos y estado de registro.  
Criterios de aceptación:
- La tabla muestra nombre, fecha nacimiento, teléfono, tipo sangre, activo/inactivo.
- Existe filtro por estado activo o rango de edad.
- Los datos se sincronizan con cambios en usuarios pacientes.

**HU-ADM-10: Actualizar datos de paciente**  
Como administrador deseo editar datos básicos de un paciente sin borrar su historial de citas.  
Criterios de aceptación:
- Los campos editables son todos excepto id_paciente.
- Las citas existentes mantienen integridad referencial.
- Se muestra confirmación de cambios.

**HU-ADM-11: Programar cita**  
Como administrador deseo crear una cita asignando médico, paciente, fecha, hora y motivo.  
Criterios de aceptación:
- El formulario es modal o página separada con campos obligatorios.
- El médico y paciente seleccionados deben estar activos.
- Se valida que no exista cita duplicada (misma fecha/hora/médico).
- El estado inicial de la cita es "Pendiente".
- Se muestra confirmación con datos de la cita creada.

**HU-ADM-12: Consultar citas programadas**  
Como administrador deseo ver todas las citas con detalles de médico, paciente, fecha/hora, estado y motivo.  
Criterios de aceptación:
- La tabla muestra datos completos de cita.
- Existe filtro por médico, paciente, estado o rango de fechas.
- Los datos se actualizan en tiempo real si otra sesión modifica citas.

**HU-ADM-13: Actualizar estado de cita**  
Como administrador deseo cambiar el estado de una cita (Pendiente → Confirmada → Atendida → Cancelada, etc.).  
Criterios de aceptación:
- Los estados válidos se definen en la BD o configuración.
- El cambio es registrado con fecha de actualización.
- Se muestra confirmación.
- El registro histórico de cita se mantiene (no se elimina).

**HU-ADM-14: Eliminación lógica de usuario**  
Como administrador deseo inactivar (soft delete) un usuario sin borrar su registro histórico.  
Criterios de aceptación:
- El campo activo se cambia a false.
- El usuario inactivo no puede iniciar sesión.
- Sus registros en pacientes/médicos permanecen.
- Las citas asociadas no se eliminan, quedan huérfanas o marcadas como referencia histórica.

---

### 2.2.2 Historias del Médico

**HU-MED-01: Iniciar sesión como médico**  
Como médico deseo iniciar sesión para acceder a mis funciones profesionales.  
Criterios de aceptación:
- Usa las mismas credenciales que cualquier usuario (correo + contraseña).
- Se valida que el rol es "Médico".
- Se redirige al dashboard de médico.

**HU-MED-02: Consultar mi agenda de citas**  
Como médico deseo visualizar mis citas programadas por fecha para organizar mi jornada.  
Criterios de aceptación:
- Se muestran solo las citas donde soy asignado como médico.
- La tabla incluye paciente, fecha/hora, estado y motivo.
- Existe filtro por fecha o estado.
- Se indica claramente las citas de hoy vs. futuras.

**HU-MED-03: Consultar base de pacientes**  
Como médico deseo acceder a información básica de contacto de pacientes para coordinación.  
Criterios de aceptación:
- Se lista nombre, teléfono, correo y datos de contacto.
- No se exponen datos clínicos sensibles sin autorización.
- Existe búsqueda por nombre o correo.

---

### 2.2.3 Historias del Paciente

**HU-PAC-01: Registrarse en el sistema**  
Como paciente deseo crear una cuenta en la plataforma con correo y contraseña para acceder a mis datos.  
Criterios de aceptación:
- El formulario requiere nombre, correo y contraseña.
- Se valida que el correo no esté registrado.
- Tras confirmar, se redirige a login.
- Se crea un registro en tabla pacientes asociado al usuario.

**HU-PAC-02: Iniciar sesión como paciente**  
Como paciente deseo iniciar sesión para acceder a mis citas y solicitudes.  
Criterios de aceptación:
- Se valida correo y contraseña.
- Se redirige al dashboard de paciente.

**HU-PAC-03: Visualizar mis citas**  
Como paciente deseo ver mis citas programadas y su estado para seguimiento.  
Criterios de aceptación:
- Se muestran solo mis citas (filtradas por id_paciente).
- La tabla incluye médico, fecha/hora, estado y motivo.
- Se distingue claramente citas pasadas de futuras.

---

## 2.3 Requerimientos Funcionales

Los requerimientos funcionales definen qué hace el sistema.

### RF-01: Autenticación por correo y contraseña

El sistema debe permitir a usuarios registrados iniciar sesión con correo único y contraseña.

- **Detalles:**
  - Las contraseñas se almacenan con hash bcrypt (mínimo 10 rondas).
  - Los intentos fallidos no revelan análisis de si existe el correo.
  - La sesión se valida mediante JWT con expiración de 8 horas.
  - El logout es posible eliminando el token del cliente.

### RF-02: Control de acceso basado en roles (RBAC)

El sistema debe restringir funciones según el rol del usuario autenticado.

- **Detalles:**
  - Roles válidos: Administrador, Médico, Paciente.
  - El rol es asignado en la tabla usuarios.
  - Las pantallas y endpoints verifican rol antes de permitir acceso.
  - Si un usuario intenta acceder sin permisos, se rechaza con estado HTTP 403.

### RF-03: Gestión de usuarios (CRUD)

El sistema debe permitir crear, leer, actualizar y (lógicamente) eliminar usuarios.

- **Detalles:**
  - Crear: nombre, correo único, contraseña, rol.
  - Leer: consultar usuarios con paginación opcional.
  - Actualizar: nombre, correo, rol, estado activo/inactivo.
  - Eliminar: soft delete (activo = false).
  - Validar que correos sean únicos; rechazar duplicados con error 400.
  - Solo administrador puede crear/editar usuarios (excepto perfil propio).

### RF-04: Sincronización Médico-Usuario

El sistema debe mantener consistencia entre tabla usuarios (rol=Médico) y tabla médicos.

- **Detalles:**
  - Al crear usuario con rol Médico, crear registro automático en tabla médicos.
  - Al actualizar nombre/email/activo de usuario Médico, reflejar en médicos.
  - Al crear médico manualmente, crear usuario Médico asociado si no existe.
  - Si usuario Médico se inactiva, inactivar médico asociado.

### RF-05: Sincronización Paciente-Usuario

El sistema debe mantener consistencia entre tabla usuarios (rol=Paciente) y tabla pacientes.

- **Detalles:**
  - Al registrar usuario Paciente, crear registro automático en tabla pacientes.
  - Al actualizar nombre/email/activo de usuario Paciente, reflejar en pacientes.
  - Mantener relación de uno a uno entre usuario y paciente.

### RF-06: Gestión de médicos (CRUD)

El sistema debe permitir crear, leer, actualizar y eliminar médicos con especialidad y cédula.

- **Detalles:**
  - Crear: nombre, especialidad, cédula profesional única, teléfono (opcional), correo.
  - Leer: listar médicos con filtro por especialidad o estado.
  - Actualizar: especialidad, teléfono, correo, estado.
  - Eliminar: soft delete (activo = false); las citas no se eliminan.
  - La cédula es generada automáticamente si es vacía: AUTO-MED-{id_usuario}.

### RF-07: Gestión de pacientes (CRUD)

El sistema debe permitir crear, leer, actualizar y eliminar pacientes con datos básicos.

- **Detalles:**
  - Crear: nombre, fecha nacimiento, teléfono (opcional), tipo sangre, alergias.
  - Leer: listar pacientes con filtro por estado o rango de edad.
  - Actualizar: todos los campos excepto id_paciente.
  - Eliminar: soft delete (activo = false); historial de citas se mantiene.

### RF-08: Gestión de citas (CRUD)

El sistema debe permitir crear, leer, actualizar y eliminar citas.

- **Detalles:**
  - Crear: seleccionar médico, paciente, fecha, hora, motivo. Estado inicial = "Pendiente".
  - Leer: listar citas con filtro por médico, paciente, fecha, estado.
  - Actualizar: cambiar estado (Pendiente, Confirmada, Atendida, Cancelada).
  - Eliminar: hard delete permitido (no es dato crítico de expediente en esta fase).
  - Validar que médico y paciente seleccionados estén activos.

### RF-09: Sincronización global del sistema

El sistema debe ofrecer endpoint que sincronice inconsistencias Médico-Usuario y Paciente-Usuario.

- **Detalles:**
  - Endpoint: POST /api/v1/system-sync.
  - Valida todos los usuarios Médico contra tabla médicos.
  - Valida todos los usuarios Paciente contra tabla pacientes.
  - Crea/actualiza perfiles según sea necesario.
  - Retorna resumen: cantidad de médicos/pacientes sincronizados.

### RF-10: Consulta de roles disponibles

El sistema debe permitir consultar los roles definidos en la BD.

- **Detalles:**
  - Endpoint: GET /api/v1/roles.
  - Retorna lista de roles con id y nombre.
  - Útil para inicializar dropdowns en frontend.

### RF-11: Health check del backend

El sistema debe exponer un endpoint para validar disponibilidad del servidor.

- **Detalles:**
  - Endpoint: GET /api/health.
  - Retorna status 200 con mensaje "MediSystem Backend ejecutándose".
  - No requiere autenticación.

### RF-12: Paneles diferenciados por rol

El sistema debe mostrar interfaces y funciones específicas según rol del usuario.

- **Detalles:**
  - Dashboard Administrador: métricas, gestión de usuarios, médicos, pacientes, citas.
  - Dashboard Médico: mi agenda, directorio de pacientes.
  - Dashboard Paciente: mis citas, solicitar cita (en evolución).

---

## 2.4 Requerimientos No Funcionales

Los requerimientos no funcionales definen cómo se comporta el sistema.

### RNF-01: Seguridad - Contraseñas

Las contraseñas deben almacenarse de forma irreversible using bcrypt.

- **Detalles:**
  - Mínimo 10 rondas de hash.
  - Nunca se transmiten en texto plano en logs.
  - La API rechaza contraseñas menores a 6 caracteres (validable en cliente/servidor).

### RNF-02: Seguridad - Autenticación

La autenticación debe usar JWT con expiración y validación en cada petición protegida.

- **Detalles:**
  - Expiración de token: 8 horas.
  - El JWT se valida contra la BD para confirmar usuario activo.
  - Middleware valida presencia del header Authorization: Bearer <token>.

### RNF-03: Seguridad - CORS

El servidor backend debe definir CORS permitidos.

- **Detalles:**
  - En desarrollo: localhost:3000 (frontend).
  - En producción: dominio específico de la clínica.
  - Métodos permitidos: GET, POST, PUT, DELETE, OPTIONS.

### RNF-04: Seguridad - Headers HTTP

El servidor debe usar middleware Helmet para protección de headers.

- **Detalles:**
  - Content-Security-Policy, X-Frame-Options, X-Content-Type-Options, etc.
  - Previene ataques XSS, clickjacking y MIME sniffing.

### RNF-05: Performance - Tiempo de respuesta API

Las respuestas de la API deben ocurrir en menos de 1000 ms para operaciones básicas.

- **Detalles:**
  - Operaciones CRUD simples: < 500 ms.
  - Listados con paginación: < 800 ms.
  - Casos excepcionales de carga (batch sync): hasta 2000 ms permitidos.

### RNF-06: Performance - Escalabilidad

El sistema debe soportar 100+ usuarios concurrentes sin degradación significativa.

- **Detalles:**
  - Base de datos optimizada con índices en columnas de búsqueda frecuente.
  - Conexión a BD reciclada vía ORM (Prisma).
  - Frontend optimizado con lazy loading y caché.

### RNF-07: Confiabilidad - Disponibilidad

El sistema debe estar operativo al menos 99% del tiempo en producción.

- **Detalles:**
  - Esto requiere infraestructura de respaldo, failover y monitoreo.
  - En fase actual (desarrollo), no es aplicable.

### RNF-08: Confiabilidad - Consistencia de datos

La BD debe garantizar integridad referencial y consistencia transaccional.

- **Detalles:**
  - Foreign keys en campos de relación.
  - Transacciones ACID en operaciones multi-tabla.
  - Prisma maneja migraciones y validación de esquema.

### RNF-09: Usabilidad - Interfaz responsiva

La interfaz web debe ser operable en navegadores desktop y tablet.

- **Detalles:**
  - Breakpoints TailwindCSS: sm, md, lg, xl.
  - Modo oscuro opcional.
  - Accesibilidad WCAG AA en elementos críticos.

### RNF-10: Mantenibilidad - Código limpio

El código backend y frontend debe seguir estándares de legibilidad.

- **Detalles:**
  - TypeScript con tsconfig restrictivo.
  - ESLint y Prettier configurados.
  - Comentarios en funciones complejas.
  - Separación clara entre capas (routing, controladores, servicios, BD).

### RNF-11: Logging y monitoreo

El sistema debe registrar eventos relevantes (logins, errores, cambios críticos).

- **Detalles:**
  - Morgan en Express para logs HTTP.
  - Logs en consola y opcionalmente archivo.
  - Errores capturados y reportados sin exponer detalles técnicos al cliente.

### RNF-12: Compatibilidad

El sistema debe ser compatible con navegadores modernos (Chrome, Firefox, Safari, Edge versiones últimas 2 años).

- **Detalles:**
  - Next.js 14 y React 18 soportan esto nativamente.
  - Polyfills para BOM/DOM si es necesario.

---

## 2.5 Matriz de Trazabilidad

La matriz de trazabilidad mapea historias de usuario ↔ requerimientos funcionales ↔ casos de uso.

| ID HU | Descripción HU | RF Asociados | Caso de Uso | RNF Asociados |
|-------|----------------|--------------|-------------|---------------|
| HU-ADM-01 | Iniciar sesión admin | RF-01, RF-02 | CU-AUTH-01 | RNF-01, RNF-02, RNF-03, RNF-04 |
| HU-ADM-02 | Crear usuario | RF-03, RF-04, RF-05 | CU-USR-01 | RNF-01, RNF-08, RNF-10 |
| HU-ADM-03 | Consultar usuarios | RF-03 | CU-USR-02 | RNF-05, RNF-09 |
| HU-ADM-04 | Actualizar usuario | RF-03, RF-04, RF-05 | CU-USR-03 | RNF-05, RNF-08 |
| HU-ADM-05 | Crear médico | RF-04, RF-06 | CU-MED-01 | RNF-08, RNF-10 |
| HU-ADM-06 | Consultar médicos | RF-06 | CU-MED-02 | RNF-05, RNF-09 |
| HU-ADM-07 | Actualizar médico | RF-04, RF-06 | CU-MED-03 | RNF-05, RNF-08 |
| HU-ADM-08 | Crear paciente | RF-05, RF-07 | CU-PAC-01 | RNF-08, RNF-10 |
| HU-ADM-09 | Consultar pacientes | RF-07 | CU-PAC-02 | RNF-05, RNF-09 |
| HU-ADM-10 | Actualizar paciente | RF-05, RF-07 | CU-PAC-03 | RNF-05, RNF-08 |
| HU-ADM-11 | Programar cita | RF-08 | CU-CIT-01 | RNF-05, RNF-08 |
| HU-ADM-12 | Consultar citas | RF-08 | CU-CIT-02 | RNF-05, RNF-09 |
| HU-ADM-13 | Actualizar estado cita | RF-08 | CU-CIT-03 | RNF-05 |
| HU-ADM-14 | Eliminación lógica usuario | RF-03 | CU-USR-04 | RNF-08 |
| HU-MED-01 | Iniciar sesión médico | RF-01, RF-02 | CU-AUTH-01 | RNF-01, RNF-02, RNF-03 |
| HU-MED-02 | Consultar mi agenda | RF-08 | CU-CIT-02 | RNF-05, RNF-09 |
| HU-MED-03 | Base de pacientes | RF-07 | CU-PAC-02 | RNF-05, RNF-09 |
| HU-PAC-01 | Registrarse | RF-01, RF-05 | CU-AUTH-02 | RNF-01, RNF-02, RNF-08 |
| HU-PAC-02 | Iniciar sesión paciente | RF-01, RF-02 | CU-AUTH-01 | RNF-01, RNF-02, RNF-03 |
| HU-PAC-03 | Ver mis citas | RF-08 | CU-CIT-02 | RNF-05, RNF-09 |

---

## Conclusiones del SRS

El Documento de Requerimientos (SRS) define formalmente las 20 historias de usuario, 12 requerimientos funcionales y 12 no funcionales de MediSystem. La matriz de trazabilidad asegura que cada historia se soporta por requerimientos medibles y casos de uso. Este documento es la base para validación y pruebas en fases posteriores.
