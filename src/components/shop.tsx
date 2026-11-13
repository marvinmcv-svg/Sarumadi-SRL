"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { matches, type ProductLite } from "@/lib/product";
import { openAssistant } from "./ask-bar";
import { ProductCard } from "./product-card";

type Dept = { slug: string; name: string; count: number };
const PAGE = 24;
const sorts = { nuevo: "Más recientes", menor: "Precio: menor a mayor", mayor: "Precio: mayor a menor", az: "Nombre A–Z" } as const;
type Sort = keyof typeof sorts;
const prices = {
  "0-20": "Hasta Bs 20",
  "20-50": "Bs 20 – 50",
  "50-200": "Bs 50 – 200",
  "200-": "Más de Bs 200",
} as const;
type Price = keyof typeof prices;
const inPrice = (p: ProductLite, band: Price | "") => {
  if (!band) return true;
  const [lo, hi] = band.split("-").map((n) => (n ? Number(n) : Infinity));
  return p.price >= lo && p.price < hi;
};

export function Shop({ items, departments, brands }: { items: ProductLite[]; departments: Dept[]; brands: string[] }) {
  const params = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const q = params.get("q") ?? "";
  const depto = params.get("depto") ?? "";
  const marca = params.get("marca") ?? "";
  const sub = params.get("sub") ?? "";
  const precio = ((params.get("precio") ?? "") in prices ? params.get("precio") : "") as Price | "";
  const orden = (params.get("orden") as Sort) in sorts ? (params.get("orden") as Sort) : "nuevo";

  const [draft, setDraft] = useState(q);
  const [shown, setShown] = useState(PAGE);
  const [filtersOpen, setFiltersOpen] = useState(false);

  useEffect(() => setDraft(q), [q]);
  useEffect(() => setShown(PAGE), [q, depto, marca, sub, orden, precio]);

  const set = (changes: Record<string, string>) => {
    const next = new URLSearchParams(params);
    for (const [k, v] of Object.entries(changes)) v ? next.set(k, v) : next.delete(k);
    router.replace(`${pathname}${next.size ? `?${next}` : ""}`, { scroll: false });
  };

  // Debounced search-as-you-type
  useEffect(() => {
    if (draft === q) return;
    const t = setTimeout(() => set({ q: draft.trim() }), 250);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [draft]);

  const base = useMemo(
    () => items.filter((p) => (!q || matches(p, q)) && (!marca || p.brand === marca) && inPrice(p, precio)),
    [items, q, marca, precio],
  );
  const inDept = useMemo(() => (depto ? base.filter((p) => p.dept === depto) : base), [base, depto]);
  const subs = useMemo(() => {
    if (!depto) return [];
    const m = new Map<string, number>();
    for (const p of inDept) if (p.sub) m.set(p.sub, (m.get(p.sub) ?? 0) + 1);
    return [...m.entries()].sort((a, b) => b[1] - a[1]);
  }, [inDept, depto]);

  // Counts per price band, given every other active filter.
  const priceCounts = useMemo(() => {
    const pool = items.filter((p) => (!q || matches(p, q)) && (!marca || p.brand === marca) && (!depto || p.dept === depto) && (!sub || p.sub === sub));
    return Object.fromEntries(Object.keys(prices).map((k) => [k, pool.filter((p) => inPrice(p, k as Price)).length])) as Record<Price, number>;
  }, [items, q, marca, depto, sub]);

  const results = useMemo(() => {
    const r = sub ? inDept.filter((p) => p.sub === sub) : inDept;
    if (orden === "menor") return [...r].sort((a, b) => a.price - b.price);
    if (orden === "mayor") return [...r].sort((a, b) => b.price - a.price);
    if (orden === "az") return [...r].sort((a, b) => a.name.localeCompare(b.name, "es"));
    return r;
  }, [inDept, sub, orden]);

  const deptName = departments.find((d) => d.slug === depto)?.name;
  const chips: { label: string; clear: Record<string, string> }[] = [];
  if (q) chips.push({ label: `“${q}”`, clear: { q: "" } });
  if (deptName) chips.push({ label: deptName, clear: { depto: "", sub: "" } });
  if (sub) chips.push({ label: sub, clear: { sub: "" } });
  if (marca) chips.push({ label: marca, clear: { marca: "" } });
  if (precio) chips.push({ label: prices[precio], clear: { precio: "" } });

  const filters = (
    <div className="space-y-8">
      <FilterGroup title="Departamento">
        <FilterRow active={!depto} onClick={() => set({ depto: "", sub: "" })} label="Todos" count={base.length} />
        {departments.map((d) => {
          const n = base.filter((p) => p.dept === d.slug).length;
          return n || depto === d.slug ? (
            <div key={d.slug}>
              <FilterRow active={depto === d.slug} onClick={() => set({ depto: d.slug, sub: "" })} label={d.name} count={n} />
              {depto === d.slug && subs.length > 1 && (
                <div className="mb-2 ml-3 mt-1 border-l border-line pl-3">
                  {subs.map(([s, c]) => (
                    <FilterRow key={s} small active={sub === s} onClick={() => set({ sub: sub === s ? "" : s })} label={s} count={c} />
                  ))}
                </div>
              )}
            </div>
          ) : null;
        })}
      </FilterGroup>
      <FilterGroup title="Marca">
        <div className="flex flex-wrap gap-2">
          {brands.map((b) => (
            <button
              key={b}
              onClick={() => set({ marca: marca === b ? "" : b })}
              aria-pressed={marca === b}
              className={`rounded-full border px-3.5 py-1.5 text-sm transition-colors ${marca === b ? "border-ink bg-ink text-white" : "border-line bg-white hover:border-ink"}`}
            >
              {b}
            </button>
          ))}
        </div>
      </FilterGroup>
      <FilterGroup title="Precio">
        {Object.entries(prices).map(([k, label]) => (
          <FilterRow
            key={k}
            active={precio === k}
            onClick={() => set({ precio: precio === k ? "" : k })}
            label={label}
            count={priceCounts[k as Price]}
          />
        ))}
      </FilterGroup>
    </div>
  );

  return (
    <div className="mx-auto max-w-[90rem] px-4 pt-10 sm:px-6 lg:px-10">
      <p className="label flex items-center gap-2 text-orange-deep">
        <span className="h-px w-8 bg-orange" /> Tienda en línea
      </p>
      <h1 className="display mt-4 text-5xl sm:text-7xl">{deptName ?? (marca || "Todo el catálogo")}</h1>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-steel-2" />
          <input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            type="search"
            placeholder="Buscar por nombre, uso o código"
            aria-label="Buscar en el catálogo"
            className="h-12 w-full rounded-full border border-line bg-white pl-11 pr-4 text-base placeholder:text-steel-2 focus:border-ink focus:outline-none"
          />
        </div>
        <div className="flex gap-3">
          <button onClick={() => setFiltersOpen(true)} className="flex h-12 flex-1 items-center justify-center gap-2 rounded-full border border-line bg-white px-5 text-sm font-semibold lg:hidden">
            <SlidersHorizontal className="size-4" /> Filtros{chips.length ? ` (${chips.length})` : ""}
          </button>
          <select
            value={orden}
            onChange={(e) => set({ orden: e.target.value === "nuevo" ? "" : e.target.value })}
            aria-label="Ordenar"
            className="h-12 flex-1 rounded-full border border-line bg-white px-4 text-sm font-medium focus:border-ink focus:outline-none"
          >
            {Object.entries(sorts).map(([k, v]) => (
              <option key={k} value={k}>
                {v}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="mt-4 flex min-h-8 flex-wrap items-center gap-2">
        <span className="label mr-1 text-steel" aria-live="polite">
          {results.length} {results.length === 1 ? "producto" : "productos"}
        </span>
        {chips.map((c) => (
          <button key={c.label} onClick={() => set(c.clear)} className="flex items-center gap-1.5 rounded-full bg-ink py-1 pl-3 pr-2 text-sm text-white hover:bg-orange-deep">
            {c.label} <X className="size-3.5" aria-label="Quitar filtro" />
          </button>
        ))}
        {chips.length > 1 && (
          <button onClick={() => router.replace(pathname, { scroll: false })} className="text-sm font-medium underline underline-offset-4 hover:text-orange-deep">
            Limpiar todo
          </button>
        )}
      </div>

      <div className="mt-8 grid gap-10 lg:grid-cols-[15rem_1fr]">
        <aside className="hidden lg:block">
          <div className="sticky top-32 max-h-[calc(100dvh-9rem)] overflow-y-auto pb-4 pr-2">{filters}</div>
        </aside>

        <div>
          {results.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-line px-6 py-20 text-center">
              <p className="display text-3xl">Sin resultados</p>
              <p className="mx-auto mt-3 max-w-sm text-steel">No encontramos productos con esos filtros en la web. El showroom tiene más surtido: pregúntale al asistente o prueba con otra palabra.</p>
              <div className="mt-6 flex flex-wrap justify-center gap-3">
                <button onClick={() => router.replace(pathname, { scroll: false })} className="rounded-full border border-ink px-5 py-2.5 text-sm font-semibold">
                  Limpiar filtros
                </button>
                <button onClick={() => openAssistant(q ? `Busco: ${q}` : undefined)} className="rounded-full bg-orange px-5 py-2.5 text-sm font-semibold text-white">
                  Preguntar al asistente
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 gap-x-3 gap-y-8 md:grid-cols-3 xl:grid-cols-4">
                {results.slice(0, shown).map((p, i) => (
                  <ProductCard key={p.slug} p={p} priority={i < 4} />
                ))}
              </div>
              {shown < results.length && (
                <div className="mt-12 flex flex-col items-center gap-3">
                  <span className="label text-steel">
                    Viendo {shown} de {results.length}
                  </span>
                  <button onClick={() => setShown((n) => n + PAGE)} className="h-13 rounded-full border border-ink px-8 py-3.5 font-semibold transition-colors hover:bg-ink hover:text-white">
                    Cargar más productos
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {filtersOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-ink/50" onClick={() => setFiltersOpen(false)} />
          <div role="dialog" aria-label="Filtros" className="absolute inset-x-0 bottom-0 flex max-h-[85dvh] animate-pop flex-col rounded-t-3xl bg-paper">
            <div className="flex items-center justify-between border-b border-line px-5 py-4">
              <h2 className="display text-2xl">Filtros</h2>
              <button onClick={() => setFiltersOpen(false)} aria-label="Cerrar filtros" className="grid size-10 place-items-center rounded-full border border-line bg-white">
                <X className="size-4" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto px-5 py-6">{filters}</div>
            <div className="border-t border-line bg-white p-4">
              <button onClick={() => setFiltersOpen(false)} className="h-12 w-full rounded-full bg-ink font-semibold text-white">
                Ver {results.length} productos
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function FilterGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="label mb-3 text-steel">{title}</h2>
      {children}
    </div>
  );
}

function FilterRow({ label, count, active, onClick, small }: { label: string; count: number; active: boolean; onClick: () => void; small?: boolean }) {
  return (
    <button onClick={onClick} aria-pressed={active} className={`flex w-full items-baseline justify-between gap-3 py-1.5 text-left transition-colors hover:text-orange-deep ${small ? "text-[0.8125rem]" : "text-[0.9375rem]"} ${active ? "font-semibold text-orange-deep" : ""}`}>
      <span>{label}</span>
      <span className="font-mono text-xs text-steel-2">{count}</span>
    </button>
  );
}
