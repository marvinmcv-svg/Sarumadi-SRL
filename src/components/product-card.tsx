"use client";

import Image from "next/image";
import Link from "next/link";
import { Plus } from "lucide-react";
import { formatBs, img, type ProductLite } from "@/lib/product";
import { useCart } from "./cart";

export function ProductCard({ p, priority = false }: { p: ProductLite; priority?: boolean }) {
  const { add } = useCart();
  return (
    <article className="group relative flex flex-col">
      <Link href={`/producto/${p.slug}`} className="relative block aspect-square overflow-hidden rounded-2xl bg-tile">
        <Image
          src={img(p.images[0])}
          alt={p.name}
          fill
          priority={priority}
          sizes="(min-width: 1280px) 20vw, (min-width: 768px) 30vw, 46vw"
          className={`on-tile object-contain p-5 transition-all duration-500 group-hover:scale-105 ${p.images[1] ? "group-hover:opacity-0" : ""}`}
        />
        {p.images[1] && (
          <Image
            src={img(p.images[1])}
            alt=""
            fill
            sizes="(min-width: 1280px) 20vw, (min-width: 768px) 30vw, 46vw"
            className="on-tile object-contain p-5 opacity-0 transition-all duration-500 group-hover:scale-105 group-hover:opacity-100"
          />
        )}
        {p.brand && <span className="label absolute left-3 top-3 rounded-full bg-white/80 px-2.5 py-1 text-ink backdrop-blur">{p.brand}</span>}
      </Link>
      <button
        onClick={() => add(p)}
        aria-label={`Añadir ${p.name} al carrito`}
        className="absolute right-3 top-3 grid size-9 place-items-center rounded-full bg-ink text-white opacity-100 shadow-lg transition-all hover:bg-orange md:translate-y-1 md:opacity-0 md:group-hover:translate-y-0 md:group-hover:opacity-100 md:focus-visible:translate-y-0 md:focus-visible:opacity-100"
      >
        <Plus className="size-4" />
      </button>
      <div className="flex flex-1 flex-col px-1 pt-3">
        <span className="label text-steel-2">{p.sku}</span>
        <h3 className="mt-1 line-clamp-2 text-[0.9375rem] font-medium leading-snug">
          <Link href={`/producto/${p.slug}`} className="hover:text-orange-deep">
            {p.name}
          </Link>
        </h3>
        <p className="mt-auto pt-2 font-display text-lg font-bold tracking-tight">{formatBs(p.price)}</p>
      </div>
    </article>
  );
}
