"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";
import { ArrowRight, Minus, Plus, ShoppingBag, X } from "lucide-react";
import { formatBs, img } from "@/lib/product";
import { useCart, type CartLine } from "./cart";

export function QtyStepper({ qty, onChange, small = false }: { qty: number; onChange: (n: number) => void; small?: boolean }) {
  const s = small ? "size-8" : "size-11";
  return (
    <div className="inline-flex items-center rounded-full border border-line bg-white">
      <button onClick={() => onChange(qty - 1)} aria-label="Quitar uno" className={`grid ${s} place-items-center rounded-full hover:bg-tile`}>
        <Minus className="size-3.5" />
      </button>
      <span className="min-w-7 text-center font-mono text-sm" aria-live="polite">
        {qty}
      </span>
      <button onClick={() => onChange(qty + 1)} aria-label="Agregar uno" className={`grid ${s} place-items-center rounded-full hover:bg-tile`}>
        <Plus className="size-3.5" />
      </button>
    </div>
  );
}

export function CartLineRow({ l, onNavigate }: { l: CartLine; onNavigate?: () => void }) {
  const { setQty } = useCart();
  return (
    <li className="flex gap-4 py-4">
      <Link href={`/producto/${l.slug}`} onClick={onNavigate} className="relative size-20 shrink-0 overflow-hidden rounded-xl bg-tile">
        <Image src={img(l.image)} alt="" fill sizes="80px" className="on-tile object-contain p-2" />
      </Link>
      <div className="min-w-0 flex-1">
        <p className="label text-steel-2">{l.sku}</p>
        <p className="line-clamp-2 text-sm font-medium leading-snug">{l.name}</p>
        <div className="mt-2 flex items-center justify-between">
          <QtyStepper small qty={l.qty} onChange={(n) => setQty(l.slug, n)} />
          <span className="font-display font-bold">{formatBs(l.price * l.qty)}</span>
        </div>
      </div>
    </li>
  );
}

export function CartDrawer() {
  const { open, setOpen, lines, total, count } = useCart();

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, setOpen]);

  return (
    <div className={`fixed inset-0 z-50 ${open ? "" : "pointer-events-none"}`} aria-hidden={!open}>
      <div onClick={() => setOpen(false)} className={`absolute inset-0 bg-ink/50 backdrop-blur-sm transition-opacity duration-300 ${open ? "opacity-100" : "opacity-0"}`} />
      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Carrito"
        inert={!open}
        className={`absolute inset-y-0 right-0 flex w-full max-w-md flex-col bg-paper shadow-2xl transition-transform duration-300 ease-out ${open ? "translate-x-0" : "translate-x-full"}`}
      >
        <div className="flex items-center justify-between border-b border-line px-6 py-5">
          <h2 className="display text-2xl">
            Tu carrito <span className="text-steel-2">({count})</span>
          </h2>
          <button onClick={() => setOpen(false)} aria-label="Cerrar carrito" className="grid size-10 place-items-center rounded-full border border-line bg-white hover:border-ink">
            <X className="size-4" />
          </button>
        </div>

        {lines.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 px-8 text-center">
            <ShoppingBag className="size-10 text-steel-2" strokeWidth={1.25} />
            <p className="text-steel">Tu carrito está vacío. Empieza por lo que tu obra necesita hoy.</p>
            <Link href="/tienda" onClick={() => setOpen(false)} className="rounded-full bg-ink px-6 py-3 text-sm font-semibold text-white hover:bg-orange-deep">
              Ir a la tienda
            </Link>
          </div>
        ) : (
          <>
            <ul className="flex-1 divide-y divide-line overflow-y-auto px-6">
              {lines.map((l) => (
                <CartLineRow key={l.slug} l={l} onNavigate={() => setOpen(false)} />
              ))}
            </ul>
            <div className="border-t border-line bg-white px-6 py-5">
              <div className="flex items-baseline justify-between">
                <span className="label text-steel">Subtotal</span>
                <span className="font-display text-2xl font-extrabold">{formatBs(total)}</span>
              </div>
              <p className="mt-1 text-xs text-steel-2">El envío y la disponibilidad se confirman por WhatsApp.</p>
              <Link
                href="/checkout"
                onClick={() => setOpen(false)}
                className="mt-4 flex h-13 items-center justify-center gap-2 rounded-full bg-orange py-3.5 text-base font-semibold text-white transition-colors hover:bg-orange-deep"
              >
                Finalizar pedido <ArrowRight className="size-4" />
              </Link>
            </div>
          </>
        )}
      </aside>
    </div>
  );
}
