# Dolarito · Sitio Web Interactivo

Proyecto del **Primer Parcial** de **Desarrollo de Aplicaciones Web**
Tema: Sitio Web Interactivo **Dolarito** 

**Autores:** Anthony Pambi y Wilmer Medina

## Enlaces de entrega

| Recurso | Enlace |
|---|---|
| Sitio desplegado en Netlify | [https://tu-sitio.netlify.app](https://tu-sitio.netlify.app) |
| Repositorio en GitHub | [https://github.com/usuario/repositorio](https://github.com/AnthonyPambi/PrimerParcialREPO.git) |
| Video de presentación (YouTube, máx. 5 min) | [https://youtu.be/...](https://youtu.be/...) |

## Descripción

Sitio web informativo e interactivo que presenta **Dolarito**, una aplicación para controlar las finanzas personales y familiares desde el celular.

El sitio está desarrollado **únicamente con HTML5, CSS3 y JavaScript**, sin frameworks ni librerías, y funciona bajo la arquitectura cliente. Aplica los conocimientos de las unidades 1, 2 y 3 de la asignatura.

## Estructura del sitio

El sitio cuenta con una página principal y tres páginas adicionales (el mínimo requerido es una principal y dos adicionales).

| Página | Contenido |
|---|---|
| `index.html` (principal) | Presentación del proyecto, beneficios, calculadora de ahorro, tecnologías y formulario de contacto |
| `unidades.html` | Unidades de la app y recorrido por sus pantallas en un carrusel |
| `acerca.html` | Historia del proyecto, equipo, cómo funciona la app y preguntas frecuentes |
| `gracias.html` | Confirmación posterior al envío del formulario |

## Cumplimiento de los requisitos

### HTML semántico
Uso de `<header>`, `<nav>`, `<section>`, `<article>` y `<footer>` en todas las páginas.

### CSS externo
Estilos personalizados en `css/styles.css`, con variables CSS, Flexbox, Grid y media queries.

### Interactividad con JavaScript
Todo el comportamiento está en `js/main.js`, sin librerías externas:

- **Formulario de contacto funcional** con validación en el cliente y mensajes de error por campo. Los envíos se reciben mediante Netlify Forms.
- **Menú de navegación fijo**, que se vuelve desplegable en celulares.
- **Carrusel de pantallas** con flechas, indicadores, pausa y deslizamiento táctil.
- **Acordeón** de preguntas frecuentes.
- **Modo claro y oscuro**, que se recuerda entre visitas.
- **Calculadora de ahorro** interactiva.
- **Animaciones** de aparición de secciones al hacer scroll.

### Diseño responsivo
El sitio se adapta a pantallas de escritorio y móviles.

## Tecnologías utilizadas

- **HTML5** semántico
- **CSS3** (archivo externo)
- **JavaScript** (vanilla, sin librerías)
- **Netlify** (despliegue y recepción del formulario)
- **GitHub** (control de versiones)

## Estructura de archivos

```
nombre-del-proyecto/
├── index.html
├── unidades.html
├── acerca.html
├── gracias.html
├── css/
│   └── styles.css
├── js/
│   └── main.js
└── imagenes/
```

## Cómo ejecutarlo en local

1. Clona el repositorio:
   ```bash
   git clone https://github.com/AnthonyPambi/PrimerParcialREPO.git
   ```
2. Abre la carpeta del proyecto.
3. Abre `index.html` en el navegador, o usa la extensión **Live Server** de VS Code.

> El envío del formulario solo se registra en el sitio desplegado en Netlify; en local la validación funciona, pero el mensaje no se almacena.

## Autores

- Anthony Pambi
- Wilmer Medina