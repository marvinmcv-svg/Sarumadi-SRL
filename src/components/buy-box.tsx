"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { Check, ShoppingBag } from "lucide-react";
import { formatBs, img, type ProductLite } from "@/lib/product";
import { waLink } from "@/lib/site";
import { useCart } from "./cart";
import { QtyStepper } from "./cart-drawer";
import { WhatsAppIcon } from "./icons";

export function Gallery({ images, name }: { images: string[]; name: string }) {
  const [active, setActive] = useState(0);
  return (
    <div className="flex flex-col-reverse gap-3 sm:flex-row">
      {images.length > 1 && (
        <div className="no-scrollbar flex gap-3 overflow-x-auto sm:flex-col">
          {images.map((f, i) => (
            <button
              key={f}
              onClick={() => setActive(i)}
              aria-label={`Ver imagen ${i + 1}`}
              aria-current={i === active}
              className={`relative size-18 shrink-0 overflow-hidden rounded-xl bg-tile transition-shadow sm:size-20 ${i === active ? "ring-2 ring-ink" : "hover:ring-2 hover:ring-line"}`}
            >
              <Image src={img(f)} alt="" fill sizes="80px" className="on-tile object-contain p-2" />
            </button>
          ))}
        </div>
      )}
      <div className="relative aspect-square flex-1 overflow-hidden rounded-[1.75rem] bg-tile">
        <Image key={images[active]} src={img(images[active])} alt={name} fill priority sizes="(min-width: 1024px) 50vw, 100vw" className="on-tile animate-pop object-contain p-8 sm:p-14" />
      </div>
    </div>
  );
}

export function BuyBox({ p }: { p: ProductLite }) {
  const { add } = useCart();
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const box = useRef<HTMLDivElement>(null);
  const [offscreen, setOffscreen] = useState(false);

  // On phones the buy box scrolls away: show a sticky bar once it's out of view.
  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setOffscreen(!e.isIntersecting && e.boundingClientRect.top < 0));
    io.observe(el);
    return () => io.disconnect();
  }, []);
  useEffect(() => {
    const root = document.documentElement;
    if (offscreen) root.dataset.buybar = "";
    else delete root.dataset.buybar;
    return () => {
      delete root.dataset.buybar;
    };
  }, [offscreen]);

  return (
    <div ref={box} className="space-y-3">
      {offscreen && (
        <div className="fixed inset-x-0 bottom-0 z-30 flex animate-pop items-center gap-3 border-t border-line bg-white/95 px-4 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] shadow-2xl backdrop-blur lg:hidden">
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium">{p.name}</p>
            <p className="font-display text-lg font-bold leading-tight">{formatBs(p.price)}</p>
          </div>
          <button onClick={() => add(p, qty)} className="flex h-12 shrink-0 items-center gap-2 rounded-full bg-orange px-5 font-semibold text-white">
            <ShoppingBag className="size-5" /> Añadir
          </button>
        </div>
      )}
      <div className="flex gap-3">
        <QtyStepper qty={qty} onChange={(n) => setQty(Math.max(1, Math.min(999, n)))} />
        <button
          onClick={() => {
            add(p, qty);
            setAdded(true);
            setTimeout(() => setAdded(false), 1800);
          }}
          className="flex h-12 flex-1 items-center justify-center gap-2.5 rounded-full bg-orange px-6 font-semibold text-white transition-colors hover:bg-orange-deep"
        >
          {added ? <Check className="size-5" /> : <ShoppingBag className="size-5" />}
          {added ? "Añadido" : `Añadir · ${formatBs(p.price * qty)}`}
        </button>
      </div>
      <a
        href={waLink(`Hola Sarumadi, quiero consultar por este producto:\n${p.name}\nCódigo: ${p.sku}\nCantidad: ${qty}`)}
        target="_blank"
        rel="noreferrer"
        className="flex h-12 items-center justify-center gap-2.5 rounded-full border border-ink font-semibold transition-colors hover:bg-ink hover:text-white"
      >
        <WhatsAppIcon /> Consultar por WhatsApp
      </a>
    </div>
  );
}
