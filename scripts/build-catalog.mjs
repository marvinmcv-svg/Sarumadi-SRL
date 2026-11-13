// Rebuilds src/data/products.json and public/products/* from the live
// WooCommerce Store API of tienda.sarumadi.com.  Usage: npm run catalog
import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const API = "https://tienda.sarumadi.com/wp-json/wc/store/v1";
const OUT_JSON = "src/data/products.json";
const OUT_IMG = "public/products";
const SKIP_IMAGES = process.argv.includes("--no-images");

const BRANDS = { TR: "Truper", PR: "Pretul", HR: "Hermex", FI: "Fiero", VO: "Volteck", FO: "Foset", KL: "Klintek" };

// WooCommerce root category -> storefront department
const DEPTS = [
  ["herramientas-mecanicas", "Herramientas mecánicas", /^(HERRAMIENTAS MECANICAS|ARCOS MECANICOS|ACCESORIOS HERRAMIENTAS)/],
  ["carpinteria", "Carpintería", /CARPINTER/],
  ["construccion", "Construcción y medición", /CONSTRUCCI|PICOTAS|BASCULAS/],
  ["cerrajeria", "Cerrajería y herrajes", /CERRAJERIA/],
  ["acero-y-fijacion", "Acero y fijación", /ACERO|CHINCHES|COLGADORES|TACHUELAS/],
  ["plomeria", "Grifería y plomería", /GRIFERIA|PLOMERIA/],
  ["electricidad", "Electricidad e iluminación", /ELÉCTRICOS|ELECTRICOS/],
  ["seguridad", "Seguridad industrial", /SEGURIDAD INDUSTRIAL/],
  ["jardineria", "Jardinería y riego", /JARDINERIA|RIEGO|PODAR/],
  ["neumatica", "Aire y pintura", /COMPRESORES|PISTOLA DE AIRE/],
  ["limpieza", "Limpieza", /LIMPIEZA/],
];
const FALLBACK = ["mas-soluciones", "Más soluciones"];

const decode = (s) =>
  s
    .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(+n))
    .replace(/&amp;/g, "&")
    .replace(/&quot;|&ldquo;|&rdquo;/g, '"')
    .replace(/[″”]/g, '"')
    .replace(/–/g, "-")
    .replace(/\s+/g, " ")
    .trim();
const sentence = (s) => {
  const l = decode(s).toLowerCase();
  return l[0].toUpperCase() + l.slice(1);
};
const slugify = (s) =>
  s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

const fold = (s) => slugify(s);

async function getAll(pathname) {
  const out = [];
  for (let page = 1; ; page++) {
    const res = await fetch(`${API}${pathname}?per_page=100&page=${page}`);
    if (!res.ok) throw new Error(`${pathname} page ${page}: HTTP ${res.status}`);
    const rows = await res.json();
    out.push(...rows);
    if (rows.length < 100) return out;
  }
}

function bullets(html) {
  const items = [...html.matchAll(/<li[^>]*>([\s\S]*?)<\/li>/g)].map((m) => decode(m[1].replace(/<[^>]+>/g, "")));
  return [...new Set(items)].filter(Boolean);
}

/** Plain text of the description, minus any bullet list (those become `features`). */
function plainText(html) {
  const text = decode(html.replace(/<(ul|ol)[^>]*>[\s\S]*?<\/\1>/g, " ").replace(/<[^>]+>/g, " "));
  return text.length > 600 ? `${text.slice(0, 597).replace(/\s+\S*$/, "")}…` : text;
}

const [raw, cats] = await Promise.all([getAll("/products"), getAll("/products/categories")]);
const byId = new Map(cats.map((c) => [c.id, c]));
const rootOf = (id) => {
  let c = byId.get(id);
  while (c?.parent && byId.get(c.parent)) c = byId.get(c.parent);
  return c;
};

await fs.mkdir(OUT_IMG, { recursive: true });
const jobs = [];
const products = raw.map((p) => {
  const cat = p.categories[0];
  const root = cat ? rootOf(cat.id) : null;
  const rootName = decode(root?.name ?? "").toUpperCase();
  const [dept, deptName] = DEPTS.find(([, , re]) => re.test(rootName)) ?? FALLBACK;
  const sub = cat && cat.id !== root?.id ? sentence(cat.name) : null;
  const images = p.images.map((img, i) => {
    const file = `${slugify(p.sku)}-${i + 1}.webp`;
    jobs.push([img.src, path.join(OUT_IMG, file)]);
    return file;
  });
  return {
    id: p.id,
    slug: p.slug,
    name: decode(p.name),
    sku: p.sku,
    brand: BRANDS[p.sku.split("-")[0]] ?? null,
    price: Number(p.prices.price) / 10 ** p.prices.currency_minor_unit,
    dept,
    deptName,
    sub,
    images,
    rating: Number(p.average_rating) || null,
    features: bullets(p.description || ""),
    ...(() => {
      const d = plainText(p.short_description || "") || plainText(p.description || "");
      return d && fold(d) !== fold(decode(p.name)) ? { description: d } : {};
    })(),
  };
});

if (!SKIP_IMAGES) {
  let done = 0;
  let failed = 0;
  const worker = async () => {
    for (let job; (job = jobs.pop()); ) {
      const [src, dest] = job;
      try {
        await fs.access(dest);
      } catch {
        try {
          const res = await fetch(src);
          if (!res.ok) throw new Error(`HTTP ${res.status}`);
          await sharp(Buffer.from(await res.arrayBuffer()))
            .resize(800, 800, { fit: "inside", withoutEnlargement: true })
            .flatten({ background: "#ffffff" })
            .webp({ quality: 76 })
            .toFile(dest);
        } catch (e) {
          failed++;
          console.error("image failed:", src, e.message);
        }
      }
      if (++done % 100 === 0) console.log(`images ${done}`);
    }
  };
  await Promise.all(Array.from({ length: 10 }, worker));
  console.log(`images done, ${failed} failed`);
}

await fs.writeFile(OUT_JSON, JSON.stringify(products));
console.log(`${products.length} products -> ${OUT_JSON}`);
