# CafeRater (Comment Wall App)

Una aplicación web completa para compartir y visualizar reseñas de cafeterías en tiempo real. Construida con una API RESTful en Node.js y un Frontend modular reactivo puramente en Vanilla JavaScript.

**Enlace en vivo:** [https://caferater.onrender.com/](https://caferater.onrender.com/)

---

## Tecnologías Utilizadas

### Frontend (Cliente)
- **Vanilla JavaScript (ES6+):** Lógica principal, consumo asíncrono de la API REST (`fetch`, `async/await`) y manipulación exhaustiva del DOM dinámico sin recargar la página.
- **Tailwind CSS (Vía CDN):** Framework de diseño utilizado para lograr tarjetas de reseñas (cards), estilo responsivo y para inyectar una paleta de colores personalizada mediante variables de configuración.
- **HTML5 & CSS3:** Estructura semántica y micro-animaciones usando keyframes.

### Backend (Servidor)
- **Node.js:** Entorno de tiempo de ejecución para JavaScript fuera del navegador.
- **Express.js:** Framework para atrapar las peticiones HTTP (`GET`, `POST`, `DELETE`) de la Web API y para servir todos los archivos estáticos de forma automática.
- **CORS:** Middleware de seguridad activado para permitir que la interfaz gráfica interactúe libremente y de forma segura con la API local o remota.

---

## Arquitectura

1. **Persistencia de Datos Rápida (Memoria):** El servidor Express almacena las reseñas en la memoria RAM `let comments = []`. Procesa validaciones de seguridad y asigna de manera autoincremental los IDs y marcas de tiempo (`timestamps`) formato ISO a cada objeto entrante.
2. **Exposición Web API:** Todo ocurre en el *endpoint* fundamental `/comments`, el cual se comunica bidireccionalmente lanzando y aceptando únicamente paquetes de datos puros en formato JSON.
3. **Frontend Interactivo Asíncrono:** La página nunca parpadea ni hace recargas físicas totales (`e.preventDefault()`). En cuanto un usuario publica o elimina un comentario, una función asíncrona intercepta el paquete de datos y le ordena visualmente a la página (`DOM`) crear una gráfica de tarjeta o destruirla, imitando interfaces rápidas modernas.
4. **Validación Dual Simétrica:** El requisito mandatorio de que los renglones no estén vacíos o el comentario supere los 5 caracteres se evalúa primero visualmente al presionar el botón y luego forzosamente de nuevo al llegar al servidor Express antes de su inserción.

---

## Instalación y Ejecución Local

Si descargaste o clonaste este repositorio de GitHub y deseas correrlo y modificarlo en tu propia máquina de desarrollo, sigue estos pasos:

1. **Abre la terminal de comandos** y navega hasta la carpeta principal del proyecto.
2. **Instala las librerías obligatorias** del servidor (Express y Cors) ejecutando:
   ```bash
   npm install
   ```
3. **Arranca la aplicación Todo-en-uno** ejecutando el siguiente comando:
   ```bash
   node server.js
   ```
4. Cuando tu terminal imprima el mensaje de éxito indicándote el puerto (3000), dirígete a tu navegador.
5. Accede a las reseñas localmente aquí:
   **http://localhost:3000**