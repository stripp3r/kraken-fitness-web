/* =========================================================
   KRAKEN — script.js
   Navegación, animaciones de scroll y modal de video.
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {
  /* ---------- Año dinámico en el footer ---------- */
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Header: fondo al hacer scroll ---------- */
  const header = document.getElementById("site-header");
  const onScroll = () => {
    if (window.scrollY > 20) header.classList.add("scrolled");
    else header.classList.remove("scrolled");
  };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  /* ---------- Menú mobile ---------- */
  const navToggle = document.getElementById("nav-toggle");
  const nav = document.getElementById("nav");

  const closeNav = () => {
    nav.classList.remove("open");
    navToggle.classList.remove("open");
    navToggle.setAttribute("aria-expanded", "false");
  };

  navToggle.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("open");
    navToggle.classList.toggle("open", isOpen);
    navToggle.setAttribute("aria-expanded", String(isOpen));
  });

  nav.querySelectorAll(".nav-link").forEach((link) => {
    link.addEventListener("click", closeNav);
  });

  /* ---------- Animaciones al hacer scroll ---------- */
  const revealEls = document.querySelectorAll(".reveal");
  const revealAll = () => revealEls.forEach((el) => el.classList.add("visible"));

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -10% 0px" }
    );
    revealEls.forEach((el) => observer.observe(el));
    // Red de seguridad: si algo no se reveló por un fallo del observer, mostrarlo igual.
    setTimeout(revealAll, 2500);
  } else {
    revealAll();
  }

  /* =========================================================
     MODAL DE VIDEO (Google Drive)
     ========================================================= */
  const modal = document.getElementById("video-modal");
  const iframe = document.getElementById("modal-iframe");
  const modalTitle = document.getElementById("modal-title");
  const modalVideoBox = modal.querySelector(".modal-video");
  let lastFocused = null;

  /**
   * Convierte un link de Google Drive a su URL de reproducción embebida.
   * Acepta:
   *   https://drive.google.com/file/d/FILE_ID/view?usp=sharing
   *   https://drive.google.com/open?id=FILE_ID
   *   FILE_ID directo
   * Devuelve la URL /preview lista para <iframe>, o null si es un placeholder.
   */
  function toDrivePreview(url) {
    if (!url || url === "#" || url.trim() === "") return null;

    let id = null;
    const byPath = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
    const byQuery = url.match(/[?&]id=([a-zA-Z0-9_-]+)/);

    if (byPath) id = byPath[1];
    else if (byQuery) id = byQuery[1];
    else if (/^[a-zA-Z0-9_-]{20,}$/.test(url.trim())) id = url.trim();

    if (!id) return url; // por si ya es una URL de embed completa

    // /preview permite reproducción embebida. Se intenta autoplay por query.
    return `https://drive.google.com/file/d/${id}/preview?autoplay=1`;
  }

  function openModal(title, rawVideo) {
    const src = toDrivePreview(rawVideo);
    modalTitle.textContent = title || "Video del ejercicio";

    // Limpia cualquier aviso previo
    const oldNote = modalVideoBox.querySelector(".modal-note");
    if (oldNote) oldNote.remove();

    if (src) {
      iframe.style.display = "";
      iframe.src = src;
    } else {
      // Placeholder: todavía no hay link de Drive cargado
      iframe.style.display = "none";
      iframe.src = "";
      const note = document.createElement("p");
      note.className = "modal-note";
      note.textContent = "Video no disponible todavía. Cargá el link de Google Drive en index.html.";
      note.style.cssText =
        "position:absolute;inset:0;display:flex;align-items:center;justify-content:center;text-align:center;padding:24px;color:#7a7a7a;font-size:.9rem;";
      modalVideoBox.appendChild(note);
    }

    lastFocused = document.activeElement;
    modal.classList.add("open");
    modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    modal.querySelector(".modal-close").focus();
  }

  function closeModal() {
    modal.classList.remove("open");
    modal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    // Detener la reproducción vaciando el src
    iframe.src = "";
    if (lastFocused) lastFocused.focus();
  }

  document.querySelectorAll(".exercise-card").forEach((card) => {
    const trigger = () =>
      openModal(card.dataset.title, card.dataset.video);

    card.querySelector(".exercise-btn").addEventListener("click", trigger);
    card.querySelector(".exercise-thumb").addEventListener("click", trigger);
  });

  modal.querySelectorAll("[data-close]").forEach((el) => {
    el.addEventListener("click", closeModal);
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal.classList.contains("open")) closeModal();
  });
});
