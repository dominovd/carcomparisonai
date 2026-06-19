import type { Metadata } from "next";
import Link from "next/link";
import { Analytics } from "@vercel/analytics/next";
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
  alternates: { canonical: "./" },
  verification: { google: "BhyXJrYt0iLxK4f6g_3r5EdyaE2oXzjYqTsxHpEOBy8" },
};

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "CarComparisonAI",
  url: siteUrl,
  description:
    "Side-by-side car comparisons with real EPA and NHTSA data: specs, cost of ownership and safety ratings.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <header className="border-b border-slate-200 bg-white/95 backdrop-blur">
          <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
            <Link href="/" className="flex items-center gap-2 text-lg font-semibold tracking-tight">
              <svg viewBox="0 0 64 64" className="h-6 w-6" aria-hidden="true">
                <rect width="64" height="64" rx="14" fill="#1D9E75" />
                <path
                  d="M16 36c0-2 1-3 3-3.4l3.4-7.2A5 5 0 0 1 27 22h10a5 5 0 0 1 4.6 3.4L45 32.6c2 .4 3 1.4 3 3.4v6a2 2 0 0 1-2 2h-2a2 2 0 0 1-2-2v-1H22v1a2 2 0 0 1-2 2h-2a2 2 0 0 1-2-2v-6z"
                  fill="#fff"
                />
                <circle cx="24" cy="37" r="2.6" fill="#1D9E75" />
                <circle cx="40" cy="37" r="2.6" fill="#1D9E75" />
                <path d="M25.5 26.5h13l2.2 5h-17.4l2.2-5z" fill="#1D9E75" />
              </svg>
              CarComparisonAI
            </Link>
            <nav className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-ink-soft">
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
          <nav className="mb-3 flex flex-wrap justify-center gap-x-5 gap-y-2">
            <Link href="/about" className="hover:text-ink">
              About
            </Link>
            <Link href="/contact" className="hover:text-ink">
              Contact
            </Link>
            <Link href="/methodology" className="hover:text-ink">
              Methodology
            </Link>
            <Link href="/privacy" className="hover:text-ink">
              Privacy
            </Link>
            <Link href="/terms" className="hover:text-ink">
              Terms
            </Link>
          </nav>
          <p>© {new Date().getFullYear()} CarComparisonAI</p>
        </footer>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
        <Analytics />
      </body>
    </html>
  );
}
