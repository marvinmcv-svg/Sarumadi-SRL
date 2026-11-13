import type { MetadataRoute } from "next";
import { departments, products } from "@/lib/catalog";
import { brands, site } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const u = (path: string) => `${site.url}${path}`;
  return [
    { url: u("/"), changeFrequency: "weekly", priority: 1 },
    { url: u("/tienda"), changeFrequency: "weekly", priority: 0.9 },
    { url: u("/reservar"), changeFrequency: "monthly", priority: 0.6 },
    { url: u("/nosotros"), changeFrequency: "yearly", priority: 0.4 },
    { url: u("/contacto"), changeFrequency: "yearly", priority: 0.5 },
    { url: u("/politicas"), changeFrequency: "yearly", priority: 0.4 },
    ...departments.map((d) => ({ url: u(`/tienda?depto=${d.slug}`), changeFrequency: "weekly" as const, priority: 0.7 })),
    ...brands.map((b) => ({ url: u(`/tienda?marca=${b.name}`), changeFrequency: "weekly" as const, priority: 0.6 })),
    ...products.map((p) => ({
      url: u(`/producto/${p.slug}`),
      changeFrequency: "weekly" as const,
      priority: 0.8,
      images: p.images.slice(0, 1).map((f) => u(`/products/${f}`)),
    })),
  ];
}
