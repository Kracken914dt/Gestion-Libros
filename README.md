# Aplicacion de Gestion de Libros

Aplicacion CRUD full-stack para gestionar libros, construida con React (frontend), Node.js/Express (backend) y MongoDB.

## Arquitectura

```text
Gestion-Libros/
├── backend/             # API con Express + TypeScript + JWT
├── frontend/            # SPA con React + Vite + TailwindCSS
└── docker-compose.yml
```

## Caracteristicas Principales

### Backend
- API REST con Express y TypeScript
- MongoDB con Mongoose
- Autenticacion con JWT
- Password hashing con bcryptjs
- Validacion de datos con express-validator
- Manejo centralizado de errores
- Control de acceso por roles: admin y user
- Creacion automatica de admin por defecto al iniciar el servidor

### Frontend
- React 18 + Vite
- React Router para navegacion
- Axios con interceptor para token Bearer
- TailwindCSS para UI
- Vista de libros en cards y tabla
- Modo claro/oscuro persistente
- Modal de gestion de usuarios para admin (listar, editar email y eliminar usuarios role=user)
- Loaders reutilizables en estados de carga

## Acceso por Roles

- admin:
   - Puede crear, editar y eliminar libros
   - Puede abrir la ventana Users para gestionar cuentas de tipo user
- user (rol por defecto en registro):
   - Solo puede visualizar libros y detalle

Regla de seguridad importante:
- Los endpoints de gestion de usuarios excluyen cuentas admin y bloquean editar/eliminar admins.

## Endpoints de la API

### Auth

| Metodo | Endpoint | Acceso | Descripcion |
|--------|----------|--------|-------------|
| POST | /api/auth/register | Publico | Registra usuario con rol user |
| POST | /api/auth/login | Publico | Login y retorno de JWT |
| GET | /api/auth/users | Admin | Lista usuarios role=user |
| PUT | /api/auth/users/:id | Admin | Edita email de usuario role=user |
| DELETE | /api/auth/users/:id | Admin | Elimina usuario role=user |

### Books

| Metodo | Endpoint | Acceso | Descripcion |
|--------|----------|--------|-------------|
| GET | /api/books | Authenticated | Lista libros (paginacion y filtros) |
| GET | /api/books/search | Authenticated | Busca libros |
| GET | /api/books/:id | Authenticated | Obtiene detalle de libro |
| POST | /api/books | Admin | Crea libro |
| PUT | /api/books/:id | Admin | Actualiza libro |
| DELETE | /api/books/:id | Admin | Elimina libro |

### Parametros de Consulta en GET /api/books

- page: numero de pagina (default 1)
- limit: elementos por pagina (default 10, max 100)
- genre: filtro por genero
- isAvailable: filtro por disponibilidad (true/false)
- search: busqueda por titulo o autor

## Inicio Rapido

### 1) Backend

```bash
cd backend
npm install
cp .env.example .env
npm run dev
```

API local: http://localhost:3000

### 2) Frontend

```bash
cd frontend
npm install
npm run dev
```

App local (Vite): http://localhost:5173

## Variables de Entorno

### Backend (.env)

- PORT: puerto del servidor (default 3000)
- NODE_ENV: development o production
- MONGODB_URI: conexion a MongoDB
- CORS_ORIGIN: lista CSV de origenes permitidos
   - ejemplo: http://localhost:5173,http://localhost:4200,https://tu-frontend.vercel.app
- LOG_LEVEL: nivel de logs (info, debug, etc)
- JWT_SECRET: secreto para firmar tokens
- JWT_EXPIRES_IN: expiracion JWT (ej. 8h)
- ADMIN_EMAIL: correo del admin inicial
- ADMIN_PASSWORD: password del admin inicial

### Frontend (.env)

- VITE_API_URL: URL base del backend
   - ejemplo: https://tu-backend.onrender.com/api

## Credenciales Admin por Defecto

Si no defines variables en entorno, el backend usa:

- ADMIN_EMAIL=admin@library.com
- ADMIN_PASSWORD=password123

Recomendado: cambiar estas credenciales en produccion.

## Estructura Actual del Proyecto

### Backend

```text
backend/src/
├── app.ts
├── config/
├── middlewares/
├── modules/
│   ├── auth/
│   └── books/
└── utils/
```

### Frontend

```text
frontend/src/
├── api/
├── components/
├── pages/
├── utils/
├── App.jsx
├── main.jsx
└── index.css
```

## Scripts

### Backend

```bash
npm run dev
npm run build
npm run start
npm run test
```

### Frontend

```bash
npm run dev
npm run build
npm run preview
```

## Docker (Opcional)

```bash
docker-compose up --build
```

## Licencia

Julio Molina Redondo
Diego Tique Ramirez

MIT
