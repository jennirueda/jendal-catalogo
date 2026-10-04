(() => {
  const data = window.JENDAL;
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const igUrl = `https://www.instagram.com/${data.instagram}/`;
  const money = new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN", maximumFractionDigits: 0 });

  function orderLink(message) {
    if (!data.whatsapp) return igUrl;
    return `https://wa.me/${data.whatsapp}?text=${encodeURIComponent(message)}`;
  }

  document.querySelectorAll(".js-wa").forEach((link) => {
    link.href = orderLink(link.dataset.message || "Hola Jendal");
    link.target = "_blank";
    link.rel = "noopener";
  });
  document.querySelectorAll(".js-ig").forEach((link) => { link.href = igUrl; });
  document.getElementById("year").textContent = new Date().getFullYear();

  /* ---------- encabezado: sólido después del hero, se esconde al bajar ---------- */

  const header = document.querySelector(".site-header");
  const hero = document.querySelector(".hero");
  let lastY = window.scrollY;
  function onScroll() {
    const y = window.scrollY;
    const pastHero = y > hero.offsetHeight - 80;
    header.classList.toggle("is-solid", pastHero);
    header.classList.toggle("is-hidden", pastHero && y > lastY + 4 && !header.contains(document.activeElement));
    if (y < lastY - 4 || !pastHero) header.classList.remove("is-hidden");
    lastY = y;
  }
  window.addEventListener("scroll", () => requestAnimationFrame(onScroll), { passive: true });
  onScroll();

  /* ---------- hero: la flor cambia de color sola ---------- */

  const heroCanvas = document.querySelector(".hero-canvas");
  const heroCycle = [
    { petal: "#F59AB0", edge: "#FBD3DC", center: "#F3D36A", leaf: "#7FA048", chain: "#7FA048", ink: "#2a0a12" },
    { petal: "#F7E08A", edge: "#FFF3C4", center: "#E07A9A", leaf: "#7FA048", chain: "#7FA048", ink: "#2a0a12" },
    { petal: "#F6A15A", edge: "#FBD2A6", center: "#FBE7B5", leaf: "#7FA048", chain: "#7FA048", ink: "#2a0a12" },
    { petal: "#C9A8E8", edge: "#ECDDFA", center: "#F3D36A", leaf: "#7FA048", chain: "#7FA048", ink: "#2a0a12" }
  ];
  const heroArt = window.JendalBeads.create(heroCanvas, {
    model: "lirio", view: "bloom", variant: heroCycle[0], intro: "auto",
    bloom: { cx: 492, cy: 515, scale: 352, rotate: -0.18 }
  });
  let heroIndex = 0, heroTimer = 0, heroVisible = true;
  function cycleHero() {
    clearTimeout(heroTimer);
    if (reduceMotion || !heroVisible || document.hidden) return;
    heroTimer = setTimeout(() => {
      heroIndex = (heroIndex + 1) % heroCycle.length;
      heroArt.setVariant(heroCycle[heroIndex], { origin: [492, 515] });
      cycleHero();
    }, 3600);
  }
  new IntersectionObserver(([entry]) => { heroVisible = entry.isIntersecting; cycleHero(); }).observe(hero);
  document.addEventListener("visibilitychange", cycleHero);
  hero.addEventListener("pointermove", (event) => {
    if (event.pointerType !== "mouse") return;
    const rect = hero.getBoundingClientRect();
    heroArt.pointer((event.clientX - rect.left) / rect.width - 0.5, (event.clientY - rect.top) / rect.height - 0.5);
  });
  hero.addEventListener("pointerleave", () => heroArt.pointer(0, 0));

  /* ---------- piezas ---------- */

  const template = document.getElementById("piece-template");
  const list = document.getElementById("piezas");

  data.pieces.forEach((piece, pieceIndex) => {
    const node = template.content.firstElementChild.cloneNode(true);
    node.id = `collar-${piece.id}`;
    node.classList.toggle("is-flipped", pieceIndex % 2 === 1);

    const canvas = node.querySelector(".piece-canvas");
    const photo = node.querySelector(".piece-photo");
    const swatchRow = node.querySelector(".swatch-row");
    const swatchName = node.querySelector(".swatch-name");
    const order = node.querySelector(".order");
    const orderLabel = order.querySelector("span");
    const toggle = node.querySelector(".view-toggle");
    const note = node.querySelector(".stage-note");

    node.querySelector(".piece-name").textContent = piece.name;
    node.querySelector(".piece-name").id = `nombre-${piece.id}`;
    node.setAttribute("aria-labelledby", `nombre-${piece.id}`);
    node.querySelector(".piece-kind").textContent = `${piece.category} · chaquira y alambre`;
    node.querySelector(".piece-desc").textContent = piece.description;
    node.querySelector(".price").textContent = piece.price ? money.format(piece.price) : "Pregunta el precio";
    node.querySelector(".price").classList.toggle("is-pending", !piece.price);

    let current = piece.variants[0];
    let mode = "flat";
    const art = window.JendalBeads.create(canvas, { model: piece.model, variant: current, ink: current.ink, intro: "wait" });

    function showPhoto() {
      const src = current.images && current.images[mode];
      photo.hidden = !src;
      canvas.hidden = !!src;
      note.hidden = !!src;
      if (src) {
        photo.src = src;
        photo.alt = `Collar ${piece.name} en color ${current.name}${mode === "worn" ? ", puesto" : ""}`;
      }
    }

    function apply(variant, animate) {
      current = variant;
      node.style.setProperty("--field", variant.field);
      node.style.setProperty("--ink", variant.ink);
      node.style.setProperty("--accent", variant.edge);
      swatchName.textContent = variant.name;
      orderLabel.textContent = `Pedir en ${variant.name.toLowerCase()}`;
      const price = piece.price ? ` (${money.format(piece.price)})` : "";
      order.href = orderLink(`Hola Jendal 🌸 Me interesa el collar ${piece.name} en color ${variant.name}${price}. ¿Me das más información?`);
      canvas.setAttribute("aria-label", `Ilustración del collar ${piece.name} en color ${variant.name}${mode === "worn" ? ", puesto" : ""}`);
      if (animate) art.setVariant(variant);
      showPhoto();
    }

    piece.variants.forEach((variant, i) => {
      const id = `${piece.id}-${variant.id}`;
      const input = document.createElement("input");
      input.type = "radio";
      input.name = `color-${piece.id}`;
      input.id = id;
      input.value = variant.id;
      input.checked = i === 0;
      const label = document.createElement("label");
      label.htmlFor = id;
      label.className = "swatch";
      label.style.setProperty("--c", variant.petal);
      label.style.setProperty("--e", variant.edge);
      label.innerHTML = `<span class="sr-only">${variant.name}</span>`;
      label.title = variant.name;
      input.addEventListener("change", () => apply(variant, true));
      swatchRow.append(input, label);
    });

    const modeButtons = [...toggle.querySelectorAll("button")];
    function setMode(next, focus) {
      mode = next;
      toggle.dataset.mode = next;
      modeButtons.forEach((b) => {
        const on = b.dataset.mode === next;
        b.setAttribute("aria-checked", String(on));
        b.tabIndex = on ? 0 : -1;
        if (on && focus) b.focus();
      });
      art.setMode(next);
      apply(current, false);
    }
    modeButtons.forEach((button) => {
      button.addEventListener("click", () => setMode(button.dataset.mode));
      button.addEventListener("keydown", (event) => {
        if (!["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(event.key)) return;
        event.preventDefault();
        setMode(mode === "flat" ? "worn" : "flat", true);
      });
    });

    apply(current, false);
    setMode("flat");
    list.append(node);

    new IntersectionObserver((entries, observer) => {
      if (!entries[0].isIntersecting) return;
      art.play();
      observer.disconnect();
    }, { threshold: 0.35 }).observe(canvas);
  });

  /* ---------- próximamente ---------- */

  const soonColors = ["#F59AB0", "#F7E08A", "#F6A15A", "#C9A8E8", "#7FA048"];
  const soon = document.getElementById("proximamente");
  data.upcoming.forEach((name, i) => {
    const li = document.createElement("li");
    li.style.setProperty("--dot", soonColors[i % soonColors.length]);
    li.innerHTML = `<span class="soon-name"></span><span class="soon-tag">Próximamente</span>`;
    li.querySelector(".soon-name").textContent = name;
    soon.append(li);
  });
})();
