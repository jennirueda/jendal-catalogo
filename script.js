const menuToggle = document.querySelector(".menu-toggle");
const siteNav = document.querySelector(".site-nav");

menuToggle?.addEventListener("click", () => {
  const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
  menuToggle.setAttribute("aria-expanded", String(!isOpen));
  siteNav?.classList.toggle("is-open", !isOpen);
});

siteNav?.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    menuToggle?.setAttribute("aria-expanded", "false");
    siteNav.classList.remove("is-open");
  });
});

document.querySelectorAll(".filter").forEach((button) => {
  button.addEventListener("click", () => {
    const selected = button.dataset.filter;
    document.querySelectorAll(".filter").forEach((item) => {
      item.classList.toggle("is-active", item === button);
    });
    document.querySelectorAll(".product-card").forEach((card) => {
      card.hidden = selected !== "all" && card.dataset.category !== selected;
    });
  });
});
