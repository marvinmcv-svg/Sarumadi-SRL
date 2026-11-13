// Single source of truth for business details. Edit here, not in components.
export const site = {
  name: "Sarumadi SRL",
  tagline: "Un mundo de soluciones",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://tienda.sarumadi.com",
  // Number behind the current site's wa.link/ob36xg
  whatsapp: "59169432135",
  whatsappDisplay: "+591 69432135",
  email: "ventas@sarumadi.com",
  address: ["Av. G77 + China", "Barrio Libertad Norte s/n", "Santa Cruz de la Sierra, Bolivia"],
  mapsUrl: "https://www.google.com/maps/search/?api=1&query=Sarumadi+SRL+Santa+Cruz+Bolivia",
  social: {
    instagram: "https://www.instagram.com/sarumadi.bo",
    facebook: "https://www.facebook.com/sarumadi.bo",
    youtube: "https://www.youtube.com/@TioBladyTeEnse%C3%B1a",
  },
  // ASSUMPTION: opening hours are not published on the current site.
  // Confirm with the store and adjust; the booking calendar reads from here.
  hours: {
    // 0 = Sunday ... 6 = Saturday; [openHour, closeHour] in 24h local time
    1: [8.5, 18.5],
    2: [8.5, 18.5],
    3: [8.5, 18.5],
    4: [8.5, 18.5],
    5: [8.5, 18.5],
    6: [8.5, 12.5],
  } as Record<number, [number, number]>,
  hoursLabel: "Lun a Vie 8:30 – 18:30 · Sáb 8:30 – 12:30",
} as const;

export const brands = [
  { slug: "truper", name: "Truper", blurb: "Herramientas con la mejor relación calidad-precio." },
  { slug: "pretul", name: "Pretul", blurb: "Productos caseros diseñados para uso ligero y labores en el hogar." },
  { slug: "foset", name: "Foset", blurb: "Grifería y plomería, con 5 líneas que cubren todas las necesidades." },
  { slug: "volteck", name: "Volteck", blurb: "Productos eléctricos para el mercado ferretero." },
  { slug: "hermex", name: "Hermex", blurb: "Cerrajería con la más alta calidad y diseño." },
  { slug: "fiero", name: "Fiero", blurb: "Productos de acero para la industria ferretera." },
  { slug: "klintek", name: "Klintek", blurb: "Artículos de limpieza para el hogar y la industria." },
] as const;

export function waLink(text: string) {
  return `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(text)}`;
}
