# Entrega III - Codificación: MediSystem

A continuación se encuentra el material técnico exacto para integrar en el documento PDF de la Entrega 3. 

## 3.1 Diseño Final de la Base de Datos (Modelo E-R)

```mermaid
erDiagram
    ROLES {
        int id_rol PK
        string nombre UK
        text descripcion
    }
    USUARIOS {
        int id_usuario PK
        string nombre
        string email UK
        string password
        int rol_id FK
        boolean activo
        datetime fecha_creacion
    }
    MEDICOS {
        int id_medico PK
        string nombre
        string especialidad
        string cedula_profesional UK
        string telefono
        string email
        boolean activo
    }
    PACIENTES {
        int id_paciente PK
        string nombre
        date fecha_nacimiento
        string telefono
        string tipo_sangre
        text alergias
        boolean activo
        datetime fecha_registro
    }
    CITAS {
        int id_cita PK
        int medico_id FK
        int paciente_id FK
        date fecha
        time hora
        string estado
        text motivo
        datetime fecha_creacion
    }

    ROLES ||--o{ USUARIOS : "Asignado a"
    MEDICOS ||--o{ CITAS : "Atiende"
    PACIENTES ||--o{ CITAS : "Programa"
```

## 3.2 Pantallas Finales del Sistema
Las pantallas creadas están en el proyecto ejecutando `npm run dev` en el directorio `frontend/`. 
1. **Login Dinámico:** `/` (Intercepción por roles: *admin* o *medico* en el correo redirige automáticamante).
2. **Dashboard de Administración:** `/dashboard/administrador` (Métricas en tiempo real, médicos, pacientes y citas).

## 3.3 Diagrama Final de la Arquitectura

```mermaid
graph TD
    subgraph Capa de Presentación [Frontend: Next.js + TailwindCSS + Redux]
        UI[Interfaces Web / React 18]
        StateMode[Gestor de Estado - Redux Persist]
        AxiosHTTP[Cliente HTTP Axios]
    end

    subgraph Capa de Lógica de Negocio [Backend: Node.js + Express.js]
        Router[API Routing - Express v5]
        Controllers[Controladores Médicos/Auth/Pacientes]
        Middleware[Seguridad: Helmet, Cors, JWT]
        ORM[Prisma ORM - Mapeo de Datos]
    end

    subgraph Capa de Datos [Base de Datos]
        DB[(PostgreSQL)]
    end

    UI --> StateMode
    StateMode --> AxiosHTTP
    AxiosHTTP -- Peticiones REST / JSON --> Middleware
    Middleware --> Router
    Router --> Controllers
    Controllers --> ORM
    ORM -- Consultas SQL Tipadas --> DB
```

## 3.4 Código Fuente (Funcionalidades Básicas)

El proyecto completo ha sido estructurado en:
- `backend/prisma/schema.prisma`: Control de tipos de BD e inyecciones.
- `backend/src/controllers/authController.ts`: Inicio de sesión, JWT (Roles).
- `backend/src/index.ts`: Arquitectura Express principal.
- `frontend/src/app/page.tsx`: Pantalla de Login (React Server Components).
- `frontend/src/app/dashboard/administrador/page.tsx`: Pantalla principal del perfil administrador.
