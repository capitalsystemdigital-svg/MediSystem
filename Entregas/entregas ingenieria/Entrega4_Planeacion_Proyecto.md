# Entrega 4 - Planeación del Proyecto: MediSystem

Fecha: 17 de abril de 2026  
Proyecto: MediSystem  
Versión: 1.0

---

## 4.1 Organización del Equipo

### 4.1.1 Estructura del equipo

MediSystem es desarrollado por un equipo multidisciplinario de cinco integrantes con roles complementarios. La estructura es horizontal con un coordinador de proyecto, favoreciendo la colaboración continua y la toma de decisiones consensuada.

| # | Nombre / Rol | Responsabilidades principales |
|---|---|---|
| 1 | **Coordinador de Proyecto** | Planificación y seguimiento, gestión de riesgos, control de entregables, comunicación con stakeholders. |
| 2 | **Analista de Requerimientos** | Levantamiento de requerimientos funcionales y no funcionales, elaboración del SRS, historias de usuario, casos de uso y validación con usuarios. |
| 3 | **Arquitecto / Desarrollador Backend** | Diseño de la arquitectura, API REST (Node.js + Express + TypeScript), autenticación JWT, integración con Prisma ORM y PostgreSQL. |
| 4 | **Desarrollador Frontend** | Implementación de interfaces en Next.js + React, dashboards por rol, conexión con la API, manejo de estado y sesión. |
| 5 | **Ingeniero de Calidad (QA) / DevOps** | Diseño y ejecución de pruebas (unitarias, integración, UI), revisión de seguridad, configuración del entorno de despliegue. |

### 4.1.2 Modelo de colaboración

- **Control de versiones:** Git con repositorio centralizado en GitHub; flujo de trabajo basado en ramas por funcionalidad (`feature/*`), rama de integración (`develop`) y rama estable (`main`).
- **Reuniones:** Sincronización semanal de 30 minutos para revisión de avance; sesiones de revisión antes de cada entrega.
- **Comunicación:** Canal de mensajería instantánea para comunicación diaria; tablero Kanban para visibilidad del estado de tareas.
- **Revisión de código:** Todo cambio a `develop` o `main` requiere revisión de al menos un integrante antes de fusionar.

### 4.1.3 Responsabilidades por módulo

| Módulo | Responsable principal | Apoyo |
|---|---|---|
| Autenticación y JWT | Arquitecto Backend | QA |
| CRUD Usuarios / Roles | Arquitecto Backend | Analista |
| CRUD Médicos | Arquitecto Backend | Desarrollador Frontend |
| CRUD Pacientes | Arquitecto Backend | Desarrollador Frontend |
| CRUD Citas | Arquitecto Backend | Desarrollador Frontend |
| Expedientes | Arquitecto Backend | QA |
| Dashboard Administrador | Desarrollador Frontend | Coordinador |
| Dashboard Médico | Desarrollador Frontend | Analista |
| Dashboard Paciente | Desarrollador Frontend | Analista |
| Plan de pruebas e integración | QA | Arquitecto Backend |
| Documentación de entregas | Analista | Coordinador |
| Despliegue y CI | QA / DevOps | Arquitecto Backend |

---

## 4.2 WBS (Work Breakdown Structure)

La WBS descompone el proyecto en paquetes de trabajo organizados jerárquicamente. El nivel superior representa las fases del proyecto; los niveles inferiores detallan las actividades concretas.

```
1. MediSystem
│
├── 1.1 Gestión del Proyecto
│   ├── 1.1.1 Definición de alcance y objetivos
│   ├── 1.1.2 Elaboración del plan del proyecto (WBS, cronograma, riesgos)
│   ├── 1.1.3 Seguimiento y control de avance
│   ├── 1.1.4 Gestión de riesgos activos
│   └── 1.1.5 Cierre y entrega final del proyecto
│
├── 1.2 Análisis y Requerimientos
│   ├── 1.2.1 Identificación de stakeholders
│   ├── 1.2.2 Levantamiento de requerimientos funcionales (RF)
│   ├── 1.2.3 Levantamiento de requerimientos no funcionales (RNF)
│   ├── 1.2.4 Elaboración del SRS
│   ├── 1.2.5 Definición de historias de usuario
│   └── 1.2.6 Validación de requerimientos con stakeholders
│
├── 1.3 Diseño del Sistema
│   ├── 1.3.1 Diseño de arquitectura (capas, componentes)
│   ├── 1.3.2 Diseño del modelo de base de datos
│   ├── 1.3.3 Diagrama de clases UML
│   ├── 1.3.4 Diagramas de secuencia (login, citas, médico, paciente, admin)
│   ├── 1.3.5 Diagrama de casos de uso
│   └── 1.3.6 Diseño de mockups e interfaz de usuario
│
├── 1.4 Desarrollo del Backend
│   ├── 1.4.1 Configuración del entorno (Node.js, TypeScript, Express)
│   ├── 1.4.2 Configuración de Prisma ORM y conexión a PostgreSQL
│   ├── 1.4.3 Definición y migración del esquema de base de datos
│   ├── 1.4.4 Seed de datos iniciales (roles, usuario administrador)
│   ├── 1.4.5 Módulo de autenticación (login, registro, JWT, bcrypt)
│   ├── 1.4.6 CRUD de Usuarios
│   ├── 1.4.7 CRUD de Médicos (con sincronización usuario-médico)
│   ├── 1.4.8 CRUD de Pacientes (con sincronización usuario-paciente)
│   ├── 1.4.9 CRUD de Citas
│   ├── 1.4.10 CRUD de Expedientes
│   └── 1.4.11 Configuración de middlewares (helmet, cors, morgan)
│
├── 1.5 Desarrollo del Frontend
│   ├── 1.5.1 Configuración del entorno (Next.js, Tailwind CSS)
│   ├── 1.5.2 Página de inicio y enrutamiento general
│   ├── 1.5.3 Módulo de Login y Registro
│   ├── 1.5.4 Dashboard Administrador (gestión de usuarios, médicos, pacientes, citas)
│   ├── 1.5.5 Dashboard Médico (consulta de agenda y pacientes)
│   ├── 1.5.6 Dashboard Paciente (consulta de citas y perfil)
│   └── 1.5.7 Integración frontend-backend (Axios, manejo de tokens y sesión)
│
├── 1.6 Pruebas y Aseguramiento de Calidad
│   ├── 1.6.1 Elaboración del plan de pruebas
│   ├── 1.6.2 Pruebas unitarias de controladores (backend)
│   ├── 1.6.3 Pruebas de integración de API (endpoints)
│   ├── 1.6.4 Pruebas de base de datos (por entidad y relaciones)
│   ├── 1.6.5 Pruebas de flujos de interfaz de usuario
│   ├── 1.6.6 Pruebas de autorización por rol
│   ├── 1.6.7 Pruebas de seguridad básica (JWT, hash, CORS)
│   └── 1.6.8 Corrección de defectos identificados
│
└── 1.7 Despliegue y Documentación
    ├── 1.7.1 Configuración del entorno de producción
    ├── 1.7.2 Despliegue del backend
    ├── 1.7.3 Despliegue del frontend
    ├── 1.7.4 Validación del sistema en producción
    ├── 1.7.5 Elaboración de documentación técnica final
    └── 1.7.6 Elaboración de informe de evidencia de ejecución
```

### 4.2.1 Descripción de paquetes de trabajo clave

| ID | Paquete de Trabajo | Descripción |
|---|---|---|
| 1.4.5 | Módulo de autenticación | Implementación de los endpoints `/api/auth/login` y `/api/auth/register` con generación de tokens JWT, hashing con bcrypt y redirección por rol. |
| 1.4.7 | CRUD de Médicos | Alta, consulta, actualización y baja de médicos, incluyendo la lógica de sincronización bidireccional con la entidad `Usuario`. |
| 1.5.4 | Dashboard Administrador | Panel completo con tablas de gestión, formularios modales para CRUD de usuarios, médicos, pacientes y citas, con actualización en tiempo real vía API. |
| 1.6.3 | Pruebas de integración API | Colección de pruebas Postman/Jest para todos los endpoints bajo `/api/v1` y `/api/auth`, verificando estados HTTP, estructuras de respuesta y manejo de errores. |
| 1.7.1 | Configuración de producción | Variables de entorno, configuración de base de datos en producción, revisión de configuraciones de seguridad (CORS, HTTPS, JWT_SECRET). |

---

## 4.3 Cronograma del Proyecto

### 4.3.1 Hitos principales

| # | Hito | Fecha objetivo | Estado |
|---|---|---|---|
| M1 | Entrega I — Definición del proyecto | 20 mar 2026 | ✅ Completado |
| M2 | Entrega II — Ingeniería de requerimientos y casos de uso | 20 mar 2026 | ✅ Completado |
| M3 | Entrega III — Arquitectura, BD, UML y Mockups | 24 mar 2026 | ✅ Completado |
| M4 | Entrega IV — Planeación del proyecto | 17 abr 2026 | 🔄 En curso |
| M5 | Implementación completa del backend | 25 abr 2026 | ⬜ Pendiente |
| M6 | Implementación completa del frontend | 02 may 2026 | ⬜ Pendiente |
| M7 | Ciclo de pruebas y corrección de defectos | 09 may 2026 | ⬜ Pendiente |
| M8 | Despliegue en ambiente de producción | 14 may 2026 | ⬜ Pendiente |
| M9 | Entrega final — Evidencias y documentación | 17 may 2026 | ⬜ Pendiente |

### 4.3.2 Cronograma detallado por fase

| ID Actividad | Actividad | Responsable | Inicio | Fin | Duración (días) | Dependencias |
|---|---|---|---|---|---|---|
| **FASE 1: Gestión** | | | | | | |
| A-1.1 | Definición de alcance y objetivos | Coordinador + Analista | 10 mar 2026 | 19 mar 2026 | 10 | — |
| A-1.2 | Plan del proyecto (WBS, cronograma, riesgos) | Coordinador | 10 abr 2026 | 17 abr 2026 | 8 | A-1.1 |
| **FASE 2: Análisis** | | | | | | |
| A-2.1 | Levantamiento de requerimientos y SRS | Analista | 10 mar 2026 | 19 mar 2026 | 10 | A-1.1 |
| A-2.2 | Historias de usuario y casos de uso | Analista | 12 mar 2026 | 20 mar 2026 | 9 | A-2.1 |
| **FASE 3: Diseño** | | | | | | |
| A-3.1 | Arquitectura y modelo de BD | Arquitecto | 20 mar 2026 | 24 mar 2026 | 5 | A-2.1 |
| A-3.2 | Diagramas UML (clases, secuencia) | Arquitecto + Analista | 20 mar 2026 | 24 mar 2026 | 5 | A-2.2 |
| A-3.3 | Mockups de interfaz | Desarrollador FE | 21 mar 2026 | 24 mar 2026 | 4 | A-2.2 |
| **FASE 4: Desarrollo Backend** | | | | | | |
| A-4.1 | Configuración entorno + Prisma + PostgreSQL | Arquitecto | 25 mar 2026 | 28 mar 2026 | 4 | A-3.1 |
| A-4.2 | Módulo de autenticación (JWT, bcrypt) | Arquitecto | 29 mar 2026 | 02 abr 2026 | 5 | A-4.1 |
| A-4.3 | CRUD Usuarios y Roles | Arquitecto | 03 abr 2026 | 07 abr 2026 | 5 | A-4.2 |
| A-4.4 | CRUD Médicos y sincronización | Arquitecto | 08 abr 2026 | 11 abr 2026 | 4 | A-4.3 |
| A-4.5 | CRUD Pacientes y sincronización | Arquitecto | 08 abr 2026 | 11 abr 2026 | 4 | A-4.3 |
| A-4.6 | CRUD Citas y Expedientes | Arquitecto | 12 abr 2026 | 17 abr 2026 | 6 | A-4.4, A-4.5 |
| A-4.7 | Middlewares y configuración de seguridad | Arquitecto + QA | 17 abr 2026 | 19 abr 2026 | 3 | A-4.6 |
| **FASE 5: Desarrollo Frontend** | | | | | | |
| A-5.1 | Configuración Next.js + Tailwind | Desarrollador FE | 25 mar 2026 | 27 mar 2026 | 3 | A-3.3 |
| A-5.2 | Módulo Login / Register | Desarrollador FE | 29 mar 2026 | 02 abr 2026 | 5 | A-4.2, A-5.1 |
| A-5.3 | Dashboard Administrador | Desarrollador FE | 08 abr 2026 | 17 abr 2026 | 10 | A-4.3, A-5.2 |
| A-5.4 | Dashboard Médico | Desarrollador FE | 18 abr 2026 | 24 abr 2026 | 7 | A-4.4, A-5.3 |
| A-5.5 | Dashboard Paciente | Desarrollador FE | 18 abr 2026 | 24 abr 2026 | 7 | A-4.5, A-5.3 |
| A-5.6 | Integración Axios + manejo de sesión | Desarrollador FE | 25 abr 2026 | 28 abr 2026 | 4 | A-5.4, A-5.5 |
| **FASE 6: Pruebas** | | | | | | |
| A-6.1 | Plan de pruebas | QA | 01 abr 2026 | 05 abr 2026 | 5 | A-2.2 |
| A-6.2 | Pruebas de API (endpoints, autorización) | QA | 20 abr 2026 | 25 abr 2026 | 6 | A-4.7 |
| A-6.3 | Pruebas de UI y flujos por rol | QA | 29 abr 2026 | 04 may 2026 | 6 | A-5.6 |
| A-6.4 | Pruebas de base de datos y reglas de negocio | QA + Arquitecto | 29 abr 2026 | 04 may 2026 | 6 | A-4.7 |
| A-6.5 | Corrección de defectos | Arquitecto + Dev FE | 05 may 2026 | 09 may 2026 | 5 | A-6.2, A-6.3 |
| **FASE 7: Despliegue y Cierre** | | | | | | |
| A-7.1 | Configuración ambiente de producción | QA / DevOps | 10 may 2026 | 12 may 2026 | 3 | A-6.5 |
| A-7.2 | Despliegue y validación en producción | QA / DevOps + Arquitecto | 12 may 2026 | 14 may 2026 | 3 | A-7.1 |
| A-7.3 | Documentación técnica final y evidencias | Analista + Coordinador | 14 may 2026 | 17 may 2026 | 4 | A-7.2 |

### 4.3.3 Representación del cronograma (Diagrama de Gantt textual)

```
Actividad                         | Mar 10 | Mar 20 | Mar 24 | Abr 01 | Abr 17 | Abr 30 | May 09 | May 17
----------------------------------|--------|--------|--------|--------|--------|--------|--------|--------
[FASE 1] Gestión del proyecto     |======= |        |        |        |========|        |        |
[FASE 2] Análisis                 |========|======  |        |        |        |        |        |
[FASE 3] Diseño                   |        |========|===     |        |        |        |        |
[FASE 4] Backend                  |        |        |        |========|========|=====   |        |
[FASE 5] Frontend                 |        |        |   =====|======  |========|====    |        |
[FASE 6] Pruebas                  |        |        |        |====    |        |========|====    |
[FASE 7] Despliegue y cierre      |        |        |        |        |        |        |========|=====

Hitos:  M1,M2                     M3              M4                         M5,M6    M7  M8  M9
```

---

## 4.4 Matriz de Riesgos

La matriz de riesgos identifica las amenazas que pueden afectar el éxito del proyecto, evaluando probabilidad e impacto para priorizar acciones de mitigación.

### 4.4.1 Escalas de valoración

**Probabilidad:**
| Nivel | Descripción | Valor |
|---|---|---|
| Muy baja | Poco probable que ocurra | 1 |
| Baja | Posible pero no esperada | 2 |
| Media | Puede ocurrir en condiciones normales | 3 |
| Alta | Es probable que ocurra | 4 |
| Muy alta | Se espera que ocurra | 5 |

**Impacto:**
| Nivel | Descripción | Valor |
|---|---|---|
| Muy bajo | Efecto mínimo sin consecuencias visibles | 1 |
| Bajo | Ligero retraso o esfuerzo adicional menor | 2 |
| Medio | Retraso moderado o reducción de alcance parcial | 3 |
| Alto | Afecta un módulo entero o una entrega | 4 |
| Muy alto | Compromete la entrega del sistema completo | 5 |

**Nivel de riesgo = Probabilidad × Impacto**

| Puntuación | Clasificación | Color |
|---|---|---|
| 1 – 4 | Bajo | 🟢 |
| 5 – 9 | Moderado | 🟡 |
| 10 – 14 | Alto | 🟠 |
| 15 – 25 | Crítico | 🔴 |

---

### 4.4.2 Registro de riesgos

| ID | Categoría | Riesgo | Causa raíz | Prob. (1-5) | Imp. (1-5) | Nivel | Clasificación | Estrategia | Plan de mitigación | Responsable | Plan de contingencia |
|---|---|---|---|---|---|---|---|---|---|---|---|
| R-01 | Técnico | Incompatibilidad de versiones entre dependencias del stack (Next.js, Express, Prisma) | Actualizaciones no coordinadas entre paquetes | 3 | 4 | 12 | 🟠 Alto | Mitigar | Fijar versiones exactas en `package.json`; revisar changelogs antes de actualizar; usar `npm ci` en CI/CD. | Arquitecto Backend | Revertir versión conflictiva; aislar módulo afectado y continuar con versión estable. |
| R-02 | Técnico | Falla o pérdida de la conexión con la base de datos PostgreSQL | Configuración incorrecta de variables de entorno o caída del servicio | 2 | 5 | 10 | 🟠 Alto | Mitigar | Validar configuración de `DATABASE_URL` desde etapas tempranas; definir manejo de errores en Prisma Client; backups periódicos del esquema y datos de prueba. | Arquitecto Backend | Restaurar desde backup; usar base de datos local durante diagóstico. |
| R-03 | Seguridad | Exposición de tokens JWT o credenciales por mala configuración | Almacenamiento inseguro en `localStorage` sin rotación de tokens; secretos en código | 3 | 5 | 15 | 🔴 Crítico | Mitigar | Usar variables de entorno para `JWT_SECRET`; establecer tiempo de expiración corto (8h); no exponer tokens en logs ni en respuestas de error. | QA + Arquitecto | Rotar secreto inmediatamente; invalidar sesiones activas; auditoría de código del módulo de autenticación. |
| R-04 | Planificación | Retraso en el desarrollo por subestimación de complejidad de módulos | Falta de experiencia con algunos componentes del stack (Prisma, Next.js App Router) | 4 | 4 | 16 | 🔴 Crítico | Mitigar | Reservar buffer del 20% en el cronograma; identificar módulos de alta complejidad en la WBS; hacer picos técnicos tempranos para validar enfoque. | Coordinador | Reducir alcance de funcionalidades secundarias; redistribuir tareas entre integrantes disponibles. |
| R-05 | Equipo | Indisponibilidad temporal de uno o más integrantes | Compromisos académicos o personales que coincidan con fechas clave | 3 | 3 | 9 | 🟡 Moderado | Mitigar | Documentar código y decisiones de diseño continuamente; repartir conocimiento entre integrantes (no crear dependencias de persona única). | Coordinador | Redistribuir tareas; priorizar funcionalidades críticas; comunicar riesgo de entrega al equipo. |
| R-06 | Técnico | Errores en la sincronización usuario-médico y usuario-paciente | Lógica transaccional incompleta en el backend al crear/eliminar registros relacionados | 3 | 4 | 12 | 🟠 Alto | Mitigar | Usar transacciones de Prisma (`$transaction`); incluir pruebas de integración específicas que cubran flujos de creación y eliminación en cascada. | Arquitecto Backend | Reescribir la lógica de sincronización; ejecutar suite de pruebas de regresión completa. |
| R-07 | Seguridad | Inyección de datos maliciosos en formularios o endpoints (SQL Injection, XSS) | Falta de validación y sanitización de entradas en frontend y backend | 2 | 5 | 10 | 🟠 Alto | Mitigar | Usar Prisma como ORM parametrizado (previene SQL Injection por defecto); validar y sanitizar entradas en backend; aplicar `helmet` para cabeceras HTTP seguras. | QA + Arquitecto | Parchear endpoint o componente afectado; revisar todos los puntos de entrada del sistema. |
| R-08 | Técnico | Fallo en el despliegue del sistema en el entorno de producción | Diferencias entre entorno local y producción (variables, versiones, puertos) | 3 | 4 | 12 | 🟠 Alto | Mitigar | Documentar y versionar configuración del entorno (`docker-compose`, `.env.example`); hacer prueba de despliegue anticipada en sprint previo a la entrega final. | QA / DevOps | Revertir a versión anterior; desplegar en entorno alternativo; ajustar configuración y re-ejecutar. |
| R-09 | Calidad | Insuficiente cobertura de pruebas antes de la entrega | Presión de tiempo hace que se omitan pruebas de casos límite y negativos | 4 | 3 | 12 | 🟠 Alto | Mitigar | Integrar pruebas desde el inicio del desarrollo (no al final); definir criterios de aceptación mínimos por entidad en el plan de pruebas. | QA | Ejecutar pruebas manuales de los flujos críticos prioritarios (login, citas, autenticación por rol). |
| R-10 | Planificación | Cambio en los requerimientos durante el desarrollo | Solicitudes de ajuste por parte de stakeholders o profesor después del SRS aprobado | 2 | 4 | 8 | 🟡 Moderado | Aceptar + Mitigar | Establecer congelamiento de requerimientos desde Entrega II; gestionar cambios mediante control formal (log de cambios, impacto en cronograma). | Analista + Coordinador | Evaluar impacto en WBS y cronograma; negociar alcance reducido si el cambio compromete la entrega. |
| R-11 | Técnico | Problemas de rendimiento en el frontend por carga de datos grandes | Consultas sin paginación o filtrado que devuelven todos los registros a la vez | 2 | 3 | 6 | 🟡 Moderado | Mitigar | Implementar paginación básica en los endpoints de listado desde el diseño de la API; limitar el número de registros por respuesta. | Arquitecto Backend | Implementar paginación de forma reactiva; añadir loading states en la UI. |
| R-12 | Organizacional | Falta de comunicación efectiva entre integrantes del equipo | Decisiones no documentadas; comprensión diferente del mismo requerimiento | 2 | 3 | 6 | 🟡 Moderado | Mitigar | Mantener actas de reunión o notas de decisiones en el repositorio; revisiones de código cruzadas; tablero Kanban actualizado. | Coordinador | Reunión de alineación urgente; revisión conjunta del código o documento afectado. |

---

### 4.4.3 Mapa visual de riesgos (Probabilidad vs. Impacto)

```
Impacto →
         | Muy bajo | Bajo | Medio | Alto | Muy alto
---------|----------|------|-------|------|----------
Muy alta |          |      |       |      |
  Alta   |          |      | R-09  | R-04 |
  Media  |          |      | R-05  | R-01 | R-03
         |          |      | R-12  | R-06 | R-07
         |          |      | R-11  | R-08 |
  Baja   |          |      | R-10  |      | R-02
Muy baja |          |      |       |      |

Leyenda:  🟢 Bajo (1-4)  🟡 Moderado (5-9)  🟠 Alto (10-14)  🔴 Crítico (15-25)
```

### 4.4.4 Resumen de riesgos por clasificación

| Clasificación | Riesgos | Cantidad |
|---|---|---|
| 🔴 Crítico (15-25) | R-03 (Seguridad JWT), R-04 (Retraso por complejidad) | 2 |
| 🟠 Alto (10-14) | R-01 (Incompatibilidad deps), R-02 (Fallo BD), R-06 (Sincronización), R-07 (Inyección), R-08 (Despliegue), R-09 (Pruebas) | 6 |
| 🟡 Moderado (5-9) | R-05 (Indisponibilidad equipo), R-10 (Cambio requerimientos), R-11 (Rendimiento), R-12 (Comunicación) | 4 |
| 🟢 Bajo (1-4) | — | 0 |

> **Acciones prioritarias:** Atender inmediatamente R-03 (seguridad de autenticación) y R-04 (gestión del cronograma), dado que su nivel crítico puede comprometer la entrega del sistema completo. Los riesgos altos (R-01, R-02, R-06, R-07, R-08, R-09) deben ser monitoreados en cada sincronización semanal.
