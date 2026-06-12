import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About us",
  description:
    "CarComparisonAI helps US car buyers make a confident decision: real ownership cost, safety records and risks, compared side by side.",
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-4">
      <section className="py-12">
        <h1 className="text-3xl font-bold tracking-tight">About CarComparisonAI</h1>
        <p className="mt-4 leading-relaxed text-ink-soft">
          Most car sites give you data. We try to give you a decision. CarComparisonAI compares
          cars the way a knowledgeable friend would: what it really costs to own over the years,
          what tends to break, who each car actually suits and what to ask the dealer before
          paying.
        </p>
      </section>
      <section className="mb-10">
        <h2 className="mb-3 text-xl font-semibold tracking-tight">What makes us different</h2>
        <p className="leading-relaxed text-ink-soft">
          Every comparison is built on official government data: EPA fuel economy and NHTSA safety
          ratings, recalls and complaints. On top of that we add a transparent cost-of-ownership
          model you can adjust to your own driving, and verdicts written in plain language. No
          invented scores, no jargon, and our{" "}
          <Link href="/methodology" className="text-brand underline hover:text-brand-dark">
            methodology
          </Link>{" "}
          is public.
        </p>
      </section>
      <section className="mb-10">
        <h2 className="mb-3 text-xl font-semibold tracking-tight">Get in touch</h2>
        <p className="leading-relaxed text-ink-soft">
          Spotted an error in our data or want to suggest a comparison? Write to{" "}
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
