import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of use",
  description: "Terms of use for CarComparisonAI: informational content, no warranties.",
};

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4">
      <section className="py-12">
        <h1 className="text-3xl font-bold tracking-tight">Terms of use</h1>
        <p className="mt-3 text-sm text-ink-faint">Last updated: June 2026</p>
      </section>
      <section className="mb-10">
        <h2 className="mb-3 text-xl font-semibold tracking-tight">Informational purposes only</h2>
        <p className="leading-relaxed text-ink-soft">
          CarComparisonAI provides comparisons, estimates and editorial opinions to help you
          research vehicles. Nothing on this site is financial, legal or professional purchasing
          advice. Cost-of-ownership figures are estimates built on stated assumptions; your actual
          prices, insurance rates and resale values will differ. Always verify current pricing,
          specifications and recall status with the manufacturer, dealer or NHTSA before making a
          purchase.
        </p>
      </section>
      <section className="mb-10">
        <h2 className="mb-3 text-xl font-semibold tracking-tight">Data sources</h2>
        <p className="leading-relaxed text-ink-soft">
          Fuel economy data originates from the EPA (FuelEconomy.gov); safety ratings, recalls and
          complaints from NHTSA. We refresh this data periodically but do not guarantee it is
          complete or current at any given moment. MSRP figures are list prices at the time of
          writing.
        </p>
      </section>
      <section className="mb-10">
        <h2 className="mb-3 text-xl font-semibold tracking-tight">No warranty and liability</h2>
        <p className="leading-relaxed text-ink-soft">
          The site is provided "as is" without warranties of any kind. To the maximum extent
          permitted by law, CarComparisonAI is not liable for any losses arising from decisions
          made based on the information here. If you do not agree with these terms, please do not
          use the site.
        </p>
      </section>
      <section className="mb-10">
        <h2 className="mb-3 text-xl font-semibold tracking-tight">Contact</h2>
        <p className="leading-relaxed text-ink-soft">
          Questions about these terms:{" "}
          <a
            href="mailto:info@carcomparisonai.com"
            className="text-brand underline hover:text-brand-dark"
          >
            info@carcomparisonai.com
          </a>
          .
        </p>
      </section>
    </div>
  );
}
