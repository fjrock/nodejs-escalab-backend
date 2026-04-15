# Music API - Backend Node.js

API REST para gestionar canciones, albums, artistas y generos musicales. Construida con Node.js, Express y MongoDB.

---

## Requisitos previos

Antes de empezar necesitas tener instalado:

- **Node.js** (v12 o superior) - [Descargar aqui](https://nodejs.org/)
- **MongoDB** (local o en la nube con [MongoDB Atlas](https://www.mongodb.com/atlas))
- **npm** (viene incluido con Node.js)

Para verificar que los tienes instalados, abre una terminal y ejecuta:

```bash
node --version
npm --version
```

Si ambos comandos muestran un numero de version, estas listo.

---

## Instalacion paso a paso

### 1. Clonar el repositorio

```bash
git clone https://github.com/fjrock/nodejs-escalab-backend.git
cd nodejs-escalab-backend
```

### 2. Instalar dependencias

```bash
npm install
```

Esto descarga todas las librerias necesarias. Puede tardar unos minutos.

### 3. Configurar variables de entorno

Crea un archivo llamado `.env` en la raiz del proyecto (al mismo nivel que `package.json`):

```bash
touch .env
```

Abre el archivo `.env` y agrega lo siguiente:

```env
DATABASE=mongodb://localhost:27017/musicapi
JWT_SECRET=una_clave_secreta_muy_larga_y_dificil_de_adivinar
PORT=8000
```

| Variable | Que es | Ejemplo |
|----------|--------|---------|
| `DATABASE` | URL de conexion a MongoDB | `mongodb://localhost:27017/musicapi` (local) o tu URI de Atlas |
| `JWT_SECRET` | Clave secreta para generar tokens de autenticacion. Ponle algo largo y aleatorio | `mi_super_secreto_123!` |
| `PORT` | Puerto donde correra el servidor | `8000` |

> **IMPORTANTE:** Nunca subas el archivo `.env` a GitHub. Ya esta incluido en `.gitignore`.

### 4. Iniciar el servidor

**Modo desarrollo** (se reinicia automaticamente al guardar cambios):

```bash
npm run dev
```

**Modo produccion:**

```bash
npm start
```

Si todo salio bien, veras en la terminal:

```
DB Conn
Server is running on port 8000
```

Si ves `DB Conn`, tu base de datos esta conectada correctamente.

---

## Documentacion de la API (Swagger)

Una vez que el servidor este corriendo, abre tu navegador y ve a:

```
http://localhost:8000/api-docs
```

Ahi puedes ver y probar todos los endpoints de la API de forma interactiva.

---

## Endpoints principales

Todos los endpoints estan bajo el prefijo `/api`.

### Autenticacion

| Metodo | Ruta | Descripcion | Requiere login |
|--------|------|-------------|:--------------:|
| POST | `/api/signup` | Registrar un nuevo usuario | No |
| POST | `/api/signin` | Iniciar sesion | No |
| GET | `/api/signout` | Cerrar sesion | No |

### Usuarios

| Metodo | Ruta | Descripcion | Requiere login |
|--------|------|-------------|:--------------:|
| GET | `/api/user/:userId` | Ver perfil de usuario | Si |
| PUT | `/api/user/:userId` | Actualizar perfil | Si |

### Canciones

| Metodo | Ruta | Descripcion | Requiere login |
|--------|------|-------------|:--------------:|
| GET | `/api/songs/:userId` | Listar todas las canciones | Si (admin) |
| GET | `/api/song/:songId/:userId` | Ver una cancion | Si (admin) |
| POST | `/api/song/create/:userId` | Crear cancion | Si (admin) |
| PUT | `/api/song/:songId/:userId` | Actualizar cancion | Si (admin) |
| DELETE | `/api/song/:songId/:userId` | Eliminar cancion | Si (admin) |

### Albums

| Metodo | Ruta | Descripcion | Requiere login |
|--------|------|-------------|:--------------:|
| GET | `/api/albums` | Listar todos los albums | No |
| GET | `/api/album/:albumId/:userId` | Ver un album | Si |
| POST | `/api/album/create/:userId` | Crear album | Si (admin) |
| PUT | `/api/album/:albumId/:userId` | Actualizar album | Si (admin) |
| DELETE | `/api/album/:albumId/:userId` | Eliminar album | Si (admin) |

### Artistas

| Metodo | Ruta | Descripcion | Requiere login |
|--------|------|-------------|:--------------:|
| GET | `/api/artists` | Listar todos los artistas | No |
| GET | `/api/artist/:artistId/:userId` | Ver un artista | Si |
| POST | `/api/artist/create/:userId` | Crear artista | Si (admin) |
| PUT | `/api/artist/:artistId/:userId` | Actualizar artista | Si (admin) |
| DELETE | `/api/artist/:artistId/:userId` | Eliminar artista | Si (admin) |

### Generos

| Metodo | Ruta | Descripcion | Requiere login |
|--------|------|-------------|:--------------:|
| GET | `/api/genres` | Listar todos los generos | No |
| GET | `/api/genre/:genreId/:userId` | Ver un genero | Si |
| POST | `/api/genre/create/:userId` | Crear genero | Si (admin) |
| PUT | `/api/genre/:genreId/:userId` | Actualizar genero | Si (admin) |
| DELETE | `/api/genre/:genreId/:userId` | Eliminar genero | Si (admin) |

---

## Como usar la API (ejemplo rapido)

### 1. Registrar un usuario

```bash
curl -X POST http://localhost:8000/api/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Juan",
    "email": "juan@email.com",
    "password": "mipassword123"
  }'
```

> La contrasena debe tener al menos 6 caracteres e incluir un numero.

### 2. Iniciar sesion

```bash
curl -X POST http://localhost:8000/api/signin \
  -H "Content-Type: application/json" \
  -d '{
    "email": "juan@email.com",
    "password": "mipassword123"
  }'
```

Esto te devuelve un **token**. Guardalo, lo necesitas para las siguientes peticiones.

### 3. Usar el token en peticiones protegidas

```bash
curl http://localhost:8000/api/genres \
  -H "Authorization: Bearer TU_TOKEN_AQUI"
```

Reemplaza `TU_TOKEN_AQUI` con el token que obtuviste al iniciar sesion.

---

## Ejecutar tests

```bash
npm test
```

El proyecto tiene 86 tests con objetivo de 100% de cobertura de codigo.

---

## Estructura del proyecto

```
nodejs-escalab-backend/
├── app.js              # Punto de entrada. Configura Express y conecta a MongoDB
├── package.json        # Dependencias y scripts
├── jest.config.js      # Configuracion de tests
├── render.yaml         # Configuracion para deploy en Render
│
├── models/             # Esquemas de la base de datos (Mongoose)
│   ├── user.js         #   Usuario (nombre, email, contrasena, rol)
│   ├── song.js         #   Cancion
│   ├── album.js        #   Album (contiene canciones)
│   ├── artist.js       #   Artista (tiene albums y generos)
│   └── genre.js        #   Genero musical
│
├── controllers/        # Logica de negocio
│   ├── auth.js         #   Registro, login, logout, middleware JWT
│   ├── user.js         #   Operaciones de usuario
│   ├── song.js         #   CRUD de canciones
│   ├── album.js        #   CRUD de albums
│   ├── artist.js       #   CRUD de artistas
│   └── genre.js        #   CRUD de generos
│
├── routes/             # Definicion de rutas/endpoints
│   ├── auth.js
│   ├── user.js
│   ├── song.js
│   ├── album.js
│   ├── artist.js
│   └── genre.js
│
├── helpers/            # Funciones utilitarias
│   └── dbErrorHandler.js  # Formateo de errores de MongoDB
│
├── validator/          # Reglas de validacion
│   └── index.js        #   Validacion de registro de usuario
│
└── tests/              # Tests unitarios (Jest)
    ├── controllers/
    ├── models/
    ├── helpers/
    └── validator/
```

---

## Tecnologias utilizadas

| Tecnologia | Para que se usa |
|------------|----------------|
| **Express** | Framework web para crear la API |
| **MongoDB + Mongoose** | Base de datos y modelado de datos |
| **JWT (jsonwebtoken)** | Autenticacion con tokens |
| **bcrypt** | Encriptacion de contrasenas |
| **Swagger** | Documentacion interactiva de la API |
| **Jest** | Tests unitarios |
| **Morgan** | Logs de peticiones HTTP |
| **CORS** | Permitir peticiones desde otros dominios |
| **dotenv** | Cargar variables de entorno desde `.env` |
| **Nodemon** | Reinicio automatico en desarrollo |

---

## Roles de usuario

La API tiene control de acceso basado en roles:

- **Usuario normal** (`role: 1`): Puede ver su perfil y actualizarlo.
- **Administrador** (`role: 0`): Puede crear, editar y eliminar canciones, albums, artistas y generos.

Por defecto, los usuarios nuevos se crean con rol de usuario normal.

---

## Solucionar problemas comunes

### "Error: Cannot connect to MongoDB"

- Verifica que MongoDB esta corriendo
- Revisa que la URL en `DATABASE` de tu `.env` es correcta
- Si usas Atlas, verifica que tu IP esta en la whitelist

### "Error: JWT_SECRET is not defined"

- Asegurate de tener el archivo `.env` en la raiz del proyecto
- Verifica que el archivo tiene la variable `JWT_SECRET`

### "npm install falla"

- Verifica tu version de Node.js (`node --version`): necesitas v12+
- Borra `node_modules` y `package-lock.json` e intenta de nuevo:
  ```bash
  rm -rf node_modules package-lock.json
  npm install
  ```

### "El servidor no arranca"

- Revisa que el puerto no este ocupado por otro proceso
- Prueba con otro puerto cambiando `PORT` en `.env`

---

## Deploy

El proyecto incluye configuracion para [Render](https://render.com/) en el archivo `render.yaml`. Para deployar:

1. Crea una cuenta en Render
2. Conecta tu repositorio de GitHub
3. Configura las variables de entorno (`DATABASE`, `JWT_SECRET`)
4. Render se encarga del resto

---

## Licencia

ISC
