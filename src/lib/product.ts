// Client-safe product types and helpers (no catalog data imported here).
export type Product = {
  id: number;
  slug: string;
  name: string;
  sku: string;
  brand: string | null;
  price: number;
  dept: string;
  deptName: string;
  sub: string | null;
  images: string[];
  rating: number | null;
  features: string[];
};

/** What client components need to list, filter and add to cart. */
export type ProductLite = Pick<Product, "slug" | "name" | "sku" | "brand" | "price" | "dept" | "sub" | "images">;

const bs = new Intl.NumberFormat("es-BO", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
export const formatBs = (n: number) => `Bs ${bs.format(n)}`;

export const img = (file: string | undefined) => (file ? `/products/${file}` : "/brand/icon.png");

export const fold = (s: string) =>
  s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase();

const stem = (w: string) => (w.length > 4 && w.endsWith("s") ? w.slice(0, -1) : w);

export const queryWords = (q: string) =>
  fold(q)
    .split(/[^a-z0-9]+/)
    .filter((w) => w.length > 1)
    .map(stem);

/** Every query word must appear in name, SKU, brand or subcategory. */
export function matches(p: ProductLite, query: string) {
  const hay = fold(`${p.name} ${p.sku} ${p.brand ?? ""} ${p.sub ?? ""}`);
  return queryWords(query).every((w) => hay.includes(w));
}
