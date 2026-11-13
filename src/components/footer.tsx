import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { departments } from "@/lib/catalog";
import { brands, site, waLink } from "@/lib/site";
import { Logo, WhatsAppIcon } from "./icons";

export function Footer() {
  return (
    <footer className="slatwall mt-24 bg-ink text-white">
      <div className="mx-auto max-w-[90rem] px-4 sm:px-6 lg:px-10">
        <div className="flex flex-col justify-between gap-8 border-b border-white/10 py-14 lg:flex-row lg:items-end">
          <p className="display max-w-3xl text-4xl sm:text-6xl">
            ¿No encuentras la pieza? <span className="text-orange">Escríbenos.</span>
          </p>
          <a
            href={waLink("Hola Sarumadi, estoy buscando un producto que no encuentro en la web.")}
            target="_blank"
            rel="noreferrer"
            className="flex h-14 shrink-0 items-center gap-3 self-start rounded-full bg-wa px-7 text-base font-semibold text-white transition-transform hover:-translate-y-0.5 lg:self-auto"
          >
            <WhatsAppIcon />
            Chatear por WhatsApp
          </a>
        </div>

        <div className="grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <Logo light />
            <address className="mt-6 space-y-1 text-sm not-italic text-white/70">
              {site.address.map((l) => (
                <p key={l}>{l}</p>
              ))}
              <p className="pt-3">{site.hoursLabel}</p>
              <p className="pt-3">
                <a href={`mailto:${site.email}`} className="text-white hover:text-orange">
                  {site.email}
                </a>
              </p>
            </address>
          </div>

          <FooterCol title="Departamentos">
            {departments.slice(0, 7).map((d) => (
              <Link key={d.slug} href={`/tienda?depto=${d.slug}`} className="hover:text-orange">
                {d.name}
              </Link>
            ))}
          </FooterCol>

          <FooterCol title="Marcas">
            {brands.map((b) => (
              <Link key={b.slug} href={`/tienda?marca=${b.name}`} className="hover:text-orange">
                {b.name}
              </Link>
            ))}
          </FooterCol>

          <FooterCol title="Sarumadi">
            <Link href="/reservar" className="hover:text-orange">Reservar visita</Link>
            <Link href="/nosotros" className="hover:text-orange">Quiénes somos</Link>
            <Link href="/contacto" className="hover:text-orange">Contacto</Link>
            <Link href="/#preguntas" className="hover:text-orange">Preguntas frecuentes</Link>
            <Link href="/politicas#envios" className="hover:text-orange">Envíos</Link>
            <Link href="/politicas#cambios" className="hover:text-orange">Cambios y garantía</Link>
            <Link href="/politicas#privacidad" className="hover:text-orange">Privacidad</Link>
            {Object.entries(site.social).map(([k, url]) => (
              <a key={k} href={url} target="_blank" rel="noreferrer" className="flex items-center gap-1 capitalize hover:text-orange">
                {k} <ArrowUpRight className="size-3.5" />
              </a>
            ))}
          </FooterCol>
        </div>

        <div className="label flex flex-col justify-between gap-2 border-t border-white/10 py-6 text-white/50 sm:flex-row">
          <span>© Sarumadi SRL · Santa Cruz de la Sierra</span>
          <span>Precios en bolivianos (Bs) · Sujetos a confirmación de stock</span>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="label mb-4 text-orange">{title}</h3>
      <div className="flex flex-col gap-2.5 text-sm text-white/75">{children}</div>
    </div>
  );
}
