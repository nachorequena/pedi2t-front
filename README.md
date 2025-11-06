Pedi2t - Frontend

Aplicación frontend de Pedi2t: SPA en React creada con Vite. Está pensada para gestionar pedidos y perfiles de empleados, y usa TailwindCSS para estilos rápidos, Axios para llamadas a la API y SweetAlert2 para notificaciones.

Estado: código fuente del cliente (ruta principal: `src/`).

## Características principales

- Autenticación básica (login/registro).
- Gestión y visualización de pedidos.
- Perfil de empleado con iniciales generadas desde el nombre y apellido.
- Configuración local de días presenciales (guardado en `localStorage`).
- Rutas protegidas con `ProtectedRoute`.

## Tecnologías

- React 19
- Vite
- TailwindCSS
- React Router DOM
- Axios
- SweetAlert2

## Scripts disponibles

Los scripts definidos en `package.json` (usa npm):

```powershell
npm install
npm run dev    # inicia el servidor de desarrollo
npm run build  # construye la versión de producción
npm run preview# vista previa del build
npm run lint   # ejecuta eslint
```

## Instalación y ejecución local

1. Clonar el repositorio.
2. Entrar en la carpeta del proyecto y ejecutar:

```powershell
npm install
npm run dev
```

3. Abrir en el navegador la URL que indique Vite (por defecto `http://localhost:5173`).

## Estructura principal del proyecto

```
src/
  api/           # axios y helpers para llamadas a la API
  assets/        # imágenes y recursos estáticos
  componets/     # componentes reutilizables (Navbar, LoadingSpinner, etc.)
  pages/         # vistas/ páginas (Home, Login, Pedidos, Perfil, Registro)
  main.jsx       # punto de entrada
  App.jsx        # layout y rutas
```

## Notas de implementación

- Las iniciales del perfil se generan en `src/pages/Perfil.jsx` con una función que toma la primera letra del nombre y la primera letra del apellido. Si el apellido no existe, se usa la inicial de la segunda palabra del nombre o la segunda letra del primer nombre como respaldo.
- La aplicación almacena en `localStorage`:
  - `usuarioActual`: datos del usuario autenticado (usado para mostrar perfil).
  - `diasPresenciales`: array con los días seleccionados por el empleado.

## Variables de entorno

Actualmente no hay variables obligatorias listadas en el repositorio. Si se añade un backend, normalmente se usará una variable para la URL base de la API (por ejemplo `VITE_API_URL`) y se referenciará desde `src/api/axios.js`.

## Despliegue

- Construir con `npm run build` y servir los ficheros estáticos resultantes (`dist/`).
- Puedes desplegar en Netlify, Vercel, Surge o cualquier servidor estático.

## Contribuciones

1. Haz un fork.
2. Crea una rama feature/bugfix.
3. Envía un pull request con una descripción clara de los cambios.

## Licencia

Proyecto abierto (añade la licencia que prefieras).

---
