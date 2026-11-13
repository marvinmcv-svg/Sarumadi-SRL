import data from "@/data/products.json";
// Drafted by `npm run describe` for products the store left without a description.
import drafts from "@/data/descriptions.json";
import { fold, queryWords, type Product, type ProductLite } from "./product";

export type { Product, ProductLite };

const extra = drafts as Record<string, string>;
export const products = (data as Product[]).map((p) => (p.description || !extra[p.slug] ? p : { ...p, description: extra[p.slug] }));

export const lite = (p: Product): ProductLite => ({
  slug: p.slug,
  name: p.name,
  sku: p.sku,
  brand: p.brand,
  price: p.price,
  dept: p.dept,
  sub: p.sub,
  images: p.images.slice(0, 2),
});

export const departments = (() => {
  const map = new Map<string, { slug: string; name: string; count: number; cover: string }>();
  for (const p of products) {
    const d = map.get(p.dept);
    if (d) d.count++;
    else map.set(p.dept, { slug: p.dept, name: p.deptName, count: 1, cover: p.images[0] });
  }
  return [...map.values()].sort((a, b) => b.count - a.count);
})();

export const getProduct = (slug: string) => products.find((p) => p.slug === slug);

/** Ranked search for the assistant: rewards matches in the name over the category. */
export function search(query: string, opts: { brand?: string; maxPrice?: number; limit?: number } = {}) {
  const words = queryWords(query);
  const scored: [number, Product][] = [];
  for (const p of products) {
    if (opts.brand && fold(p.brand ?? "") !== fold(opts.brand)) continue;
    if (opts.maxPrice && p.price > opts.maxPrice) continue;
    const name = fold(p.name);
    const rest = fold(`${p.sku} ${p.brand ?? ""} ${p.sub ?? ""} ${p.deptName}`);
    let score = 0;
    for (const w of words) score += name.includes(w) ? 3 : rest.includes(w) ? 1 : 0;
    if (score > 0 || words.length === 0) scored.push([score, p]);
  }
  return scored
    .sort((a, b) => b[0] - a[0])
    .slice(0, opts.limit ?? 8)
    .map(([, p]) => p);
}
