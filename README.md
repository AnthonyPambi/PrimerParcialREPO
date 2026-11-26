# Dolarito · Sitio web

Sitio web informativo e interactivo de **Dolarito**, una aplicación móvil hecha en Flutter para controlar las finanzas personales y familiares desde el celular.

Proyecto del Primer Parcial de **Desarrollo de Aplicaciones Web**.

**Autores:** Anthony Pambi y Wilmer Medina

🔗 **Sitio publicado:** primerparcialrepo.netlify.app

## Páginas

| Página | Contenido |
|---|---|
| `index.html` | Inicio: presentación del proyecto, beneficios, calculadora de ahorro, stack tecnológico y formulario de contacto |
| `unidades.html` | Unidades de la app y recorrido por sus pantallas en un carrusel |
| `acerca.html` | Historia del proyecto, equipo, cómo funciona la app y preguntas frecuentes |
| `gracias.html` | Confirmación después de enviar el formulario |

## Funcionalidades

- **Menú de navegación fijo**, desplegable en celulares.
- **Modo claro y oscuro**, que se recuerda entre visitas.
- **Formulario de contacto** con validación en el navegador y mensajes de error por campo. Los mensajes se reciben con Netlify Forms.
- **Calculadora de ahorro** interactiva.
- **Carrusel** de pantallas con flechas, puntos, pausa y deslizamiento táctil.
- **Acordeón** de preguntas frecuentes.
- Secciones que **aparecen al hacer scroll**.
- Diseño **responsivo** para escritorio y celular.

## Tecnologías

- **HTML5** semántico (`header`, `nav`, `section`, `article`, `footer`)
- **CSS3** en un archivo externo (Grid, Flexbox, variables y media queries)
- **JavaScript** sin librerías
- **Netlify** para publicar el sitio y recibir el formulario

## Estructura

```
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

## Cómo verlo en local

Abre `index.html` en el navegador, o usa la extensión **Live Server** de VS Code.
