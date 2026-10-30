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