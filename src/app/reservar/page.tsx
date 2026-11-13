import type { Metadata } from "next";
import { Booking } from "@/components/booking";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Reservar visita al showroom",
  description: "Agenda por WhatsApp tu visita al showroom de Sarumadi en Santa Cruz: recorrido, asesoría técnica o cotización para tu empresa.",
};

export default function Reservar() {
  return (
    <div className="mx-auto max-w-[80rem] px-4 pt-10 sm:px-6 lg:px-10">
      <p className="label flex items-center gap-2 text-orange-deep">
        <span className="h-px w-8 bg-orange" /> Reservas por WhatsApp
      </p>
      <h1 className="display mt-4 text-5xl sm:text-7xl">Reserva tu visita</h1>
      <p className="mt-4 max-w-2xl text-lg text-steel">
        Elige motivo, día y hora. Te llevamos a WhatsApp con la solicitud lista y un asesor te confirma. Horario: {site.hoursLabel}.
      </p>
      <div className="mt-12">
        <Booking />
      </div>
    </div>
  );
}
