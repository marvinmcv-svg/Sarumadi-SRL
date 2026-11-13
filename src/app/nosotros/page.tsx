import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { products } from "@/lib/catalog";
import { brands } from "@/lib/site";

export const metadata: Metadata = {
  title: "Quiénes somos",
  description: "Sarumadi SRL: importadores y distribuidores de Truper, Pretul, Foset, Volteck, Hermex, Fiero y Klintek en Santa Cruz, Bolivia.",
};

export default function Nosotros() {
  return (
    <div className="mx-auto max-w-[90rem] px-4 pt-10 sm:px-6 lg:px-10">
      <p className="label flex items-center gap-2 text-orange-deep">
        <span className="h-px w-8 bg-orange" /> Quiénes somos
      </p>
      <h1 className="display mt-4 max-w-5xl text-5xl sm:text-8xl">
        Importamos las herramientas que <span className="text-orange">construyen</span> Bolivia.
      </h1>

      <div className="mt-12 grid gap-10 lg:grid-cols-[1.3fr_1fr] lg:items-end">
        <div className="relative aspect-[4/3] overflow-hidden rounded-[1.75rem]">
          <Image src="/showroom/isla-herramientas.webp" alt="Interior del showroom Sarumadi" fill priority sizes="(min-width: 1024px) 55vw, 100vw" className="object-cover" />
        </div>
        <div className="space-y-5 text-lg text-steel">
          <p>
            <strong className="text-ink">Sarumadi SRL</strong> es una importadora cruceña dedicada al rubro ferretero. Desde nuestro showroom en Santa Cruz de la Sierra abastecemos a obras, talleres, ferreterías y hogares con las marcas del grupo Truper.
          </p>
          <p>Nuestro lema es simple: <strong className="text-ink">un mundo de soluciones</strong>. Herramienta manual y eléctrica, cerrajería, grifería, material eléctrico, acero y limpieza, con asesoría de gente que conoce el producto.</p>
          <dl className="grid grid-cols-3 gap-4 border-t border-line pt-6">
            {[
              [String(brands.length), "marcas"],
              [`${products.length}+`, "productos en línea"],
              ["1", "showroom en Santa Cruz"],
            ].map(([n, l]) => (
              <div key={l}>
                <dt className="display text-4xl text-ink sm:text-5xl">{n}</dt>
                <dd className="label mt-1 text-steel">{l}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>

      <section className="mt-24">
        <h2 className="display text-4xl sm:text-5xl">Las marcas que representamos</h2>
        <div className="mt-8 divide-y divide-line border-y border-line">
          {brands.map((b) => (
            <Link key={b.slug} href={`/tienda?marca=${b.name}`} className="group grid items-center gap-4 py-5 sm:grid-cols-[14rem_1fr_auto]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={`/brand/${b.slug}.png`} alt={b.name} width={400} height={190} className="-ml-3 h-16 w-auto mix-blend-multiply" />
              <p className="text-lg text-steel">{b.blurb}</p>
              <span className="flex items-center gap-2 text-sm font-semibold group-hover:text-orange-deep">
                Ver productos <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section className="mt-24 grid gap-3 sm:grid-cols-3">
        {["letrero", "martillos", "foset-griferia"].map((f) => (
          <div key={f} className="relative aspect-[4/5] overflow-hidden rounded-2xl">
            <Image src={`/showroom/${f}.webp`} alt="Showroom Sarumadi" fill sizes="(min-width: 640px) 33vw, 100vw" className="object-cover" />
          </div>
        ))}
      </section>

      <div className="mt-16 flex flex-wrap gap-3">
        <Link href="/reservar" className="flex h-14 items-center rounded-full bg-orange px-8 font-semibold text-white hover:bg-orange-deep">
          Reservar visita al showroom
        </Link>
        <Link href="/tienda" className="flex h-14 items-center rounded-full border border-ink px-8 font-semibold hover:bg-ink hover:text-white">
          Ver la tienda
        </Link>
      </div>
    </div>
  );
}
