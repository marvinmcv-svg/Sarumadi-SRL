import type { Metadata } from "next";
import { Checkout } from "@/components/checkout";

export const metadata: Metadata = { title: "Finalizar pedido", robots: { index: false } };

export default function CheckoutPage() {
  return (
    <div className="mx-auto max-w-[80rem] px-4 pt-10 sm:px-6 lg:px-10">
      <Checkout />
    </div>
  );
}
