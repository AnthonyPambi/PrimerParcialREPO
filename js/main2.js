/* ============================================================
   Dolarito · interacciones del sitio
   Cada función inicia una funcionalidad y se salta sola si su
   HTML no está en la página (así un solo archivo sirve a todas).
   ============================================================ */

(function () {
    "use strict";

    /* ---------- Utilidades ---------- */
    const $ = (selector, base = document) => base.querySelector(selector);
    const $$ = (selector, base = document) =>
        Array.from(base.querySelectorAll(selector));
    const raiz = document.documentElement;
    const sinMovimiento = matchMedia(
        "(prefers-reduced-motion: reduce)",
    ).matches;
    const esLocal =
        location.protocol === "file:" ||
        ["", "localhost", "127.0.0.1", "[::1]"].includes(location.hostname);

    // Cambia un atributo aria-* o clase según un estado verdadero/falso
    const aria = (el, nombre, valor) =>
        el.setAttribute("aria-" + nombre, String(valor));

    /* ---------- Tema claro / oscuro ---------- */
    function iniciarTema() {
        const boton = $("#boton-tema");
        if (!boton) return;

        const pintar = () => {
            const oscuro = raiz.dataset.theme === "dark";
            aria(boton, "pressed", oscuro);
            aria(
                boton,
                "label",
                oscuro ? "Activar modo claro" : "Activar modo oscuro",
            );
            boton.title = oscuro ? "Modo claro" : "Modo oscuro";
        };

        boton.addEventListener("click", () => {
            raiz.dataset.theme =
                raiz.dataset.theme === "dark" ? "light" : "dark";
            try {
                localStorage.setItem("dolarito-tema", raiz.dataset.theme);
            } catch (e) {
                /* solo esta visita */
            }
            pintar();
        });
        pintar();
    }

    /* ---------- Menú desplegable (móvil) ---------- */
    function iniciarMenu() {
        const cabecera = $(".cabecera");
        const boton = $(".menu-boton");
        if (!cabecera || !boton) return;

        const abierto = () => boton.getAttribute("aria-expanded") === "true";
        const cambiar = (abrir) => {
            cabecera.classList.toggle("cabecera--abierta", abrir);
            aria(boton, "expanded", abrir);
            aria(boton, "label", abrir ? "Cerrar menú" : "Abrir menú");
        };

        boton.addEventListener("click", () => cambiar(!abierto()));
        $$(".menu a", cabecera).forEach((a) =>
            a.addEventListener("click", () => cambiar(false)),
        );
        matchMedia("(min-width: 48rem)").addEventListener(
            "change",
            (e) => e.matches && cambiar(false),
        );
        document.addEventListener("keydown", (e) => {
            if (e.key === "Escape" && abierto()) {
                cambiar(false);
                boton.focus();
            }
        });
    }

    /* ---------- Sombra de la cabecera al hacer scroll ---------- */
    function iniciarSombra() {
        const cabecera = $(".cabecera");
        if (!cabecera) return;

        const actualizar = () =>
            cabecera.classList.toggle("cabecera--sombra", scrollY > 8);
        addEventListener("scroll", actualizar, { passive: true });
        actualizar();
    }

    /* ---------- Aparición de secciones al hacer scroll ---------- */
    function iniciarRevelado() {
        const elementos = $$(".revelar");
        const mostrar = (el) => el.classList.add("visible");

        if (!("IntersectionObserver" in window))
            return elementos.forEach(mostrar);

        const observador = new IntersectionObserver(
            (entradas) => {
                entradas
                    .filter((e) => e.isIntersecting)
                    .forEach((e) => {
                        mostrar(e.target);
                        observador.unobserve(e.target);
                    });
            },
            { threshold: 0.12, rootMargin: "0px 0px -40px 0px" },
        );

        elementos.forEach((el) => observador.observe(el));
    }

    /* ---------- Año del pie ---------- */
    function iniciarAnio() {
        $$("[data-anio]").forEach(
            (el) => (el.textContent = new Date().getFullYear()),
        );
    }

    /* ---------- Calculadora de ahorro ---------- */
    function iniciarCalculadora() {
        const form = $("#calculadora");
        if (!form) return;

        const META = 5000; // meta de referencia para la barra
        const dinero = new Intl.NumberFormat("es-EC", {
            style: "currency",
            currency: "USD",
        });
        const valor = (id) => Number($("#calc-" + id).value);
        const escribir = (id, texto) => ($("#calc-" + id).textContent = texto);

        const calcular = () => {
            const ingreso = Math.max(0, valor("ingreso") || 0);
            const pct = valor("porcentaje");
            const meses = valor("meses");
            const porMes = (ingreso * pct) / 100;
            const total = porMes * meses;

            escribir("porcentaje-valor", pct + " %");
            escribir("total", dinero.format(total));
            escribir(
                "mensual",
                `${dinero.format(porMes)} al mes durante ${meses} meses`,
            );
            $("#calc-barra").style.width =
                Math.min(100, (total / META) * 100) + "%";
        };

        form.addEventListener("input", calcular);
        form.addEventListener("submit", (e) => e.preventDefault());
        calcular();
    }

    /* ---------- Carrusel de pantallas ---------- */
    function iniciarCarrusel() {
        const carrusel = $(".carrusel");
        if (!carrusel) return;

        const INTERVALO = 6000;
        const pista = $(".carrusel__pista", carrusel);
        const diapositivas = $$(".diapositiva", pista);
        const boton = (nombre) => $(`[data-carrusel='${nombre}']`, carrusel);
        const botonPausa = boton("pausa");
        const anuncio = $(".carrusel__anuncio", carrusel);

        let actual = 0;
        let temporizador = null;
        let pausado = sinMovimiento; // pausa elegida por la persona

        const puntos = diapositivas.map((_, i) => {
            const punto = document.createElement("button");
            punto.type = "button";
            punto.className = "carrusel__punto";
            aria(punto, "label", "Ir a la pantalla " + (i + 1));
            punto.addEventListener("click", () => mover(i));
            $(".carrusel__puntos", carrusel).append(punto);
            return punto;
        });

        // Refleja la diapositiva activa en puntos, accesibilidad y aviso
        function marcar(i) {
            actual = i;
            puntos.forEach((p, j) => aria(p, "current", j === i));
            diapositivas.forEach((d, j) => {
                aria(d, "hidden", j !== i);
                d.inert = j !== i; // sus enlaces salen del orden de tabulación
            });
            const titulo = $("h3", diapositivas[i]);
            if (anuncio && titulo)
                anuncio.textContent = `Pantalla ${i + 1} de ${diapositivas.length}: ${titulo.textContent}`;
        }

        // Desplaza la pista hasta la diapositiva indicada
        function ir(i) {
            const destino = (i + diapositivas.length) % diapositivas.length;
            marcar(destino);
            pista.scrollTo({
                left: diapositivas[destino].offsetLeft - pista.offsetLeft,
                behavior: sinMovimiento ? "auto" : "smooth",
            });
        }

        const detener = () => clearInterval(temporizador);
        const reiniciar = () => {
            detener();
            if (!pausado)
                temporizador = setInterval(() => ir(actual + 1), INTERVALO);
        };
        // Navegación hecha por la persona: se mueve y se reinicia el avance automático
        const mover = (i) => {
            ir(i);
            reiniciar();
        };

        const pintarPausa = () => {
            aria(
                botonPausa,
                "label",
                pausado ? "Reproducir carrusel" : "Pausar carrusel",
            );
            $(".icono-pausa", botonPausa).style.display = pausado ? "none" : "";
            $(".icono-play", botonPausa).style.display = pausado ? "" : "none";
        };

        boton("anterior").addEventListener("click", () => mover(actual - 1));
        boton("siguiente").addEventListener("click", () => mover(actual + 1));
        botonPausa.addEventListener("click", () => {
            pausado = !pausado;
            pintarPausa();
            reiniciar();
        });

        carrusel.addEventListener("keydown", (e) => {
            if (e.key === "ArrowRight") mover(actual + 1);
            if (e.key === "ArrowLeft") mover(actual - 1);
        });

        // Se detiene mientras se mira o se usa
        carrusel.addEventListener("mouseenter", detener);
        carrusel.addEventListener("mouseleave", reiniciar);
        carrusel.addEventListener("focusin", detener);
        carrusel.addEventListener(
            "focusout",
            (e) => carrusel.contains(e.relatedTarget) || reiniciar(),
        );

        // Al deslizar con el dedo, se actualiza la diapositiva activa
        let espera;
        pista.addEventListener(
            "scroll",
            () => {
                clearTimeout(espera);
                espera = setTimeout(() => {
                    const i = Math.round(pista.scrollLeft / pista.clientWidth);
                    if (diapositivas[i] && i !== actual) marcar(i);
                }, 120);
            },
            { passive: true },
        );

        marcar(0);
        pintarPausa();
        reiniciar();
    }

    /* ---------- Acordeón de preguntas frecuentes ---------- */
    function iniciarAcordeon() {
        $$(".acordeon").forEach((acordeon) => {
            const botones = $$(".acordeon__boton", acordeon);

            const cambiar = (boton, abrir) => {
                aria(boton, "expanded", abrir);
                document
                    .getElementById(boton.getAttribute("aria-controls"))
                    .classList.toggle("abierto", abrir);
            };

            botones.forEach((boton, i) => {
                cambiar(boton, i === 0); // empieza abierto solo el primero
                boton.addEventListener("click", () => {
                    const abrir =
                        boton.getAttribute("aria-expanded") !== "true";
                    botones.forEach((b) => cambiar(b, b === boton && abrir)); // una abierta a la vez
                });
            });
        });
    }

    /* ---------- Formulario de contacto ---------- */
    function iniciarFormulario() {
        const form = $("#form-contacto");
        if (!form) return;

        form.noValidate = true; // mensajes propios en lugar de los globos del navegador

        const MAX = 500;
        const boton = $("button[type='submit']", form);
        const mensaje = form.elements.mensaje;

        // Cada regla devuelve el mensaje de error, o "" si el campo es válido
        const reglas = {
            nombre: (v) =>
                !v
                    ? "Escribe tu nombre."
                    : v.length < 3
                      ? "El nombre debe tener al menos 3 letras."
                      : !/^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ' ]+$/.test(v)
                        ? "Usa solo letras y espacios."
                        : "",
            email: (v) =>
                !v
                    ? "Escribe tu correo electrónico."
                    : !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)
                      ? "El correo no es válido. Ejemplo: nombre@correo.com"
                      : "",
            motivo: (v) => (v ? "" : "Elige el motivo de tu mensaje."),
            mensaje: (v) =>
                !v
                    ? "Escribe tu mensaje."
                    : v.length < 10
                      ? "El mensaje debe tener al menos 10 caracteres."
                      : v.length > MAX
                        ? `El mensaje no puede pasar de ${MAX} caracteres.`
                        : "",
            acepto: (v, campo) =>
                campo.checked
                    ? ""
                    : "Debes aceptar que te respondamos por correo.",
        };
        const campos = Object.keys(reglas).map(
            (nombre) => form.elements[nombre],
        );

        function validar(campo) {
            const error = reglas[campo.name](campo.value.trim(), campo);
            const contenedor = campo.closest(".campo");
            const salida = document.getElementById("error-" + campo.name);

            contenedor.classList.toggle("campo--error", !!error);
            contenedor.classList.toggle(
                "campo--ok",
                !error && campo.type !== "checkbox",
            );
            aria(campo, "invalid", !!error);
            if (salida) salida.textContent = error;
            return !error;
        }

        // Valida al salir del campo y corrige en vivo si ya tenía error
        const revalidar = (campo) =>
            campo.getAttribute("aria-invalid") === "true" && validar(campo);
        campos.forEach((campo) => {
            campo.addEventListener("blur", () => validar(campo));
            campo.addEventListener("input", () => revalidar(campo));
            campo.addEventListener("change", () => revalidar(campo));
        });

        // Contador de caracteres
        const contador = $("#contador-mensaje");
        const contar = () => {
            contador.textContent = `${mensaje.value.length} / ${MAX} caracteres`;
            contador.style.color =
                mensaje.value.length > MAX ? "var(--peligro)" : "";
        };
        mensaje.addEventListener("input", contar);
        contar();

        // Si la persona vuelve con "Atrás", se reactiva el botón
        addEventListener("pageshow", () => {
            boton.disabled = false;
            boton.textContent = "Enviar mensaje";
        });

        form.addEventListener("submit", (e) => {
            const invalidos = campos.filter((campo) => !validar(campo)); // se validan todos, sin cortar
            if (invalidos.length) {
                e.preventDefault();
                invalidos[0].focus();
                return;
            }

            boton.disabled = true;
            boton.textContent = "Enviando…";

            // En local no existe Netlify Forms: se simula el envío. En Netlify se envía normal.
            if (esLocal) {
                e.preventDefault();
                location.href = form.getAttribute("action");
            }
        });
    }

    /* ---------- Arranque ---------- */
    [
        iniciarTema,
        iniciarMenu,
        iniciarSombra,
        iniciarRevelado,
        iniciarAnio,
        iniciarCalculadora,
        iniciarCarrusel,
        iniciarAcordeon,
        iniciarFormulario,
    ].forEach((iniciar) => iniciar());
})();
