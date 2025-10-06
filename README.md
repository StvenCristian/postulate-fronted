# Postulate Frontend

Este es el frontend del sistema **Postulate**, una plataforma para la gestión de vacantes y postulaciones.  
Está desarrollada con **Vue.js** y **Vuetify**, ofreciendo una interfaz moderna, responsiva y fácil de usar.  
El sistema permite a los usuarios registrarse, postular a vacantes, y a los administradores gestionar ofertas laborales de forma eficiente.

¡Explora el demo en línea!
Puedes probar el sistema en funcionamiento accediendo al siguiente enlace:
🔗 https://postulate-demo.web.app

## 🚀 Tecnologías utilizadas

Este proyecto está construido con las siguientes tecnologías modernas:

- [Vue.js 3](https://vuejs.org/) – Framework progresivo para construir interfaces de usuario.
- [Vuetify 3](https://vuetifyjs.com/) – Biblioteca de componentes UI basada en Material Design.
- [Vite](https://vitejs.dev/) – Herramienta de desarrollo rápida para proyectos frontend.
- [Pinia](https://pinia.vuejs.org/) – Librería para el manejo de estado en Vue.
- [Vue Router](https://router.vuejs.org/) – Enrutador oficial para Vue.js.
- [Axios](https://axios-http.com/) – Cliente HTTP para realizar peticiones al backend.
- Chart.js – Librería para crear gráficos interactivos y visualizaciones de datos.

## 📦 Instalación

Sigue estos pasos para instalar y ejecutar el proyecto en tu entorno local:

1. Clona el repositorio:

```bash
   git clone https://github.com/StvenCristian/postulate-fronted.git
```

```bash
   cd postulate-fronted
```

2. Instala las dependencias:

```bash
   npm install
```

3. Ejecuta el servidor de desarrollo:

```bash
   npm run dev
```

4. Accede a la aplicación en `http://localhost:5173` (o el puerto que indique la consola)

## ⚙️ Configuración

La configuración de la URL base del backend se realiza mediante un archivo dedicado en el proyecto.
Este proyecto define la URL directamente en el archivo: src/config/api.config.js
Dentro de este archivo se encuentra la constante `API_BASE_URL`, que debe apuntar a la URL de tu backend. Ejemplo:

```js
export const API_BASE_URL = "https://tu-backend-url/api";
```

## 🧩 Estructura del proyecto

La estructura del proyecto está organizada para mantener una arquitectura clara y escalable. A continuación se muestra una vista general de las carpetas principales:

- src/assets/: Archivos estáticos como imágenes y estilos.
- src/components/: Componentes reutilizables.
- src/views/: Vistas principales como Login, Home, etc.
- src/router/: Configuración de rutas con Vue Router.
- src/store/: Manejo de estado con Pinia.
- src/services/: Lógica de conexión con la API.
- src/config/: Configuración de la URL base del backend.
- src/utils/: Funciones auxiliares.
- src/App.vue: Componente raíz de la aplicación.

Esta estructura facilita el mantenimiento del código y la incorporación de nuevas funcionalidades.

## 🔐 Autenticación

La autenticación en el sistema se realiza mediante **JSON Web Tokens (JWT)**.

- Al iniciar sesión, el backend genera un token JWT que se almacena en el `localStorage`.
- Este token se incluye automáticamente en cada petición HTTP mediante Axios, permitiendo validar el acceso a rutas protegidas.
- El sistema también verifica el rol del usuario (por ejemplo, `ADMIN`) para controlar el acceso a secciones específicas como el panel de administración.

Esta implementación garantiza una autenticación segura y una gestión eficiente de permisos.

## 🛠️ Funcionalidades principales

El sistema Postulate ofrece las siguientes funcionalidades clave:

- Inicio de sesión con validación de credenciales y rol de usuario.
- Registro de usuarios con asignación automática del rol "Postulante".
- Panel de administración para gestionar vacantes disponibles.
- Expiración automática de vacantes según su fecha de vencimiento.
- Visualización de postulaciones realizadas por los usuarios.
- Interfaz moderna, responsiva y accesible gracias a Vuetify.
- Visualización de datos mediante gráficos con Chart.js.

## ☁️ Despliegue en Firebase

Este proyecto está desplegado en **Firebase Hosting**, una plataforma rápida y confiable para aplicaciones web modernas.

### Pasos para el despliegue:

1. Compila el proyecto:

```bash
   npm run buid
```

2. Instala la CLI de Firebase si no la tienes:

```bash
   npm install -g firebase-tools
```

3. Inicia sesión en Firebase:

```bash
   firebase login
```

4. Inicializa el proyecto (solo la primera vez):

```bash
   firebase init
```

- Selecciona Hosting.
- Usa dist como carpeta pública.

4. Despliega:

```bash
   firebase deploy
```

## 📄 Licencia

Este proyecto está bajo la licencia **MIT**, lo que permite su uso, modificación y distribución con pocas restricciones.

## 🙌 Autor

Desarrollado por **Cristian Aldair Alcantara Anton**

- GitHub: StvenCristian
- Ubicación: Lima, Perú
- Proyecto: postulate-fronted

Este proyecto forma parte de una solución completa para la gestión de vacantes y postulaciones, con enfoque en buenas prácticas, escalabilidad y experiencia de usuario.
