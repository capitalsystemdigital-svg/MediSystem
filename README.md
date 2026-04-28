# MediSystem

MediSystem es una plataforma web para la gestion de procesos clinicos basicos con tres perfiles operativos: Administrador, Medico y Paciente. El proyecto esta dividido en frontend, backend, documentacion y scripts de inicializacion para facilitar la entrega academica y la puesta en marcha local.

## Estructura del proyecto

```text
MediSystem-main/
├── README.md
├── docs/
│   ├── arquitectura/
│   │   └── arquitectura_final.pdf
│   ├── pruebas/
│   │   ├── plan_de_pruebas.pdf
│   │   ├── casos_de_prueba.xlsx
│   │   ├── reporte_de_pruebas.pdf
│   │   └── registro_defectos.xlsx
│   ├── manuales/
│   │   ├── manual_instalacion.pdf
│   │   ├── manual_despliegue.pdf
│   │   └── manual_usuario.pdf
│   └── evidencias/
│       ├── ejecucion_pruebas/
│       └── video_demo.md
├── backend/
├── test/
├── frontend/
├── scripts/
│   ├── setup.sh
│   └── setup.bat
└── .env.example
```

## Componentes principales

- backend: API REST en Node.js, Express, TypeScript y Prisma con PostgreSQL.
- frontend: interfaz web en Next.js para autenticacion, dashboards y gestion operativa.
- docs: entregables de arquitectura, pruebas, manuales y evidencias para la evaluacion.
- test: espacio reservado para pruebas automatizadas y notas de cobertura.
- scripts: automatizacion de instalacion inicial para Linux/macOS y Windows.

## Variables de entorno

La configuracion base se encuentra en .env.example. Para trabajar localmente:

1. Copiar .env.example a backend/.env o al mecanismo de configuracion que use su entorno.
2. Ajustar DATABASE_URL, JWT_SECRET y puertos segun su base de datos local.

## Ejecucion local

### Backend

```bash
cd backend
npm install
npx prisma migrate dev --name init
npx prisma db seed
npm run dev
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

## Documentacion de entrega

Los archivos dentro de docs ya contienen el contenido base de la entrega. En caso de que el profesor solicite binarios finales reales en PDF o XLSX, estos mismos archivos pueden tomarse como fuente para exportacion final desde Word, Google Docs, Excel o LibreOffice.

## Estado actual

- Arquitectura documentada y alineada con Next.js + Express + Prisma + PostgreSQL.
- Plan y reporte de pruebas integrados con los modulos implementados.
- Manuales separados para instalacion, despliegue y uso.
- Evidencias organizadas para anexar capturas, logs y enlace al video demostrativo.