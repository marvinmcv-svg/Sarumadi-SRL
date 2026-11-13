import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { ProductCard } from "@/components/product-card";
import { Shop } from "@/components/shop";
import { departments, lite, products } from "@/lib/catalog";
import { brands } from "@/lib/site";

export const metadata: Metadata = {
  title: "Tienda en línea",
  description: "Catálogo de herramientas, cerrajería, grifería, electricidad y seguridad industrial con precios en bolivianos.",
  alternates: { canonical: "/tienda" },
};

const items = products.map(lite);

export default function Tienda() {
  return (
    <Suspense fallback={<StaticShop />}>
      <Shop items={items} departments={departments} brands={brands.map((b) => b.name)} />
    </Suspense>
  );
}

/**
 * Prerendered stand-in while the filterable shop (which reads the URL) loads.
 * It is also what crawlers see, so it carries real product and department links.
 */
function StaticShop() {
  return (
    <div className="mx-auto max-w-[90rem] px-4 pt-10 sm:px-6 lg:px-10">
      <p className="label flex items-center gap-2 text-orange-deep">
        <span className="h-px w-8 bg-orange" /> Tienda en línea
      </p>
      <h1 className="display mt-4 text-5xl sm:text-7xl">Todo el catálogo</h1>
      <nav aria-label="Departamentos" className="mt-8 flex flex-wrap gap-2">
        {departments.map((d) => (
          <Link key={d.slug} href={`/tienda?depto=${d.slug}`} className="rounded-full border border-line bg-white px-3.5 py-1.5 text-sm hover:border-ink">
            {d.name}
          </Link>
        ))}
      </nav>
      <div className="mt-8 grid grid-cols-2 gap-x-3 gap-y-8 md:grid-cols-3 xl:grid-cols-4">
        {items.slice(0, 24).map((p, i) => (
          <ProductCard key={p.slug} p={p} priority={i < 4} />
        ))}
      </div>
    </div>
  );
}
