// =========================================================
// 1. CONTADOR REGRESIVO
// Fecha del evento: 25 de noviembre de 2026 a las 09:00:00 AM
// Se usa el formato ISO para evitar problemas en navegadores como Safari
// =========================================================
const eventDate = new Date("2026-11-25T09:00:00").getTime();

const countdown = setInterval(function () {
  const now = new Date().getTime();
  const distance = eventDate - now;

  // Cálculo de días, horas, minutos y segundos
  const days = Math.floor(distance / (1000 * 60 * 60 * 24));
  const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((distance % (1000 * 60)) / 1000);

  // Agrega un '0' a los números menores de 10 (ej: 09 en vez de 9)
  const formatTime = (time) => (time < 10 ? `0${time}` : time);

  document.getElementById("cd-days").innerText = formatTime(days);
  document.getElementById("cd-hours").innerText = formatTime(hours);
  document.getElementById("cd-minutes").innerText = formatTime(minutes);
  document.getElementById("cd-seconds").innerText = formatTime(seconds);

  // Cuando llega la hora del evento
  if (distance < 0) {
    clearInterval(countdown);

    document.getElementById("cd-days").innerText = "00";
    document.getElementById("cd-hours").innerText = "00";
    document.getElementById("cd-minutes").innerText = "00";
    document.getElementById("cd-seconds").innerText = "00";

    document.querySelector(".countdown-section h3").innerText = "¡El evento ha comenzado!";
  }
}, 1000);

// =========================================================
// 2. NAVBAR: fondo sólido al hacer scroll
// =========================================================
const nav = document.getElementById("mainNav");
const onScroll = () => nav.classList.toggle("scrolled", window.scrollY > 40);
window.addEventListener("scroll", onScroll, { passive: true });
onScroll();

// =========================================================
// 3. MODO CLARO / OSCURO
// =========================================================
const themeToggle = document.getElementById("themeToggle");
const themeIcon = themeToggle.querySelector("i");
const root = document.documentElement;

function applyTheme(theme) {
  root.setAttribute("data-bs-theme", theme);
  themeIcon.className = theme === "dark" ? "fa-solid fa-sun" : "fa-solid fa-moon";
  themeToggle.setAttribute("aria-pressed", theme === "dark");
  try { localStorage.setItem("theme", theme); } catch (e) { /* sin almacenamiento */ }
}

let savedTheme = null;
try { savedTheme = localStorage.getItem("theme"); } catch (e) { /* sin almacenamiento */ }
const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

applyTheme(savedTheme || (prefersDark ? "dark" : "light"));

themeToggle.addEventListener("click", () => {
  applyTheme(root.getAttribute("data-bs-theme") === "dark" ? "light" : "dark");
});


// =========================================================
// 4. FORMULARIO DE CONTACTO CON VALIDACIÓN EN TIEMPO REAL
// =========================================================
const form = document.getElementById("contactForm");

if (form) {
  // Acepta @tecmm.edu.mx y cualquier subdominio (ej. @zapopan.tecmm.edu.mx)
  const emailInstitucional = /^[a-z0-9._%+-]+@([a-z0-9-]+\.)*tecmm\.edu\.mx$/i;
  const soloLetras = /^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ\s.'-]+$/;

  // Cada regla devuelve "" si es válido, o el mensaje de error
  const reglas = {
    nombre(campo) {
      const v = campo.value.trim();
      if (v === "") return "El nombre es obligatorio.";
      if (v.length < 3) return "Escribe al menos 3 caracteres.";
      if (!soloLetras.test(v)) return "El nombre solo puede contener letras.";
      return "";
    },
    correo(campo) {
      const v = campo.value.trim();
      if (v === "") return "El correo es obligatorio.";
      if (!v.includes("@")) return "Falta el símbolo @ en el correo.";
      if (!emailInstitucional.test(v)) return "Usa tu correo institucional (@zapopan.tecmm.edu.mx).";
      return "";
    },
    tipo(campo) {
      return campo.value === "" ? "Selecciona un tipo de consulta." : "";
    },
    mensaje(campo) {
      const v = campo.value.trim();
      if (v === "") return "El mensaje es obligatorio.";
      if (v.length < 10) return `Escribe al menos 10 caracteres (llevas ${v.length}).`;
      return "";
    },
    aviso(campo) {
      return campo.checked ? "" : "Debes aceptar el aviso de privacidad.";
    }
  };

  const campos = Array.from(form.querySelectorAll("input, select, textarea"));

  function validarCampo(campo) {
    const error = reglas[campo.name](campo);
    const contenedor = campo.closest(".mb-3, .mb-4");
    const mensajeError = contenedor.querySelector(".invalid-feedback");

    mensajeError.textContent = error;
    campo.classList.toggle("is-invalid", error !== "");
    campo.classList.toggle("is-valid", error === "");
    campo.setAttribute("aria-invalid", error !== "");
    return error === "";
  }

  // Validar en tiempo real: al escribir, al salir del campo y al cambiar
  campos.forEach((campo) => {
    const evento = (campo.type === "checkbox" || campo.tagName === "SELECT") ? "change" : "input";
    campo.addEventListener(evento, () => validarCampo(campo));
    campo.addEventListener("blur", () => validarCampo(campo));
  });

  // Contador de caracteres del mensaje
  const mensaje = document.getElementById("mensaje");
  const contador = document.getElementById("mensajeCount");
  mensaje.addEventListener("input", () => { contador.textContent = mensaje.value.length; });

  // Envío
  const resultado = document.getElementById("formResultado");
  const boton = document.getElementById("btnEnviar");

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    resultado.innerHTML = "";

    const validos = campos.map(validarCampo);
    if (validos.includes(false)) {
      campos[validos.indexOf(false)].focus();
      resultado.innerHTML =
        '<div class="alert alert-danger alert-exito" role="alert">' +
        '<i class="fa-solid fa-circle-exclamation me-2" aria-hidden="true"></i>' +
        'Revisa los campos marcados en rojo antes de enviar.</div>';
      return;
    }

    // Simulación de envío (sin servidor): muestra confirmación sin recargar
    const textoOriginal = boton.querySelector("span").textContent;
    boton.disabled = true;
    boton.querySelector("span").textContent = "Enviando...";

    setTimeout(() => {
      const nombre = document.getElementById("nombre").value.trim().split(" ")[0];
      resultado.innerHTML =
        '<div class="alert alert-success alert-exito" role="alert">' +
        '<i class="fa-solid fa-circle-check me-2" aria-hidden="true"></i>' +
        `¡Gracias, ${nombre}! Recibimos tu mensaje y te responderemos a tu correo institucional.</div>`;

      form.reset();
      contador.textContent = "0";
      campos.forEach((c) => {
        c.classList.remove("is-valid", "is-invalid");
        c.removeAttribute("aria-invalid");
      });
      boton.disabled = false;
      boton.querySelector("span").textContent = textoOriginal;
    }, 900);
  });
}

// =========================================================
// 5. FILTRADO INTERACTIVO DE PROYECTOS (MANIPULACIÓN DEL DOM)
// =========================================================
const botonesFiltro = document.querySelectorAll(".filter-btn");
const tarjetasProyectos = document.querySelectorAll(".proyecto-card");

if (botonesFiltro.length > 0) {
  botonesFiltro.forEach((boton) => {
    boton.addEventListener("click", () => {
      // Remover clase 'active' de todos los botones y activarla en el pulsado
      botonesFiltro.forEach((b) => b.classList.remove("active"));
      boton.classList.add("active");

      const categoriaSeleccionada = boton.getAttribute("data-filter");

      // Mostrar u ocultar las tarjetas según la categoría
      tarjetasProyectos.forEach((tarjeta) => {
        const categoriaTarjeta = tarjeta.getAttribute("data-category");
        const mostrar = categoriaSeleccionada === "todos" || categoriaTarjeta === categoriaSeleccionada;
        
        tarjeta.style.display = mostrar ? "block" : "none";
      });
    });
  });
}