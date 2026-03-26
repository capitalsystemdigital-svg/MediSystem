# Plan de Pruebas Integral del Sistema - MediSystem

Fecha: 24 de marzo de 2026
Proyecto: MediSystem
Versión: 1.0

---

## 1. Objetivo

Definir y estructurar un plan de pruebas completo para validar el comportamiento funcional, integridad de datos, seguridad y consistencia de todas las tablas del sistema MediSystem:

- roles
- usuarios
- medicos
- pacientes
- citas
- expedientes

Este documento cubre escenarios positivos, negativos, límites, concurrencia y reglas de negocio entre tablas.

---

## 2. Alcance

### 2.1 Incluye

1. Pruebas de API backend (`/api/auth`, `/api/v1`).
2. Pruebas de base de datos por entidad y relaciones.
3. Pruebas de reglas de negocio de sincronización (usuario-medico y usuario-paciente).
4. Pruebas de autorización por rol.
5. Pruebas de flujos de UI críticos (Admin, Medico, Paciente).

### 2.2 Excluye

1. Pruebas de rendimiento a gran escala (stress > 10k usuarios concurrentes).
2. Integraciones externas (pasarelas de pago, servicios de terceros), no existentes en el sistema actual.

---

## 3. Estrategia de pruebas

### 3.1 Niveles

1. Pruebas unitarias de reglas críticas (hash de password, validaciones).
2. Pruebas de integración API + BD.
3. Pruebas end-to-end de flujos por rol.
4. Pruebas de regresión por cada cambio de esquema o rutas.

### 3.2 Tipos

1. Funcionales
2. Integridad referencial
3. Seguridad y permisos
4. Datos y consistencia
5. Usabilidad funcional
6. Resiliencia ante errores

### 3.3 Criterios de entrada

1. Base de datos PostgreSQL disponible.
2. Migraciones aplicadas y cliente Prisma generado.
3. Backend y frontend levantados.
4. Datos base (roles) creados.

### 3.4 Criterios de salida

1. 100% de casos críticos ejecutados.
2. 0 defectos críticos abiertos (Severidad Alta).
3. Cobertura de todas las tablas y relaciones documentada.

---

## 4. Ambiente de pruebas

- Backend: `http://localhost:4000`
- Frontend: `http://localhost:3000`
- API Health: `GET /api/health`
- DB: PostgreSQL (schema Prisma actual)
- Herramientas sugeridas: Postman, Prisma Studio, logs de servidor, Jest/Supertest (si se automatiza)

---

## 5. Matriz de cobertura por tabla

| Tabla | Operaciones objetivo | Validaciones clave |
|---|---|---|
| roles | Crear, consultar | Nombre único, asignación correcta en usuarios |
| usuarios | CRUD, login, estado activo | Email único, hash password, rol válido |
| medicos | CRUD, sync con usuarios | Cédula única, activo, relación con citas/expedientes |
| pacientes | CRUD, vinculación a usuario | usuario_id único, email único, fecha válida |
| citas | CRUD | FK medico_id y paciente_id válidos, estado y fechas |
| expedientes | CRUD parcial (médico), consulta por rol | FK válidas, permisos por rol, ownership médico |

---

## 6. Plan de pruebas por módulo y escenarios

## 6.1 Tabla `roles`

| ID | Escenario | Tipo | Resultado esperado |
|---|---|---|---|
| ROL-01 | Crear rol nuevo con nombre válido | Positivo | Inserción exitosa |
| ROL-02 | Crear rol con nombre duplicado | Negativo | Error por restricción UNIQUE |
| ROL-03 | Consultar catálogo de roles | Consulta | Lista completa y consistente |
| ROL-04 | Asignar rol inexistente a usuario | Integridad | Operación rechazada por FK |

## 6.2 Tabla `usuarios`

| ID | Escenario | Tipo | Resultado esperado |
|---|---|---|---|
| USR-01 | Crear usuario con datos válidos | Positivo | Usuario creado con rol asociado |
| USR-02 | Crear usuario con email duplicado | Negativo | Error de duplicidad |
| USR-03 | Crear usuario sin password | Negativo | Error de validación |
| USR-04 | Actualizar nombre/email/activo | Positivo | Cambios persistidos |
| USR-05 | Actualizar rol de Medico a otro | Regla negocio | Se desactiva perfil médico asociado |
| USR-06 | Eliminar usuario con rol Medico | Regla negocio | Perfil médico asociado se desactiva |
| USR-07 | Login con credenciales correctas | Seguridad | JWT emitido y payload correcto |
| USR-08 | Login con password incorrecto | Seguridad | 401 Credenciales inválidas |
| USR-09 | Login de usuario inactivo | Seguridad | 403 Usuario inactivo |
| USR-10 | Validar hash de password en BD | Seguridad | Password no se guarda en texto plano |

## 6.3 Tabla `medicos`

| ID | Escenario | Tipo | Resultado esperado |
|---|---|---|---|
| MED-01 | Crear médico con cédula única | Positivo | Médico creado |
| MED-02 | Crear médico con cédula duplicada | Negativo | Error por UNIQUE |
| MED-03 | Editar especialidad y contacto | Positivo | Datos actualizados |
| MED-04 | Eliminar médico con citas | Integridad | Se eliminan citas asociadas y luego médico |
| MED-05 | Listado solo muestra médicos activos | Regla negocio | Filtrado correcto |
| MED-06 | Sync crea perfil médico faltante desde usuario rol Medico | Regla negocio | Perfil generado con cédula AUTO-MED-* |
| MED-07 | Cambio de nombre/email en usuario medico sincroniza perfil | Regla negocio | Perfil médico actualizado |
| MED-08 | Usuario deja de ser Medico | Regla negocio | Médico asociado pasa a activo=false |

## 6.4 Tabla `pacientes`

| ID | Escenario | Tipo | Resultado esperado |
|---|---|---|---|
| PAC-01 | Crear paciente con fecha válida | Positivo | Registro creado |
| PAC-02 | Crear paciente sin fecha_nacimiento | Negativo | Error de validación |
| PAC-03 | Editar alergias y tipo de sangre | Positivo | Datos clínicos básicos actualizados |
| PAC-04 | Eliminar paciente con citas existentes | Integridad | Rechazo o manejo controlado según reglas actuales |
| PAC-05 | Vincular paciente a usuario existente | Regla negocio | usuario_id asignado y único |
| PAC-06 | Reutilizar usuario_id en otro paciente | Negativo | Error por UNIQUE |
| PAC-07 | Crear paciente con email duplicado | Negativo | Error por UNIQUE |
| PAC-08 | Alta de usuario Paciente crea espejo en tabla pacientes | Regla negocio | Registro espejo creado/actualizado |

## 6.5 Tabla `citas`

| ID | Escenario | Tipo | Resultado esperado |
|---|---|---|---|
| CIT-01 | Crear cita con medico y paciente válidos | Positivo | Cita creada |
| CIT-02 | Crear cita con medico inexistente | Integridad | Error FK |
| CIT-03 | Crear cita con paciente inexistente | Integridad | Error FK |
| CIT-04 | Crear cita sin motivo | Positivo | Cita creada (motivo opcional) |
| CIT-05 | Editar fecha/hora/estado | Positivo | Cita actualizada |
| CIT-06 | Cambiar estado por flujo operativo | Regla negocio | Estado persistido correctamente |
| CIT-07 | Eliminar cita existente | Positivo | Eliminación exitosa |
| CIT-08 | Listar citas con include medico/paciente | Integración | Respuesta incluye relaciones |
| CIT-09 | Citas por paciente en dashboard paciente | Funcional | Visualiza solo sus citas esperadas |
| CIT-10 | Citas por medico en dashboard médico | Funcional | Se visualizan las asignadas |

## 6.6 Tabla `expedientes`

| ID | Escenario | Tipo | Resultado esperado |
|---|---|---|---|
| EXP-01 | Médico crea expediente con paciente válido | Positivo | Expediente creado |
| EXP-02 | Crear expediente sin diagnostico | Negativo | 400 por campo obligatorio |
| EXP-03 | Paciente intenta crear expediente | Seguridad | 403 prohibido |
| EXP-04 | Médico actualiza expediente creado por él | Positivo | Actualización exitosa |
| EXP-05 | Médico intenta editar expediente de otro médico | Seguridad | 403 prohibido |
| EXP-06 | Paciente consulta sus expedientes | Seguridad | Solo ve los suyos |
| EXP-07 | Médico consulta expedientes | Seguridad | Puede consultar listado permitido |
| EXP-08 | Usuario no autenticado consulta expedientes | Seguridad | 401 no autorizado |

---

## 7. Escenarios de pruebas transversales (multi-tabla)

| ID | Escenario integrado | Tablas impactadas | Resultado esperado |
|---|---|---|---|
| INT-01 | Registro paciente desde `/auth/register` | usuarios, roles, pacientes | Se crean usuario + paciente espejo |
| INT-02 | Alta usuario con rol Medico desde admin | usuarios, roles, medicos | Sync crea/actualiza perfil médico |
| INT-03 | Cambio de rol Medico -> Paciente | usuarios, medicos, pacientes | Médico se desactiva y paciente se sincroniza |
| INT-04 | Baja de usuario medico | usuarios, medicos | Usuario eliminado y médico desactivado |
| INT-05 | Eliminación de médico con citas | medicos, citas | Citas del médico eliminadas antes de borrar médico |
| INT-06 | Creación de cita y posterior expediente | citas, pacientes, medicos, expedientes | Trazabilidad clínica completa |
| INT-07 | Ejecutar `/system-sync` tras cambios masivos | usuarios, medicos, citas | Resumen de conteos consistente |

---

## 8. Pruebas de seguridad y autorización

| ID | Caso | Resultado esperado |
|---|---|---|
| SEG-01 | Token JWT inválido en rutas protegidas | 401 |
| SEG-02 | Sin token en `/expedientes` | 401 |
| SEG-03 | Rol Paciente accede a creación de expediente | 403 |
| SEG-04 | Rol Medico edita expediente ajeno | 403 |
| SEG-05 | Login no filtra existencia de correo | Mensaje genérico de credenciales inválidas |
| SEG-06 | Password almacenado en hash bcrypt | Cumplido |
| SEG-07 | Usuario inactivo intenta login | 403 |

---

## 9. Pruebas de datos límite y calidad

| ID | Escenario | Resultado esperado |
|---|---|---|
| LIM-01 | Nombre con longitud mínima válida | Aceptado |
| LIM-02 | Email con formato inválido | Rechazado en capa API/UI |
| LIM-03 | Fecha de nacimiento futura | Rechazada por validación funcional esperada |
| LIM-04 | Campo alergias con texto largo | Persistencia sin truncamiento indebido |
| LIM-05 | Motivo de cita vacío | Aceptado (opcional) |
| LIM-06 | Alta simultánea de correos iguales | Solo una transacción exitosa |
| LIM-07 | Cédula profesional duplicada concurrente | Solo una transacción exitosa |

---

## 10. Pruebas de regresión sugeridas por sprint

1. Smoke básico:
   - Healthcheck
   - Login admin
   - GET usuarios, medicos, pacientes, citas
2. Regresión funcional:
   - Crear/editar/eliminar usuario
   - Crear/editar/eliminar médico
   - Crear/editar/eliminar paciente
   - Crear/editar/eliminar cita
   - Crear/editar expediente con médico
3. Regresión de permisos:
   - Paciente no crea expediente
   - Médico no edita expediente ajeno
4. Regresión de sincronización:
   - `/system-sync`
   - Cambio de rol en usuario médico

---

## 11. Priorización de ejecución

### 11.1 Prioridad Alta (P1)

- USR-02, USR-07, USR-08, USR-09
- MED-02, MED-06, MED-08
- CIT-02, CIT-03, CIT-05
- EXP-03, EXP-05, EXP-08
- INT-01, INT-02, INT-05

### 11.2 Prioridad Media (P2)

- USR-04, USR-05, MED-03, PAC-03, CIT-08, EXP-06, INT-03, INT-07

### 11.3 Prioridad Baja (P3)

- Casos de UX no bloqueantes y mejoras visuales.

---

## 12. Evidencias requeridas por caso

Cada ejecución de caso debe guardar:

1. ID del caso.
2. Fecha y ejecutor.
3. Request/response (si API).
4. Captura de pantalla (si UI).
5. Estado final en BD (consulta validada).
6. Resultado: Aprobado / Fallido / Bloqueado.

---

## 13. Riesgos y mitigaciones

| Riesgo | Impacto | Mitigación |
|---|---|---|
| Inconsistencia entre usuarios y medicos | Alto | Ejecutar pruebas de sync en cada release |
| Errores por datos duplicados concurrentes | Alto | Validar UNIQUE y transacciones |
| Exposición de expedientes por permisos | Crítico | Pruebas de autorización por rol en cada build |
| Dependencia de datos demo en dashboard paciente | Medio | Parametrizar por usuario autenticado |

---

## 14. Conclusión

Este plan de pruebas integral cubre todas las tablas del sistema y los principales escenarios de operación, seguridad e integridad para MediSystem. Su aplicación sistemática permite detectar regresiones tempranas, fortalecer reglas de negocio y garantizar confiabilidad operativa en los módulos de Administrador, Médico y Paciente.
