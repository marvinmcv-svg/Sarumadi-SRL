import type { Metadata } from "next";
import Link from "next/link";
import { WhatsAppIcon } from "@/components/icons";
import { site, waLink } from "@/lib/site";

export const metadata: Metadata = {
  title: "Envíos, cambios, garantía y privacidad",
  description: `Cómo entregamos tus pedidos, cambios y devoluciones dentro de ${site.returnDays} días, garantía de fábrica y uso de tus datos en Sarumadi SRL.`,
  alternates: { canonical: "/politicas" },
};

const sections = [
  { id: "envios", title: "Envíos y retiro" },
  { id: "cambios", title: "Cambios y devoluciones" },
  { id: "garantia", title: "Garantía" },
  { id: "privacidad", title: "Privacidad" },
];

const link = "font-semibold text-ink underline underline-offset-4 hover:text-orange-deep";

export default function Politicas() {
  return (
    <div className="mx-auto max-w-[80rem] px-4 pt-10 sm:px-6 lg:px-10">
      <p className="label flex items-center gap-2 text-orange-deep">
        <span className="h-px w-8 bg-orange" /> Políticas de la tienda
      </p>
      <h1 className="display mt-4 text-4xl sm:text-7xl">Compra con tranquilidad</h1>
      <p className="mt-4 max-w-2xl text-lg text-steel">Lo que necesitas saber sobre entregas, cambios, garantía y tus datos. Si algo no queda claro, escríbenos por WhatsApp.</p>

      <div className="mt-12 grid gap-10 lg:grid-cols-[14rem_1fr] lg:gap-16">
        <nav aria-label="Secciones" className="lg:sticky lg:top-32 lg:self-start">
          <ul className="flex flex-wrap gap-2 lg:flex-col lg:gap-1">
            {sections.map((s) => (
              <li key={s.id}>
                <a
                  href={`#${s.id}`}
                  className="block rounded-full border border-line bg-white px-3.5 py-1.5 text-sm hover:border-ink lg:rounded-none lg:border-0 lg:bg-transparent lg:px-0 lg:text-[0.9375rem] lg:hover:text-orange-deep"
                >
                  {s.title}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="policy min-w-0 max-w-3xl space-y-16">
          <section id="envios">
            <h2>Envíos y retiro</h2>
            <p>La web no cobra en línea: al enviar tu pedido por WhatsApp, un asesor confirma stock, forma de pago, costo de envío y plazo antes de despachar.</p>
            <h3>Retiro en showroom</h3>
            <p>
              Sin costo, en {site.address[0]}, {site.address[1]}, en horario de atención ({site.hoursLabel}). Si quieres asegurar una hora, puedes{" "}
              <Link href="/reservar" className={link}>
                reservar el retiro
              </Link>
              .
            </p>
            <h3>Entrega en Santa Cruz de la Sierra</h3>
            <p>Llevamos tu pedido a tu casa, obra, taller o ferretería. El costo y el plazo dependen de la zona y del volumen, y se confirman por WhatsApp.</p>
            <h3>Envíos al resto de Bolivia</h3>
            <p>Despachamos a otras ciudades mediante empresas de transporte o encomienda. Te informamos el costo y el tiempo estimado antes de enviar, y te compartimos los datos del envío para que lo sigas.</p>
          </section>

          <section id="cambios">
            <h2>Cambios y devoluciones</h2>
            <p>
              Puedes cambiar o devolver un producto dentro de los <strong>{site.returnDays} días</strong> siguientes a la compra o entrega, siempre que:
            </p>
            <ul>
              <li>no haya sido usado ni instalado,</li>
              <li>esté en su empaque original, completo, con sus accesorios y manuales, y</li>
              <li>presentes la factura o nota de venta.</li>
            </ul>
            <h3>Cómo hacerlo</h3>
            <p>Escríbenos por WhatsApp con el número de pedido (por ejemplo, SR-AB12C) y el motivo. Coordinamos contigo la revisión del producto en el showroom y el cambio o la devolución.</p>
            <p>
              Si el producto llegó dañado o tiene una falla, no se trata como devolución sino como garantía: mira la sección <a href="#garantia" className={link}>Garantía</a>.
            </p>
          </section>

          <section id="garantia">
            <h2>Garantía</h2>
            <p>Todos los productos que vendemos tienen la garantía de su fabricante (Truper, Pretul, Foset, Volteck, Hermex, Fiero o Klintek). El plazo y las condiciones dependen de cada marca y producto.</p>
            <h3>Cómo usar la garantía</h3>
            <ul>
              <li>Trae el producto con su factura o nota de venta a nuestro showroom.</li>
              <li>Revisamos la falla y gestionamos la garantía con el fabricante por ti.</li>
              <li>Te avisamos por WhatsApp cuando el producto reparado o de reemplazo esté listo.</li>
            </ul>
            <p>Según las condiciones de cada fabricante, la garantía no suele cubrir el desgaste normal, el mal uso, los golpes, las modificaciones ni las reparaciones hechas por terceros.</p>
          </section>

          <section id="privacidad">
            <h2>Privacidad</h2>
            <p>No necesitas crear una cuenta para comprar. Esto es lo que pasa con tu información:</p>
            <ul>
              <li>
                <strong>Carrito:</strong> se guarda solo en tu navegador, no en nuestros servidores.
              </li>
              <li>
                <strong>Pedidos, reservas y consultas:</strong> los datos que escribes (nombre, celular, dirección, NIT) nos llegan por WhatsApp y los usamos solo para atender tu pedido o consulta.
              </li>
              <li>
                <strong>Asistente con IA:</strong> tus mensajes se envían a Anthropic, el proveedor del modelo, para generar la respuesta. No escribas datos personales en el chat.
              </li>
              <li>
                <strong>Estadísticas:</strong> medimos las visitas de forma anónima y sin cookies para mejorar la tienda.
              </li>
            </ul>
            <p>
              Para consultar o pedir que borremos tus datos, escríbenos a{" "}
              <a href={`mailto:${site.email}`} className={link}>
                {site.email}
              </a>
              .
            </p>
          </section>

          <a
            href={waLink("Hola Sarumadi, tengo una consulta sobre envíos, cambios o garantía.")}
            target="_blank"
            rel="noreferrer"
            className="inline-flex h-14 items-center gap-3 rounded-full bg-wa px-7 font-semibold text-white"
          >
            <WhatsAppIcon /> Consultar por WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
}
