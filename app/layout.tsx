import type { Metadata } from "next";
import Link from "next/link";
import GarageLink from "@/components/GarageLink";
import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://carcomparisonai.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "CarComparisonAI - compare cars with real data",
    template: "%s | CarComparisonAI",
  },
  description:
    "Side-by-side car comparisons with real EPA and NHTSA data: specs, 5-year cost of ownership and safety ratings.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <header className="border-b border-slate-200">
          <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
            <Link href="/" className="text-lg font-semibold tracking-tight">
              carcomparison<span className="text-brand">ai</span>
            </Link>
            <nav className="flex gap-6 text-sm text-ink-soft">
              <Link href="/#comparisons" className="hover:text-ink">
                Comparisons
              </Link>
              <Link href="/choose" className="hover:text-ink">
                Help me choose
              </Link>
              <Link href="/methodology" className="hover:text-ink">
                Methodology
              </Link>
              <GarageLink />
            </nav>
          </div>
        </header>
        <main>{children}</main>
        <footer className="mt-16 border-t border-slate-200 py-8 text-center text-sm text-ink-faint">
          <p>
            Data: NHTSA, EPA / FuelEconomy.gov.{" "}
            <Link href="/methodology" className="underline hover:text-ink">
              How we calculate
            </Link>
            <br />© {new Date().getFullYear()} CarComparisonAI
          </p>
        </footer>
      </body>
    </html>
  );
}
