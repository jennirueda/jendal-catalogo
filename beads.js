/*
  Dibuja las piezas de Jendal chaquira por chaquira en <canvas>.
  Cada flor se arma como en el tejido francés: lazos de cuentas que crecen
  desde la base del pétalo. Cambiar de color o pasar a "puesto" anima cada
  cuenta por separado.
*/
(function () {
  const TAU = Math.PI * 2;
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  const hexToRgb = (hex) => {
    const n = parseInt(hex.slice(1), 16);
    return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
  };
  const mix = (a, b, t) => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t];
  const shade = (c, k) => (k < 0 ? c.map((v) => v * (1 + k)) : c.map((v) => v + (255 - v) * k));
  const css = (c, a = 1) => `rgba(${c[0] | 0},${c[1] | 0},${c[2] | 0},${a})`;
  const clamp01 = (t) => (t < 0 ? 0 : t > 1 ? 1 : t);
  const expoOut = (t) => (t >= 1 ? 1 : 1 - Math.pow(2, -10 * t));
  const inOut = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

  /* ---------- geometría ---------- */

  function cubic(p0, p1, p2, p3, n = 48) {
    const pts = [];
    for (let i = 0; i <= n; i++) {
      const t = i / n, u = 1 - t;
      pts.push([
        u * u * u * p0[0] + 3 * u * u * t * p1[0] + 3 * u * t * t * p2[0] + t * t * t * p3[0],
        u * u * u * p0[1] + 3 * u * u * t * p1[1] + 3 * u * t * t * p2[1] + t * t * t * p3[1]
      ]);
    }
    return pts;
  }

  function lengths(pts) {
    const acc = [0];
    for (let i = 1; i < pts.length; i++) acc.push(acc[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]));
    return acc;
  }

  function pointAt(pts, acc, s) {
    let i = 1;
    while (i < acc.length - 1 && acc[i] < s) i++;
    const seg = acc[i] - acc[i - 1] || 1;
    const t = (s - acc[i - 1]) / seg;
    return [pts[i - 1][0] + (pts[i][0] - pts[i - 1][0]) * t, pts[i - 1][1] + (pts[i][1] - pts[i - 1][1]) * t];
  }

  // cuentas separadas por `spacing` a lo largo de una línea
  function bySpacing(pts, spacing) {
    const acc = lengths(pts), total = acc[acc.length - 1], out = [];
    for (let s = spacing / 2; s < total; s += spacing) out.push(pointAt(pts, acc, s));
    return out;
  }

  // exactamente n cuentas repartidas en la línea (para poder interpolar entre dos formas)
  function byCount(pts, n) {
    const acc = lengths(pts), total = acc[acc.length - 1], out = [];
    for (let i = 0; i < n; i++) out.push(pointAt(pts, acc, ((i + 0.5) / n) * total));
    return out;
  }

  const SHAPES = {
    lanza: (u) => Math.sin(Math.PI * Math.pow(u, 0.62)) * (1 - 0.18 * u),
    redondo: (u) => Math.pow(Math.sin(Math.PI * Math.pow(u, 0.78)), 0.6),
    angosto: (u) => Math.sin(Math.PI * Math.pow(u, 0.7)),
    labio: (u) => Math.pow(Math.sin(Math.PI * Math.pow(u, 0.9)), 0.45)
  };

  function outline(len, width, shape, n = 44) {
    const hw = SHAPES[shape], pts = [];
    for (let i = 0; i <= n; i++) { const u = i / n; pts.push([(width / 2) * hw(u), -len * u]); }
    for (let i = n - 1; i >= 0; i--) { const u = i / n; pts.push([(-width / 2) * hw(u), -len * u]); }
    return pts;
  }

  /*
    Un pétalo tejido: `loops` lazos concéntricos desde la base y una vena central.
    El lazo exterior usa el color de orilla.
  */
  function petal(out, { angle, base = 0.08, len, width, shape, loops, r, inner = "petal", rim = "edge", vein = true }) {
    const spacing = r * 2.06, ca = Math.cos(angle), sa = Math.sin(angle);
    const place = (x, y, role) => {
      const py = y - base;
      out.push({ x: x * ca - py * sa, y: x * sa + py * ca, r, role });
    };
    if (vein) bySpacing([[0, -r], [0, -len * 0.78]], spacing).forEach(([x, y]) => place(x, y, rim));
    for (let k = 1; k <= loops; k++) {
      const f = k / loops;
      const pts = outline(len * (0.38 + 0.62 * f), width * f, shape);
      bySpacing(pts, spacing).forEach(([x, y]) => {
        if (k < loops && Math.hypot(x, y) < r * 2.4) return;
        place(x, y, k === loops ? rim : inner);
      });
    }
  }

  function cluster(out, { cx = 0, cy = 0, count, r, role, spread = 0.92 }) {
    for (let i = 0; i < count; i++) {
      const d = Math.sqrt(i) * r * 2 * spread, a = i * 2.39996;
      out.push({ x: cx + Math.cos(a) * d, y: cy + Math.sin(a) * d, r, role });
    }
  }

  /* ---------- modelos (coordenadas locales, radio de la flor ≈ 1) ---------- */

  const MODELS = {
    lirio() {
      const r = 0.03, b = [];
      petal(b, { angle: (-128 * Math.PI) / 180, base: 0.95, len: 0.62, width: 0.28, shape: "lanza", loops: 3, r, inner: "leaf", rim: "leafEdge" });
      petal(b, { angle: (128 * Math.PI) / 180, base: 0.95, len: 0.62, width: 0.28, shape: "lanza", loops: 3, r, inner: "leaf", rim: "leafEdge" });
      for (let i = 0; i < 6; i++) {
        petal(b, { angle: (i * 60 + 30) * (Math.PI / 180), len: 1, width: 0.5, shape: "lanza", loops: 3, r });
      }
      for (let i = 0; i < 6; i++) {
        const a = (i * 60) * (Math.PI / 180) - Math.PI / 2;
        bySpacing([[0, 0], [Math.cos(a) * 0.48, Math.sin(a) * 0.48]], r * 2.06).forEach(([x, y], j, all) => {
          b.push({ x, y, r: j === all.length - 1 ? r * 1.35 : r * 0.82, role: j === all.length - 1 ? "center" : "stamen" });
        });
      }
      cluster(b, { count: 14, r, role: "center" });
      return { beads: b, top: -1.02, buds: [] };
    },
    orquidea() {
      const r = 0.03, b = [];
      petal(b, { angle: 0, len: 1, width: 0.32, shape: "angosto", loops: 3, r });
      petal(b, { angle: (132 * Math.PI) / 180, len: 0.95, width: 0.3, shape: "angosto", loops: 3, r });
      petal(b, { angle: (-132 * Math.PI) / 180, len: 0.95, width: 0.3, shape: "angosto", loops: 3, r });
      petal(b, { angle: (62 * Math.PI) / 180, len: 0.84, width: 0.64, shape: "redondo", loops: 4, r });
      petal(b, { angle: (-62 * Math.PI) / 180, len: 0.84, width: 0.64, shape: "redondo", loops: 4, r });
      petal(b, { angle: Math.PI, base: 0.02, len: 0.78, width: 0.66, shape: "labio", loops: 4, r, inner: "lip", rim: "lipEdge", vein: false });
      cluster(b, { cy: -0.06, count: 9, r, role: "edge" });
      const bud = [];
      petal(bud, { angle: 0, base: 0, len: 0.42, width: 0.3, shape: "redondo", loops: 2, r });
      petal(bud, { angle: (-150 * Math.PI) / 180, base: 0.02, len: 0.3, width: 0.16, shape: "lanza", loops: 2, r, inner: "leaf", rim: "leafEdge", vein: false });
      petal(bud, { angle: (150 * Math.PI) / 180, base: 0.02, len: 0.3, width: 0.16, shape: "lanza", loops: 2, r, inner: "leaf", rim: "leafEdge", vein: false });
      return { beads: b, top: -1.0, buds: [{ at: 0.37, beads: bud }, { at: 0.63, beads: bud }] };
    }
  };

  /* ---------- escena: collar sobre la mesa ↔ puesto ---------- */

  const W = 1000;

  function neckFigure() {
    const left = [
      ...cubic([414, -10], [420, 110], [404, 220], [408, 300]),
      ...cubic([408, 300], [410, 370], [330, 392], [214, 410]),
      ...cubic([214, 410], [120, 424], [52, 452], [-20, 520])
    ];
    const clav = cubic([452, 438], [412, 418], [352, 412], [296, 424], 24);
    const mirror = (pts) => pts.map(([x, y]) => [W - x, y]);
    const notch = cubic([478, 446], [490, 458], [510, 458], [522, 446], 12);
    return [left, mirror(left), clav, mirror(clav), notch];
  }

  function buildNecklace(modelName) {
    const model = MODELS[modelName]();
    const wornScale = 80, flatScale = 132;
    const chainR = { worn: 2.9, flat: 4.85 };

    const neck = neckFigure();
    const leftNeck = neck[0];
    const y0 = 352;
    const lx = leftNeck.reduce((best, p) => (Math.abs(p[1] - y0) < Math.abs(best[1] - y0) ? p : best))[0] + 3;

    const wornBottom = [W / 2, 600];
    const wornPath = [
      ...cubic([lx, y0], [lx - 6, 470], [452, 600], wornBottom),
      ...cubic(wornBottom, [548, 600], [W - lx + 6, 470], [W - lx, y0]).slice(1)
    ];
    const flatBottom = [W / 2, 592];
    const flatPath = [];
    const cx = W / 2, cy = 360, rx = 182, ry = 232;
    for (let i = 0; i <= 120; i++) {
      const p = (i / 120) * TAU;
      const pinch = 1 - 0.22 * Math.max(0, -Math.cos(p));
      flatPath.push([cx - rx * Math.sin(p) * pinch, cy - ry * Math.cos(p)]);
    }
    // el collar sobre la mesa empieza en el broche (arriba); puesto empieza detrás del cuello
    // ambos pasan por el dije justo a la mitad
    const wornLen = lengths(wornPath).pop();
    const count = Math.round(wornLen / (chainR.worn * 2.08));
    const wornChain = byCount(wornPath, count);
    const flatChain = byCount(flatPath, count);

    const beads = [];
    wornChain.forEach((wp, i) => {
      const t = i / (count - 1);
      beads.push({
        fx: flatChain[i][0], fy: flatChain[i][1], fr: chainR.flat,
        wx: wp[0], wy: wp[1], wr: chainR.worn,
        role: i % 9 === 4 ? "accent" : "chain",
        order: 0.42 + Math.abs(t - 0.5) * 1.1,
        travel: Math.abs(t - 0.5) * 0.5,
        layer: 0
      });
    });

    const place = (list, fCenter, wCenter, fs, ws, layer, orderBase) => {
      list.forEach((b) => {
        const d = Math.hypot(b.x, b.y);
        beads.push({
          fx: fCenter[0] + b.x * fs, fy: fCenter[1] + b.y * fs, fr: b.r * fs,
          wx: wCenter[0] + b.x * ws, wy: wCenter[1] + b.y * ws, wr: b.r * ws,
          role: b.role, order: orderBase + d * 0.32, travel: 0.04 + d * 0.06, layer
        });
      });
    };

    model.buds.forEach((bud) => {
      const idx = Math.round(bud.at * (count - 1));
      const f = flatChain[idx], w = wornChain[idx];
      place(bud.beads, [f[0], f[1] + 4], [w[0], w[1] + 2], flatScale * 0.5, wornScale * 0.5, 1, 0.3);
    });

    const fCenter = [flatBottom[0], flatBottom[1] - model.top * flatScale];
    const wCenter = [wornBottom[0], wornBottom[1] - model.top * wornScale];
    place(model.beads, fCenter, wCenter, flatScale, wornScale, 2, 0);

    return { beads, neck, focus: { flat: fCenter, worn: wCenter } };
  }

  function buildBloom(modelName, { cx = 560, cy = 520, scale = 330, rotate = -0.2 } = {}) {
    const model = MODELS[modelName]();
    const ca = Math.cos(rotate), sa = Math.sin(rotate);
    const beads = model.beads.map((b) => {
      const x = cx + (b.x * ca - b.y * sa) * scale, y = cy + (b.x * sa + b.y * ca) * scale;
      const d = Math.hypot(b.x, b.y);
      return { fx: x, fy: y, fr: b.r * scale, wx: x, wy: y, wr: b.r * scale, role: b.role, order: d * 0.62 + Math.random() * 0.08, travel: 0, layer: 2 };
    });
    return { beads, neck: null, focus: { flat: [cx, cy], worn: [cx, cy] } };
  }

  /* ---------- color ---------- */

  function palette(v) {
    const petal = hexToRgb(v.petal), edge = hexToRgb(v.edge), center = hexToRgb(v.center), leaf = hexToRgb(v.leaf), chain = hexToRgb(v.chain);
    return {
      petal, edge, center, leaf, chain,
      stamen: shade(center, -0.42),
      leafEdge: shade(leaf, -0.28),
      accent: center,
      lip: center,
      lipEdge: shade(center, -0.22)
    };
  }

  /* ---------- render ---------- */

  function create(canvas, opts) {
    const ctx = canvas.getContext("2d");
    const scene = opts.view === "bloom" ? buildBloom(opts.model, opts.bloom) : buildNecklace(opts.model);
    const ink = hexToRgb(opts.ink || "#1c1416");
    let pal = palette(opts.variant);
    const now = () => performance.now();

    scene.beads.forEach((b) => {
      b.from = b.to = pal[b.role];
      b.cStart = 0;
      b.cDelay = 0;
    });

    let mode = 0, modeFrom = 0, modeTo = 0, modeStart = 0;
    // intro: "auto" arranca al crear, "wait" deja las cuentas escondidas hasta play()
    let introStart = reduceMotion.matches || !opts.intro ? -Infinity : opts.intro === "wait" ? Infinity : null;
    let inkColor = ink, inkFrom = ink, inkStart = 0;
    let tilt = [0, 0], tiltTarget = [0, 0];
    let size = { w: 0, h: 0, dpr: 1, k: 1, ox: 0, oy: 0 };
    let raf = 0;

    const COLOR_MS = 900, MODE_MS = 1500, INTRO_MS = opts.view === "bloom" ? 2300 : 1700;

    function resize() {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.max(1, Math.round(rect.width * dpr));
      canvas.height = Math.max(1, Math.round(rect.height * dpr));
      const k = (Math.min(rect.width, rect.height) / W) * dpr * (opts.zoom || 1);
      size = { w: canvas.width, h: canvas.height, dpr, k, ox: (canvas.width - W * k) / 2, oy: (canvas.height - W * k) / 2 };
      draw();
    }

    function colorOf(b, t) {
      const p = clamp01((t - b.cStart - b.cDelay) / COLOR_MS);
      return p >= 1 ? b.to : mix(b.from, b.to, inOut(p));
    }

    function draw() {
      const t = now();
      let busy = false;
      if (introStart === null) introStart = t;
      const intro = introStart === Infinity ? 0 : clamp01((t - introStart) / INTRO_MS);
      if (intro < 1 && introStart !== Infinity) busy = true;

      const mp = clamp01((t - modeStart) / MODE_MS);
      if (mp < 1) busy = true;
      mode = modeFrom + (modeTo - modeFrom) * mp;

      tilt[0] += (tiltTarget[0] - tilt[0]) * 0.08;
      tilt[1] += (tiltTarget[1] - tilt[1]) * 0.08;
      if (Math.abs(tiltTarget[0] - tilt[0]) + Math.abs(tiltTarget[1] - tilt[1]) > 0.001) busy = true;

      const ip = clamp01((t - inkStart) / COLOR_MS);
      if (ip < 1) busy = true;
      const inkNow = mix(inkFrom, inkColor, inOut(ip));

      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, size.w, size.h);
      ctx.setTransform(size.k, 0, 0, size.k, size.ox, size.oy);

      // la silueta se dibuja como una sola línea, igual que el logo
      if (scene.neck && mode > 0.001) {
        const drawn = inOut(clamp01(mode * 1.25));
        ctx.save();
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        ctx.strokeStyle = css(inkNow, 0.85);
        ctx.lineWidth = 2.4;
        scene.neck.forEach((pts) => {
          const acc = lengths(pts), total = acc[acc.length - 1];
          ctx.setLineDash([total * drawn, total]);
          ctx.beginPath();
          pts.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)));
          ctx.stroke();
        });
        ctx.restore();
      }

      const cx = scene.focus.flat[0], cy = scene.focus.flat[1];
      const rot = tilt[0] * 0.05, ca = Math.cos(rot), sa = Math.sin(rot);
      const list = scene.beads;
      const pos = new Float32Array(list.length * 4);

      for (let i = 0; i < list.length; i++) {
        const b = list[i];
        let m = mode;
        if (mp < 1) {
          const d = b.travel;
          const local = clamp01((mp - d) / (1 - 0.5));
          m = modeFrom + (modeTo - modeFrom) * inOut(local);
        }
        let x = b.fx + (b.wx - b.fx) * m;
        let y = b.fy + (b.wy - b.fy) * m;
        let r = b.fr + (b.wr - b.fr) * m;
        if (tilt[0] || tilt[1]) {
          const dx = x - cx, dy = y - cy;
          x = cx + dx * ca - dy * sa + tilt[0] * 10 * (b.layer + 1) * 0.5;
          y = cy + dx * sa + dy * ca + tilt[1] * 8 * (b.layer + 1) * 0.5;
        }
        let s = 1;
        if (intro < 1) {
          const local = clamp01((intro * 1.35 - b.order * 0.95) / 0.22);
          s = local <= 0 ? 0 : expoOut(local) * (1 + 0.25 * Math.sin(local * Math.PI));
        }
        pos[i * 4] = x; pos[i * 4 + 1] = y; pos[i * 4 + 2] = r * s; pos[i * 4 + 3] = s;
      }

      // sombra suave sobre la mesa
      const shadowA = 0.15 * (1 - mode);
      if (shadowA > 0.01) {
        ctx.fillStyle = css(inkNow, shadowA);
        for (let i = 0; i < list.length; i++) {
          const r = pos[i * 4 + 2];
          if (r <= 0) continue;
          ctx.beginPath();
          ctx.arc(pos[i * 4] + r * 0.32, pos[i * 4 + 1] + r * 0.55, r * 1.02, 0, TAU);
          ctx.fill();
        }
      }

      for (let i = 0; i < list.length; i++) {
        const r = pos[i * 4 + 2];
        if (r <= 0) continue;
        const x = pos[i * 4], y = pos[i * 4 + 1], b = list[i];
        const c = colorOf(b, t);
        if (t - b.cStart - b.cDelay < COLOR_MS) busy = true;
        ctx.fillStyle = css(shade(c, -0.3));
        ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.fill();
        ctx.fillStyle = css(c);
        ctx.beginPath(); ctx.arc(x - r * 0.07, y - r * 0.09, r * 0.8, 0, TAU); ctx.fill();
        ctx.fillStyle = "rgba(255,255,255,0.62)";
        ctx.beginPath(); ctx.arc(x - r * 0.34, y - r * 0.36, r * 0.24, 0, TAU); ctx.fill();
        if (r > 3.2) {
          ctx.fillStyle = css(shade(c, -0.45), 0.55);
          ctx.beginPath(); ctx.arc(x + r * 0.08, y + r * 0.06, r * 0.16, 0, TAU); ctx.fill();
        }
      }

      raf = busy ? requestAnimationFrame(draw) : 0;
    }

    const kick = () => { if (!raf) raf = requestAnimationFrame(draw); };

    function setVariant(v, { origin } = {}) {
      pal = palette(v);
      const t = now(), instant = reduceMotion.matches;
      const o = origin || (mode > 0.5 ? scene.focus.worn : scene.focus.flat);
      scene.beads.forEach((b) => {
        b.from = colorOf(b, t);
        b.to = pal[b.role];
        b.cStart = instant ? -Infinity : t;
        const x = b.fx + (b.wx - b.fx) * mode, y = b.fy + (b.wy - b.fy) * mode;
        b.cDelay = instant ? 0 : Math.hypot(x - o[0], y - o[1]) * 1.15;
      });
      if (v.ink) { inkFrom = mix(inkFrom, inkColor, 1); inkColor = hexToRgb(v.ink); inkStart = instant ? -Infinity : t; }
      kick();
    }

    function setMode(next) {
      const target = next === "worn" ? 1 : 0;
      if (target === modeTo) return;
      modeFrom = mode;
      modeTo = target;
      modeStart = reduceMotion.matches ? -Infinity : now();
      kick();
    }

    function play() {
      if (reduceMotion.matches) return;
      introStart = null;
      kick();
    }

    function pointer(x, y) {
      if (reduceMotion.matches) return;
      tiltTarget = [x, y];
      kick();
    }

    new ResizeObserver(resize).observe(canvas);
    resize();
    return { setVariant, setMode, play, pointer, redraw: kick };
  }

  window.JendalBeads = { create };
})();
