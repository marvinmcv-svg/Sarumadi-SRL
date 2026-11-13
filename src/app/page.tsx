import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, CalendarCheck, MessageSquareText, PackageCheck, Sparkles, Store } from "lucide-react";
import { AskBar, AskButton } from "@/components/ask-bar";
import { WhatsAppIcon } from "@/components/icons";
import { ProductCard } from "@/components/product-card";
import { departments, lite, products } from "@/lib/catalog";
import { formatBs, img } from "@/lib/product";
import { brands, site, waLink } from "@/lib/site";

const featured = products.find((p) => p.sku === "TR-102466") ?? products[0];
const fresh = products.filter((p) => p !== featured).slice(0, 10);

const community = [
  { date: "Oct 2026", title: "HyRock Fitness Festival", text: "Auspiciadores de una experiencia de fuerza y resistencia.", href: "https://instagram.com/p/DerkiktFrKm" },
  { date: "Jul 2026", title: "Renault 42K Santa Cruz", text: "Auspiciadores oficiales de la maratón cruceña.", href: "https://instagram.com/p/Da0PgR4FUD6" },
  { date: "Jun 2026", title: "Tour de los Elementos", text: "Guardianes de la Tierra: compromiso con el deporte y el medio ambiente.", href: "https://instagram.com/p/DZhZ03gj0F6" },
];

const faqs = [
  {
    q: "¿Cómo hago un pedido?",
    a: "Agrega los productos al carrito y pulsa “Finalizar pedido”. Completas tus datos y el pedido llega a nuestro equipo por WhatsApp, donde confirmamos disponibilidad, pago y entrega.",
  },
  {
    q: "¿Hacen envíos fuera de Santa Cruz?",
    a: "Coordinamos cada envío por WhatsApp según tu ciudad y el volumen del pedido. Indica tu ubicación al finalizar la compra y un asesor te confirma opciones y costo.",
  },
  {
    q: "¿Puedo ver los productos antes de comprar?",
    a: "Sí. Nuestro showroom en Av. G77 + China tiene el surtido completo en exhibición. Reserva tu visita y un asesor te espera a la hora que elijas.",
  },
  {
    q: "¿Atienden a ferreterías y empresas?",
    a: "Sí, somos importadores y distribuidores. Reserva una reunión de cotización o escríbenos con tu lista de productos para preparar una propuesta.",
  },
  {
    q: "¿Los precios de la web son finales?",
    a: "Los precios están en bolivianos y se confirman junto con el stock al procesar tu pedido por WhatsApp.",
  },
];

export default function Home() {
  return (
    <>
      {/* HERO */}
      <section className="mx-auto grid max-w-[90rem] gap-3 px-3 pt-3 sm:px-4 lg:grid-cols-[1fr_22rem] lg:px-6 xl:grid-cols-[1fr_26rem]">
        <div className="relative isolate flex min-h-[34rem] flex-col justify-end overflow-hidden rounded-[1.75rem] bg-ink p-6 text-white sm:p-10 lg:min-h-[40rem] lg:p-14">
          <Image src="/showroom/pasillo.webp" alt="Pasillo del showroom Sarumadi con herramientas Truper" fill priority sizes="(min-width: 1024px) 70vw, 100vw" className="-z-20 object-cover" />
          <div className="absolute inset-0 -z-10 bg-gradient-to-t from-ink via-ink/75 to-ink/25" />
          <div className="slatwall absolute inset-0 -z-10" />

          <p className="label animate-rise flex items-center gap-2 text-white/80">
            <span className="h-px w-8 bg-orange" /> Importadores · Santa Cruz, Bolivia
          </p>
          <h1 className="display mt-5 animate-rise text-[clamp(2.1rem,10.5vw,3.5rem)] sm:text-[clamp(3.5rem,6.6vw,6rem)] [animation-delay:80ms]">
            Un mundo
            <br />
            de <span className="text-orange">soluciones.</span>
          </h1>
          <p className="mt-6 max-w-xl animate-rise text-lg text-white/80 [animation-delay:160ms]">
            Truper, Pretul, Foset, Volteck, Hermex, Fiero y Klintek en un solo lugar. Compra en línea, pide por WhatsApp o ven a probarlo en el showroom.
          </p>
          <div className="mt-8 animate-rise [animation-delay:240ms]">
            <AskBar />
            <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm font-semibold">
              <Link href="/tienda" className="flex items-center gap-2 hover:text-orange">
                Ver los {products.length} productos <ArrowRight className="size-4" />
              </Link>
              <Link href="/reservar" className="flex items-center gap-2 hover:text-orange">
                <CalendarCheck className="size-4" /> Reservar visita al showroom
              </Link>
            </div>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1 lg:grid-rows-[1fr_auto]">
          <Link href={`/producto/${featured.slug}`} className="group relative flex min-h-[24rem] flex-col overflow-hidden rounded-[1.75rem] bg-orange p-6 text-white">
            <div className="flex items-start justify-between">
              <span className="label rounded-full bg-white px-3 py-1.5 text-ink">Destacado · {featured.brand}</span>
              <ArrowUpRight className="size-6 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </div>
            <div className="relative my-4 flex-1">
              <div className="absolute inset-0 m-auto aspect-square max-h-full rounded-full bg-white" />
              <Image src={img(featured.images[0])} alt={featured.name} fill sizes="(min-width: 1024px) 24rem, 50vw" className="object-contain p-4 mix-blend-multiply transition-transform duration-500 group-hover:scale-105 group-hover:-rotate-3" />
            </div>
            <p className="text-lg font-semibold leading-tight">{featured.name}</p>
            <p className="display mt-1 text-4xl">{formatBs(featured.price)}</p>
          </Link>

          <a href={waLink("Hola Sarumadi, quiero hacer una consulta.")} target="_blank" rel="noreferrer" className="group flex items-center gap-4 rounded-[1.75rem] bg-ink p-6 text-white">
            <span className="grid size-12 shrink-0 place-items-center rounded-full bg-wa">
              <WhatsAppIcon className="size-6" />
            </span>
            <span className="flex-1">
              <span className="label block text-white/60">Atención directa</span>
              <span className="block text-lg font-semibold leading-tight">Habla con un asesor por WhatsApp</span>
            </span>
            <ArrowUpRight className="size-5 text-white/60 transition-colors group-hover:text-orange" />
          </a>
        </div>
      </section>

      {/* BRAND MARQUEE */}
      <section aria-label="Marcas que distribuimos" className="mt-3 overflow-hidden border-y border-line bg-white py-5">
        <div className="flex w-max animate-marquee items-center hover:[animation-play-state:paused]">
          {[...brands, ...brands, ...brands, ...brands].map((b, i) => (
            <Link key={i} href={`/tienda?marca=${b.name}`} aria-hidden={i >= brands.length} tabIndex={i >= brands.length ? -1 : 0} className="mx-8 block shrink-0 opacity-80 transition-opacity hover:opacity-100 sm:mx-12">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={`/brand/${b.slug}.png`} alt={b.name} width={400} height={190} className="h-12 w-auto sm:h-14" />
            </Link>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="mx-auto mt-16 grid max-w-[90rem] gap-px overflow-hidden px-4 sm:px-6 md:grid-cols-3 lg:px-10">
        {[
          { icon: PackageCheck, t: "Arma tu pedido", d: "Elige entre cientos de productos con precio en bolivianos y envía tu pedido en un minuto." },
          { icon: MessageSquareText, t: "Confirmamos por WhatsApp", d: "Un asesor valida stock, forma de pago y entrega. Sin formularios eternos." },
          { icon: Store, t: "Retira o recibe", d: "Pasa por el showroom o coordina el envío a tu obra, taller o ferretería." },
        ].map(({ icon: Icon, t, d }, i) => (
          <div key={t} className="flex gap-4 border-line py-2 md:border-l md:px-8 md:first:border-l-0 md:first:pl-0">
            <span className="display text-5xl text-orange">{i + 1}</span>
            <div>
              <h3 className="flex items-center gap-2 text-lg font-semibold">
                <Icon className="size-4 text-steel" /> {t}
              </h3>
              <p className="mt-1 text-sm text-steel">{d}</p>
            </div>
          </div>
        ))}
      </section>

      {/* DEPARTMENTS */}
      <section className="mx-auto mt-24 max-w-[90rem] px-4 sm:px-6 lg:px-10">
        <SectionHead kicker="Departamentos" title="Todo para la obra, el taller y la casa" href="/tienda" cta="Ver toda la tienda" />
        <div className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
          {departments.map((d, i) => (
            <Link
              key={d.slug}
              href={`/tienda?depto=${d.slug}`}
              className={`group relative flex min-h-44 flex-col justify-between overflow-hidden rounded-2xl p-5 transition-colors ${i === 0 ? "col-span-2 row-span-2 min-h-80 bg-ink text-white" : "bg-tile hover:bg-white"}`}
            >
              <div className="relative z-10 flex items-start justify-between">
                <span className={`label ${i === 0 ? "text-orange" : "text-steel"}`}>{String(d.count).padStart(2, "0")} productos</span>
                <ArrowUpRight className="size-5 opacity-40 transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:opacity-100" />
              </div>
              <div className={`pointer-events-none absolute ${i === 0 ? "inset-x-0 top-10 bottom-28 sm:left-auto sm:right-4 sm:top-6 sm:bottom-6 sm:w-1/2" : "inset-y-8 right-0 w-1/2"}`}>
                {i === 0 && <div className="absolute inset-0 m-auto aspect-square max-h-full rounded-full bg-white" />}
                <Image src={img(d.cover)} alt="" fill sizes="(min-width: 1024px) 25vw, 50vw" className="object-contain mix-blend-multiply transition-transform duration-500 group-hover:scale-110" />
              </div>
              <h3 className={`display relative z-10 max-w-[60%] ${i === 0 ? "text-3xl sm:max-w-[45%] sm:text-4xl" : "text-base sm:text-xl"}`}>{d.name}</h3>
            </Link>
          ))}
        </div>
      </section>

      {/* NEW ARRIVALS */}
      <section className="mx-auto mt-24 max-w-[90rem] px-4 sm:px-6 lg:px-10">
        <SectionHead kicker="Recién llegados" title="Lo último en el catálogo" href="/tienda" cta="Ver todo" />
        <div className="mt-8 grid grid-cols-2 gap-x-3 gap-y-8 md:grid-cols-3 lg:grid-cols-5">
          {fresh.map((p) => (
            <ProductCard key={p.slug} p={lite(p)} />
          ))}
        </div>
      </section>

      {/* SHOWROOM + BOOKING */}
      <section id="showroom" className="slatwall mt-24 bg-ink py-20 text-white">
        <div className="mx-auto grid max-w-[90rem] gap-12 px-4 sm:px-6 lg:grid-cols-[1fr_1.15fr] lg:items-center lg:px-10">
          <div>
            <p className="label flex items-center gap-2 text-orange">
              <span className="h-px w-8 bg-orange" /> Showroom Sarumadi
            </p>
            <h2 className="display mt-5 text-5xl sm:text-7xl">
              Ven, toca
              <br />y compara.
            </h2>
            <p className="mt-6 max-w-md text-lg text-white/75">
              Pasillos completos de herramienta manual y eléctrica, grifería Foset instalada, cerrajería Hermex y todo el surtido Truper en exhibición. Reserva tu hora y un asesor te recibe.
            </p>
            <dl className="mt-8 grid max-w-md grid-cols-2 gap-6 border-t border-white/15 pt-6 text-sm">
              <div>
                <dt className="label text-white/50">Dónde</dt>
                <dd className="mt-1">{site.address[0]}<br />{site.address[1]}</dd>
              </div>
              <div>
                <dt className="label text-white/50">Cuándo</dt>
                <dd className="mt-1">Lun a Vie 8:30 – 18:30<br />Sáb 8:30 – 12:30</dd>
              </div>
            </dl>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/reservar" className="flex h-14 items-center gap-2.5 rounded-full bg-orange px-7 font-semibold transition-colors hover:bg-orange-deep">
                <CalendarCheck className="size-5" /> Reservar por WhatsApp
              </Link>
              <a href={site.mapsUrl} target="_blank" rel="noreferrer" className="flex h-14 items-center gap-2 rounded-full border border-white/25 px-7 font-semibold hover:border-white">
                Cómo llegar <ArrowUpRight className="size-4" />
              </a>
            </div>
          </div>

          <div className="grid grid-cols-6 grid-rows-[11rem_11rem_9rem] gap-3 sm:grid-rows-[15rem_15rem_12rem]">
            {[
              ["letrero", "Letrero de Sarumadi SRL con las marcas Truper, Pretul, Hermex, Foset, Fiero y Volteck", "col-span-3 row-span-2"],
              ["martillos", "Pared de martillos y herramienta manual", "col-span-3"],
              ["isla-herramientas", "Isla central con cajas de herramientas y accesorios", "col-span-3"],
              ["foset-griferia", "Exhibición de grifería y calefones Foset", "col-span-3"],
              ["carretillas", "Carretillas y llantas Truper", "col-span-3"],
            ].map(([f, alt, cls]) => (
              <div key={f} className={`relative overflow-hidden rounded-2xl ${cls}`}>
                <Image src={`/showroom/${f}.webp`} alt={alt} fill sizes="(min-width: 1024px) 35vw, 66vw" className="object-cover transition-transform duration-700 hover:scale-105" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* BRANDS */}
      <section id="marcas" className="mx-auto mt-24 max-w-[90rem] px-4 sm:px-6 lg:px-10">
        <SectionHead kicker="Nuestras marcas" title="Siete marcas, una sola garantía de surtido" />
        <div className="mt-8 grid gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
          {brands.map((b) => (
            <Link key={b.slug} href={`/tienda?marca=${b.name}`} className="group flex flex-col bg-white p-6 transition-colors hover:bg-paper">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={`/brand/${b.slug}.png`} alt={b.name} width={400} height={190} className="-ml-3 h-16 w-auto self-start" />
              <p className="mt-2 flex-1 text-sm text-steel">{b.blurb}</p>
              <span className="label mt-5 flex items-center gap-1 text-ink group-hover:text-orange-deep">
                {products.filter((p) => p.brand === b.name).length} productos <ArrowRight className="size-3.5" />
              </span>
            </Link>
          ))}
          <div className="flex flex-col justify-between bg-orange p-6 text-white">
            <p className="display text-2xl">¿Buscas otra línea?</p>
            <a href={waLink("Hola Sarumadi, busco un producto de una línea que no veo en la web.")} target="_blank" rel="noreferrer" className="mt-5 flex items-center gap-2 text-sm font-semibold">
              Consultar disponibilidad <ArrowUpRight className="size-4" />
            </a>
          </div>
        </div>
      </section>

      {/* ASSISTANT */}
      <section className="mx-auto mt-24 max-w-[90rem] px-4 sm:px-6 lg:px-10">
        <div className="slatwall-dark grid gap-10 overflow-hidden rounded-[1.75rem] bg-tile p-8 sm:p-12 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="label flex items-center gap-2 text-orange-deep">
              <Sparkles className="size-3.5" /> Asistente con IA
            </p>
            <h2 className="display mt-4 text-4xl sm:text-6xl">Dinos el trabajo. Te decimos la herramienta.</h2>
            <p className="mt-5 max-w-md text-steel">Nuestro asistente conoce todo el catálogo: busca por uso, medida o presupuesto, compara opciones y las agrega a tu carrito. Disponible a cualquier hora.</p>
          </div>
          <div className="flex flex-col items-start gap-2.5">
            {["¿Qué necesito para colgar un estante en pared de ladrillo?", "Candados de alta seguridad por menos de Bs 150", "Equipo de protección para trabajar con amoladora", "¿Qué llaves de paso Foset tienen?"].map((q) => (
              <AskButton key={q} question={q} className="flex w-full items-center justify-between gap-4 rounded-2xl bg-white px-5 py-4 text-left font-medium shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md">
                {q}
                <ArrowRight className="size-4 shrink-0 text-orange" />
              </AskButton>
            ))}
          </div>
        </div>
      </section>

      {/* COMMUNITY */}
      <section className="mx-auto mt-24 max-w-[90rem] px-4 sm:px-6 lg:px-10">
        <SectionHead kicker="@sarumadi.bo" title="Con Santa Cruz, dentro y fuera de la obra" href={site.social.instagram} cta="Seguir en Instagram" external />
        <div className="mt-8 grid gap-3 md:grid-cols-3">
          {community.map((c) => (
            <a key={c.title} href={c.href} target="_blank" rel="noreferrer" className="group flex min-h-52 flex-col justify-between rounded-2xl border border-line bg-white p-6 transition-colors hover:border-ink">
              <div className="flex items-center justify-between">
                <span className="label text-steel-2">{c.date} · Auspicio</span>
                <ArrowUpRight className="size-5 text-steel-2 transition-colors group-hover:text-orange" />
              </div>
              <div>
                <h3 className="display text-2xl">{c.title}</h3>
                <p className="mt-2 text-sm text-steel">{c.text}</p>
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section id="preguntas" className="mx-auto mt-24 grid max-w-[90rem] gap-10 px-4 sm:px-6 lg:grid-cols-[1fr_1.6fr] lg:px-10">
        <div>
          <p className="label flex items-center gap-2 text-orange-deep">
            <span className="h-px w-8 bg-orange" /> Preguntas frecuentes
          </p>
          <h2 className="display mt-4 text-4xl sm:text-5xl">Antes de comprar</h2>
        </div>
        <div className="divide-y divide-line border-y border-line">
          {faqs.map((f) => (
            <details key={f.q} className="group py-5">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-6 text-lg font-semibold [&::-webkit-details-marker]:hidden">
                {f.q}
                <span className="grid size-8 shrink-0 place-items-center rounded-full border border-line text-xl font-normal transition-transform group-open:rotate-45">+</span>
              </summary>
              <p className="mt-3 max-w-2xl text-steel">{f.a}</p>
            </details>
          ))}
        </div>
      </section>
    </>
  );
}

function SectionHead({ kicker, title, href, cta, external }: { kicker: string; title: string; href?: string; cta?: string; external?: boolean }) {
  return (
    <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
      <div>
        <p className="label flex items-center gap-2 text-orange-deep">
          <span className="h-px w-8 bg-orange" /> {kicker}
        </p>
        <h2 className="display mt-4 max-w-3xl text-4xl sm:text-5xl">{title}</h2>
      </div>
      {href && cta && (
        <Link href={href} {...(external ? { target: "_blank", rel: "noreferrer" } : {})} className="flex shrink-0 items-center gap-2 text-sm font-semibold hover:text-orange-deep">
          {cta} <ArrowRight className="size-4" />
        </Link>
      )}
    </div>
  );
}
