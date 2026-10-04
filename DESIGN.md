# Design — Jendal

## World
El color de la chaquira es el sitio: cada collar ocupa un campo de color a página completa que cambia cuando eliges otro color. Minimalista, premium, con color plano en grandes áreas y un ancla vino.

## Tokens
- Vino `#5a1622` · vino profundo `#430f19` (hero, "Lo que viene", pie)
- Papel `#fbf8f5` · crema `#f6efe6` · tinta `#1c1416` · tinta suave `#5b4a4e`
- Chaquiras: rosa `#f59ab0`, mantequilla `#f7e08a`, mandarina `#f6a15a`, lila `#c9a8e8`, hoja `#7fa048`
- Campos por pieza: `field` / `ink` por variante en `data.js` (transición vía `@property --field`)

## Type
- Display: Italiana (titulares, nombres de pieza, precio), máx. 6rem
- Texto: Hanken Grotesk 400/500/600
- Logo: máscara PNG monolínea (`assets/jendal-logo.png`) que toma `currentColor`

## Components
- Pieza: escenario (canvas de chaquiras o foto) + selector Pieza/Puesta (pastilla con indicador deslizante) + info (nombre, descripción, cuentas de color como radios, precio, botón WhatsApp)
- Botones: pastillas de 52px; `btn-light` en vino, `btn-wine` en papel, `btn-ink` sobre campos de color
- Listas con filetes de 1px; sin tarjetas

## Motion
- Una firma: cuentas que aparecen desde el centro, ola de color cuenta por cuenta al cambiar de variante, cuentas que viajan de la mesa al cuello y cuello dibujado como una sola línea
- Ease-out exponencial; `prefers-reduced-motion` desactiva todo
