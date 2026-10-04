const menuToggle = document.querySelector(".menu-toggle");
const siteNav = document.querySelector(".site-nav");
const track = document.querySelector(".product-track");
const cards = [...document.querySelectorAll(".product-card")];
const previous = document.querySelector(".slider-prev");
const next = document.querySelector(".slider-next");
const currentCount = document.querySelector(".slider-count b:first-child");
const filterButtons = [...document.querySelectorAll(".filter")];

menuToggle?.addEventListener("click", () => {
  const open = menuToggle.getAttribute("aria-expanded") === "true";
  menuToggle.setAttribute("aria-expanded", String(!open));
  menuToggle.setAttribute("aria-label", open ? "Abrir menú" : "Cerrar menú");
  siteNav?.classList.toggle("is-open", !open);
});

siteNav?.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    menuToggle?.setAttribute("aria-expanded", "false");
    menuToggle?.setAttribute("aria-label", "Abrir menú");
    siteNav.classList.remove("is-open");
  });
});

function visibleCards() {
  return cards.filter((card) => !card.hidden);
}

function updateSlider() {
  if (!track) return;
  const visible = visibleCards();
  const maxScroll = Math.max(0, track.scrollWidth - track.clientWidth);
  previous.disabled = track.scrollLeft < 4;
  next.disabled = track.scrollLeft > maxScroll - 4;
  const firstCard = visible.find((card) => card.offsetLeft + card.offsetWidth > track.scrollLeft + 12);
  currentCount.textContent = String(Math.max(1, visible.indexOf(firstCard) + 1)).padStart(2, "0");
}

function moveSlider(direction) {
  const first = visibleCards()[0];
  const distance = first ? first.getBoundingClientRect().width + 18 : track.clientWidth * .8;
  track.scrollBy({ left: direction * distance, behavior: "smooth" });
}

previous?.addEventListener("click", () => moveSlider(-1));
next?.addEventListener("click", () => moveSlider(1));
track?.addEventListener("scroll", () => requestAnimationFrame(updateSlider), { passive: true });
window.addEventListener("resize", updateSlider);

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const selected = button.dataset.filter;
    filterButtons.forEach((item) => item.classList.toggle("is-active", item === button));
    cards.forEach((card) => {
      card.hidden = selected !== "all" && card.dataset.category !== selected;
    });
    track.scrollTo({ left: 0, behavior: "smooth" });
    requestAnimationFrame(updateSlider);
  });
});

let dragStart = null;
track?.addEventListener("pointerdown", (event) => {
  if (event.pointerType === "mouse" && event.button !== 0) return;
  if (event.target.closest("a,button")) return;
  dragStart = { x: event.clientX, scroll: track.scrollLeft };
  track.classList.add("is-dragging");
  track.setPointerCapture(event.pointerId);
});
track?.addEventListener("pointermove", (event) => {
  if (dragStart) track.scrollLeft = dragStart.scroll - (event.clientX - dragStart.x);
});
const endDrag = () => {
  dragStart = null;
  track?.classList.remove("is-dragging");
};
track?.addEventListener("pointerup", endDrag);
track?.addEventListener("pointercancel", endDrag);
track?.addEventListener("lostpointercapture", endDrag);

const revealItems = document.querySelectorAll(".reveal");
if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: .12 });
  revealItems.forEach((item, index) => {
    item.style.transitionDelay = `${Math.min(index % 4, 3) * 80}ms`;
    revealObserver.observe(item);
  });
} else {
  revealItems.forEach((item) => item.classList.add("is-visible"));
}

updateSlider();

const folderTabs = [...document.querySelectorAll(".folder-tab")];
const folderPanel = document.querySelector(".folder-panel");
const folderFields = {
  botanica: {
    kicker: "COLECCIÓN DE INICIO", index: "JNDL—001", overline: "01 / FORMAS NATURALES",
    title: "La colección botánica",
    description: "Lirios, orquídeas y flores de cinco pétalos reinterpretados con alambre y chaquiras.",
    tags: ["LIRIOS", "ORQUÍDEAS", "CINCO PÉTALOS"], note: "cada flor,<br>un pequeño universo", link: "Asómate al catálogo", href: "#coleccion"
  },
  temporada: {
    kicker: "EDICIONES QUE CAMBIAN", index: "JNDL—002", overline: "02 / PALETAS DE TEMPORADA",
    title: "Flores de temporada",
    description: "Colores que cambian con la luz, el clima y las ganas de estrenar algo distinto.",
    tags: ["NUEVOS COLORES", "SERIE LIMITADA"], note: "el año también<br>tiene sus flores", link: "Ver la colección", href: "#coleccion"
  },
  historias: {
    kicker: "INSPIRADA EN TUS MUNDOS", index: "JNDL—003", overline: "03 / ESCENAS Y RELATOS",
    title: "Flores con historia",
    description: "Piezas inspiradas en escenas, personajes y universos que se quedan contigo.",
    tags: ["CINE", "SERIES", "LECTURAS"], note: "una historia<br>hecha flor", link: "Explorar ideas", href: "#personalizados"
  },
  personalizada: {
    kicker: "IDEADA CONTIGO", index: "JNDL—004", overline: "04 / DISEÑO PERSONAL",
    title: "A tu manera",
    description: "Elige la flor, la combinación de color y esos detalles que la convierten en algo tuyo.",
    tags: ["TU FLOR", "TU PALETA", "TU HISTORIA"], note: "imagina algo<br>muy tuyo", link: "Cuéntanos tu idea", href: "https://www.instagram.com/jendal_accesorios/"
  }
};
function activateFolder(tab, moveFocus = false) {
  const data = folderFields[tab.dataset.folder];
  if (!data || !folderPanel) return;
  folderTabs.forEach((item) => {
    const active = item === tab;
    item.classList.toggle("is-active", active);
    item.setAttribute("aria-selected", String(active));
    item.tabIndex = active ? 0 : -1;
  });
  folderPanel.setAttribute("aria-labelledby", tab.id);
  folderPanel.dataset.folder = tab.dataset.folder;
  folderPanel.classList.remove("is-changing");
  void folderPanel.offsetWidth;
  folderPanel.classList.add("is-changing");
  document.querySelector("#folder-kicker").textContent = data.kicker;
  document.querySelector("#folder-index").textContent = data.index;
  document.querySelector("#folder-overline").textContent = data.overline;
  document.querySelector("#folder-title").textContent = data.title;
  document.querySelector("#folder-description").textContent = data.description;
  document.querySelector("#folder-art-note").innerHTML = data.note;
  document.querySelector("#folder-link").textContent = data.link;
  document.querySelector("#folder-link").href = data.href;
  document.querySelector("#folder-tags").innerHTML = data.tags.map((tag) => `<span>${tag}</span>`).join("");
  if (moveFocus) tab.focus();
}
folderTabs.forEach((tab, index) => {
  tab.addEventListener("click", () => activateFolder(tab));
  tab.addEventListener("keydown", (event) => {
    if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
    event.preventDefault();
    const target = event.key === "Home" ? 0
      : event.key === "End" ? folderTabs.length - 1
      : (index + (event.key === "ArrowRight" ? 1 : -1) + folderTabs.length) % folderTabs.length;
    activateFolder(folderTabs[target], true);
  });
});
