import type { Metadata, Viewport } from "next";
import { Suspense } from "react";
import { Analytics } from "@vercel/analytics/next";
import "@fontsource-variable/archivo/wdth.css";
import "@fontsource-variable/inter-tight";
import "@fontsource/jetbrains-mono/400.css";
import "@fontsource/jetbrains-mono/500.css";
import "./globals.css";
import { CartProvider } from "@/components/cart";
import { CartDrawer } from "@/components/cart-drawer";
import { ChatWidget } from "@/components/chat-widget";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: "Sarumadi SRL — Truper, Pretul, Foset y más en Santa Cruz, Bolivia", template: "%s · Sarumadi SRL" },
  description:
    "Herramientas, cerrajería, grifería, electricidad y seguridad industrial. Distribuidor de Truper, Pretul, Foset, Volteck, Hermex, Fiero y Klintek con showroom en Santa Cruz de la Sierra.",
  icons: { icon: "/brand/icon.png" },
  openGraph: { type: "website", locale: "es_BO", siteName: site.name, images: ["/showroom/pasillo.webp"] },
};

export const viewport: Viewport = { themeColor: "#14171a" };

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="es" className="h-full antialiased">
      <body className="flex min-h-full flex-col overflow-x-clip">
        <CartProvider>
          <a href="#contenido" className="sr-only focus:not-sr-only focus:fixed focus:left-3 focus:top-3 focus:z-[100] focus:bg-ink focus:px-4 focus:py-2 focus:text-white">
            Saltar al contenido
          </a>
          <Header />
          <main id="contenido" className="flex-1">
            {children}
          </main>
          <Footer />
          <CartDrawer />
          <ChatWidget />
          {/* Anonymous, cookieless page views (Vercel Web Analytics). */}
          <Suspense>
            <Analytics />
          </Suspense>
        </CartProvider>
      </body>
    </html>
  );
}
