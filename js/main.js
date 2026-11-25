/* ============================================================
   Dolarito · interacciones del sitio
   1. Cambio de tema (claro / oscuro)
   2. Menú desplegable en móvil
   3. Sombra de la cabecera al hacer scroll
   4. Aparición de secciones al hacer scroll
   5. Año actual en el pie de página
   6. Calculadora de ahorro
   7. Carrusel de pantallas
   8. Acordeón de preguntas frecuentes
   9. Validación del formulario de contacto
   ============================================================ */

(function () {
    "use strict";

    const raiz = document.documentElement;
    const reducirMovimiento = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const CLAVE_TEMA = "dolarito-tema";

    /* ---------- 1. Cambio de tema ---------- */
    function iniciarTema() {
        const boton = document.getElementById("boton-tema");
        if (!boton) return;

        function pintarBoton() {
            const oscuro = raiz.getAttribute("data-theme") === "dark";
            boton.setAttribute("aria-pressed", String(oscuro));
            boton.setAttribute("aria-label", oscuro ? "Activar modo claro" : "Activar modo oscuro");
            boton.title = oscuro ? "Modo claro" : "Modo oscuro";
        }

        boton.addEventListener("click", function () {
            const nuevo = raiz.getAttribute("data-theme") === "dark" ? "light" : "dark";
            raiz.setAttribute("data-theme", nuevo);
            try {
                localStorage.setItem(CLAVE_TEMA, nuevo);
            } catch (e) {
                /* Sin almacenamiento: el tema dura solo esta visita */
            }
            pintarBoton();
        });

        pintarBoton();
    }

    /* ---------- 2. Menú desplegable ---------- */
    function iniciarMenu() {
        const cabecera = document.querySelector(".cabecera");
        const boton = document.querySelector(".menu-boton");
        if (!cabecera || !boton) return;

        function cambiar(abrir) {
            cabecera.classList.toggle("cabecera--abierta", abrir);
            boton.setAttribute("aria-expanded", String(abrir));
            boton.setAttribute("aria-label", abrir ? "Cerrar menú" : "Abrir menú");
        }

        boton.addEventListener("click", function () {
            cambiar(boton.getAttribute("aria-expanded") !== "true");
        });

        // Cerrar al elegir una opción, con Escape o al pasar a escritorio
        cabecera.querySelectorAll(".menu a").forEach(function (enlace) {
            enlace.addEventListener("click", function () {
                cambiar(false);
            });
        });

        document.addEventListener("keydown", function (e) {
            if (e.key === "Escape" && boton.getAttribute("aria-expanded") === "true") {
                cambiar(false);
                boton.focus();
            }
        });

        window.matchMedia("(min-width: 48rem)").addEventListener("change", function (e) {
            if (e.matches) cambiar(false);
        });
    }

    /* ---------- 3. Sombra de la cabecera ---------- */
    function iniciarSombraCabecera() {
        const cabecera = document.querySelector(".cabecera");
        if (!cabecera) return;

        function actualizar() {
            cabecera.classList.toggle("cabecera--sombra", window.scrollY > 8);
        }

        window.addEventListener("scroll", actualizar, { passive: true });
        actualizar();
    }

    /* ---------- 4. Aparición al hacer scroll ---------- */
    function iniciarRevelado() {
        const elementos = document.querySelectorAll(".revelar");
        if (!elementos.length) return;

        if (!("IntersectionObserver" in window)) {
            elementos.forEach(function (el) {
                el.classList.add("visible");
            });
            return;
        }

        const observador = new IntersectionObserver(function (entradas) {
            entradas.forEach(function (entrada) {
                if (entrada.isIntersecting) {
                    entrada.target.classList.add("visible");
                    observador.unobserve(entrada.target);
                }
            });
        }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });

        elementos.forEach(function (el) {
            observador.observe(el);
        });
    }

    /* ---------- 5. Año actual ---------- */
    function iniciarAnio() {
        document.querySelectorAll("[data-anio]").forEach(function (el) {
            el.textContent = String(new Date().getFullYear());
        });
    }

    /* ---------- 6. Calculadora de ahorro ---------- */
    function iniciarCalculadora() {
        const form = document.getElementById("calculadora");
        if (!form) return;

        const ingreso = form.querySelector("#calc-ingreso");
        const porcentaje = form.querySelector("#calc-porcentaje");
        const porcentajeTexto = form.querySelector("#calc-porcentaje-valor");
        const meses = form.querySelector("#calc-meses");
        const total = document.getElementById("calc-total");
        const mensual = document.getElementById("calc-mensual");
        const relleno = document.getElementById("calc-barra");
        const META = 5000; // meta de referencia para la barra de progreso

        const dinero = new Intl.NumberFormat("es-EC", { style: "currency", currency: "USD" });

        function calcular() {
            const monto = Math.max(0, parseFloat(ingreso.value) || 0);
            const pct = parseInt(porcentaje.value, 10);
            const n = parseInt(meses.value, 10);
            const porMes = monto * pct / 100;
            const acumulado = porMes * n;

            porcentajeTexto.textContent = pct + " %";
            total.textContent = dinero.format(acumulado);
            mensual.textContent = dinero.format(porMes) + " al mes durante " + n + " meses";
            relleno.style.width = Math.min(100, acumulado / META * 100) + "%";
        }

        form.addEventListener("input", calcular);
        form.addEventListener("submit", function (e) {
            e.preventDefault();
        });
        calcular();
    }

    /* ---------- 7. Carrusel ---------- */
    function iniciarCarrusel() {
        const carrusel = document.querySelector(".carrusel");
        if (!carrusel) return;

        const pista = carrusel.querySelector(".carrusel__pista");
        const diapositivas = Array.from(pista.querySelectorAll(".diapositiva"));
        const anterior = carrusel.querySelector("[data-carrusel='anterior']");
        const siguiente = carrusel.querySelector("[data-carrusel='siguiente']");
        const pausa = carrusel.querySelector("[data-carrusel='pausa']");
        const contenedorPuntos = carrusel.querySelector(".carrusel__puntos");
        const anuncio = carrusel.querySelector(".carrusel__anuncio");
        const INTERVALO = 6000;

        let actual = 0;
        let temporizador = null;
        let pausadoPorUsuario = reducirMovimiento;

        // Crear un punto por diapositiva
        const puntos = diapositivas.map(function (diapositiva, i) {
            const punto = document.createElement("button");
            punto.type = "button";
            punto.className = "carrusel__punto";
            punto.setAttribute("aria-label", "Ir a la pantalla " + (i + 1));
            punto.addEventListener("click", function () {
                ir(i);
                reiniciar();
            });
            contenedorPuntos.appendChild(punto);
            return punto;
        });

        function marcar(i) {
            actual = i;
            puntos.forEach(function (p, j) {
                p.setAttribute("aria-current", j === i ? "true" : "false");
            });
            diapositivas.forEach(function (d, j) {
                d.setAttribute("aria-hidden", j === i ? "false" : "true");
                d.querySelectorAll("a, button").forEach(function (el) {
                    el.tabIndex = j === i ? 0 : -1;
                });
            });
            const titulo = diapositivas[i].querySelector("h3");
            if (anuncio && titulo) {
                anuncio.textContent = "Pantalla " + (i + 1) + " de " + diapositivas.length + ": " + titulo.textContent;
            }
        }

        // Mientras el código desplaza la pista, se ignora el detector de deslizamiento
        let desplazandoPorCodigo = false;
        let finDesplazamiento;

        function ir(i) {
            const total = diapositivas.length;
            const destino = (i + total) % total;
            desplazandoPorCodigo = true;
            clearTimeout(finDesplazamiento);
            finDesplazamiento = setTimeout(function () {
                desplazandoPorCodigo = false;
            }, 900);
            pista.scrollTo({
                left: diapositivas[destino].offsetLeft - pista.offsetLeft,
                behavior: reducirMovimiento ? "auto" : "smooth"
            });
            marcar(destino);
        }

        function avanzar() {
            ir(actual + 1);
        }

        function detener() {
            clearInterval(temporizador);
            temporizador = null;
        }

        function reiniciar() {
            detener();
            if (!pausadoPorUsuario) temporizador = setInterval(avanzar, INTERVALO);
        }

        function pintarPausa() {
            pausa.setAttribute("aria-label", pausadoPorUsuario ? "Reproducir carrusel" : "Pausar carrusel");
            pausa.querySelector(".icono-pausa").style.display = pausadoPorUsuario ? "none" : "";
            pausa.querySelector(".icono-play").style.display = pausadoPorUsuario ? "" : "none";
        }

        anterior.addEventListener("click", function () {
            ir(actual - 1);
            reiniciar();
        });

        siguiente.addEventListener("click", function () {
            avanzar();
            reiniciar();
        });

        pausa.addEventListener("click", function () {
            pausadoPorUsuario = !pausadoPorUsuario;
            pintarPausa();
            reiniciar();
        });

        // Flechas del teclado cuando el foco está dentro del carrusel
        carrusel.addEventListener("keydown", function (e) {
            if (e.key === "ArrowRight") {
                avanzar();
                reiniciar();
            } else if (e.key === "ArrowLeft") {
                ir(actual - 1);
                reiniciar();
            }
        });

        // Pausar mientras el usuario lo mira o lo usa
        carrusel.addEventListener("mouseenter", detener);
        carrusel.addEventListener("mouseleave", reiniciar);
        carrusel.addEventListener("focusin", detener);
        carrusel.addEventListener("focusout", function (e) {
            if (!carrusel.contains(e.relatedTarget)) reiniciar();
        });

        // Si se desliza con el dedo, actualizar el punto activo
        let esperaScroll;
        pista.addEventListener("scroll", function () {
            if (desplazandoPorCodigo) return;
            clearTimeout(esperaScroll);
            esperaScroll = setTimeout(function () {
                const i = Math.round(pista.scrollLeft / pista.clientWidth);
                if (i !== actual && diapositivas[i]) marcar(i);
            }, 120);
        }, { passive: true });

        marcar(0);
        pintarPausa();
        reiniciar();
    }

    /* ---------- 8. Acordeón ---------- */
    function iniciarAcordeon() {
        document.querySelectorAll(".acordeon").forEach(function (acordeon) {
            const botones = Array.from(acordeon.querySelectorAll(".acordeon__boton"));

            function cambiar(boton, abrir) {
                const panel = document.getElementById(boton.getAttribute("aria-controls"));
                boton.setAttribute("aria-expanded", String(abrir));
                panel.classList.toggle("abierto", abrir);
            }

            botones.forEach(function (boton, i) {
                // Con JavaScript, empiezan cerrados salvo el primero
                cambiar(boton, i === 0);

                boton.addEventListener("click", function () {
                    const abrir = boton.getAttribute("aria-expanded") !== "true";
                    // Solo una respuesta abierta a la vez
                    botones.forEach(function (otro) {
                        if (otro !== boton) cambiar(otro, false);
                    });
                    cambiar(boton, abrir);
                });
            });
        });
    }

    /* ---------- 9. Validación del formulario ---------- */
    function iniciarFormulario() {
        const form = document.getElementById("form-contacto");
        if (!form) return;

        // Desactiva los globos nativos del navegador: mostramos mensajes propios
        form.noValidate = true;

        const mensaje = form.querySelector("#mensaje");
        const contador = form.querySelector("#contador-mensaje");
        const boton = form.querySelector("button[type='submit']");
        const MAX_MENSAJE = 500;

        const reglas = {
            nombre: function (v) {
                if (!v) return "Escribe tu nombre.";
                if (v.length < 3) return "El nombre debe tener al menos 3 letras.";
                if (!/^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ' ]+$/.test(v)) return "Usa solo letras y espacios.";
                return "";
            },
            email: function (v) {
                if (!v) return "Escribe tu correo electrónico.";
                if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)) return "El correo no es válido. Ejemplo: nombre@correo.com";
                return "";
            },
            motivo: function (v) {
                return v ? "" : "Elige el motivo de tu mensaje.";
            },
            mensaje: function (v) {
                if (!v) return "Escribe tu mensaje.";
                if (v.length < 10) return "El mensaje debe tener al menos 10 caracteres.";
                if (v.length > MAX_MENSAJE) return "El mensaje no puede pasar de " + MAX_MENSAJE + " caracteres.";
                return "";
            },
            acepto: function (v, campo) {
                return campo.checked ? "" : "Debes aceptar que te respondamos por correo.";
            }
        };

        function validarCampo(campo) {
            const regla = reglas[campo.name];
            if (!regla) return true;

            const error = regla(campo.value.trim(), campo);
            const contenedor = campo.closest(".campo");
            const salida = document.getElementById("error-" + campo.name);

            contenedor.classList.toggle("campo--error", Boolean(error));
            contenedor.classList.toggle("campo--ok", !error && campo.type !== "checkbox");
            campo.setAttribute("aria-invalid", String(Boolean(error)));
            if (salida) salida.textContent = error;
            return !error;
        }

        function actualizarContador() {
            const n = mensaje.value.length;
            contador.textContent = n + " / " + MAX_MENSAJE + " caracteres";
            contador.style.color = n > MAX_MENSAJE ? "var(--peligro)" : "";
        }

        // Validar al salir de cada campo y corregir en vivo si ya tenía error
        Object.keys(reglas).forEach(function (nombre) {
            const campo = form.elements[nombre];
            campo.addEventListener("blur", function () {
                validarCampo(campo);
            });
            campo.addEventListener(campo.type === "checkbox" || campo.tagName === "SELECT" ? "change" : "input", function () {
                if (campo.getAttribute("aria-invalid") === "true") validarCampo(campo);
            });
        });

        mensaje.addEventListener("input", actualizarContador);
        actualizarContador();

        // Si el usuario vuelve con "Atrás", reactivar el botón
        window.addEventListener("pageshow", function () {
            boton.disabled = false;
            boton.textContent = "Enviar mensaje";
        });

        form.addEventListener("submit", function (e) {
            let primeroConError = null;

            Object.keys(reglas).forEach(function (nombre) {
                const campo = form.elements[nombre];
                if (!validarCampo(campo) && !primeroConError) primeroConError = campo;
            });

            if (primeroConError) {
                e.preventDefault();
                primeroConError.focus();
                return;
            }

            boton.disabled = true;
            boton.textContent = "Enviando…";

            // En local (Live Server o archivo) no existe Netlify Forms:
            // se simula el envío llevando directo a la página de gracias.
            const esLocal = location.protocol === "file:" ||
                ["localhost", "127.0.0.1", "[::1]", ""].indexOf(location.hostname) !== -1;
            if (esLocal) {
                e.preventDefault();
                window.location.href = form.getAttribute("action");
            }
            // En Netlify el formulario se envía normalmente y Netlify lo guarda.
        });
    }

    /* ---------- Arranque ---------- */
    iniciarTema();
    iniciarMenu();
    iniciarSombraCabecera();
    iniciarRevelado();
    iniciarAnio();
    iniciarCalculadora();
    iniciarCarrusel();
    iniciarAcordeon();
    iniciarFormulario();
})();
