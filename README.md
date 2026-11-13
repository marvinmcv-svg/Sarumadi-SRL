# Sarumadi SRL — tienda en línea

Sitio y tienda de Sarumadi SRL (Santa Cruz, Bolivia): catálogo con carrito, pedidos y reservas por WhatsApp, y un asistente de compras con IA.

Next.js 16 (App Router) · React 19 · Tailwind CSS 4 · TypeScript.

## Puesta en marcha

```bash
npm install
```

```bash
cp .env.example .env.local
```

```bash
npm run dev
```

## Cómo funciona

| Parte | Dónde | Notas |
|---|---|---|
| Datos del negocio | `src/lib/site.ts` | WhatsApp, dirección, redes y **horario de atención** (del que sale el calendario de reservas). |
| Catálogo | `src/data/products.json`, `public/products/` | Generado por `npm run catalog` desde la API pública de WooCommerce del sitio actual. |
| Tienda | `/tienda`, `/producto/[slug]` | Búsqueda, filtros por departamento, subcategoría y marca; 500 fichas estáticas. |
| Pedido | `/checkout` | No cobra en línea: arma el pedido y lo envía al WhatsApp de ventas. |
| Reservas | `/reservar` | Motivo, día y hora; envía la solicitud por WhatsApp para que un asesor confirme. |
| Asistente IA | `src/app/api/chat/route.ts`, `src/lib/assistant.ts` | Claude con dos herramientas: buscar en el catálogo y mostrar tarjetas de producto. |

### Actualizar el catálogo

```bash
npm run catalog
```

Descarga productos, categorías e imágenes de `tienda.sarumadi.com` y regenera el JSON y las imágenes WebP. La marca se deduce del prefijo del SKU (`TR` Truper, `PR` Pretul, `HR` Hermex, `FI` Fiero, `VO` Volteck, `FO` Foset, `KL` Klintek).

### Asistente con IA

Define `ANTHROPIC_API_KEY` en el entorno (en Vercel: Project → Settings → Environment Variables). Sin clave, el chat responde con una búsqueda simple del catálogo. El endpoint tiene un límite básico por IP; para producción conviene añadir un limitador real delante.

## Pendiente de confirmar con el negocio

- **Horario de atención** en `src/lib/site.ts`: no figura en el sitio actual; se usó Lun–Vie 8:30–18:30 y Sáb 8:30–12:30.
- **Preguntas frecuentes** en `src/app/page.tsx`: el sitio actual tiene texto de relleno; se redactaron respuestas generales.
- **Fotos de Instagram**: Instagram no permite descargarlas de forma automática; la sección de comunidad enlaza a las publicaciones.
