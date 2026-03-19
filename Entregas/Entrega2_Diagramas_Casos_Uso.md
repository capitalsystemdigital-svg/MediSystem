# 2.5 Diagramas de Casos de Uso - MediSystem

## Diagrama UML de Casos de Uso General

```plantuml
@startuml MediSystem_UseCases
!theme plain
skinparam linetype ortho
skinparam packageStyle rectangle
skinparam backgroundColor #F5F5F5

actor "Administrador" as Admin
actor "Médico" as Med
actor "Paciente" as Pac

package "Autenticación" {
  usecase "UC-AUTH-01: Iniciar Sesión" as UC_LOGIN
  usecase "UC-AUTH-02: Registrarse (Paciente)" as UC_REGISTER
  usecase "UC-AUTH-03: Cerrar Sesión" as UC_LOGOUT
}

package "Gestión de Usuarios" {
  usecase "UC-USR-01: Crear Usuario" as UC_CREATE_USR
  usecase "UC-USR-02: Consultar Usuarios" as UC_LIST_USR
  usecase "UC-USR-03: Actualizar Usuario" as UC_UPDATE_USR
  usecase "UC-USR-04: Eliminar Usuario (Lógico)" as UC_DELETE_USR
}

package "Gestión de Médicos" {
  usecase "UC-MED-01: Crear Médico" as UC_CREATE_MED
  usecase "UC-MED-02: Consultar Médicos" as UC_LIST_MED
  usecase "UC-MED-03: Actualizar Médico" as UC_UPDATE_MED
  usecase "UC-MED-04: Eliminar Médico (Lógico)" as UC_DELETE_MED
}

package "Gestión de Pacientes" {
  usecase "UC-PAC-01: Crear Paciente" as UC_CREATE_PAC
  usecase "UC-PAC-02: Consultar Pacientes" as UC_LIST_PAC
  usecase "UC-PAC-03: Actualizar Paciente" as UC_UPDATE_PAC
  usecase "UC-PAC-04: Eliminar Paciente (Lógico)" as UC_DELETE_PAC
}

package "Gestión de Citas" {
  usecase "UC-CIT-01: Crear Cita" as UC_CREATE_CIT
  usecase "UC-CIT-02: Consultar Citas" as UC_LIST_CIT
  usecase "UC-CIT-03: Actualizar Estado de Cita" as UC_UPDATE_CIT
  usecase "UC-CIT-04: Eliminar Cita" as UC_DELETE_CIT
}

package "Administración del Sistema" {
  usecase "UC-SYS-01: Sincronizar Sistema" as UC_SYNC
  usecase "UC-SYS-02: Health Check" as UC_HEALTH
  usecase "UC-SYS-03: Consultar Roles" as UC_ROLES
}

' Relaciones Administrador
Admin --> UC_LOGIN
Admin --> UC_REGISTER
Admin --> UC_LOGOUT
Admin --> UC_CREATE_USR
Admin --> UC_LIST_USR
Admin --> UC_UPDATE_USR
Admin --> UC_DELETE_USR
Admin --> UC_CREATE_MED
Admin --> UC_LIST_MED
Admin --> UC_UPDATE_MED
Admin --> UC_DELETE_MED
Admin --> UC_CREATE_PAC
Admin --> UC_LIST_PAC
Admin --> UC_UPDATE_PAC
Admin --> UC_DELETE_PAC
Admin --> UC_CREATE_CIT
Admin --> UC_LIST_CIT
Admin --> UC_UPDATE_CIT
Admin --> UC_DELETE_CIT
Admin --> UC_SYNC

' Relaciones Médico
Med --> UC_LOGIN
Med --> UC_LOGOUT
Med --> UC_LIST_CIT
Med --> UC_LIST_PAC

' Relaciones Paciente
Pac --> UC_LOGIN
Pac --> UC_REGISTER
Pac --> UC_LOGOUT
Pac --> UC_LIST_CIT

@enduml
```

---

## Diagrama Detallado por Rol: Administrador

```plantuml
@startuml Admin_UseCases
!theme plain
skinparam linetype ortho

actor "Administrador" as Admin
actor "Sistema" as Sys

package "Dashboard Admin" {
  usecase "Ver Métricas" as UC_METRICS
  usecase "Acceder a Módulos" as UC_ACCESS_MODS
}

package "Gestión Integral" {
  usecase "CRUD Usuarios" as UC_CRUD_USR
  usecase "CRUD Médicos" as UC_CRUD_MED
  usecase "CRUD Pacientes" as UC_CRUD_PAC
  usecase "CRUD Citas" as UC_CRUD_CIT
}

package "Mantenimiento" {
  usecase "Sincronizar Perfiles" as UC_SYNC_PROF
  usecase "Consultar Roles" as UC_GET_ROLES
}

Admin --> UC_METRICS
Admin --> UC_ACCESS_MODS
UC_ACCESS_MODS --> UC_CRUD_USR
UC_ACCESS_MODS --> UC_CRUD_MED
UC_ACCESS_MODS --> UC_CRUD_PAC
UC_ACCESS_MODS --> UC_CRUD_CIT

Admin --> UC_SYNC_PROF
Admin --> UC_GET_ROLES

UC_CRUD_USR --> UC_SYNC_PROF : <<include>>
UC_CRUD_MED --> UC_SYNC_PROF : <<include>>
UC_CRUD_PAC --> UC_SYNC_PROF : <<include>>

@enduml
```

---

## Diagrama Detallado por Rol: Médico

```plantuml
@startuml Medico_UseCases
!theme plain
skinparam linetype ortho

actor "Médico" as Med

package "Dashboard Médico" {
  usecase "Ver Agenda Personal" as UC_AGENDA
  usecase "Consultar Directorio de Pacientes" as UC_DIR_PAC
  usecase "Ver Detalles de Cita" as UC_CITA_DETAIL
}

Med --> UC_AGENDA
Med --> UC_DIR_PAC
UC_AGENDA --> UC_CITA_DETAIL : <<include>>

@enduml
```

---

## Diagrama Detallado por Rol: Paciente

```plantuml
@startuml Paciente_UseCases
!theme plain
skinparam linetype ortho

actor "Paciente" as Pac

package "Dashboard Paciente" {
  usecase "Registrarse" as UC_REG
  usecase "Iniciar Sesión" as UC_LOGIN
  usecase "Ver Mis Citas" as UC_MYCIT
  usecase "Ver Detalles de Cita" as UC_CIT_DETAIL
}

Pac --> UC_REG
Pac --> UC_LOGIN
Pac --> UC_MYCIT
UC_MYCIT --> UC_CIT_DETAIL : <<include>>

@enduml
```

---

## Diagrama de Flujo de Autenticación

```plantuml
@startuml Auth_Flow
!theme plain
skinparam linetype ortho

start
:Usuario accede a login;
:Ingresa correo y contraseña;
:Sistema valida credenciales;

if (¿Correo existe en BD?) then (No)
  :Error 401: Credenciales inválidas;
  :Mantiene en login;
  stop
else (Sí)
  if (¿Contraseña es correcta?) then (No)
    :Error 401: Credenciales inválidas;
    stop
  else (Sí)
    if (¿Usuario activo?) then (No)
      :Error 403: Usuario inactivo;
      stop
    else (Sí)
      :Genera JWT (8h validez);
      :Retorna token y datos usuario;
      :Frontend almacena token;
      if (¿Rol es Admin?) then (Sí)
        :Redirige a /dashboard/administrador;
      else
        if (¿Rol es Médico?) then (Sí)
          :Redirige a /dashboard/medico;
        else
          :Redirige a /dashboard/paciente;
        endif
      endif
      stop
    endif
  endif
endif
@enduml
```

---

## Diagrama de Interacción: Crear Médico (Ejemplo)

```plantuml
@startuml Create_Medico_Sequence
!theme plain

actor Admin
participant "Frontend" as FE
participant "Backend\n/api/v1/medicos" as BE
participant "BD\nPrisma" as DB

Admin -> FE: Completa formulario de médico\n(nombre, especialidad, cédula)
FE -> BE: POST /api/v1/medicos\n{nombre, especialidad, cedula_profesional, email}
BE -> DB: Valida cédula única
DB --> BE: ✓ Cédula válida o\n✗ Duplicada
alt Cédula duplicada
  BE --> FE: 400 Bad Request\n{error: "Cédula ya registrada"}
  FE --> Admin: Mostrar error
else Cédula válida
  BE -> DB: Crea registro en tabla médicos
  DB --> BE: Retorna médico creado
  BE -> DB: Busca/Crea usuario Médico\ncon rol_id apropiado
  DB --> BE: Usuario creado/actualizado
  BE --> FE: 201 Created\n{médico, usuario}
  FE --> Admin: Mostrar confirmación
end

@enduml
```

---

## Diagrama de Estados: Cita

```plantuml
@startuml Cita_States
!theme plain
skinparam linetype ortho

[*] --> Pendiente: Al crear\n(administrador)

Pendiente --> Confirmada: Administrador\nconfirma
Pendiente --> Cancelada: Administrador\ncancela

Confirmada --> Atendida: Médico marca\ncomo atendida
Confirmada --> Cancelada: Admin/Médico\ncancela

Atendida --> [*]: Cita completada

Cancelada --> [*]: Cita descartada

@enduml
```

---

## Descripción de Casos de Uso Principales

### CU-AUTH-01: Iniciar Sesión
**Actores:** Administrador, Médico, Paciente  
**Precondiciones:** Usuario registrado en BD y activo.  
**Flujo principal:**
1. Actor accede a pantalla de login.
2. Ingresa correo y contraseña.
3. Sistema valida contra BD.
4. Si válido, genera JWT con rol.
5. Frontend redirige según rol.

**Flujo alternativo:**
- Credenciales inválidas → Error 401.
- Usuario inactivo → Error 403.

---

### CU-AUTH-02: Registrarse (Paciente)
**Actores:** Paciente  
**Precondiciones:** Ninguna.  
**Flujo principal:**
1. Paciente accede a formulario de registro.
2. Ingresa nombre, correo, contraseña.
3. Sistema valida unicidad del correo.
4. Crea usuario con rol "Paciente".
5. Crea registro sincronizado en tabla pacientes.
6. Redirige a login.

**Flujo alternativo:**
- Correo duplicado → Error 400.

---

### CU-USR-01: Crear Usuario
**Actores:** Administrador  
**Precondiciones:** Admin autenticado.  
**Flujo principal:**
1. Admin accede a módulo "Gestión de Usuarios".
2. Rellena formulario (nombre, correo, contraseña, rol).
3. Sistema valida unicidad de correo.
4. Crea usuario con hash de contraseña.
5. Si rol es "Médico", sincroniza perfil médico.
6. Si rol es "Paciente", sincroniza perfil paciente.
7. Muestra confirmación.

**Flujo alternativo:**
- Correo duplicado → Error 400.

---

### CU-MED-01: Crear Médico
**Actores:** Administrador  
**Precondiciones:** Admin autenticado.  
**Flujo principal:**
1. Admin accede a "Plantilla Médica".
2. Rellena nombre, especialidad, cédula (si no se genera automáticamente).
3. Opcionalmente ingresa teléfono y correo.
4. Sistema valida cédula única.
5. Crea registro médico.
6. Si correo existe como usuario Médico, vincula.
7. Si no existe usuario, crea automáticamente.
8. Muestra confirmación.

**Flujo alternativo:**
- Cédula duplicada → Error 400.

---

### CU-CIT-01: Crear Cita
**Actores:** Administrador  
**Precondiciones:** Admin autenticado; médico y paciente activos.  
**Flujo principal:**
1. Admin selecciona módulo "Citas".
2. Completa formulario: médico, paciente, fecha, hora, motivo.
3. Sistema valida:
   - Médico activo.
   - Paciente activo.
   - No exista cita duplicada (mismo médico, fecha, hora).
4. Crea cita con estado "Pendiente".
5. Muestra confirmación con detalles.

**Flujo alternativo:**
- Médico inactivo → Error de validación.
- Paciente inactivo → Error de validación.
- Cita duplicada → Error 400.

---

## Conclusiones

Los diagramas de casos de uso especifican las interacciones de cada actor con el sistema. Los flujos detallados garantizan que cada requerimiento funcional es traducible a funcionalidad verificable.
