"use client";

import Image from "next/image";
import { track } from "@vercel/analytics";
import Link from "next/link";
import { Fragment, useEffect, useRef, useState } from "react";
import { ArrowUp, Plus, Sparkles, X } from "lucide-react";
import { formatBs, img, type ProductLite } from "@/lib/product";
import { waLink } from "@/lib/site";
import { useCart } from "./cart";
import { WhatsAppIcon } from "./icons";

type Msg = { role: "user" | "assistant"; content: string; products?: ProductLite[]; error?: boolean };

const starters = [
  "Necesito un candado resistente para un portón",
  "¿Qué lentes de seguridad tienen?",
  "Busco una manguera para jardín",
  "¿Cómo hago un pedido?",
];

/** Turns site paths the assistant writes (/reservar, /checkout…) into links. */
function RichText({ text }: { text: string }) {
  const parts = text.split(/(\/(?:reservar|checkout|tienda|contacto|nosotros|politicas)\b)/g);
  return (
    <>
      {parts.map((part, i) =>
        i % 2 ? (
          <Link key={i} href={part} className="font-medium text-orange-deep underline underline-offset-2">
            {part}
          </Link>
        ) : (
          <Fragment key={i}>{part}</Fragment>
        ),
      )}
    </>
  );
}

export function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const scroller = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const { add } = useCart();

  useEffect(() => {
    scroller.current?.scrollTo({ top: scroller.current.scrollHeight });
  }, [msgs, open]);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  // Lets any page open the assistant: window.dispatchEvent(new CustomEvent("sarumadi:chat", { detail: "pregunta" }))
  useEffect(() => {
    const onOpen = (e: Event) => {
      setOpen(true);
      const q = (e as CustomEvent<string | undefined>).detail;
      if (q) askRef.current(q);
    };
    window.addEventListener("sarumadi:chat", onOpen);
    return () => window.removeEventListener("sarumadi:chat", onOpen);
  }, []);

  async function ask(question: string) {
    const q = question.trim();
    if (!q || busy) return;
    const history: Msg[] = [...msgs.filter((m) => !m.error && m.content), { role: "user", content: q }];
    // Count only: questions can contain personal details, so their text is not sent.
    track("Pregunta al asistente", { turno: history.filter((m) => m.role === "user").length });
    setMsgs([...history, { role: "assistant", content: "" }]);
    setInput("");
    setBusy(true);

    const patch = (fn: (m: Msg) => Msg) => setMsgs((all) => all.map((m, i) => (i === all.length - 1 ? fn(m) : m)));
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: history.slice(-20).map(({ role, content }) => ({ role, content: content.slice(0, 2000) })) }),
      });
      if (!res.ok || !res.body) {
        const { error } = await res.json().catch(() => ({ error: null }));
        throw new Error(error ?? "No pude conectar con el asistente.");
      }
      const reader = res.body.pipeThrough(new TextDecoderStream()).getReader();
      let buffer = "";
      for (;;) {
        const { value, done } = await reader.read();
        if (done) break;
        buffer += value;
        const lines = buffer.split("\n");
        buffer = lines.pop() ?? "";
        for (const line of lines) {
          if (!line) continue;
          const e = JSON.parse(line) as { t: "text" | "products" | "error"; v: never };
          if (e.t === "text") patch((m) => ({ ...m, content: m.content + (e.v as string) }));
          if (e.t === "products") patch((m) => ({ ...m, products: e.v as ProductLite[] }));
          if (e.t === "error") patch((m) => ({ ...m, content: e.v as string, error: true }));
        }
      }
      patch((m) => (m.content.trim() || m.products ? { ...m, content: m.content.trim() } : { ...m, content: "No obtuve respuesta. Intenta de nuevo.", error: true }));
    } catch (err) {
      patch((m) => ({ ...m, content: err instanceof Error ? err.message : "Algo salió mal. Intenta de nuevo.", error: true }));
    } finally {
      setBusy(false);
    }
  }

  const askRef = useRef(ask);
  askRef.current = ask;

  return (
    <>
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed bottom-5 right-5 z-40 flex h-13 max-lg:[[data-buybar]_&]:bottom-24 items-center gap-2.5 rounded-full border border-white/10 bg-ink py-3.5 pl-4 pr-5 text-sm font-semibold text-white shadow-2xl shadow-ink/30 transition-transform hover:-translate-y-0.5"
        >
          <span className="grid size-6 place-items-center rounded-full bg-orange">
            <Sparkles className="size-3.5" />
          </span>
          Pregúntale al asistente
        </button>
      )}

      {open && (
        <section
          role="dialog"
          aria-label="Asistente Sarumadi"
          className="fixed inset-0 z-50 flex animate-pop flex-col overflow-hidden bg-paper shadow-2xl shadow-ink/40 sm:inset-auto sm:bottom-5 sm:right-5 sm:h-[min(40rem,calc(100dvh-2.5rem))] sm:w-[25rem] sm:rounded-3xl sm:border sm:border-line"
        >
          <header className="slatwall flex items-center gap-3 bg-ink px-5 py-4 text-white">
            <span className="grid size-9 place-items-center rounded-full bg-orange">
              <Sparkles className="size-4" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="display text-lg">Asistente Sarumadi</p>
              <p className="label text-white/60">IA · Catálogo completo</p>
            </div>
            <a
              href={waLink("Hola Sarumadi, quiero hablar con un asesor.")}
              target="_blank"
              rel="noreferrer"
              aria-label="Hablar con una persona por WhatsApp"
              title="Hablar con una persona"
              className="grid size-9 place-items-center rounded-full bg-wa"
            >
              <WhatsAppIcon className="size-4" />
            </a>
            <button onClick={() => setOpen(false)} aria-label="Cerrar asistente" className="grid size-9 place-items-center rounded-full bg-white/10 hover:bg-white/20">
              <X className="size-4" />
            </button>
          </header>

          <div ref={scroller} className="flex-1 space-y-4 overflow-y-auto px-4 py-5" aria-live="polite">
            {msgs.length === 0 && (
              <div className="px-1">
                <p className="display text-2xl">¿Qué necesitas resolver hoy?</p>
                <p className="mt-2 text-sm text-steel">Cuéntame el trabajo y te muestro la herramienta. También puedo explicarte cómo comprar o reservar una visita.</p>
                <div className="mt-5 flex flex-col gap-2">
                  {starters.map((s) => (
                    <button key={s} onClick={() => ask(s)} className="rounded-2xl border border-line bg-white px-4 py-3 text-left text-sm transition-colors hover:border-ink">
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {msgs.map((m, i) =>
              m.role === "user" ? (
                <p key={i} className="ml-auto w-fit max-w-[85%] whitespace-pre-wrap rounded-2xl rounded-br-md bg-ink px-4 py-2.5 text-sm text-white">
                  {m.content}
                </p>
              ) : (
                <div key={i} className="max-w-[92%] space-y-2">
                  {(m.content || !m.products) && (
                    <p className={`w-fit whitespace-pre-wrap rounded-2xl rounded-bl-md px-4 py-2.5 text-sm leading-relaxed ${m.error ? "border border-orange/40 bg-orange/10" : "bg-white"}`}>
                      {m.content ? <RichText text={m.content} /> : <span className="label animate-pulse text-steel-2">Buscando en el catálogo…</span>}
                    </p>
                  )}
                  {m.products?.map((p) => (
                    <div key={p.slug} className="flex items-center gap-3 rounded-2xl border border-line bg-white p-2 pr-3">
                      <Link href={`/producto/${p.slug}`} className="relative size-16 shrink-0 overflow-hidden rounded-xl bg-tile">
                        <Image src={img(p.images[0])} alt="" fill sizes="64px" className="on-tile object-contain p-1.5" />
                      </Link>
                      <div className="min-w-0 flex-1">
                        <Link href={`/producto/${p.slug}`} className="line-clamp-2 text-[0.8125rem] font-medium leading-snug hover:text-orange-deep">
                          {p.name}
                        </Link>
                        <p className="font-display text-sm font-bold">{formatBs(p.price)}</p>
                      </div>
                      <button onClick={() => add(p)} aria-label={`Añadir ${p.name} al carrito`} className="grid size-9 shrink-0 place-items-center rounded-full bg-orange text-white hover:bg-orange-deep">
                        <Plus className="size-4" />
                      </button>
                    </div>
                  ))}
                </div>
              ),
            )}
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              ask(input);
            }}
            className="border-t border-line bg-white p-3"
          >
            <div className="flex items-end gap-2 rounded-3xl border border-line bg-paper py-1.5 pl-4 pr-1.5 focus-within:border-ink">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    ask(input);
                  }
                }}
                rows={1}
                maxLength={2000}
                placeholder="Escribe tu consulta…"
                aria-label="Mensaje para el asistente"
                className="max-h-28 min-h-9 flex-1 resize-none bg-transparent py-2 text-base outline-none focus-visible:outline-none placeholder:text-steel-2 sm:text-sm"
              />
              <button type="submit" disabled={busy || !input.trim()} aria-label="Enviar" className="grid size-9 shrink-0 place-items-center rounded-full bg-ink text-white transition-colors enabled:hover:bg-orange disabled:opacity-30">
                <ArrowUp className="size-4" />
              </button>
            </div>
            <p className="label pt-2 text-center !text-[0.5625rem] text-steel-2">Stock y envíos se confirman con un asesor</p>
          </form>
        </section>
      )}
    </>
  );
}
