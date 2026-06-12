import type { Metadata } from "next";
import { tcoAssumptions } from "@/lib/vehicles";

export const metadata: Metadata = {
  title: "How we calculate our numbers",
  description:
    "Data sources and methodology behind CarComparisonAI: EPA fuel economy, NHTSA recalls and complaints, and our 5-year cost of ownership model.",
};

export default function MethodologyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4">
      <section className="py-12">
        <h1 className="text-3xl font-bold tracking-tight">How we calculate our numbers</h1>
        <p className="mt-4 leading-relaxed text-ink-soft">
          Every figure on this site is either an official government number or a clearly labeled
          estimate. This page explains which is which, so you can judge our verdicts instead of
          trusting them blindly.
        </p>
      </section>

      <section className="mb-10">
        <h2 className="mb-3 text-xl font-semibold tracking-tight">Official data</h2>
        <p className="leading-relaxed text-ink-soft">
          Fuel economy (MPG / MPGe) comes from the EPA via{" "}
          <a href="https://www.fueleconomy.gov" className="text-brand underline hover:text-brand-dark">
            FuelEconomy.gov
          </a>
          . Safety ratings, recalls and complaint counts come from{" "}
          <a href="https://www.nhtsa.gov" className="text-brand underline hover:text-brand-dark">
            NHTSA
          </a>{" "}
          - the federal agency that runs crash tests and tracks every recall in the US. Recall and
          complaint data refers to the specific model year shown and is refreshed regularly.
        </p>
      </section>

      <section className="mb-10">
        <h2 className="mb-3 text-xl font-semibold tracking-tight">Cost of ownership model</h2>
        <p className="leading-relaxed text-ink-soft">
          Our default assumptions: {tcoAssumptions.milesPerYear.toLocaleString()} miles per year,{" "}
          {tcoAssumptions.years} years of ownership, ${tcoAssumptions.gasPricePerGallon}/gallon gas
          and ${tcoAssumptions.electricityPerKwh}/kWh home electricity - every one of them
          adjustable in the calculator, and your settings apply across the whole site. Fuel cost is
          computed from EPA combined ratings. Insurance and maintenance are class averages by
          powertrain type (gas / hybrid / EV), not personal quotes. Depreciation is modeled as a
          percentage of MSRP scaled to your ownership period. These three are estimates: useful for
          comparing two cars against each other, not for predicting your exact bill.
        </p>
      </section>

      <section className="mb-10">
        <h2 className="mb-3 text-xl font-semibold tracking-tight">Editorial content</h2>
        <p className="leading-relaxed text-ink-soft">
          Verdicts, “who it's for” notes and “before you buy” warnings are written by us, informed
          by the data above plus widely documented owner-reported issues. MSRP figures are
          manufacturer list prices at time of writing and change with model years and incentives -
          always confirm current pricing with a dealer.
        </p>
      </section>

      <section className="mb-10">
        <h2 className="mb-3 text-xl font-semibold tracking-tight">What we don't do</h2>
        <p className="leading-relaxed text-ink-soft">
          We don't invent precision we don't have: no “reliability score 83/100” without a data
          source behind it, no insurance quotes by ZIP code until we can do them accurately. Your
          profile and garage are stored only in your browser - we don't collect them.
        </p>
      </section>
    </div>
  );
}
