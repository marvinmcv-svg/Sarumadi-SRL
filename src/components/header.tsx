"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { CalendarCheck, MapPin, Menu, Search, ShoppingBag, X } from "lucide-react";
import { site, waLink } from "@/lib/site";
import { useCart } from "./cart";
import { Logo, WhatsAppIcon } from "./icons";

const nav = [
  { href: "/tienda", label: "Tienda" },
  { href: "/#marcas", label: "Marcas" },
  { href: "/#showroom", label: "Showroom" },
  { href: "/nosotros", label: "Nosotros" },
  { href: "/contacto", label: "Contacto" },
];

export function Header() {
  const { count, setOpen } = useCart();
  const pathname = usePathname();
  const [menu, setMenu] = useState(false);

  useEffect(() => setMenu(false), [pathname]);

  return (
    <header className="sticky top-0 z-40">
      <div className="bg-ink text-white/80">
        <div className="mx-auto flex h-9 max-w-[90rem] items-center justify-between gap-4 px-4 sm:px-6 lg:px-10">
          <a href={site.mapsUrl} target="_blank" rel="noreferrer" className="label flex min-w-0 items-center gap-1.5 hover:text-white">
            <MapPin className="size-3.5 shrink-0 text-orange" />
            <span className="truncate">Showroom · {site.address[0]}, Santa Cruz</span>
          </a>
          <div className="flex shrink-0 items-center gap-5">
            <span className="label hidden md:block">{site.hoursLabel}</span>
            <a href={waLink("Hola Sarumadi, tengo una consulta desde la web.")} target="_blank" rel="noreferrer" className="label flex items-center gap-1.5 text-white hover:text-orange">
              <WhatsAppIcon className="size-3.5" />
              {site.whatsappDisplay}
            </a>
          </div>
        </div>
      </div>

      <div className="border-b border-line bg-paper/90 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-[90rem] items-center gap-4 px-4 sm:px-6 lg:gap-8 lg:px-10">
          <Link href="/" aria-label="Sarumadi SRL, inicio">
            <Logo />
          </Link>

          <nav className="hidden items-center gap-6 lg:flex" aria-label="Principal">
            {nav.map((n) => (
              <Link key={n.href} href={n.href} className="text-[0.9375rem] font-medium text-ink/75 transition-colors hover:text-orange-deep">
                {n.label}
              </Link>
            ))}
          </nav>

          <form action="/tienda" className="relative ml-auto hidden max-w-xs flex-1 md:block" role="search">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-steel-2" />
            <input
              name="q"
              type="search"
              placeholder="Buscar taladro, candado, TR-102466…"
              aria-label="Buscar productos"
              className="h-10 w-full rounded-full border border-line bg-white pl-10 pr-4 text-sm placeholder:text-steel-2 focus:border-ink focus:outline-none"
            />
          </form>

          <div className="ml-auto flex items-center gap-2 md:ml-0">
            <Link
              href="/reservar"
              className="hidden h-10 items-center gap-2 rounded-full bg-ink px-4 text-sm font-semibold text-white transition-colors hover:bg-orange-deep sm:flex"
            >
              <CalendarCheck className="size-4" />
              Reservar visita
            </Link>
            <button
              onClick={() => setOpen(true)}
              aria-label={`Abrir carrito, ${count} productos`}
              className="relative grid size-10 place-items-center rounded-full border border-line bg-white transition-colors hover:border-ink"
            >
              <ShoppingBag className="size-[1.125rem]" />
              {count > 0 && (
                <span className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-orange px-1 font-mono text-[0.6875rem] font-medium text-white">
                  {count}
                </span>
              )}
            </button>
            <button
              onClick={() => setMenu((m) => !m)}
              aria-label="Menú"
              aria-expanded={menu}
              className="grid size-10 place-items-center rounded-full border border-line bg-white lg:hidden"
            >
              {menu ? <X className="size-[1.125rem]" /> : <Menu className="size-[1.125rem]" />}
            </button>
          </div>
        </div>

        {menu && (
          <div className="border-t border-line bg-paper px-4 pb-6 pt-4 sm:px-6 lg:hidden">
            <form action="/tienda" className="relative mb-4 md:hidden" role="search">
              <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-steel-2" />
              <input name="q" type="search" placeholder="Buscar productos" aria-label="Buscar productos" className="h-11 w-full rounded-full border border-line bg-white pl-10 pr-4 text-base" />
            </form>
            <nav className="flex flex-col" aria-label="Móvil">
              {[...nav, { href: "/reservar", label: "Reservar visita" }].map((n) => (
                <Link key={n.href} href={n.href} className="display border-b border-line py-3 text-2xl">
                  {n.label}
                </Link>
              ))}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
