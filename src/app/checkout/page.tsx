import type { Metadata } from "next";
import { Checkout } from "@/components/checkout";
import { products } from "@/lib/catalog";

// Current prices, so carts saved before a catalog update are repriced at checkout.
const prices = Object.fromEntries(products.map((p) => [p.slug, p.price]));

export const metadata: Metadata = { title: "Finalizar pedido", robots: { index: false } };

export default function CheckoutPage() {
  return (
    <div className="mx-auto max-w-[80rem] px-4 pt-10 sm:px-6 lg:px-10">
      <Checkout prices={prices} />
    </div>
  );
}
