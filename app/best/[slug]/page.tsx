import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  buildPairSlug,
  calcTco,
  getScenario,
  getVehicle,
  scenarios,
  usd,
} from "@/lib/vehicles";

export function generateStaticParams() {
  return scenarios.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const s = getScenario(slug);
  if (!s) return {};
  return {
    title: s.title,
    description: s.intro.slice(0, 155),
  };
}

export default async function ScenarioPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const scenario = getScenario(slug);
  if (!scenario) notFound();

  const picks = scenario.picks
    .map((p) => ({ ...p, v: getVehicle(p.vehicle) }))
    .filter((p) => p.v !== undefined);

  return (
    <div className="mx-auto max-w-3xl px-4">
      <section className="py-12">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">{scenario.title}</h1>
        <p className="mt-4 leading-relaxed text-ink-soft">{scenario.intro}</p>
      </section>

      <section className="space-y-5">
        {picks.map((p, i) => {
          const v = p.v!;
          const tco = calcTco(v);
          return (
            <div key={v.slug} className="rounded-xl border border-slate-200 p-5 sm:p-6">
              <div className="mb-2 flex items-baseline justify-between gap-4">
                <p className="text-lg font-semibold">
                  <span className="mr-2 text-brand">#{i + 1}</span>
                  {v.year} {v.make} {v.model}
                </p>
                <p className="shrink-0 text-sm text-ink-soft">{usd(v.msrp)} MSRP</p>
              </div>
              <p className="mb-3 text-sm leading-relaxed text-ink-soft">{p.blurb}</p>
              <p className="text-xs text-ink-faint">
                {v.mpgCombined} {v.fuelType === "ev" ? "MPGe" : "MPG"} combined · 5-year cost ~
                {usd(tco.total)} · NHTSA {"★".repeat(v.nhtsaOverall)}
              </p>
              {i === 0 && picks.length > 1 && (
                <Link
                  href={`/compare/${buildPairSlug(picks[0].v!.slug, picks[1].v!.slug)}`}
                  className="mt-3 inline-block text-sm font-medium text-brand hover:text-brand-dark"
                >
                  Compare #1 vs #2 side by side →
                </Link>
              )}
            </div>
          );
        })}
      </section>

      <section className="mt-12">
        <h2 className="mb-4 text-xl font-semibold tracking-tight">Other guides</h2>
        <div className="flex flex-wrap gap-2">
          {scenarios
            .filter((s) => s.slug !== slug)
            .map((s) => (
              <Link
                key={s.slug}
                href={`/best/${s.slug}`}
                className="rounded-full border border-slate-200 px-4 py-1.5 text-sm text-ink-soft transition hover:border-brand hover:text-ink"
              >
                {s.title}
              </Link>
            ))}
        </div>
      </section>
    </div>
  );
}
