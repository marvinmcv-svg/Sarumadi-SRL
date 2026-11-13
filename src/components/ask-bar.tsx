"use client";

import { useState } from "react";
import { ArrowRight, Sparkles } from "lucide-react";

export const openAssistant = (question?: string) => window.dispatchEvent(new CustomEvent("sarumadi:chat", { detail: question }));

export function AskBar() {
  const [q, setQ] = useState("");
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        openAssistant(q.trim() || undefined);
        setQ("");
      }}
      className="flex h-14 w-full max-w-xl items-center gap-3 rounded-full bg-white pl-5 pr-1.5 text-ink shadow-2xl shadow-black/30"
    >
      <Sparkles className="size-5 shrink-0 text-orange" />
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Describe tu trabajo: “cortar cerámica”, “asegurar un portón”…"
        aria-label="Pregunta al asistente"
        className="h-full min-w-0 flex-1 bg-transparent text-base outline-none placeholder:text-steel-2"
      />
      <button type="submit" aria-label="Preguntar al asistente" className="grid size-11 shrink-0 place-items-center rounded-full bg-orange text-white transition-colors hover:bg-orange-deep">
        <ArrowRight className="size-5" />
      </button>
    </form>
  );
}

export function AskButton({ children, question, className }: { children: React.ReactNode; question?: string; className?: string }) {
  return (
    <button onClick={() => openAssistant(question)} className={className}>
      {children}
    </button>
  );
}
