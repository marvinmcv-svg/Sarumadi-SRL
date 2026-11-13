// Drafts short product descriptions with Claude for products that have none,
// and saves them to src/data/descriptions.json (slug -> text), which the site
// merges into the catalog. The store's WooCommerce data has no descriptions,
// so this is the only source; review the drafts before publishing.
//
// Usage (needs ANTHROPIC_API_KEY in your environment):
//   npm run describe                  only products without a description yet
//   npm run describe -- --all         redo every product
//   npm run describe -- --resume ID   collect the results of an earlier batch
//
// Runs as a Message Batch (half price, usually done within an hour).
import fs from "node:fs/promises";
import Anthropic from "@anthropic-ai/sdk";

const PRODUCTS = "src/data/products.json";
const OUT = "src/data/descriptions.json";
const MODEL = process.env.ANTHROPIC_MODEL ?? "claude-opus-5-5";

const args = process.argv.slice(2);
const resumeId = args.includes("--resume") ? args[args.indexOf("--resume") + 1] : null;

const SYSTEM = `Escribes descripciones cortas para las fichas de producto de Sarumadi SRL, una ferretería importadora de Santa Cruz, Bolivia.

Recibes el nombre, el código, la marca y la categoría de un producto. Escribe una descripción en español de Bolivia, de 1 a 2 oraciones y entre 20 y 45 palabras, que diga qué es el producto y para qué trabajos sirve.

Reglas:
- Usa solo los datos que aparecen en el nombre (medidas, potencia, material, cantidad de piezas). No inventes especificaciones, materiales, accesorios incluidos, certificaciones ni garantías que no estén en el nombre.
- Explica el uso típico de ese tipo de producto, que sí puedes conocer de forma general.
- Tono claro y práctico, sin superlativos ni frases publicitarias ("el mejor", "increíble", "de alta calidad"), sin precios y sin mencionar la tienda.
- No repitas el nombre del producto palabra por palabra al inicio.
- Si el nombre está en mayúsculas o abreviado, escribe con mayúsculas normales.`;

const schema = {
  type: "object",
  properties: { descripcion: { type: "string" } },
  required: ["descripcion"],
  additionalProperties: false,
};

const client = new Anthropic();
const products = JSON.parse(await fs.readFile(PRODUCTS, "utf8"));
const saved = JSON.parse(await fs.readFile(OUT, "utf8").catch(() => "{}"));
const byId = new Map(products.map((p) => [`p-${p.id}`, p]));

let batchId = resumeId;
if (!batchId) {
  const todo = products.filter((p) => !p.description && (args.includes("--all") || !saved[p.slug]));
  if (todo.length === 0) {
    console.log("Every product already has a description. Use --all to redo them.");
    process.exit(0);
  }
  const batch = await client.messages.batches.create({
    requests: todo.map((p) => ({
      custom_id: `p-${p.id}`,
      params: {
        model: MODEL,
        max_tokens: 2000,
        // Same system prompt on every request, so it can be served from cache.
        system: [{ type: "text", text: SYSTEM, cache_control: { type: "ephemeral" } }],
        output_config: { effort: "low", format: { type: "json_schema", schema } },
        messages: [
          {
            role: "user",
            content: `Nombre: ${p.name}\nCódigo: ${p.sku}\nMarca: ${p.brand ?? "sin marca"}\nCategoría: ${p.deptName}${p.sub ? ` > ${p.sub}` : ""}`,
          },
        ],
      },
    })),
  });
  batchId = batch.id;
  console.log(`Batch ${batchId} created with ${todo.length} products.`);
  console.log(`If this script stops, collect the results later with: npm run describe -- --resume ${batchId}`);
}

for (;;) {
  const b = await client.messages.batches.retrieve(batchId);
  if (b.processing_status === "ended") break;
  console.log(`${b.request_counts.processing} still processing…`);
  await new Promise((r) => setTimeout(r, 30_000));
}

let ok = 0;
const failed = [];
for await (const r of await client.messages.batches.results(batchId)) {
  const p = byId.get(r.custom_id);
  if (!p) continue;
  if (r.result.type !== "succeeded" || r.result.message.stop_reason !== "end_turn") {
    failed.push(p.sku);
    continue;
  }
  const text = r.result.message.content.find((c) => c.type === "text")?.text;
  try {
    const d = JSON.parse(text ?? "").descripcion.trim();
    if (d.length < 20 || d.length > 400) throw new Error("length");
    saved[p.slug] = d;
    ok++;
  } catch {
    failed.push(p.sku);
  }
}

const sorted = Object.fromEntries(Object.entries(saved).sort(([a], [b]) => a.localeCompare(b)));
await fs.writeFile(OUT, JSON.stringify(sorted, null, 2) + "\n");
console.log(`${ok} descriptions saved to ${OUT}.`);
if (failed.length) console.log(`${failed.length} failed (run again to retry): ${failed.join(", ")}`);
console.log("Review the drafts before deploying: they are written from the product name only.");
