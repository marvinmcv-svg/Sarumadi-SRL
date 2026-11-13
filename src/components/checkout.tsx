"use client";

import Link from "next/link";
import { useState } from "react";
import { Check, Store, Truck } from "lucide-react";
import { formatBs } from "@/lib/product";
import { site, waLink } from "@/lib/site";
import { useCart } from "./cart";
import { CartLineRow } from "./cart-drawer";
import { Field, inputCls } from "./field";
import { WhatsAppIcon } from "./icons";

export function Checkout() {
  const { lines, total, clear } = useCart();
  const [entrega, setEntrega] = useState<"retiro" | "envio">("retiro");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [sent, setSent] = useState<string | null>(null);

  function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = Object.fromEntries(new FormData(e.currentTarget)) as Record<string, string>;
    const errs: Record<string, string> = {};
    if (f.nombre.trim().length < 3) errs.nombre = "Escribe tu nombre completo.";
    if (f.celular.replace(/\D/g, "").length < 7) errs.celular = "Escribe un número de celular válido.";
    if (entrega === "envio" && f.direccion.trim().length < 5) errs.direccion = "Indica la dirección de entrega.";
    setErrors(errs);
    if (Object.keys(errs).length) return;

    const ref = `SR-${Date.now().toString(36).slice(-5).toUpperCase()}`;
    const text = [
      `*Pedido web ${ref}*`,
      "",
      ...lines.map((l) => `• ${l.qty} × ${l.name} (${l.sku}) — ${formatBs(l.price * l.qty)}`),
      "",
      `*Subtotal: ${formatBs(total)}*`,
      "",
      `Nombre: ${f.nombre.trim()}`,
      `Celular: ${f.celular.trim()}`,
      entrega === "retiro" ? "Entrega: Retiro en showroom" : `Entrega: Envío a ${f.direccion.trim()}, ${f.ciudad.trim() || "Santa Cruz"}`,
      f.nit.trim() ? `Factura: ${f.nit.trim()}` : null,
      f.nota.trim() ? `Nota: ${f.nota.trim()}` : null,
    ]
      .filter((l) => l !== null)
      .join("\n");

    window.open(waLink(text), "_blank", "noopener");
    setSent(ref);
    clear();
  }

  if (sent) {
    return (
      <div className="mx-auto max-w-xl py-16 text-center">
        <span className="mx-auto grid size-16 place-items-center rounded-full bg-wa text-white">
          <Check className="size-8" />
        </span>
        <h1 className="display mt-6 text-4xl sm:text-5xl">Pedido {sent} listo para enviar</h1>
        <p className="mt-4 text-steel">
          Abrimos WhatsApp con tu pedido escrito. Pulsa <strong>enviar</strong> en el chat para que nuestro equipo lo reciba; te confirmamos stock, pago y entrega en horario de atención ({site.hoursLabel}).
        </p>
        <Link href="/tienda" className="mt-8 inline-flex h-12 items-center rounded-full bg-ink px-7 font-semibold text-white hover:bg-orange-deep">
          Seguir comprando
        </Link>
      </div>
    );
  }

  if (lines.length === 0) {
    return (
      <div className="mx-auto max-w-xl py-16 text-center">
        <h1 className="display text-4xl sm:text-5xl">Tu carrito está vacío</h1>
        <p className="mt-4 text-steel">Agrega productos para armar tu pedido.</p>
        <Link href="/tienda" className="mt-8 inline-flex h-12 items-center rounded-full bg-ink px-7 font-semibold text-white hover:bg-orange-deep">
          Ir a la tienda
        </Link>
      </div>
    );
  }

  return (
    <div className="grid gap-10 lg:grid-cols-[1.2fr_1fr] lg:gap-16">
      <form onSubmit={submit} noValidate className="space-y-8">
        <div>
          <h1 className="display text-4xl sm:text-6xl">Finalizar pedido</h1>
          <p className="mt-3 text-steel">Sin pagos en línea: tu pedido llega a un asesor por WhatsApp, que confirma disponibilidad, pago y entrega.</p>
        </div>

        <fieldset className="space-y-4">
          <legend className="label mb-3 text-steel">1 · Tus datos</legend>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Nombre completo" error={errors.nombre}>
              <input name="nombre" autoComplete="name" aria-invalid={!!errors.nombre} className={inputCls} />
            </Field>
            <Field label="Celular / WhatsApp" error={errors.celular}>
              <input name="celular" type="tel" inputMode="tel" autoComplete="tel" placeholder="7XXXXXXX" aria-invalid={!!errors.celular} className={inputCls} />
            </Field>
          </div>
          <Field label="NIT o CI y razón social" hint="Opcional, para factura">
            <input name="nit" className={inputCls} />
          </Field>
        </fieldset>

        <fieldset>
          <legend className="label mb-3 text-steel">2 · Entrega</legend>
          <div className="grid gap-3 sm:grid-cols-2">
            {(
              [
                ["retiro", Store, "Retiro en showroom", site.address[0]],
                ["envio", Truck, "Envío", "Costo y plazo se coordinan por WhatsApp"],
              ] as const
            ).map(([v, Icon, t, d]) => (
              <label key={v} className={`flex cursor-pointer gap-3 rounded-2xl border bg-white p-4 transition-colors ${entrega === v ? "border-ink ring-1 ring-ink" : "border-line hover:border-steel-2"}`}>
                <input type="radio" name="entrega" value={v} checked={entrega === v} onChange={() => setEntrega(v)} className="sr-only" />
                <Icon className={`mt-0.5 size-5 shrink-0 ${entrega === v ? "text-orange" : "text-steel-2"}`} />
                <span>
                  <span className="block font-semibold">{t}</span>
                  <span className="block text-sm text-steel">{d}</span>
                </span>
              </label>
            ))}
          </div>
          <div className={`mt-4 grid gap-4 sm:grid-cols-[2fr_1fr] ${entrega === "envio" ? "" : "hidden"}`}>
            <Field label="Dirección de entrega" error={errors.direccion}>
              <input name="direccion" autoComplete="street-address" aria-invalid={!!errors.direccion} className={inputCls} />
            </Field>
            <Field label="Ciudad">
              <input name="ciudad" autoComplete="address-level2" placeholder="Santa Cruz" className={inputCls} />
            </Field>
          </div>
        </fieldset>

        <fieldset>
          <legend className="label mb-3 text-steel">3 · Nota para el asesor</legend>
          <textarea name="nota" rows={3} placeholder="Horario de entrega, referencias, consultas…" className={`${inputCls} h-auto py-3`} />
        </fieldset>

        <button type="submit" className="flex h-14 w-full items-center justify-center gap-3 rounded-full bg-wa text-lg font-semibold text-white transition-transform hover:-translate-y-0.5">
          <WhatsAppIcon /> Enviar pedido por WhatsApp
        </button>
      </form>

      <aside className="lg:sticky lg:top-32 lg:self-start">
        <div className="rounded-[1.75rem] border border-line bg-white p-6">
          <h2 className="label text-steel">Resumen del pedido</h2>
          <ul className="mt-2 divide-y divide-line">
            {lines.map((l) => (
              <CartLineRow key={l.slug} l={l} />
            ))}
          </ul>
          <div className="mt-2 flex items-baseline justify-between border-t border-line pt-5">
            <span className="label text-steel">Subtotal</span>
            <span className="display text-3xl">{formatBs(total)}</span>
          </div>
          <p className="mt-2 text-xs text-steel-2">Precios en bolivianos. El total final (incluido el envío, si aplica) lo confirma el asesor.</p>
        </div>
      </aside>
    </div>
  );
}
