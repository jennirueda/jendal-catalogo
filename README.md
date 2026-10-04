# Jendal · catálogo

Sitio estático (HTML/CSS/JS sin build) desplegado en Vercel: https://jendal-catalogo.vercel.app

## Editar el catálogo
Todo está en `data.js`:
- `whatsapp`: número con lada de país (p. ej. `5218112345678`). Vacío = los botones llevan a Instagram.
- `pieces[].price`: precio en pesos; `null` muestra "Pregunta el precio".
- `pieces[].variants[]`: colores de cada pieza (campo de fondo, tinta, pétalo, orilla, centro, hoja, cadena).
- `variants[].images`: `{ flat: "ruta", worn: "ruta" }` para usar fotos reales o generadas en lugar de la ilustración.

Al cambiar CSS/JS sube el `?v=` en `index.html` para que los navegadores tomen la versión nueva.

## Local
```
python3 -m http.server 4321
```
