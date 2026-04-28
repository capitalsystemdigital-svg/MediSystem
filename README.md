# MediSystem - Gestión de Consultorios Médicos 🏥

![Estado](https://img.shields.io/badge/Estado-Release_Candidate-success)
![Versión](https://img.shields.io/badge/Versi%C3%B3n-1.0-blue)
![Node](https://img.shields.io/badge/Node.js-%3E%3D18.x-green)

**MediSystem** es una plataforma integral Cliente-Servidor diseñada para administrar consultorios médicos. Facilita la gestión de pacientes, doctores y citas médicas, aplicando reglas de negocio automatizadas para optimizar la rentabilidad y el servicio al cliente.

> **Entregas V, VI y VII** | *Proyecto de Ingeniería de Software*  
> **Alumno:** JOSÉ FRANCISCO DE LA ROSA IBARRA

---

## 🏗️ Estructura del Proyecto

El repositorio está organizado según los estándares profesionales solicitados para las entregas finales:

```text
MediSystem/
│
├── docs/                       # Documentación Técnica y Funcional
│   ├── arquitectura/           # Arquitectura final del sistema
│   ├── evidencias/             # Pruebas de funcionamiento (Video Demo)
│   ├── manuales/               # Manuales de Instalación, Despliegue y Usuario
│   └── pruebas/                # Plan de QA, Casos de Prueba, Reportes y Defectos
│
├── backend/                    # API REST (Node.js, Express, TypeScript, Prisma)
├── frontend/                   # Interfaz de Usuario (React / Vue / HTML)
├── test/                       # Suites de Pruebas Automatizadas
├── scripts/                    # Scripts de configuración de entorno (.sh / .bat)
│
├── README.md                   # Este archivo
└── .env.example                # Plantilla de variables de entorno
```

---

## ⚙️ Características Principales

1. **Autenticación Segura (JWT):** Control de acceso basado en roles (Doctores, Recepcionistas, Admin).
2. **Gestión de Citas (Regla 1:3):** El motor de lógica de negocio asigna automáticamente la 4ta cita de forma gratuita al completar 3 consultas de cobro en un lapso determinado por Doctor.
3. **API Documentada:** Integración nativa con `Swagger UI` (`/api-docs`).
4. **Pruebas Automatizadas:** Cobertura de QA utilizando `Jest` y `Supertest`.

---

## 🚀 Instalación y Despliegue Rápidos

Para obtener los detalles completos, por favor consulte los archivos ubicados en `docs/manuales/`. A continuación se muestra el método rápido.

### Entorno Mac/Linux
1. Clonar el repositorio.
2. Otorgar permisos de ejecución al script y ejecutarlo:
   ```bash
   chmod +x scripts/setup.sh
   ./scripts/setup.sh
   ```
3. Editar el archivo `backend/.env` con las credenciales de base de datos.
4. Levantar el servidor: `cd backend && npm run dev`

### Entorno Windows
1. Ejecutar el script `scripts\setup.bat` desde la terminal.
2. Editar el archivo `backend\.env`.
3. Levantar el servidor: `cd backend && npm run dev`

---

## 🧪 Pruebas (QA)

El sistema cuenta con pruebas automatizadas para garantizar su estabilidad.
Para ejecutarlas, corra el siguiente comando dentro de la carpeta `backend/`:

```bash
npm run test
```

Los reportes detallados, casos de prueba y registro de defectos se encuentran en `docs/pruebas/`.

---

## 📄 Licencia y Derechos
Desarrollado para uso académico y profesional. Propiedad intelectual de José Francisco de la Rosa Ibarra. Todos los derechos reservados © 2026.