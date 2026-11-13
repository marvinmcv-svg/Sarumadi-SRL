"use client";

import { track } from "@vercel/analytics";
import { useEffect, useMemo, useState } from "react";
import { Check, FileText, MessagesSquare, PackageCheck, Store } from "lucide-react";
import { site, waLink } from "@/lib/site";
import { Field, inputCls } from "./field";
import { WhatsAppIcon } from "./icons";

const reasons = [
  { id: "Visita al showroom", icon: Store, d: "Recorre la exhibición con un asesor." },
  { id: "Asesoría técnica", icon: MessagesSquare, d: "Te ayudamos a elegir la herramienta para tu trabajo." },
  { id: "Cotización para empresa o ferretería", icon: FileText, d: "Reunión para precios por volumen y distribución." },
  { id: "Retiro de pedido", icon: PackageCheck, d: "Agenda la hora para recoger tu compra." },
] as const;

const fmtTime = (h: number) => `${Math.floor(h)}:${h % 1 ? "30" : "00"}`;
const dayFmt = new Intl.DateTimeFormat("es-BO", { weekday: "short" });
const longFmt = new Intl.DateTimeFormat("es-BO", { weekday: "long", day: "numeric", month: "long" });
const monthFmt = new Intl.DateTimeFormat("es-BO", { month: "short" });

export function Booking() {
  // Dates depend on the visitor's clock, so they are built after mount.
  const [days, setDays] = useState<Date[]>([]);
  useEffect(() => {
    const out: Date[] = [];
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    while (out.length < 12) {
      d.setDate(d.getDate() + 1);
      if (site.hours[d.getDay()]) out.push(new Date(d));
    }
    setDays(out);
  }, []);

  const [reason, setReason] = useState<string>(reasons[0].id);
  const [day, setDay] = useState<Date | null>(null);
  const [time, setTime] = useState<number | null>(null);
  const [name, setName] = useState("");
  const [note, setNote] = useState("");
  const [tried, setTried] = useState(false);
  const [sent, setSent] = useState<string | null>(null);

  const slots = useMemo(() => {
    if (!day) return [];
    const [open, close] = site.hours[day.getDay()];
    const out: number[] = [];
    for (let h = open; h <= close - 0.5; h += 0.5) out.push(h);
    return out;
  }, [day]);

  const missing = !day ? "Elige un día." : time === null ? "Elige una hora." : name.trim().length < 3 ? "Escribe tu nombre." : null;

  function confirm() {
    setTried(true);
    if (missing || !day || time === null) return;
    const text = [
      "*Solicitud de reserva — web*",
      "",
      `Motivo: ${reason}`,
      `Día: ${longFmt.format(day)}`,
      `Hora: ${fmtTime(time)}`,
      `Nombre: ${name.trim()}`,
      note.trim() ? `Nota: ${note.trim()}` : null,
      "",
      "¿Me confirman la disponibilidad?",
    ]
      .filter((l) => l !== null)
      .join("\n");
    const link = waLink(text);
    track("Reserva enviada", { motivo: reason });
    window.open(link, "_blank", "noopener");
    setSent(link);
  }

  return (
    <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr] lg:gap-14">
      <div className="min-w-0 space-y-10">
        <Step n={1} title="¿Para qué nos visitas?">
          <div className="grid gap-3 sm:grid-cols-2">
            {reasons.map(({ id, icon: Icon, d }) => (
              <button
                key={id}
                onClick={() => setReason(id)}
                aria-pressed={reason === id}
                className={`flex gap-3 rounded-2xl border bg-white p-4 text-left transition-colors ${reason === id ? "border-ink ring-1 ring-ink" : "border-line hover:border-steel-2"}`}
              >
                <Icon className={`mt-0.5 size-5 shrink-0 ${reason === id ? "text-orange" : "text-steel-2"}`} />
                <span>
                  <span className="block font-semibold leading-snug">{id}</span>
                  <span className="mt-0.5 block text-sm text-steel">{d}</span>
                </span>
              </button>
            ))}
          </div>
        </Step>

        <Step n={2} title="Elige el día">
          <div className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:px-0">
            {days.length === 0 && Array.from({ length: 12 }, (_, i) => <div key={i} className="h-[5.25rem] w-16 shrink-0 animate-pulse rounded-2xl bg-tile" />)}
            {days.map((d) => {
              const on = day?.getTime() === d.getTime();
              return (
                <button
                  key={d.getTime()}
                  onClick={() => {
                    setDay(d);
                    setTime(null);
                  }}
                  aria-pressed={on}
                  aria-label={longFmt.format(d)}
                  className={`flex h-[5.25rem] w-16 shrink-0 flex-col items-center justify-center rounded-2xl border transition-colors ${on ? "border-orange bg-orange text-white" : "border-line bg-white hover:border-ink"}`}
                >
                  <span className="label !text-[0.625rem]">{dayFmt.format(d).replace(".", "")}</span>
                  <span className="font-display text-2xl font-extrabold leading-none">{d.getDate()}</span>
                  <span className={`label !text-[0.5625rem] ${on ? "text-white/80" : "text-steel-2"}`}>{monthFmt.format(d).replace(".", "")}</span>
                </button>
              );
            })}
          </div>
        </Step>

        <Step n={3} title="Elige la hora">
          {day ? (
            <div className="grid grid-cols-4 gap-2 sm:grid-cols-6">
              {slots.map((h) => (
                <button
                  key={h}
                  onClick={() => setTime(h)}
                  aria-pressed={time === h}
                  className={`h-11 rounded-full border font-mono text-sm transition-colors ${time === h ? "border-ink bg-ink text-white" : "border-line bg-white hover:border-ink"}`}
                >
                  {fmtTime(h)}
                </button>
              ))}
            </div>
          ) : (
            <p className="rounded-2xl border border-dashed border-line px-5 py-6 text-sm text-steel">Primero elige un día para ver los horarios.</p>
          )}
        </Step>

        <Step n={4} title="Tus datos">
          <div className="grid gap-4">
            <Field label="Nombre">
              <input value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" className={inputCls} />
            </Field>
            <Field label="¿Algo que debamos preparar?" hint="Opcional">
              <textarea value={note} onChange={(e) => setNote(e.target.value)} rows={3} placeholder="Productos que quieres ver, tamaño del proyecto…" className={`${inputCls} h-auto py-3`} />
            </Field>
          </div>
        </Step>
      </div>

      {/* Ticket */}
      <aside className="lg:sticky lg:top-32 lg:self-start">
        <div className="slatwall overflow-hidden rounded-[1.75rem] bg-ink text-white">
          <div className="p-7">
            <p className="label text-orange">Tu reserva</p>
            <p className="display mt-3 text-3xl">{reason}</p>
            <dl className="mt-6 space-y-4 text-sm">
              <Row k="Día" v={day ? longFmt.format(day) : "Por elegir"} />
              <Row k="Hora" v={time !== null ? fmtTime(time) : "Por elegir"} />
              <Row k="Lugar" v={`${site.address[0]}, ${site.address[1]}`} />
              <Row k="A nombre de" v={name.trim() || "Por completar"} />
            </dl>
          </div>
          <div className="relative border-t border-dashed border-white/25 p-7">
            <span className="absolute -left-3 -top-3 size-6 rounded-full bg-paper" />
            <span className="absolute -right-3 -top-3 size-6 rounded-full bg-paper" />
            {sent ? (
              <div className="flex gap-3">
                <Check className="mt-0.5 size-5 shrink-0 text-wa" />
                <p className="text-sm text-white/85">
                  Abrimos WhatsApp con tu solicitud. Pulsa <strong>enviar</strong> en el chat: la reserva queda firme cuando nuestro equipo te responde.{" "}
                  <a href={sent} target="_blank" rel="noreferrer" className="font-semibold text-white underline underline-offset-4">
                    ¿No se abrió? Ábrelo aquí
                  </a>
                  .
                </p>
              </div>
            ) : (
              <>
                <button onClick={confirm} className="flex h-14 w-full items-center justify-center gap-3 rounded-full bg-wa text-base font-semibold transition-transform hover:-translate-y-0.5">
                  <WhatsAppIcon /> Confirmar por WhatsApp
                </button>
                <p role="alert" className="mt-3 min-h-5 text-center text-sm text-orange">
                  {tried && missing}
                </p>
                <p className="text-center text-xs text-white/55">Sin registro ni pagos. Respondemos en horario de atención.</p>
              </>
            )}
          </div>
        </div>
      </aside>
    </div>
  );
}

function Step({ n, title, children }: { n: number; title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="mb-4 flex items-center gap-3 text-xl font-semibold">
        <span className="grid size-8 place-items-center rounded-full bg-ink font-mono text-sm text-white">{n}</span>
        {title}
      </h2>
      {children}
    </section>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex items-baseline justify-between gap-6 border-b border-white/10 pb-3">
      <dt className="label shrink-0 text-white/50">{k}</dt>
      <dd className="text-right first-letter:uppercase">{v}</dd>
    </div>
  );
}
