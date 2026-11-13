"use client";

import { track } from "@vercel/analytics";
import { useState } from "react";
import { waLink } from "@/lib/site";
import { Field, inputCls } from "./field";
import { WhatsAppIcon } from "./icons";

export function ContactForm() {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [sent, setSent] = useState<string | null>(null);

  function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = Object.fromEntries(new FormData(e.currentTarget)) as Record<string, string>;
    const errs: Record<string, string> = {};
    if (f.nombre.trim().length < 3) errs.nombre = "Escribe tu nombre.";
    if (f.mensaje.trim().length < 5) errs.mensaje = "Cuéntanos en qué podemos ayudarte.";
    setErrors(errs);
    if (Object.keys(errs).length) return;
    const text = [`*Consulta web*`, "", f.mensaje.trim(), "", `Nombre: ${f.nombre.trim()}`, f.empresa.trim() ? `Empresa: ${f.empresa.trim()}` : null].filter((l) => l !== null).join("\n");
    const link = waLink(text);
    track("Consulta enviada");
    window.open(link, "_blank", "noopener");
    setSent(link);
  }

  return (
    <form onSubmit={submit} noValidate className="mt-6 space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Tu nombre" error={errors.nombre}>
          <input name="nombre" autoComplete="name" aria-invalid={!!errors.nombre} className={inputCls} />
        </Field>
        <Field label="Empresa" hint="Opcional">
          <input name="empresa" autoComplete="organization" className={inputCls} />
        </Field>
      </div>
      <Field label="Mensaje" error={errors.mensaje}>
        <textarea name="mensaje" rows={5} aria-invalid={!!errors.mensaje} className={`${inputCls} h-auto py-3`} />
      </Field>
      <button type="submit" className="flex h-13 w-full items-center justify-center gap-3 rounded-full bg-ink py-3.5 font-semibold text-white transition-colors hover:bg-orange-deep">
        <WhatsAppIcon /> Enviar por WhatsApp
      </button>
      {sent && (
        <p role="status" className="text-center text-sm text-steel">
          Abrimos WhatsApp con tu mensaje: pulsa <strong>enviar</strong> en el chat.{" "}
          <a href={sent} target="_blank" rel="noreferrer" className="font-semibold text-ink underline underline-offset-4">
            ¿No se abrió? Ábrelo aquí
          </a>
        </p>
      )}
    </form>
  );
}
