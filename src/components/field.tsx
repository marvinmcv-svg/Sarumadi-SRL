export const inputCls =
  "h-12 w-full rounded-xl border border-line bg-white px-4 text-base placeholder:text-steel-2 focus:border-ink focus:outline-none aria-[invalid=true]:border-red-600";

export function Field({ label, hint, error, children }: { label: string; hint?: string; error?: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 flex items-baseline justify-between text-sm font-medium">
        {label}
        {hint && <span className="text-xs font-normal text-steel-2">{hint}</span>}
      </span>
      {children}
      {error && <span className="mt-1 block text-sm text-red-700">{error}</span>}
    </label>
  );
}
