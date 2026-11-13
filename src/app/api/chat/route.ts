import Anthropic from "@anthropic-ai/sdk";
import { betaZodTool } from "@anthropic-ai/sdk/helpers/beta/zod";
import { z } from "zod";
import { SYSTEM_PROMPT } from "@/lib/assistant";
import { lite, products, search } from "@/lib/catalog";
import { formatBs } from "@/lib/product";
import { site } from "@/lib/site";

export const maxDuration = 60;

const MODEL = process.env.ANTHROPIC_MODEL ?? "claude-opus-5-5";

const Body = z.object({
  messages: z
    .array(z.object({ role: z.enum(["user", "assistant"]), content: z.string().min(1).max(2000) }))
    .min(1)
    .max(30),
});

type Event = { t: "text"; v: string } | { t: "products"; v: ReturnType<typeof lite>[] } | { t: "error"; v: string };

// Abuse protection, in layers:
// 1. A Vercel Firewall rate-limit rule on /api/chat (configured in the project, see README) stops floods
//    before this function runs.
// 2. Per-IP throttle below: best effort, since each serverless instance keeps its own counts.
// 3. Hourly cap on Claude calls per instance: past it, the chat answers with the free catalog search
//    instead of the model, so a burst of traffic can't run up the API bill.
const hits = new Map<string, number[]>();
function throttled(ip: string) {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < 60_000);
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 5000) hits.clear();
  return recent.length > 12;
}

const HOURLY_AI_LIMIT = Number(process.env.CHAT_HOURLY_LIMIT) || 300;
let aiWindow = { start: 0, count: 0 };
function aiBudgetLeft() {
  const now = Date.now();
  if (now - aiWindow.start > 3_600_000) aiWindow = { start: now, count: 0 };
  return ++aiWindow.count <= HOURLY_AI_LIMIT;
}

/** Browsers send Origin on POST: refuse calls made from other websites. */
function foreignOrigin(req: Request) {
  const origin = req.headers.get("origin");
  if (!origin) return false;
  try {
    return new URL(origin).host !== (req.headers.get("x-forwarded-host") ?? req.headers.get("host"));
  } catch {
    return true;
  }
}

export async function POST(req: Request) {
  if (foreignOrigin(req)) return Response.json({ error: "Origen no permitido." }, { status: 403 });
  const parsed = Body.safeParse(await req.json().catch(() => null));
  if (!parsed.success || parsed.data.messages.at(-1)?.role !== "user") {
    return Response.json({ error: "Solicitud inválida." }, { status: 400 });
  }
  if (throttled(req.headers.get("x-forwarded-for")?.split(",")[0] ?? "local")) {
    return Response.json({ error: "Demasiados mensajes. Espera un momento." }, { status: 429 });
  }
  const { messages } = parsed.data;

  const encoder = new TextEncoder();
  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      const send = (e: Event) => controller.enqueue(encoder.encode(JSON.stringify(e) + "\n"));
      try {
        if ((process.env.ANTHROPIC_API_KEY || process.env.ANTHROPIC_AUTH_TOKEN) && aiBudgetLeft()) await runClaude(messages, send);
        else runOffline(messages.at(-1)!.content, send);
      } catch (err) {
        console.error("chat error", err);
        const busy = err instanceof Anthropic.RateLimitError || (err instanceof Anthropic.APIError && (err.status ?? 0) >= 500);
        send({
          t: "error",
          v: busy
            ? "Estoy con mucha demanda en este momento. Intenta de nuevo en unos segundos o escríbenos por WhatsApp."
            : `No pude responder ahora. Escríbenos por WhatsApp al ${site.whatsappDisplay} y te atendemos.`,
        });
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: { "Content-Type": "application/x-ndjson; charset=utf-8", "Cache-Control": "no-store" },
  });
}

async function runClaude(messages: z.infer<typeof Body>["messages"], send: (e: Event) => void) {
  const client = new Anthropic();

  const buscar = betaZodTool({
    name: "buscar_productos",
    description:
      "Busca en el catálogo vigente de Sarumadi por palabras clave. Devuelve hasta 8 productos con SKU, nombre, marca, categoría y precio en Bs. Úsala antes de mencionar cualquier producto o precio. Usa pocas palabras clave en singular (por ejemplo: 'candado hierro 50', 'lentes seguridad', 'manguera 15 m').",
    inputSchema: z.object({
      consulta: z.string().describe("Palabras clave del producto, sin frases completas."),
      marca: z.enum(["Truper", "Pretul", "Foset", "Volteck", "Hermex", "Fiero", "Klintek"]).optional().describe("Filtrar por marca, solo si el cliente la pidió."),
      precio_maximo: z.number().positive().optional().describe("Precio máximo en Bs, solo si el cliente dio un presupuesto."),
    }),
    eager_input_streaming: true,
    run: async ({ consulta, marca, precio_maximo }) => {
      const found = search(consulta, { brand: marca, maxPrice: precio_maximo, limit: 8 });
      if (found.length === 0) return "Sin resultados para esa búsqueda. Prueba con un sinónimo o menos palabras.";
      return found.map((p) => `${p.sku} | ${p.name} | ${p.brand ?? "sin marca"} | ${p.sub ?? p.deptName} | ${formatBs(p.price)}`).join("\n");
    },
  });

  const mostrar = betaZodTool({
    name: "mostrar_productos",
    description:
      "Muestra al cliente tarjetas de producto (foto, precio, botón de añadir al carrito) debajo de tu respuesta. Llámala con los SKU exactos devueltos por buscar_productos que quieras recomendar, de 1 a 4, ordenados del más al menos adecuado.",
    inputSchema: z.object({ skus: z.array(z.string()).min(1).max(4) }),
    eager_input_streaming: true,
    run: async ({ skus }) => {
      const shown = skus.map((s) => products.find((p) => p.sku.toLowerCase() === s.trim().toLowerCase())).filter((p) => p !== undefined);
      if (shown.length === 0) return "Ninguno de esos SKU existe en el catálogo. Usa los SKU tal como los devuelve buscar_productos.";
      send({ t: "products", v: shown.map(lite) });
      return `Tarjetas mostradas al cliente: ${shown.map((p) => p.sku).join(", ")}.`;
    },
  });

  const runner = client.beta.messages.toolRunner({
    model: MODEL,
    // Chat replies are short by design; this caps spend per turn on a public endpoint.
    max_tokens: 4096,
    system: SYSTEM_PROMPT,
    output_config: { effort: "low" },
    // If a safety classifier declines, the API re-runs the turn on a fallback model in the same call.
    betas: ["server-side-fallback-2026-07-01"],
    fallbacks: "default",
    tools: [buscar, mostrar],
    messages,
    stream: true,
    max_iterations: 6,
  });

  for await (const messageStream of runner) {
    for await (const event of messageStream) {
      if (event.type === "content_block_delta" && event.delta.type === "text_delta") send({ t: "text", v: event.delta.text });
    }
    const message = await messageStream.finalMessage();
    if (message.stop_reason === "refusal") {
      send({ t: "text", v: `No puedo ayudarte con eso por aquí. Para cualquier consulta de productos, escríbenos por WhatsApp al ${site.whatsappDisplay}.` });
      break;
    }
    // A tool call cut off by the token cap may carry truncated input: don't let it run.
    if (message.stop_reason === "max_tokens" && message.content.some((b) => b.type === "tool_use")) break;
    if (message.stop_reason === "tool_use") send({ t: "text", v: "\n\n" });
  }
}

/** No API key configured: answer with a plain catalog search so the widget still works. */
function runOffline(question: string, send: (e: Event) => void) {
  const found = search(question, { limit: 4 }).filter(() => question.trim().length > 2);
  if (found.length) {
    send({ t: "text", v: "Esto es lo más parecido que encontré en el catálogo. Si no es lo que buscas, cuéntame para qué lo necesitas o consúltanos por WhatsApp." });
    send({ t: "products", v: found.map(lite) });
  } else {
    send({
      t: "text",
      v: `No encontré eso en el catálogo en línea, pero el showroom tiene más surtido. Escríbenos por WhatsApp al ${site.whatsappDisplay} o reserva una visita en /reservar.`,
    });
  }
}
