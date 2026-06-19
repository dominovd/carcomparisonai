import Link from "next/link";
import type { Metadata } from "next";
import ComparePicker from "@/components/ComparePicker";
import { calcTco, comparisons, getComparison, scenarios, usd, vehicles } from "@/lib/vehicles";

export const metadata: Metadata = {
  title: "Car Comparison Tool - Compare Cars Side by Side",
  description:
    "Compare cars side by side with EPA MPG, NHTSA safety ratings, cargo size, specs and 5-year ownership cost estimates.",
};

const featured = getComparison("honda-cr-v-vs-toyota-rav4");
const featuredA = featured?.vehicleA ?? vehicles[0];
const featuredB = featured?.vehicleB ?? vehicles[1];
const featuredATco = calcTco(featuredA);
const featuredBTco = calcTco(featuredB);
const savings = Math.abs(featuredATco.total - featuredBTco.total);
const winner = featuredATco.total <= featuredBTco.total ? featuredA : featuredB;

const trustStats = [
  { value: "EPA", label: "Fuel economy" },
  { value: "NHTSA", label: "Safety + recalls" },
  { value: "5-year", label: "Ownership model" },
];

const decisionCards = [
  {
    title: "Total cost",
    text: "MSRP is only the start. Fuel, insurance, maintenance and depreciation sit in one comparable estimate.",
  },
  {
    title: "Daily fit",
    text: "Cargo, seats, power, commute use and family needs are translated into a practical buyer verdict.",
  },
  {
    title: "Risk check",
    text: "Safety ratings, recalls, complaints and known watch-outs are surfaced before you shortlist a car.",
  },
];

const workflow = [
  {
    title: "Pick two cars",
    text: "Start with a real matchup or choose any pair from the dataset.",
  },
  {
    title: "Adjust assumptions",
    text: "Keep mileage, fuel prices and ownership years consistent.",
  },
  {
    title: "Read the verdict",
    text: "See the trade-off across cost, size, safety and daily fit.",
  },
  {
    title: "Save the shortlist",
    text: "Keep candidates together while prices or priorities change.",
  },
];

const comparisonFeatures = [
  {
    title: "Side-by-side car comparison",
    text: "Line up two models by price, MPG, safety rating, cargo space, horsepower, drivetrain and practical buyer fit.",
  },
  {
    title: "Car size comparison",
    text: "Compare body type, seating and cargo volume so you can see which car has the room you actually need.",
  },
  {
    title: "Electric, hybrid and gas costs",
    text: "Estimate fuel or charging cost with the same mileage assumptions across EVs, hybrids and gas cars.",
  },
  {
    title: "Safety and reliability checks",
    text: "Use NHTSA safety ratings, recalls, complaints and ownership-cost signals before trusting a shortlist.",
  },
];

const comparisonRows = [
  {
    label: "Starting MSRP",
    a: usd(featuredA.msrp),
    b: usd(featuredB.msrp),
    note: "RAV4 starts lower",
  },
  {
    label: "Combined MPG",
    a: `${featuredA.mpgCombined} MPG`,
    b: `${featuredB.mpgCombined} MPG`,
    note: "Same EPA combined rating",
  },
  {
    label: "Cargo size",
    a: `${featuredA.cargoCuFt} cu ft`,
    b: `${featuredB.cargoCuFt} cu ft`,
    note: "CR-V has more cargo room",
  },
  {
    label: "NHTSA safety",
    a: `${featuredA.nhtsaOverall}/5`,
    b: `${featuredB.nhtsaOverall}/5`,
    note: "Both score 5 stars",
  },
  {
    label: "5-year ownership cost",
    a: usd(featuredATco.total),
    b: usd(featuredBTco.total),
    note: `${winner.model} saves ${usd(savings)}`,
  },
];

const faqs = [
  {
    question: "What is the best way to compare cars side by side?",
    answer:
      "Start with two similar vehicles, then compare MSRP, MPG, cargo space, safety ratings, recalls and estimated 5-year ownership cost. A side-by-side car comparison is most useful when every car uses the same assumptions.",
  },
  {
    question: "Does this car comparison tool include size and dimensions?",
    answer:
      "The current comparison includes body type, seating and cargo volume. Those are the size signals most shoppers use first. Full exterior dimensions such as length, width and height can be added as the dataset expands.",
  },
  {
    question: "Can I compare electric cars with gas or hybrid cars?",
    answer:
      "Yes. EVs, hybrids and gas cars are compared with the same ownership model, using electricity cost for EVs and fuel cost for gas or hybrid vehicles.",
  },
  {
    question: "Is this a car insurance comparison site?",
    answer:
      "No. CarComparisonAI compares vehicles, not insurance quotes. Insurance is included only as an estimated ownership-cost input so two vehicles can be judged consistently.",
  },
];

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((faq) => ({
    "@type": "Question",
    name: faq.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: faq.answer,
    },
  })),
};

const vehicleImages: Record<string, { src: string; alt: string }> = {
  "honda-cr-v-2025": {
    src: "/vehicles/2025-honda-cr-v-outline.webp",
    alt: "2025 Honda CR-V outline mockup",
  },
  "toyota-rav4-2025": {
    src: "/vehicles/2025-toyota-rav4-outline.webp",
    alt: "2025 Toyota RAV4 outline mockup",
  },
};

const formatCar = (vehicle: typeof featuredA) =>
  `${vehicle.year} ${vehicle.make} ${vehicle.model}`;

export default function HomePage() {
  return (
    <div className="overflow-hidden">
      <section id="compare" className="relative border-b border-slate-200 bg-[radial-gradient(circle_at_top_left,#f0fdfa,transparent_34%),linear-gradient(180deg,#ffffff_0%,#f8fafc_100%)]">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 pb-14 pt-10 sm:pt-14 lg:grid-cols-[1fr_0.9fr] lg:items-center lg:pb-20">
          <div>
            <div className="mb-5 flex flex-wrap gap-2 text-xs font-semibold uppercase tracking-wide text-ink-soft">
              <span className="rounded-full border border-emerald-200 bg-white px-3 py-1 text-brand-dark">
                Real EPA &amp; NHTSA data
              </span>
              <span className="rounded-full border border-slate-200 bg-white px-3 py-1">
                Built for buying decisions
              </span>
            </div>
            <h1 className="max-w-3xl text-4xl font-bold tracking-tight text-ink sm:text-6xl">
              Compare cars by what they actually cost to own.
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-ink-soft">
              CarComparisonAI turns specs, safety data, fuel costs and ownership estimates into a
              clear recommendation: which car fits your life, your budget and your risk tolerance.
            </p>

            <ComparePicker />

            <div className="mt-5 flex flex-wrap items-center gap-3">
              <Link
                href="/choose"
                className="rounded-lg border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-ink transition hover:border-brand hover:text-brand-dark"
              >
                Help me choose
              </Link>
              <a href="#comparisons" className="px-2 py-3 text-sm font-semibold text-brand-dark">
                Browse popular comparisons
              </a>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -right-16 -top-10 hidden h-48 w-48 rounded-full border border-emerald-200 lg:block" />
            <div className="relative rounded-2xl border border-slate-200 bg-white p-4 shadow-xl shadow-slate-200/70 sm:p-5">
              <div className="mb-4 flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-brand">
                    Live comparison preview
                  </p>
                  <p className="mt-1 text-xl font-semibold tracking-tight">
                    {featuredA.model} vs {featuredB.model}
                  </p>
                </div>
                <span className="rounded-full bg-brand-light px-3 py-1 text-xs font-semibold text-brand-dark">
                  {winner.model} saves {usd(savings)}
                </span>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                {[featuredA, featuredB].map((vehicle, index) => {
                  const tco = index === 0 ? featuredATco : featuredBTco;
                  const vehicleImage = vehicleImages[vehicle.slug];
                  return (
                    <div
                      key={vehicle.slug}
                      className="rounded-xl border border-slate-200 bg-slate-50 p-4"
                    >
                      <div className="mb-4 flex h-28 items-center justify-center overflow-hidden rounded-lg bg-white px-2 shadow-inner">
                        {vehicleImage ? (
                          <img
                            src={vehicleImage.src}
                            alt={vehicleImage.alt}
                            className="h-full w-full object-contain"
                            loading={index === 0 ? "eager" : "lazy"}
                          />
                        ) : (
                          <div className="mx-auto h-10 w-full max-w-[180px]">
                            <div
                              className={[
                                "h-7 rounded-t-[36px] border-2",
                                index === 0
                                  ? "border-brand bg-emerald-100"
                                  : "border-slate-500 bg-slate-200",
                              ].join(" ")}
                            />
                            <div className="mx-auto -mt-1 h-4 w-[88%] rounded-b-xl bg-ink" />
                            <div className="-mt-3 flex justify-between px-5">
                              <span className="h-4 w-4 rounded-full border-2 border-white bg-slate-900" />
                              <span className="h-4 w-4 rounded-full border-2 border-white bg-slate-900" />
                            </div>
                          </div>
                        )}
                      </div>
                      <p className="font-semibold">{formatCar(vehicle)}</p>
                      <p className="text-sm text-ink-soft">{vehicle.trim}</p>
                      <div className="mt-4 grid grid-cols-3 gap-2 text-center text-xs">
                        <div className="rounded-lg bg-white p-2">
                          <p className="font-semibold text-ink">{vehicle.mpgCombined}</p>
                          <p className="text-ink-faint">MPG</p>
                        </div>
                        <div className="rounded-lg bg-white p-2">
                          <p className="font-semibold text-ink">{vehicle.cargoCuFt}</p>
                          <p className="text-ink-faint">cu ft</p>
                        </div>
                        <div className="rounded-lg bg-white p-2">
                          <p className="font-semibold text-ink">{vehicle.nhtsaOverall}/5</p>
                          <p className="text-ink-faint">safety</p>
                        </div>
                      </div>
                      <div className="mt-4">
                        <div className="mb-1 flex justify-between text-xs text-ink-soft">
                          <span>5-year cost</span>
                          <span className="font-semibold text-ink">{usd(tco.total)}</span>
                        </div>
                        <div className="h-2 overflow-hidden rounded-full bg-slate-200">
                          <div
                            className="h-full rounded-full bg-brand"
                            style={{
                              width: `${Math.max(
                                46,
                                Math.round((Math.min(featuredATco.total, featuredBTco.total) / tco.total) * 100)
                              )}%`,
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="mt-4 rounded-xl bg-ink p-4 text-white">
                <p className="text-xs font-semibold uppercase tracking-wide text-emerald-200">
                  AI-style verdict
                </p>
                <p className="mt-2 text-sm leading-6 text-slate-200">
                  {featured?.verdict ??
                    "Compare the purchase price, fuel cost, safety data and daily usability before you choose."}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-10">
        <div className="grid gap-4 border-b border-slate-200 pb-10 sm:grid-cols-3">
          {trustStats.map((stat) => (
            <div key={stat.label} className="flex items-center gap-4">
              <p className="text-3xl font-bold tracking-tight text-ink">{stat.value}</p>
              <p className="max-w-32 text-sm text-ink-soft">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-8">
        <div className="grid gap-4 lg:grid-cols-3">
          {decisionCards.map((card) => (
            <div key={card.title} className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
              <p className="text-lg font-semibold tracking-tight">{card.title}</p>
              <p className="mt-2 text-sm leading-6 text-ink-soft">{card.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-10">
        <div className="mb-6 max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-wide text-brand">
            Car comparison tool
          </p>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight">
            Compare cars side by side by cost, size, safety and MPG
          </h2>
          <p className="mt-3 text-sm leading-6 text-ink-soft">
            A useful car comparison tool should answer more than one question at once: which car is
            cheaper to own, which one is roomier, which one is safer, and whether gas, hybrid or
            electric makes more sense for your driving.
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {comparisonFeatures.map((feature) => (
            <div key={feature.title} className="rounded-xl border border-slate-200 bg-white p-5">
              <p className="font-semibold">{feature.title}</p>
              <p className="mt-2 text-sm leading-6 text-ink-soft">{feature.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-8">
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="grid gap-4 border-b border-slate-200 bg-slate-50 p-5 sm:grid-cols-[1fr_1fr_1fr] sm:items-end">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-brand">
                Side-by-side example
              </p>
              <h2 className="mt-2 text-2xl font-semibold tracking-tight">
                {featuredA.model} vs {featuredB.model} side-by-side car comparison
              </h2>
            </div>
            <p className="font-semibold">{formatCar(featuredA)}</p>
            <p className="font-semibold">{formatCar(featuredB)}</p>
          </div>
          <div className="divide-y divide-slate-200">
            {comparisonRows.map((row) => (
              <div
                key={row.label}
                className="grid gap-3 p-5 text-sm sm:grid-cols-[1fr_1fr_1fr]"
              >
                <div>
                  <p className="font-semibold text-ink">{row.label}</p>
                  <p className="mt-1 text-xs text-ink-soft">{row.note}</p>
                </div>
                <p className="text-ink-soft">{row.a}</p>
                <p className="text-ink-soft">{row.b}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="comparisons" className="mx-auto max-w-6xl px-4 py-10">
        <div className="mb-6 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-brand">
              Start with a known matchup
            </p>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight">
              Popular side-by-side car comparisons
            </h2>
          </div>
          <p className="max-w-xl text-sm leading-6 text-ink-soft">
            Each comparison gives you specs, ownership cost, safety context and a plain-English
            recommendation you can inspect.
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {comparisons.map((comparison) => {
            const cmp = getComparison(comparison.slug);
            if (!cmp) return null;
            const aTco = calcTco(cmp.vehicleA);
            const bTco = calcTco(cmp.vehicleB);
            const better = aTco.total <= bTco.total ? cmp.vehicleA : cmp.vehicleB;
            return (
              <Link
                key={comparison.slug}
                href={`/compare/${comparison.slug}`}
                className="group rounded-xl border border-slate-200 bg-white p-5 transition hover:-translate-y-0.5 hover:border-brand hover:shadow-lg hover:shadow-slate-200/80"
              >
                <div className="flex items-center justify-between gap-3">
                  <p className="font-semibold leading-6">
                    {cmp.vehicleA.make} {cmp.vehicleA.model}
                    <span className="text-ink-faint"> vs </span>
                    {cmp.vehicleB.make} {cmp.vehicleB.model}
                  </p>
                  <span className="shrink-0 text-brand transition group-hover:translate-x-1">→</span>
                </div>
                <p className="mt-2 text-sm text-ink-soft">
                  Better 5-year cost: <span className="font-semibold text-ink">{better.model}</span>
                </p>
                <div className="mt-4 flex gap-2 text-xs text-ink-soft">
                  <span className="rounded-full bg-slate-100 px-2.5 py-1">{cmp.vehicleA.bodyType}</span>
                  <span className="rounded-full bg-brand-light px-2.5 py-1 text-brand-dark">
                    {usd(Math.abs(aTco.total - bTco.total))} gap
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="bg-slate-950 py-16 text-white">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 lg:grid-cols-[0.78fr_1.22fr] lg:items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-emerald-300">
              Guided workflow
            </p>
            <h2 className="mt-3 max-w-lg text-3xl font-semibold tracking-tight sm:text-4xl">
              A car comparison workflow for a defensible shortlist.
            </h2>
            <p className="mt-4 max-w-xl text-sm leading-6 text-slate-300">
              Compare the same facts every time: specs, cost assumptions, safety context and the
              verdict. The result is easier to revisit when prices or priorities change.
            </p>
            <div className="mt-6 grid max-w-xl grid-cols-3 overflow-hidden rounded-xl border border-white/10 bg-white/[0.04]">
              <div className="border-r border-white/10 p-4">
                <p className="text-2xl font-semibold text-white">2</p>
                <p className="mt-1 text-xs text-slate-400">cars</p>
              </div>
              <div className="border-r border-white/10 p-4">
                <p className="text-2xl font-semibold text-white">5yr</p>
                <p className="mt-1 text-xs text-slate-400">cost model</p>
              </div>
              <div className="p-4">
                <p className="text-2xl font-semibold text-emerald-300">1</p>
                <p className="mt-1 text-xs text-slate-400">verdict</p>
              </div>
            </div>
          </div>
          <div>
            <div className="grid gap-3">
              {workflow.map((step, index) => (
                <div
                  key={step.title}
                  className="relative rounded-xl border border-white/10 bg-white/[0.045] p-4 pl-5 shadow-2xl shadow-black/10 transition hover:border-emerald-300/40 hover:bg-white/[0.07] sm:ml-14 sm:grid sm:grid-cols-[1fr_auto] sm:gap-4"
                >
                  {index < workflow.length - 1 && (
                    <span className="absolute left-5 top-14 hidden h-[calc(100%+0.75rem)] w-px bg-emerald-300/45 sm:-left-8 sm:block" />
                  )}
                  <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full border border-emerald-300/40 bg-slate-950 text-lg font-semibold text-emerald-300 sm:absolute sm:-left-[3.25rem] sm:top-5 sm:mb-0">
                    {index + 1}
                  </div>
                  <div>
                    <p className="font-semibold">{step.title}</p>
                    <p className="mt-1 text-sm leading-6 text-slate-400">{step.text}</p>
                  </div>
                  {index === workflow.length - 1 && (
                    <div className="mt-3 w-fit rounded-full border border-emerald-300/20 bg-emerald-300/10 px-3 py-1.5 text-xs font-semibold text-emerald-200 sm:mt-0 sm:self-center">
                      Ready to compare
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-14">
        <div className="mb-6 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-brand">
              Browse by situation
            </p>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight">
              Best car comparisons by situation
            </h2>
          </div>
          <Link href="/choose" className="text-sm font-semibold text-brand-dark">
            Open the chooser →
          </Link>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {scenarios.map((scenario) => (
            <Link
              key={scenario.slug}
              href={`/best/${scenario.slug}`}
              className="rounded-xl border border-slate-200 p-6 transition hover:border-brand hover:shadow-sm"
            >
              <p className="text-lg font-semibold">{scenario.title}</p>
              <p className="mt-2 text-sm leading-6 text-ink-soft">{scenario.intro.slice(0, 150)}...</p>
              <p className="mt-4 text-sm font-semibold text-brand-dark">See the picks →</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-14">
        <div className="mb-6 max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-wide text-brand">
            Car comparison FAQ
          </p>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight">
            Questions people ask before comparing cars
          </h2>
        </div>
        <div className="divide-y divide-slate-200 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          {faqs.map((faq, index) => (
            <details
              key={faq.question}
              open={index === 0}
              className="group"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-5 transition hover:bg-slate-50 sm:px-6 [&::-webkit-details-marker]:hidden">
                <h3 className="font-semibold leading-6">{faq.question}</h3>
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-slate-200 text-brand transition group-open:rotate-180 group-open:border-brand-light group-open:bg-brand-light">
                  <svg
                    viewBox="0 0 20 20"
                    aria-hidden="true"
                    className="h-4 w-4"
                  >
                    <path
                      d="M5 7.5 10 12.5 15 7.5"
                      fill="none"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                    />
                  </svg>
                </span>
              </summary>
              <div className="px-5 pb-5 pt-0 sm:px-6">
                <p className="max-w-3xl text-sm leading-6 text-ink-soft">{faq.answer}</p>
              </div>
            </details>
          ))}
        </div>
      </section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
    </div>
  );
}
