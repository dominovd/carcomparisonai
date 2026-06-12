import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact",
  description: "Contact CarComparisonAI: questions, data corrections and partnership inquiries.",
};

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-3xl px-4">
      <section className="py-12">
        <h1 className="text-3xl font-bold tracking-tight">Contact us</h1>
        <p className="mt-4 leading-relaxed text-ink-soft">
          For questions, data corrections, comparison requests or partnership inquiries, email us
          at{" "}
          <a
            href="mailto:info@carcomparisonai.com"
            className="text-brand underline hover:text-brand-dark"
          >
            info@carcomparisonai.com
          </a>
          . We read everything and usually reply within a couple of business days.
        </p>
        <p className="mt-4 leading-relaxed text-ink-soft">
          If you're reporting a data error, please include the page link and the figure you
          believe is wrong - it helps us fix it faster.
        </p>
      </section>
    </div>
  );
}
