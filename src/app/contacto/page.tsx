import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, CalendarCheck, Clock, Mail, MapPin } from "lucide-react";
import { ContactForm } from "@/components/contact-form";
import { WhatsAppIcon } from "@/components/icons";
import { site, waLink } from "@/lib/site";

export const metadata: Metadata = { title: "Contacto", description: "Escríbenos por WhatsApp o visítanos en Av. G77 + China, Santa Cruz de la Sierra." };

export default function Contacto() {
  return (
    <div className="mx-auto max-w-[80rem] px-4 pt-10 sm:px-6 lg:px-10">
      <p className="label flex items-center gap-2 text-orange-deep">
        <span className="h-px w-8 bg-orange" /> Contáctenos
      </p>
      <h1 className="display mt-4 text-5xl sm:text-7xl">Hablemos</h1>
      <p className="mt-4 max-w-2xl text-lg text-steel">Si necesitas asesoramiento en alguna de nuestras marcas, no dudes en ponerte en contacto con nosotros.</p>

      <div className="mt-12 grid gap-10 lg:grid-cols-[1fr_1.1fr] lg:gap-16 [&>*]:min-w-0">
        <div className="space-y-3">
          <a href={waLink("Hola Sarumadi, tengo una consulta desde la web.")} target="_blank" rel="noreferrer" className="group flex items-center gap-4 rounded-2xl bg-wa p-6 text-white">
            <WhatsAppIcon className="size-8" />
            <span className="flex-1">
              <span className="label block text-white/75">WhatsApp · Respuesta más rápida</span>
              <span className="display block text-3xl">{site.whatsappDisplay}</span>
            </span>
            <ArrowUpRight className="size-6 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </a>
          <Info icon={MapPin} label="Showroom" href={site.mapsUrl}>
            {site.address.map((l) => (
              <span key={l} className="block">{l}</span>
            ))}
          </Info>
          <Info icon={Clock} label="Horario">{site.hoursLabel}</Info>
          <Info icon={Mail} label="Correo" href={`mailto:${site.email}`}>{site.email}</Info>
          <Link href="/reservar" className="flex items-center gap-4 rounded-2xl border border-ink p-6 font-semibold transition-colors hover:bg-ink hover:text-white">
            <CalendarCheck className="size-6 text-orange" /> Reservar una visita con hora
          </Link>
        </div>

        <div className="rounded-[1.75rem] border border-line bg-white p-6 sm:p-8">
          <h2 className="display text-3xl">Envíanos tu mensaje</h2>
          <p className="mt-2 text-sm text-steel">Lo recibimos por WhatsApp y te respondemos en horario de atención.</p>
          <ContactForm />
        </div>
      </div>
    </div>
  );
}

function Info({ icon: Icon, label, href, children }: { icon: typeof MapPin; label: string; href?: string; children: React.ReactNode }) {
  const body = (
    <>
      <Icon className="mt-0.5 size-5 shrink-0 text-orange" />
      <span>
        <span className="label block text-steel">{label}</span>
        <span className="mt-1 block font-medium">{children}</span>
      </span>
    </>
  );
  const cls = "flex gap-4 rounded-2xl border border-line bg-white p-6";
  return href ? (
    <a href={href} target={href.startsWith("http") ? "_blank" : undefined} rel="noreferrer" className={`${cls} transition-colors hover:border-ink`}>
      {body}
    </a>
  ) : (
    <div className={cls}>{body}</div>
  );
}
