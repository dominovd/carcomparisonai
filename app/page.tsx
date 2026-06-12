import Link from "next/link";
import ComparePicker from "@/components/ComparePicker";
import { comparisons, getComparison, scenarios } from "@/lib/vehicles";

export default function HomePage() {
  return (
    <div className="mx-auto max-w-5xl px-4">
      <section className="py-16 text-center">
        <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-brand">
          Real EPA &amp; NHTSA data
        </p>
        <h1 className="mx-auto max-w-2xl text-4xl font-bold tracking-tight sm:text-5xl">
          Find the car that costs less to own - not just less to buy
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-lg text-ink-soft">
          Real ownership cost, safety records and hidden risks - side by side, without reading
          40-minute reviews.
        </p>
        <ComparePicker />
        <div className="mt-4">
          <Link
            href="/choose"
            className="inline-block rounded-lg border border-brand px-6 py-2.5 text-sm font-semibold text-brand-dark transition hover:bg-brand-light"
          >
            Don't know what to compare? Help me choose →
          </Link>
        </div>
        <div className="mx-auto mt-6 flex max-w-2xl flex-wrap justify-center gap-2">
          {scenarios.map((s) => (
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

      <section id="comparisons" className="pb-8">
        <h2 className="mb-6 text-2xl font-semibold tracking-tight">Popular comparisons</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {comparisons.map((c) => {
            const cmp = getComparison(c.slug);
            if (!cmp) return null;
            return (
              <Link
                key={c.slug}
                href={`/compare/${c.slug}`}
                className="rounded-xl border border-slate-200 p-5 transition hover:border-brand hover:shadow-sm"
              >
                <p className="font-semibold">
                  {cmp.vehicleA.make} {cmp.vehicleA.model}{" "}
                  <span className="text-ink-faint">vs</span> {cmp.vehicleB.make}{" "}
                  {cmp.vehicleB.model}
                </p>
                <p className="mt-1 text-sm text-ink-soft">
                  {cmp.vehicleA.year} · {cmp.vehicleA.bodyType}
                </p>
                <p className="mt-3 text-sm font-medium text-brand">Compare →</p>
              </Link>
            );
          })}
        </div>
      </section>

      <section id="how" className="py-12">
        <h2 className="mb-6 text-2xl font-semibold tracking-tight">How it works</h2>
        <div className="grid gap-6 sm:grid-cols-3">
          <div>
            <p className="font-semibold">Government data</p>
            <p className="mt-1 text-sm text-ink-soft">
              Fuel economy from EPA, safety ratings from NHTSA - not marketing brochures.
            </p>
          </div>
          <div>
            <p className="font-semibold">True 5-year cost</p>
            <p className="mt-1 text-sm text-ink-soft">
              Fuel, insurance, maintenance and depreciation combined into one number.
            </p>
          </div>
          <div>
            <p className="font-semibold">A straight verdict</p>
            <p className="mt-1 text-sm text-ink-soft">
              Every comparison ends with a clear recommendation for a specific kind of buyer.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
