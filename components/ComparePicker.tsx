"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { buildPairSlug, vehicles } from "@/lib/vehicles";

export default function ComparePicker() {
  const router = useRouter();
  const [a, setA] = useState(vehicles[0].slug);
  const [b, setB] = useState(vehicles[1].slug);
  const same = a === b;

  const selectCls =
    "w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm focus:border-brand focus:outline-none";

  return (
    <div className="mx-auto mt-8 max-w-2xl rounded-xl border border-slate-200 p-4 sm:p-5">
      <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
        <select aria-label="First car" className={selectCls} value={a} onChange={(e) => setA(e.target.value)}>
          {vehicles.map((v) => (
            <option key={v.slug} value={v.slug}>
              {v.year} {v.make} {v.model} ({v.trim})
            </option>
          ))}
        </select>
        <span className="shrink-0 text-center text-sm font-medium text-ink-faint">vs</span>
        <select aria-label="Second car" className={selectCls} value={b} onChange={(e) => setB(e.target.value)}>
          {vehicles.map((v) => (
            <option key={v.slug} value={v.slug}>
              {v.year} {v.make} {v.model} ({v.trim})
            </option>
          ))}
        </select>
        <button
          onClick={() => router.push(`/compare/${buildPairSlug(a, b)}`)}
          disabled={same}
          className="shrink-0 rounded-lg bg-brand px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-dark disabled:cursor-not-allowed disabled:opacity-40"
        >
          Compare
        </button>
      </div>
      {same && (
        <p className="mt-2 text-center text-xs text-ink-faint">Pick two different cars to compare.</p>
      )}
    </div>
  );
}
