# Entrega I - Definicion del Proyecto (MediSystem)

Fecha: 20 de marzo de 2026

## 1.1 Descripcion del problema

En entornos clinicos pequenos y medianos, la gestion de citas, usuarios y datos basicos de atencion suele realizarse de forma fragmentada (hojas de calculo, mensajeria informal o sistemas no integrados). Esto genera problemas operativos recurrentes:

- Duplicidad o inconsistencia de informacion de pacientes y personal medico.
- Dificultad para coordinar agendas y estados de citas en tiempo real.
- Tiempos de respuesta altos para tareas administrativas.
- Falta de trazabilidad y control centralizado sobre accesos y roles.
- Riesgo de errores por procesos manuales y poca estandarizacion.

Como resultado, se afecta la calidad del servicio, se incrementa la carga administrativa y se reduce la capacidad de seguimiento oportuno de la operacion diaria.

## 1.2 Objetivo del sistema

Disenar e implementar un sistema web llamado MediSystem que centralice la administracion de usuarios, medicos, pacientes y citas, mediante una plataforma con autenticacion por roles y modulos de gestion que permitan:

- Organizar la operacion clinica basica en una unica herramienta.
- Reducir errores de captura y coordinacion.
- Mejorar la visibilidad del estado de citas y recursos.
- Facilitar la toma de decisiones operativas con informacion actualizada.

Objetivo especifico medible:

- Disminuir el tiempo promedio de gestion administrativa diaria, pasando de procesos manuales dispersos a flujos digitales centralizados con actualizacion inmediata de datos.

## 1.3 Alcance del proyecto

### Alcance funcional (incluido)

MediSystem contempla los siguientes modulos principales en su version actual:

- Autenticacion y control de acceso por roles (Administrador, Medico, Paciente).
- Registro e inicio de sesion para usuarios.
- Gestion de usuarios (alta, consulta, actualizacion y baja segun perfil autorizado).
- Gestion de medicos (alta, consulta, actualizacion y baja).
- Gestion de pacientes (alta, consulta, actualizacion y baja).
- Gestion de citas (programacion, actualizacion de estado y eliminacion).
- Paneles diferenciados por rol para administracion y consulta operativa.
- API REST para integracion entre frontend y backend.

### Alcance tecnico (incluido)

- Frontend web con Next.js y React.
- Backend con Node.js, Express y TypeScript.
- Persistencia de datos en PostgreSQL mediante Prisma ORM.
- Seguridad base con JWT, hash de contrasenas con bcrypt y middlewares de proteccion.

### Fuera de alcance (esta fase/entrega)

- Modulo completo de expediente clinico detallado como componente operativo principal.
- Integraciones con sistemas externos hospitalarios (HIS/ERP/LIS).
- Facturacion, inventario farmaceutico y telemedicina.
- Aplicacion movil nativa.
- Reporteria avanzada con BI y analitica predictiva.

## 1.4 Identificacion de stakeholders

### Stakeholders internos

- Administrador del sistema:
  Responsable de operar modulos de alta prioridad (usuarios, medicos, pacientes, citas) y supervisar la consistencia de la informacion.

- Personal medico:
  Usuario que requiere consultar agenda y datos operativos de pacientes para atencion coordinada.

- Pacientes:
  Usuarios finales que necesitan acceder a su informacion basica y gestionar/consultar citas.

- Equipo de desarrollo:
  Responsable del analisis, construccion, pruebas, despliegue y mantenimiento evolutivo de la plataforma.

### Stakeholders externos o institucionales

- Direccion/administracion de la clinica:
  Interesada en eficiencia operativa, calidad de servicio y reduccion de errores administrativos.

- Area de soporte TI:
  Encargada de infraestructura, respaldo, disponibilidad y soporte tecnico del sistema en operacion.

- Entidad academica/evaluadora del proyecto:
  Interesada en la calidad del proceso de ingenieria de software, documentacion y evidencia de cumplimiento por fases.

## 1.5 Descripcion general del sistema

MediSystem es una aplicacion web de arquitectura cliente-servidor orientada a la gestion clinica administrativa.

### Vision general de funcionamiento

1. El usuario accede al sistema desde navegador web.
2. El frontend valida credenciales contra el backend.
3. El backend autentica al usuario, genera token JWT y determina su rol.
4. Con base en el rol, el frontend redirige al dashboard correspondiente.
5. Cada modulo (usuarios, medicos, pacientes, citas) consume la API REST para operaciones CRUD.
6. Prisma gestiona la persistencia y relaciones en PostgreSQL.

### Componentes principales

- Capa de presentacion:
  Interfaz web con rutas para login, registro y paneles por rol.

- Capa de logica de negocio:
  API Express con controladores de autenticacion y gestion de entidades principales.

- Capa de datos:
  Modelo relacional con entidades clave (roles, usuarios, medicos, pacientes, citas y expediente en evolucion).

### Beneficio esperado

La implementacion de MediSystem permite centralizar procesos administrativos, mejorar la trazabilidad de la operacion diaria y establecer una base tecnologica escalable para futuras ampliaciones funcionales del sistema.

---

## Conclusiones de la Entrega I

La definicion del problema confirma la necesidad de digitalizar y centralizar la gestion clinica basica. Con el objetivo, alcance, stakeholders y descripcion general ya formalizados, el proyecto queda preparado para continuar con fases de diseno detallado, construccion incremental y validacion con pruebas.
