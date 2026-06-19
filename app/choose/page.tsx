"use client";

import { useState } from "react";
import Link from "next/link";
import {
  buildPairSlug,
  calcTco,
  getSafety,
  usd,
  vehicles,
  type Vehicle,
} from "@/lib/vehicles";
import { useProfile } from "@/components/profile";
import GarageButton from "@/components/GarageButton";

type PriorityKey = "totalCost" | "fuel" | "cargo" | "performance" | "safety" | "price";

const PRIORITIES: { key: PriorityKey; label: string }[] = [
  { key: "totalCost", label: "Low total cost" },
  { key: "fuel", label: "Fuel economy" },
  { key: "cargo", label: "Cargo space" },
  { key: "performance", label: "Performance" },
  { key: "safety", label: "Clean safety record" },
  { key: "price", label: "Low purchase price" },
];

const BODY_TYPES = ["Any", "SUV", "Sedan", "Pickup", "Coupe"];
const BUDGETS = [
  { label: "Up to $25k", value: 25000 },
  { label: "Up to $30k", value: 30000 },
  { label: "Up to $35k", value: 35000 },
  { label: "Up to $45k", value: 45000 },
  { label: "No limit", value: Infinity },
];

interface Scored {
  v: Vehicle;
  score: number;
  reasons: string[];
}

function rank(
  budget: number,
  bodyType: string,
  priorities: PriorityKey[],
  profile: { milesPerYear: number; years: number; gasPricePerGallon: number; electricityPerKwh: number }
): Scored[] {
  let pool = vehicles.filter((v) => v.msrp <= budget);
  if (bodyType !== "Any")
    pool = pool.filter((v) => v.bodyType.toLowerCase().includes(bodyType.toLowerCase()));
  if (pool.length === 0) return [];

  const active = priorities.length > 0 ? priorities : (["totalCost"] as PriorityKey[]);

  const metrics = pool.map((v) => {
    const tco = calcTco(v, profile);
    const s = getSafety(v.slug);
    return {
      v,
      tco,
      raw: {
        totalCost: -tco.total,
        fuel: -tco.fuel,
        cargo: v.cargoCuFt,
        performance: v.horsepower,
        safety: -((s?.complaintsCount ?? 0) + (s?.recallsCount ?? 0) * 30),
        price: -v.msrp,
      } as Record<PriorityKey, number>,
    };
  });

  const norm = (key: PriorityKey) => {
    const vals = metrics.map((m) => m.raw[key]);
    const min = Math.min(...vals);
    const max = Math.max(...vals);
    return (x: number) => (max === min ? 1 : (x - min) / (max - min));
  };
  const normFns = Object.fromEntries(active.map((k) => [k, norm(k)])) as Record<
    PriorityKey,
    (x: number) => number
  >;

  const reasonText = (key: PriorityKey, m: (typeof metrics)[0]): string => {
    switch (key) {
      case "totalCost":
        return `${usd(m.tco.total)} total over ${profile.years} years - among the lowest here`;
      case "fuel":
        return `${m.v.mpgCombined} ${m.v.fuelType === "ev" ? "MPGe" : "MPG"} → ${usd(m.tco.fuel)} on fuel over ${profile.years} years`;
      case "cargo":
        return `${m.v.cargoCuFt} cu ft of cargo space`;
      case "performance":
        return `${m.v.horsepower} hp`;
      case "safety": {
        const s = getSafety(m.v.slug);
        return `${s?.recallsCount ?? 0} recalls, ${s?.complaintsCount ?? 0} NHTSA complaints for ${m.v.year}`;
      }
      case "price":
        return `${usd(m.v.msrp)} MSRP`;
    }
  };

  return metrics
    .map((m) => {
      const perKey = active.map((k) => ({ k, val: normFns[k](m.raw[k]) }));
      const score = perKey.reduce((sum, x) => sum + x.val, 0) / active.length;
      const reasons = perKey
        .filter((x) => x.val >= 0.66)
        .slice(0, 3)
        .map((x) => reasonText(x.k, m));
      return { v: m.v, score, reasons };
    })
    .sort((x, y) => y.score - x.score);
}

export default function ChoosePage() {
  const [profile] = useProfile();
  const [budget, setBudget] = useState(35000);
  const [bodyType, setBodyType] = useState("Any");
  const [priorities, setPriorities] = useState<PriorityKey[]>(["totalCost"]);
  const [submitted, setSubmitted] = useState(false);

  const togglePriority = (k: PriorityKey) =>
    setPriorities((p) => (p.includes(k) ? p.filter((x) => x !== k) : [...p, k]));

  const results = submitted ? rank(budget, bodyType, priorities, profile).slice(0, 3) : [];

  return (
    <div className="mx-auto max-w-3xl px-4">
      <section className="py-12">
        <h1 className="text-3xl font-bold tracking-tight">Help me choose</h1>
        <p className="mt-3 text-ink-soft">
          Answer three questions - we'll rank every car in our database against your priorities
          using EPA data, NHTSA records and our cost model ({profile.milesPerYear.toLocaleString()}{" "}
          mi/yr, {profile.years} years - adjustable on any comparison page).
        </p>
      </section>

      <section className="mb-8 space-y-6 rounded-xl border border-slate-200 p-5 sm:p-6">
        <div>
          <p className="mb-2 text-sm font-semibold">Budget</p>
          <div className="flex flex-wrap gap-2">
            {BUDGETS.map((b) => (
              <button
                key={b.label}
                onClick={() => setBudget(b.value)}
                className={
                  "rounded-full border px-4 py-1.5 text-sm transition " +
                  (budget === b.value
                    ? "border-brand bg-brand-light font-medium text-brand-dark"
                    : "border-slate-200 text-ink-soft hover:border-brand")
                }
              >
                {b.label}
              </button>
            ))}
          </div>
        </div>
        <div>
          <p className="mb-2 text-sm font-semibold">Body type</p>
          <div className="flex flex-wrap gap-2">
            {BODY_TYPES.map((t) => (
              <button
                key={t}
                onClick={() => setBodyType(t)}
                className={
                  "rounded-full border px-4 py-1.5 text-sm transition " +
                  (bodyType === t
                    ? "border-brand bg-brand-light font-medium text-brand-dark"
                    : "border-slate-200 text-ink-soft hover:border-brand")
                }
              >
                {t}
              </button>
            ))}
          </div>
        </div>
        <div>
          <p className="mb-2 text-sm font-semibold">What matters most? (pick up to 3)</p>
          <div className="flex flex-wrap gap-2">
            {PRIORITIES.map((p) => (
              <button
                key={p.key}
                onClick={() => togglePriority(p.key)}
                disabled={!priorities.includes(p.key) && priorities.length >= 3}
                className={
                  "rounded-full border px-4 py-1.5 text-sm transition disabled:opacity-40 " +
                  (priorities.includes(p.key)
                    ? "border-brand bg-brand-light font-medium text-brand-dark"
                    : "border-slate-200 text-ink-soft hover:border-brand")
                }
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>
        <button
          onClick={() => setSubmitted(true)}
          className="w-full rounded-lg bg-brand px-5 py-3 text-sm font-semibold text-white transition hover:bg-brand-dark sm:w-auto"
        >
          Show my top 3
        </button>
      </section>

      {submitted && results.length === 0 && (
        <p className="rounded-xl border border-dashed border-slate-300 p-8 text-center text-ink-soft">
          Nothing in our database fits that budget and body type yet - try widening the budget.
        </p>
      )}

      {results.length > 0 && (
        <section className="space-y-5">
          <h2 className="text-2xl font-semibold tracking-tight">
            Your top {results.length} car comparison matches
          </h2>
          {results.map((r, i) => (
            <div key={r.v.slug} className="rounded-xl border border-slate-200 p-5 sm:p-6">
              <div className="mb-2 flex flex-wrap items-baseline justify-between gap-2">
                <p className="text-lg font-semibold">
                  <span className="mr-2 text-brand">#{i + 1}</span>
                  {r.v.year} {r.v.make} {r.v.model}
                  <span className="ml-2 text-sm font-normal text-ink-faint">{r.v.trim}</span>
                </p>
                <p className="text-sm text-ink-soft">{usd(r.v.msrp)} MSRP</p>
              </div>
              {r.reasons.length > 0 && (
                <ul className="mb-3 space-y-1 text-sm text-ink-soft">
                  {r.reasons.map((reason) => (
                    <li key={reason}>✓ {reason}</li>
                  ))}
                </ul>
              )}
              <div className="flex flex-wrap items-center gap-3">
                <GarageButton slug={r.v.slug} label={r.v.model} />
                {i > 0 && (
                  <Link
                    href={`/compare/${buildPairSlug(results[0].v.slug, r.v.slug)}`}
                    className="text-sm font-medium text-brand hover:text-brand-dark"
                  >
                    Compare with #{1} →
                  </Link>
                )}
              </div>
            </div>
          ))}
          {results.length >= 2 && (
            <Link
              href={`/compare/${buildPairSlug(results[0].v.slug, results[1].v.slug)}`}
              className="inline-block rounded-lg border border-brand px-5 py-2.5 text-sm font-semibold text-brand-dark transition hover:bg-brand-light"
            >
              Full comparison: #1 vs #2 →
            </Link>
          )}
        </section>
      )}
    </div>
  );
}
