import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import ComparePicker from "@/components/ComparePicker";
import GarageButton from "@/components/GarageButton";
import TcoSection from "@/components/TcoSection";
import {
  calcTco,
  comparisons,
  dealerQuestions,
  getComparison,
  getSafety,
  resolvePair,
  usd,
  type Vehicle,
} from "@/lib/vehicles";

export function generateStaticParams() {
  return comparisons.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const cmp = resolvePair(slug);
  if (!cmp) return {};
  const a = cmp.vehicleA;
  const b = cmp.vehicleB;
  const title = `${a.year} ${a.make} ${a.model} vs ${b.make} ${b.model}: specs & 5-year cost`;
  const description = `${a.make} ${a.model} vs ${b.make} ${b.model} compared: MSRP, MPG, cargo space, NHTSA safety and true 5-year cost of ownership with real EPA data.`;
  return { title, description };
}

interface SpecRow {
  label: string;
  a: string;
  b: string;
  winner: 0 | 1 | 2;
}

function buildRows(a: Vehicle, b: Vehicle): SpecRow[] {
  const num = (x: number) => x.toLocaleString("en-US");
  const lowerWins = (x: number, y: number): 0 | 1 | 2 => (x === y ? 0 : x < y ? 1 : 2);
  const higherWins = (x: number, y: number): 0 | 1 | 2 => (x === y ? 0 : x > y ? 1 : 2);
  return [
    { label: "MSRP", a: usd(a.msrp), b: usd(b.msrp), winner: lowerWins(a.msrp, b.msrp) },
    {
      label: a.fuelType === "ev" || b.fuelType === "ev" ? "MPG / MPGe combined" : "MPG combined",
      a: num(a.mpgCombined),
      b: num(b.mpgCombined),
      winner: higherWins(a.mpgCombined, b.mpgCombined),
    },
    {
      label: "Horsepower",
      a: `${a.horsepower} hp`,
      b: `${b.horsepower} hp`,
      winner: higherWins(a.horsepower, b.horsepower),
    },
    {
      label: "Cargo space",
      a: `${a.cargoCuFt} cu ft`,
      b: `${b.cargoCuFt} cu ft`,
      winner: higherWins(a.cargoCuFt, b.cargoCuFt),
    },
    {
      label: "NHTSA overall rating",
      a: "★".repeat(a.nhtsaOverall),
      b: "★".repeat(b.nhtsaOverall),
      winner: higherWins(a.nhtsaOverall, b.nhtsaOverall),
    },
    { label: "Drivetrain", a: a.drivetrain, b: b.drivetrain, winner: 0 },
    { label: "Seats", a: String(a.seats), b: String(b.seats), winner: 0 },
  ];
}

function WinnerCards({ a, b }: { a: Vehicle; b: Vehicle }) {
  const tcoA = calcTco(a);
  const tcoB = calcTco(b);
  const sa = getSafety(a.slug);
  const sb = getSafety(b.slug);
  const cards: { label: string; winner: string; detail: string }[] = [];

  if (tcoA.total !== tcoB.total) {
    const w = tcoA.total < tcoB.total ? a : b;
    cards.push({
      label: "Lower 5-year cost",
      winner: w.model,
      detail: `saves ~${usd(Math.abs(tcoA.total - tcoB.total))}`,
    });
  }
  if (a.msrp !== b.msrp) {
    const w = a.msrp < b.msrp ? a : b;
    cards.push({
      label: "Lower price",
      winner: w.model,
      detail: `${usd(Math.abs(a.msrp - b.msrp))} less upfront`,
    });
  }
  if (a.cargoCuFt !== b.cargoCuFt) {
    const w = a.cargoCuFt > b.cargoCuFt ? a : b;
    cards.push({
      label: "More cargo",
      winner: w.model,
      detail: `+${Math.abs(a.cargoCuFt - b.cargoCuFt).toFixed(1)} cu ft`,
    });
  }
  if (sa && sb && sa.recallsCount !== sb.recallsCount) {
    const w = sa.recallsCount < sb.recallsCount ? a : b;
    cards.push({
      label: "Fewer recalls",
      winner: w.model,
      detail: `${Math.min(sa.recallsCount, sb.recallsCount)} vs ${Math.max(sa.recallsCount, sb.recallsCount)} (NHTSA)`,
    });
  } else if (a.horsepower !== b.horsepower) {
    const w = a.horsepower > b.horsepower ? a : b;
    cards.push({
      label: "More power",
      winner: w.model,
      detail: `+${Math.abs(a.horsepower - b.horsepower)} hp`,
    });
  }

  if (cards.length === 0) return null;
  return (
    <section className="mb-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
      {cards.slice(0, 4).map((c) => (
        <div key={c.label} className="rounded-xl bg-slate-50 p-4">
          <p className="text-xs font-medium uppercase tracking-wide text-ink-faint">{c.label}</p>
          <p className="mt-1 font-semibold">{c.winner}</p>
          <p className="text-xs text-ink-soft">{c.detail}</p>
        </div>
      ))}
    </section>
  );
}

function WinnerBadge() {
  return (
    <span className="ml-2 rounded bg-brand-light px-1.5 py-0.5 text-xs font-medium text-brand-dark">
      better
    </span>
  );
}

export default async function ComparePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const cmp = resolvePair(slug);
  if (!cmp) notFound();

  const a = cmp.vehicleA;
  const b = cmp.vehicleB;
  const rows = buildRows(a, b);

  return (
    <div className="mx-auto max-w-3xl px-4">
      <section className="py-12 text-center">
        <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-brand">
          {a.year} · {a.bodyType}
        </p>
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          {a.make} {a.model} vs {b.make} {b.model}
        </h1>
        <p className="mt-3 text-ink-soft">
          {a.trim} vs {b.trim} - specs, true cost of ownership and safety, side by side.
        </p>
        <div className="mt-5 flex flex-wrap justify-center gap-3">
          <GarageButton slug={a.slug} label={a.model} />
          <GarageButton slug={b.slug} label={b.model} />
        </div>
      </section>

      <WinnerCards a={a} b={b} />

      <section className="mb-10 rounded-xl bg-brand-light p-5">
        <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-brand-dark">
          Verdict
        </p>
        <p className="leading-relaxed text-ink">{cmp.verdict}</p>
        <div className="mt-4 grid gap-4 border-t border-brand/20 pt-4 sm:grid-cols-2">
          {[a, b].map((v) => (
            <div key={v.slug}>
              <p className="mb-1 text-sm font-semibold text-brand-dark">
                Pick the {v.model} if
              </p>
              <ul className="space-y-1 text-sm text-ink">
                {v.goodFor.slice(0, 2).map((g) => (
                  <li key={g}>• {g.charAt(0).toLowerCase() + g.slice(1)}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <section className="mb-12">
        <h2 className="mb-4 text-xl font-semibold tracking-tight">Specs side by side</h2>
        <table className="w-full table-fixed border-collapse text-sm">
          <thead>
            <tr className="text-left">
              <th className="w-1/3 pb-2 font-medium text-ink-faint">Spec</th>
              <th className="pb-2 font-semibold">
                {a.make} {a.model}
              </th>
              <th className="pb-2 font-semibold">
                {b.make} {b.model}
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.label} className="border-t border-slate-200">
                <td className="py-3 text-ink-soft">{r.label}</td>
                <td className="py-3">
                  {r.a}
                  {r.winner === 1 && <WinnerBadge />}
                </td>
                <td className="py-3">
                  {r.b}
                  {r.winner === 2 && <WinnerBadge />}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <TcoSection a={a} b={b} />

      <section className="mb-12">
        <h2 className="mb-4 text-xl font-semibold tracking-tight">Who each car is for</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {[a, b].map((v) => (
            <div key={v.slug} className="rounded-xl border border-slate-200 p-5">
              <p className="mb-3 font-semibold">
                {v.make} {v.model}
              </p>
              <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-brand-dark">
                Good fit
              </p>
              <ul className="mb-3 space-y-1 text-sm text-ink-soft">
                {v.goodFor.map((g) => (
                  <li key={g}>✓ {g}</li>
                ))}
              </ul>
              <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-ink-faint">
                Look elsewhere if
              </p>
              <ul className="space-y-1 text-sm text-ink-soft">
                {v.notFor.map((n) => (
                  <li key={n}>✗ {n}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <section className="mb-12">
        <h2 className="mb-1 text-xl font-semibold tracking-tight">Risks, recalls &amp; what to check</h2>
        <p className="mb-5 text-sm text-ink-soft">
          Recall and complaint data is pulled from official NHTSA records for the {a.year} model
          year.
        </p>
        <div className="grid gap-4 sm:grid-cols-2">
          {[a, b].map((v) => {
            const s = getSafety(v.slug);
            return (
              <div key={v.slug} className="rounded-xl border border-slate-200 p-5">
                <p className="mb-2 font-semibold">
                  {v.make} {v.model}
                </p>
                {s && (
                  <p className="mb-3 text-sm">
                    <span
                      className={
                        s.recallsCount > 3
                          ? "font-semibold text-red-600"
                          : "font-semibold text-ink"
                      }
                    >
                      {s.recallsCount} {s.recallsCount === 1 ? "recall" : "recalls"}
                    </span>{" "}
                    <span className="text-ink-soft">
                      · {s.complaintsCount} NHTSA complaints filed
                    </span>
                  </p>
                )}
                {s && s.recallSummaries.length > 0 && (
                  <ul className="mb-3 space-y-2 text-xs text-ink-soft">
                    {s.recallSummaries.map((r) => (
                      <li key={r} className="border-l-2 border-slate-200 pl-2">
                        {r}
                      </li>
                    ))}
                  </ul>
                )}
                <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-ink-faint">
                  Before you buy
                </p>
                <ul className="space-y-1 text-sm text-ink-soft">
                  {v.watchOuts.map((w) => (
                    <li key={w}>• {w}</li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </section>

      <section className="mb-12">
        <h2 className="mb-4 text-xl font-semibold tracking-tight">Questions to ask the dealer</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {[a, b].map((v) => (
            <div key={v.slug} className="rounded-xl border border-slate-200 p-5">
              <p className="mb-3 font-semibold">
                {v.make} {v.model}
              </p>
              <ol className="list-decimal space-y-2 pl-4 text-sm text-ink-soft">
                {dealerQuestions(v, getSafety(v.slug)).map((q) => (
                  <li key={q}>{q}</li>
                ))}
              </ol>
            </div>
          ))}
        </div>
      </section>

      <section className="mb-8">
        <h2 className="mb-4 text-xl font-semibold tracking-tight">More comparisons</h2>
        <div className="flex flex-wrap gap-2">
          {comparisons
            .filter((c) => c.slug !== slug)
            .slice(0, 4)
            .map((c) => {
              const other = getComparison(c.slug);
              if (!other) return null;
              return (
                <Link
                  key={c.slug}
                  href={`/compare/${c.slug}`}
                  className="rounded-full border border-slate-200 px-4 py-1.5 text-sm text-ink-soft transition hover:border-brand hover:text-ink"
                >
                  {other.vehicleA.model} vs {other.vehicleB.model}
                </Link>
              );
            })}
        </div>
      </section>

      <section className="mb-8">
        <h2 className="mb-1 text-xl font-semibold tracking-tight">Build your own comparison</h2>
        <p className="text-sm text-ink-soft">Pick any two cars from our database.</p>
        <ComparePicker />
      </section>
    </div>
  );
}
