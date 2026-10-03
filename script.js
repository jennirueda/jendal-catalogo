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
