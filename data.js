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
      [[402, 372], [384, 560], [466, 742], [540, 756]],
      [[540, 756], [614, 766], [828, 610], [884, 418]]
    ],
    chainR: 4.2,
    scale: 100,
    credit: { name: "El S", url: "https://unsplash.com/es/fotos/mujer-con-camiseta-blanca-sin-mangas-gUPznplBsLI" }
  },

  pieces: [
    {
      id: "lirio",
      category: "Collar",
      name: "Lirio",
      model: "lirio",
      price: null,
      description:
        "Un lirio de seis pétalos tejido a mano, chaquira por chaquira, que cuelga de una cadena de cuentas verdes como si acabara de brotar.",
      variants: [
        { id: "rosa", name: "Rosa", field: "#F4C9D2", ink: "#3B1220", petal: "#F59AB0", edge: "#D9607F", center: "#F3D36A", leaf: "#5E8137", chain: "#7FA048", images: null },
        { id: "mantequilla", name: "Mantequilla", field: "#F6E7A6", ink: "#3A2A0C", petal: "#F7E08A", edge: "#E2B63E", center: "#E07A9A", leaf: "#5E8137", chain: "#7FA048", images: null },
        { id: "mandarina", name: "Mandarina", field: "#F7C59B", ink: "#3D1A08", petal: "#F6A15A", edge: "#DD6C2C", center: "#FBE7B5", leaf: "#4F7330", chain: "#6F9440", images: null },
        { id: "lila", name: "Lila", field: "#DCCDEB", ink: "#24163A", petal: "#C9A8E8", edge: "#8E63BE", center: "#F3D36A", leaf: "#5E8137", chain: "#7FA048", images: null }
      ]
    },
    {
      id: "orquidea",
      category: "Collar",
      name: "Orquídea",
      model: "orquidea",
      price: null,
      description:
        "Una orquídea con su labio en contraste y dos botones a los lados. Delicada de lejos, llena de detalle cuando te acercas.",
      variants: [
        { id: "vainilla", name: "Vainilla", field: "#F3EBCF", ink: "#2F2610", petal: "#FBF1C9", edge: "#E9CF79", center: "#D9718E", leaf: "#5E8137", chain: "#7FA048", images: null },
        { id: "frambuesa", name: "Frambuesa", field: "#EFB7C3", ink: "#3A0D1B", petal: "#E8738F", edge: "#B83A5C", center: "#FBE3A0", leaf: "#4F7330", chain: "#6F9440", images: null },
        { id: "cielo", name: "Cielo", field: "#C9DDEB", ink: "#10263A", petal: "#A9CDEB", edge: "#5B8DBE", center: "#F3D36A", leaf: "#5E8137", chain: "#7FA048", images: null },
        { id: "vino", name: "Vino", field: "#E2BCC0", ink: "#2E0A12", petal: "#9E2F48", edge: "#6B1A2B", center: "#F3D36A", leaf: "#4F7330", chain: "#6F9440", images: null }
      ]
    }
  ],

  upcoming: ["Pulseras", "Anillos", "Aretes"]
};
