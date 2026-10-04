/*
  Catálogo de Jendal — el único archivo que hay que editar para agregar piezas,
  colores, precios o fotos.

  · whatsapp: número con lada de país y sin espacios, p. ej. "5218112345678".
    Mientras esté vacío, los botones de pedido llevan a Instagram.
  · price: número en pesos (p. ej. 450). Con null se muestra "Pregunta el precio".
  · images: rutas a fotos reales o generadas por variante, p. ej.
      images: { flat: "assets/piezas/lirio-rosa.jpg", worn: "assets/piezas/lirio-rosa-puesto.jpg" }
    Si una variante no tiene imágenes, la pieza se dibuja chaquira por chaquira.
  · model: forma que se dibuja mientras no hay fotos ("lirio" u "orquidea").
*/
window.JENDAL = {
  whatsapp: "",
  instagram: "jendal_accesorios",

  // Foto para la vista "Puesta" mientras no haya fotos propias de cada pieza.
  // path: caída del collar en coordenadas de 0 a 1000 sobre el recorte cuadrado de la foto.
  modelo: {
    src: "assets/modelo/cuello.jpg",
    crop: { x: 300, y: 0, size: 1200 },
    path: [
      [[382, 352], [366, 560], [462, 742], [540, 756]],
      [[540, 756], [622, 768], [872, 640], [898, 412]]
    ],
    chainR: 4.2,
    scale: 100,
    credit: { name: "El S", url: "https://unsplash.com/es/fotos/mujer-con-camiseta-blanca-sin-mangas-gUPznplBsLI" }
  },

  upcoming: ["Pulseras", "Anillos", "Aretes"],

  collections: [
    { id: "semilla-botanica", name: "Semilla botánica", status: "active" },
    { id: "flores-temporada", name: "Flores de temporada", status: "upcoming" },
    { id: "mundos-favoritos", name: "Mundos favoritos", status: "upcoming" },
    { id: "a-tu-manera", name: "A tu manera", status: "upcoming" }
  ],

  pieces: [
    {
      id: "lirio",
      category: "Collar",
      collection: "semilla-botanica",
      name: "Lirio",
      model: "lirio",
      price: null,
      description:
        "Un lirio de seis pétalos tejido a mano, chaquira por chaquira, que cuelga de una cadena de cuentas verdes como si acabara de brotar.",
      variants: [
        { id: "dorado", name: "Dorado", field: "#fbf4e7", ink: "#5b4937", petal: "#d7b86e", edge: "#af9251", center: "#fff8f1", leaf: "#a8ae68", chain: "#b79a53", images: null },
        { id: "blanco", name: "Blanco", field: "#fffdf8", ink: "#625d56", petal: "#faf8f3", edge: "#d8d2c8", center: "#dfc783", leaf: "#a8ae68", chain: "#d8d2c8", images: null },
        { id: "cafe", name: "Café", field: "#f2e8e0", ink: "#654d42", petal: "#b49a88", edge: "#8b715f", center: "#d9ba83", leaf: "#a8ae68", chain: "#9a806b", images: null },
        { id: "rosa", name: "Rosa", field: "#fff1ef", ink: "#79535b", petal: "#f2c6cb", edge: "#bd8490", center: "#d7b86e", leaf: "#a8ae68", chain: "#bd8490", images: null },
        { id: "plateado", name: "Plateado", field: "#f0f1f0", ink: "#505056", petal: "#cbd0d3", edge: "#9ca5aa", center: "#d8c690", leaf: "#a8ae68", chain: "#a7afb3", images: null },
        { id: "negro", name: "Negro", field: "#ece7e6", ink: "#41383a", petal: "#554d50", edge: "#302a2d", center: "#d7b86e", leaf: "#a8ae68", chain: "#544c4e", images: null },
        { id: "verde", name: "Verde", field: "#eff1df", ink: "#515745", petal: "#b7bf8d", edge: "#859060", center: "#d7b86e", leaf: "#909a60", chain: "#8e9a5d", images: null }
      ]
    },
    {
      id: "orquidea",
      category: "Collar",
      collection: "semilla-botanica",
      name: "Orquídea",
      model: "orquidea",
      price: null,
      description:
        "Una orquídea con su labio en contraste y dos botones a los lados. Delicada de lejos, llena de detalle cuando te acercas.",
      variants: [
        { id: "dorado", name: "Dorado", field: "#fbf4e7", ink: "#5b4937", petal: "#d7b86e", edge: "#af9251", center: "#fff8f1", leaf: "#a8ae68", chain: "#b79a53", images: null },
        { id: "blanco", name: "Blanco", field: "#fffdf8", ink: "#625d56", petal: "#faf8f3", edge: "#d8d2c8", center: "#dfc783", leaf: "#a8ae68", chain: "#d8d2c8", images: null },
        { id: "cafe", name: "Café", field: "#f2e8e0", ink: "#654d42", petal: "#b49a88", edge: "#8b715f", center: "#d9ba83", leaf: "#a8ae68", chain: "#9a806b", images: null },
        { id: "rosa", name: "Rosa", field: "#fff1ef", ink: "#79535b", petal: "#f2c6cb", edge: "#bd8490", center: "#d7b86e", leaf: "#a8ae68", chain: "#bd8490", images: null },
        { id: "plateado", name: "Plateado", field: "#f0f1f0", ink: "#505056", petal: "#cbd0d3", edge: "#9ca5aa", center: "#d8c690", leaf: "#a8ae68", chain: "#a7afb3", images: null },
        { id: "negro", name: "Negro", field: "#ece7e6", ink: "#41383a", petal: "#554d50", edge: "#302a2d", center: "#d7b86e", leaf: "#a8ae68", chain: "#544c4e", images: null },
        { id: "verde", name: "Verde", field: "#eff1df", ink: "#515745", petal: "#b7bf8d", edge: "#859060", center: "#d7b86e", leaf: "#909a60", chain: "#8e9a5d", images: null }
      ]
    }
  ],

};
