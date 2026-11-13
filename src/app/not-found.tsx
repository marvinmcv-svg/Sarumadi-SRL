import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-xl px-4 py-28 text-center">
      <p className="display text-8xl text-orange">404</p>
      <h1 className="display mt-4 text-4xl">Esta pieza no está en el estante</h1>
      <p className="mt-4 text-steel">La página que buscas no existe o cambió de lugar.</p>
      <Link href="/tienda" className="mt-8 inline-flex h-12 items-center rounded-full bg-ink px-7 font-semibold text-white hover:bg-orange-deep">
        Ir a la tienda
      </Link>
    </div>
  );
}
