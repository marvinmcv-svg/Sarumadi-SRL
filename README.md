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
| Tienda | `/tienda`, `/producto/[slug]` | Búsqueda, filtros por departamento, subcategoría, marca y precio; 500 fichas estáticas. |
| Guías de compra | `src/data/guides.ts` | "Para qué sirve" y consejos por subcategoría o departamento, en cada ficha. |
| Descripciones | `src/data/descriptions.json` | Borradores de `npm run describe` para las fichas sin descripción. |
| Políticas | `/politicas`, `site.returnDays` | Envíos, cambios y devoluciones (7 días), garantía de fábrica y privacidad. |
| Estadísticas | `@vercel/analytics` | Visitas anónimas sin cookies y eventos: añadir al carrito, pedido, reserva, consulta y preguntas al asistente (sin datos personales). Actívalas en Vercel → Analytics. |
| Pedido | `/checkout` | No cobra en línea: arma el pedido y lo envía al WhatsApp de ventas. |
| Reservas | `/reservar` | Motivo, día y hora; envía la solicitud por WhatsApp para que un asesor confirme. |
| SEO | `src/app/sitemap.ts`, `robots.ts`, `manifest.ts` | Sitemap con las 500 fichas, URL canónicas y datos estructurados (tienda local, producto, migas de pan). |
| Asistente IA | `src/app/api/chat/route.ts`, `src/lib/assistant.ts` | Claude con dos herramientas: buscar en el catálogo y mostrar tarjetas de producto. |

### Actualizar el catálogo

```bash
npm run catalog
```

Descarga productos, categorías e imágenes de `tienda.sarumadi.com` y regenera el JSON y las imágenes WebP. La marca se deduce del prefijo del SKU (`TR` Truper, `PR` Pretul, `HR` Hermex, `FI` Fiero, `VO` Volteck, `FO` Foset, `KL` Klintek).

### Asistente con IA

Define `ANTHROPIC_API_KEY` en el entorno (en Vercel: Project → Settings → Environment Variables). Sin clave, el chat responde con una búsqueda simple del catálogo.

Protección del endpoint `/api/chat`:

1. **Regla de Vercel Firewall** (recomendada): límite de solicitudes por IP en `/api/chat`, antes de que corra la función.
2. Rechaza llamadas desde otros sitios web (cabecera `Origin`).
3. Límite por IP dentro de cada instancia.
4. Tope de llamadas a Claude por hora y por instancia (`CHAT_HOURLY_LIMIT`, 300 por defecto): al superarlo, el chat responde con la búsqueda simple en lugar del modelo.

### Descripciones de producto

La tienda WooCommerce no tiene descripciones (el campo viene vacío), así que se redactan con Claude a partir del nombre de cada producto:

```bash
npm run describe
```

Usa la API de lotes (mitad de precio, suele terminar en menos de una hora) y guarda los textos en `src/data/descriptions.json`. Solo procesa las fichas que aún no tienen descripción; `-- --all` las rehace todas. **Revisa los borradores antes de publicar**: el modelo solo conoce el nombre del producto y tiene instrucciones de no inventar especificaciones, pero conviene leerlos.

## Pendiente

- **Descripciones de producto**: ejecutar `npm run describe` con una clave de la API y revisar los borradores.
- **Stock**: WooCommerce no lleva control de stock (todo figura disponible), así que la web no muestra existencias; se confirman por WhatsApp.
- **Preguntas frecuentes** en `src/app/page.tsx`: el sitio actual tiene texto de relleno; se redactaron respuestas generales.
- **Fotos de Instagram**: Instagram no permite descargarlas de forma automática; la sección de comunidad enlaza a las publicaciones.
