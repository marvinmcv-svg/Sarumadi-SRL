"use client"; // Error boundaries must be Client Components

import Link from "next/link";
import { useEffect } from "react";
import { WhatsAppIcon } from "@/components/icons";
import { site, waLink } from "@/lib/site";

export default function Error({ error, retry }: { error: unknown; retry: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="mx-auto max-w-xl px-4 py-24 text-center">
      <p className="label text-orange-deep">Algo falló</p>
      <h1 className="display mt-4 text-4xl sm:text-5xl">No pudimos cargar esta página</h1>
      <p className="mt-4 text-steel">Puede ser un problema pasajero. Intenta de nuevo o escríbenos por WhatsApp al {site.whatsappDisplay}.</p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <button onClick={() => retry()} className="inline-flex h-12 items-center rounded-full bg-ink px-7 font-semibold text-white hover:bg-orange-deep">
          Intentar de nuevo
        </button>
        <Link href="/" className="inline-flex h-12 items-center rounded-full border border-ink px-7 font-semibold">
          Ir al inicio
        </Link>
        <a href={waLink("Hola Sarumadi, tuve un problema con la página web.")} target="_blank" rel="noreferrer" className="inline-flex h-12 items-center gap-2 rounded-full bg-wa px-7 font-semibold text-white">
          <WhatsAppIcon /> WhatsApp
        </a>
      </div>
    </div>
  );
}
