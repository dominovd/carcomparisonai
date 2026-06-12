import Link from "next/link";
import ComparePicker from "@/components/ComparePicker";
import { comparisons, getComparison, scenarios } from "@/lib/vehicles";

const learnCards = [
  {
    title: "The real 5-year cost",
    text: "Fuel, insurance, maintenance and depreciation combined into one ownership estimate.",
  },
  {
    title: "The better fit",
    text: "Which car is better for families, commuters, long trips, resale value or low running costs.",
  },
  {
    title: "Known risks",
    text: "Recall and complaint data from NHTSA, plus practical checks before you buy.",
  },
  {
    title: "Dealer questions",
    text: "Specific questions to ask before signing: out-the-door price, add-ons, recalls, financing terms.",
  },
];

const chatbotPoints = [
  {
    title: "Real data, not just an opinion",
    text: "EPA fuel economy, NHTSA recalls and safety ratings are built into every comparison.",
  },
  {
    title: "Your numbers stay consistent",
    text: "Miles per year, ownership period, fuel and electricity prices are saved and applied across the site.",
  },
  {
    title: "Every answer is comparable",
    text: "Each car is judged with the same cost model, risk checks and buyer-fit logic - so verdicts can be compared, not just read.",
  },
];

const verdictSteps = [
  {
    title: "Compare the facts",
    text: "Specs, fuel economy, cargo space, power, safety ratings and recalls.",
  },
  {
    title: "Calculate ownership cost",
    text: "Estimate what each car may cost over 3, 5 or 7 years with your driving.",
  },
  {
    title: "Explain the trade-off",
    text: "A plain-English recommendation for the kind of buyer each car fits best.",
  },
];

export default function HomePage() {
  return (
    <div className="mx-auto max-w-5xl px-4">
      <section id="compare" className="pb-10 pt-16 text-center">
        <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-brand">
          Real EPA &amp; NHTSA data
        </p>
        <h1 className="mx-auto max-w-2xl text-4xl font-bold tracking-tight sm:text-5xl">
          Find the car that costs less to own - not just less to buy
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-lg text-ink-soft">
          We turn specs, safety data, fuel costs and ownership estimates into a clear
          recommendation: which car to buy, which to avoid, and why.
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
      </section>

      <section className="py-10">
        <h2 className="mb-2 text-center text-2xl font-semibold tracking-tight">
          Not just specs. A buying decision.
        </h2>
        <p className="mx-auto mb-8 max-w-2xl text-center text-ink-soft">
          What every comparison tells you:
        </p>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {learnCards.map((c) => (
            <div key={c.title} className="rounded-xl border border-slate-200 p-5">
              <p className="font-semibold">{c.title}</p>
              <p className="mt-1 text-sm text-ink-soft">{c.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="py-10">
        <h2 className="mb-2 text-center text-2xl font-semibold tracking-tight">
          Why use this instead of asking a chatbot?
        </h2>
        <p className="mx-auto mb-8 max-w-2xl text-center text-ink-soft">
          A chatbot gives a general opinion. CarComparisonAI gives a structured comparison with
          real vehicle data, saved driving assumptions, cost calculations and a repeatable verdict
          you can inspect.
        </p>
        <div className="grid gap-4 sm:grid-cols-3">
          {chatbotPoints.map((p, i) => (
            <div key={p.title} className="rounded-xl bg-slate-50 p-5">
              <p className="text-xs font-semibold uppercase tracking-wide text-brand">
                {String(i + 1).padStart(2, "0")}
              </p>
              <p className="mt-1 font-semibold">{p.title}</p>
              <p className="mt-1 text-sm text-ink-soft">{p.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="comparisons" className="py-10">
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

      <section className="py-10">
        <h2 className="mb-6 text-2xl font-semibold tracking-tight">
          Find the better car for your situation
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {scenarios.map((s) => (
            <Link
              key={s.slug}
              href={`/best/${s.slug}`}
              className="rounded-xl border border-slate-200 p-5 transition hover:border-brand hover:shadow-sm"
            >
              <p className="font-semibold">{s.title}</p>
              <p className="mt-1 text-sm text-ink-soft">{s.intro.slice(0, 110)}…</p>
              <p className="mt-3 text-sm font-medium text-brand">See the picks →</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="py-10">
        <h2 className="mb-2 text-center text-2xl font-semibold tracking-tight">
          How the verdict is built
        </h2>
        <p className="mx-auto mb-8 max-w-2xl text-center text-ink-soft">
          Each verdict weighs purchase price, fuel or electricity cost, insurance, maintenance,
          depreciation, safety ratings, recalls and everyday usability. Adjust the assumptions and
          see how the recommendation changes.
        </p>
        <div className="grid gap-4 sm:grid-cols-3">
          {verdictSteps.map((s, i) => (
            <div key={s.title} className="rounded-xl border border-slate-200 p-5">
              <p className="text-2xl font-semibold text-brand">{i + 1}</p>
              <p className="mt-1 font-semibold">{s.title}</p>
              <p className="mt-1 text-sm text-ink-soft">{s.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="py-10">
        <div className="rounded-xl bg-slate-50 p-6 sm:p-8">
          <h2 className="text-xl font-semibold tracking-tight">
            Built on public data and transparent assumptions
          </h2>
          <p className="mt-2 max-w-3xl text-sm leading-relaxed text-ink-soft">
            Fuel economy comes from EPA / FuelEconomy.gov. Safety ratings, recalls and complaints
            come from NHTSA. Ownership estimates use adjustable assumptions, so you can always see
            what changes the result. Full details in our{" "}
            <Link href="/methodology" className="text-brand underline hover:text-brand-dark">
              methodology
            </Link>
            .
          </p>
        </div>
      </section>

      <section className="py-12 text-center">
        <h2 className="text-2xl font-semibold tracking-tight">
          Start with two cars, or let AI guide you
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-ink-soft">
          Compare any two vehicles side by side, or set your budget and priorities to get a
          shortlist built around total cost, safety and ownership risk.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <a
            href="#compare"
            className="rounded-lg bg-brand px-6 py-3 text-sm font-semibold text-white transition hover:bg-brand-dark"
          >
            Compare two cars
          </a>
          <Link
            href="/choose"
            className="rounded-lg border border-brand px-6 py-3 text-sm font-semibold text-brand-dark transition hover:bg-brand-light"
          >
            Help me choose
          </Link>
        </div>
      </section>
    </div>
  );
}
