import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CalendarCheck, ChevronRight, MessageSquareText, Store } from "lucide-react";
import { AskButton } from "@/components/ask-bar";
import { BuyBox, Gallery } from "@/components/buy-box";
import { ProductCard } from "@/components/product-card";
import { guideFor } from "@/data/guides";
import { getProduct, lite, products } from "@/lib/catalog";
import { formatBs, img } from "@/lib/product";
import { jsonLd, site } from "@/lib/site";

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/producto/[slug]">): Promise<Metadata> {
  const p = getProduct((await params).slug);
  if (!p) return {};
  return {
    title: p.name,
    description: `${p.name} (${p.sku})${p.brand ? ` de ${p.brand}` : ""} a ${formatBs(p.price)} en Sarumadi SRL, Santa Cruz.`,
    alternates: { canonical: `/producto/${p.slug}` },
    openGraph: { images: [img(p.images[0])] },
  };
}

export default async function ProductPage({ params }: PageProps<"/producto/[slug]">) {
  const p = getProduct((await params).slug);
  if (!p) notFound();

  const guide = guideFor(p.dept, p.sub);
  const pool = products.filter((o) => o !== p && o.dept === p.dept);
  const related = [...pool.filter((o) => o.sub === p.sub), ...pool.filter((o) => o.sub !== p.sub)].slice(0, 5);

  const productLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: p.name,
    sku: p.sku,
    image: p.images.map((f) => site.url + img(f)),
    ...(p.brand ? { brand: { "@type": "Brand", name: p.brand } } : {}),
    ...(p.description ? { description: p.description } : {}),
    offers: {
      "@type": "Offer",
      price: p.price.toFixed(2),
      priceCurrency: "BOB",
      url: `${site.url}/producto/${p.slug}`,
      seller: { "@type": "Organization", name: site.name },
      hasMerchantReturnPolicy: {
        "@type": "MerchantReturnPolicy",
        applicableCountry: "BO",
        returnPolicyCategory: "https://schema.org/MerchantReturnFiniteReturnWindow",
        merchantReturnDays: site.returnDays,
        returnMethod: "https://schema.org/ReturnInStore",
      },
    },
  };
  const crumbs = [
    ["Tienda", "/tienda"],
    [p.deptName, `/tienda?depto=${p.dept}`],
    ...(p.sub ? [[p.sub, `/tienda?depto=${p.dept}&sub=${encodeURIComponent(p.sub)}`]] : []),
    [p.name, `/producto/${p.slug}`],
  ];
  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map(([name, path], i) => ({ "@type": "ListItem", position: i + 1, name, item: site.url + path })),
  };

  return (
    <div className="mx-auto max-w-[90rem] px-4 pt-6 sm:px-6 lg:px-10">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd([productLd, breadcrumbLd]) }} />

      <nav aria-label="Ruta" className="label no-scrollbar flex items-center gap-1.5 overflow-x-auto whitespace-nowrap text-steel">
        <Link href="/tienda" className="hover:text-orange-deep">Tienda</Link>
        <ChevronRight className="size-3" />
        <Link href={`/tienda?depto=${p.dept}`} className="hover:text-orange-deep">{p.deptName}</Link>
        {p.sub && (
          <>
            <ChevronRight className="size-3" />
            <Link href={`/tienda?depto=${p.dept}&sub=${encodeURIComponent(p.sub)}`} className="hover:text-orange-deep">{p.sub}</Link>
          </>
        )}
      </nav>

      <div className="mt-6 grid gap-10 lg:grid-cols-[1.15fr_1fr] lg:gap-16">
        <Gallery images={p.images} name={p.name} />

        <div className="lg:sticky lg:top-32 lg:self-start">
          <div className="flex items-center gap-3">
            {p.brand && (
              <Link href={`/tienda?marca=${p.brand}`} className="label rounded-full bg-ink px-3 py-1.5 text-white hover:bg-orange-deep">
                {p.brand}
              </Link>
            )}
            <span className="label text-steel">Código {p.sku}</span>
          </div>
          <h1 className="mt-4 font-display text-3xl font-extrabold leading-[1.05] tracking-tight sm:text-4xl">{p.name}</h1>

          <div className="mt-6 flex items-end justify-between border-y border-line py-5">
            <div>
              <p className="label text-steel">Precio</p>
              <p className="display mt-1 whitespace-nowrap text-4xl sm:text-5xl">{formatBs(p.price)}</p>
            </div>
            <p className="max-w-36 text-right text-xs text-steel-2">Stock sujeto a confirmación por WhatsApp</p>
          </div>

          <div className="mt-6">
            <BuyBox p={lite(p)} />
          </div>

          {p.description && <p className="mt-8 text-[0.9375rem] leading-relaxed text-steel">{p.description}</p>}

          {p.features.length > 0 && (
            <div className="mt-8">
              <h2 className="label text-steel">Características</h2>
              <ul className="mt-3 space-y-2">
                {p.features.map((f) => (
                  <li key={f} className="flex gap-3 text-[0.9375rem]">
                    <span className="mt-2 size-1.5 shrink-0 rounded-full bg-orange" /> {f}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <ul className="mt-8 divide-y divide-line rounded-2xl border border-line bg-white text-sm">
            <li className="flex items-center gap-3 px-5 py-4">
              <MessageSquareText className="size-5 shrink-0 text-orange" />
              <span>Pides en la web y <strong>confirmas con un asesor</strong> por WhatsApp.</span>
            </li>
            <li className="flex items-center gap-3 px-5 py-4">
              <Store className="size-5 shrink-0 text-orange" />
              <span>
                Retiro en showroom ({site.address[0]}) o envío a todo Bolivia.{" "}
                <Link href="/politicas" className="underline underline-offset-4 hover:text-orange-deep">
                  Cambios en {site.returnDays} días y garantía de fábrica
                </Link>
                .
              </span>
            </li>
            <li className="flex items-center gap-3 px-5 py-4">
              <CalendarCheck className="size-5 shrink-0 text-orange" />
              <span>
                ¿Prefieres verlo antes? <Link href="/reservar" className="font-semibold underline underline-offset-4 hover:text-orange-deep">Reserva una visita</Link>.
              </span>
            </li>
          </ul>

          <AskButton question={`Tengo dudas sobre el producto ${p.sku} (${p.name}). ¿Para qué trabajos sirve y qué alternativas hay?`} className="mt-4 text-sm font-semibold underline underline-offset-4 hover:text-orange-deep">
            ¿Dudas? Pregúntale al asistente sobre este producto
          </AskButton>
        </div>
      </div>

      {guide && (
        <section aria-labelledby="guia" className="mt-20 grid gap-8 rounded-[1.75rem] border border-line bg-white p-6 sm:p-10 lg:grid-cols-[1fr_1.4fr] lg:gap-16">
          <div>
            <p className="label text-orange-deep">Guía de compra</p>
            <h2 id="guia" className="display mt-3 text-3xl sm:text-4xl">
              {p.sub ?? p.deptName}
            </h2>
            <p className="mt-4 text-steel">{guide.use}</p>
          </div>
          <div>
            <h3 className="label text-steel">Antes de comprar</h3>
            <ul className="mt-3 space-y-3">
              {guide.tips.map((t) => (
                <li key={t} className="flex gap-3 text-[0.9375rem]">
                  <span className="mt-2 size-1.5 shrink-0 rounded-full bg-orange" /> {t}
                </li>
              ))}
            </ul>
            <AskButton question={`¿Cuál me conviene entre los productos de ${p.sub ?? p.deptName}? Te cuento para qué lo necesito.`} className="mt-6 text-sm font-semibold underline underline-offset-4 hover:text-orange-deep">
              ¿No sabes cuál elegir? Pregúntale al asistente
            </AskButton>
          </div>
        </section>
      )}

      {related.length > 0 && (
        <section className="mt-24">
          <h2 className="display text-3xl sm:text-4xl">También en {p.sub ?? p.deptName}</h2>
          <div className="mt-8 grid grid-cols-2 gap-x-3 gap-y-8 md:grid-cols-3 lg:grid-cols-5">
            {related.map((r) => (
              <ProductCard key={r.slug} p={lite(r)} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
