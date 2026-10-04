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
        { id: "rosa", name: "Rosa", field: "#ffeeee", ink: "#752640", petal: "#ffb5bd", edge: "#b32f4e", center: "#f4f7cd", leaf: "#8d9a2e", chain: "#8d9a2e", images: null },
        { id: "mantequilla", name: "Mantequilla", field: "#f4f7cd", ink: "#752640", petal: "#f4f7cd", edge: "#8d9a2e", center: "#b32f4e", leaf: "#8d9a2e", chain: "#8d9a2e", images: null },
        { id: "frambuesa", name: "Frambuesa", field: "#f8e4e8", ink: "#752640", petal: "#b32f4e", edge: "#752640", center: "#f4f7cd", leaf: "#8d9a2e", chain: "#8d9a2e", images: null },
        { id: "olivo", name: "Olivo", field: "#8d9a2e", ink: "#fff8f1", petal: "#ffeeee", edge: "#b32f4e", center: "#f4f7cd", leaf: "#752640", chain: "#f4f7cd", images: null }
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
        { id: "rosa", name: "Rosa", field: "#fff8f1", ink: "#752640", petal: "#ffb5bd", edge: "#b32f4e", center: "#f4f7cd", leaf: "#8d9a2e", chain: "#8d9a2e", images: null },
        { id: "frambuesa", name: "Frambuesa", field: "#f8e4e8", ink: "#752640", petal: "#b32f4e", edge: "#752640", center: "#f4f7cd", leaf: "#8d9a2e", chain: "#8d9a2e", images: null },
        { id: "primavera", name: "Primavera", field: "#f4f7cd", ink: "#752640", petal: "#ffeeee", edge: "#b32f4e", center: "#ffb5bd", leaf: "#8d9a2e", chain: "#8d9a2e", images: null },
        { id: "olivo", name: "Olivo", field: "#8d9a2e", ink: "#fff8f1", petal: "#ffeeee", edge: "#b32f4e", center: "#f4f7cd", leaf: "#752640", chain: "#f4f7cd", images: null }
      ]
    }
  ],

  upcoming: ["Pulseras", "Anillos", "Aretes"]
};
