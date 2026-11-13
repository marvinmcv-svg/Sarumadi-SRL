import type { Metadata } from "next";
import { Suspense } from "react";
import { Shop } from "@/components/shop";
import { departments, lite, products } from "@/lib/catalog";
import { brands } from "@/lib/site";

export const metadata: Metadata = {
  title: "Tienda en línea",
  description: "Catálogo de herramientas, cerrajería, grifería, electricidad y seguridad industrial con precios en bolivianos.",
};

const items = products.map(lite);

export default function Tienda() {
  return (
    <Suspense fallback={<div className="mx-auto max-w-[90rem] px-4 pt-10 sm:px-6 lg:px-10"><p className="display text-5xl sm:text-7xl">Todo el catálogo</p></div>}>
      <Shop items={items} departments={departments} brands={brands.map((b) => b.name)} />
    </Suspense>
  );
}
