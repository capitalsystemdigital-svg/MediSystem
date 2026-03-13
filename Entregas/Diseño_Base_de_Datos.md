# Estructura Real de la Base de Datos - MediSystem

Este documento muestra las tablas y relaciones tal como están definidas exactamente en el archivo `schema.prisma` del sistema.

## Modelo Entidad-Relación (E-R) Técnico

```mermaid
erDiagram
    roles ||--o{ usuarios : "rol_id"
    medicos ||--o{ citas : "medico_id"
    pacientes ||--o{ citas : "paciente_id"

    roles {
        Int id_rol PK
        String nombre
        String descripcion
    }

    usuarios {
        Int id_usuario PK
        String nombre
        String email
        String password
        Int rol_id FK
        Boolean activo
        DateTime fecha_creacion
    }

    medicos {
        Int id_medico PK
        String nombre
        String especialidad
        String cedula_profesional
        String telefono
        String email
        Boolean activo
    }

    pacientes {
        Int id_paciente PK
        String nombre
        DateTime fecha_nacimiento
        String telefono
        String tipo_sangre
        String alergias
        Boolean activo
        DateTime fecha_registro
    }

    citas {
        Int id_cita PK
        Int medico_id FK
        Int paciente_id FK
        DateTime fecha
        DateTime hora
        String estado
        String motivo
        DateTime fecha_creacion
    }
```

## Detalle de Tablas (Esquema Técnico)

### 1. Tabla: `roles`
| Campo | Tipo | Atributos |
| :--- | :--- | :--- |
| `id_rol` | Int | Primary Key, Autoincrement |
| `nombre` | String | Unique |
| `descripcion` | String | Opcional |

### 2. Tabla: `usuarios`
| Campo | Tipo | Atributos |
| :--- | :--- | :--- |
| `id_usuario` | Int | Primary Key, Autoincrement |
| `nombre` | String | |
| `email` | String | Unique |
| `password` | String | |
| `rol_id` | Int | Foreign Key (roles.id_rol) |
| `activo` | Boolean | Default: true |
| `fecha_creacion` | DateTime | Default: now() |

### 3. Tabla: `medicos`
| Campo | Tipo | Atributos |
| :--- | :--- | :--- |
| `id_medico` | Int | Primary Key, Autoincrement |
| `nombre` | String | |
| `especialidad` | String | |
| `cedula_profesional` | String | Unique |
| `telefono` | String | Opcional |
| `email` | String | Opcional |
| `activo` | Boolean | Default: true |

### 4. Tabla: `pacientes`
| Campo | Tipo | Atributos |
| :--- | :--- | :--- |
| `id_paciente` | Int | Primary Key, Autoincrement |
| `nombre` | String | |
| `fecha_nacimiento` | DateTime | |
| `telefono` | String | Opcional |
| `tipo_sangre` | String | Opcional |
| `alergias` | String | Opcional |
| `activo` | Boolean | Default: true |
| `fecha_registro` | DateTime | Default: now() |

### 5. Tabla: `citas`
| Campo | Tipo | Atributos |
| :--- | :--- | :--- |
| `id_cita` | Int | Primary Key, Autoincrement |
| `medico_id` | Int | Foreign Key (medicos.id_medico) |
| `paciente_id` | Int | Foreign Key (pacientes.id_paciente) |
| `fecha` | DateTime | |
| `hora` | DateTime | |
| `estado` | String | Default: "Pendiente" |
| `motivo` | String | Opcional |
| `fecha_creacion` | DateTime | Default: now() |

---

**Nota:** La imagen visual con **diseño sencillo** se encuentra en el archivo `diseno_sencillo_db.png` dentro de esta misma carpeta.
