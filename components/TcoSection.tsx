"use client";

import Link from "next/link";
import { calcTco, usd, type Vehicle } from "@/lib/vehicles";
import { useProfile } from "@/components/profile";

const inputCls =
  "w-full rounded-lg border border-slate-300 px-2.5 py-1.5 text-sm focus:border-brand focus:outline-none";

const SEGMENTS = [
  { key: "fuel", label: "Fuel", color: "bg-brand" },
  { key: "insurance", label: "Insurance", color: "bg-sky-500" },
  { key: "maintenance", label: "Maintenance", color: "bg-amber-500" },
  { key: "depreciation", label: "Depreciation", color: "bg-slate-400" },
] as const;

export default function TcoSection({ a, b }: { a: Vehicle; b: Vehicle }) {
  const [profile, saveProfile] = useProfile();
  const tcoA = calcTco(a, profile);
  const tcoB = calcTco(b, profile);
  const maxTco = Math.max(tcoA.total, tcoB.total);
  const cheaper = tcoA.total <= tcoB.total ? a : b;
  const diff = Math.abs(tcoA.total - tcoB.total);

  const set = (key: keyof typeof profile) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    saveProfile({ ...profile, [key]: Number(e.target.value) || 0 });

  return (
    <section className="mb-12">
      <h2 className="mb-1 text-xl font-semibold tracking-tight">
        Car cost of ownership comparison - for your driving
      </h2>
      <p className="mb-4 text-sm text-ink-soft">
        Adjust the numbers to your life. They're saved on this device and applied to every
        comparison on the site.
      </p>

      <div className="mb-6 grid grid-cols-2 gap-3 rounded-xl border border-slate-200 p-4 sm:grid-cols-4">
        <label className="text-xs text-ink-soft">
          Miles / year
          <input
            type="number"
            step={1000}
            min={1000}
            value={profile.milesPerYear}
            onChange={set("milesPerYear")}
            className={inputCls + " mt-1"}
          />
        </label>
        <label className="text-xs text-ink-soft">
          Years of ownership
          <select value={profile.years} onChange={set("years")} className={inputCls + " mt-1"}>
            {[3, 5, 7].map((y) => (
              <option key={y} value={y}>
                {y} years
              </option>
            ))}
          </select>
        </label>
        <label className="text-xs text-ink-soft">
          Gas, $/gallon
          <input
            type="number"
            step={0.1}
            min={1}
            value={profile.gasPricePerGallon}
            onChange={set("gasPricePerGallon")}
            className={inputCls + " mt-1"}
          />
        </label>
        <label className="text-xs text-ink-soft">
          Electricity, $/kWh
          <input
            type="number"
            step={0.01}
            min={0.05}
            value={profile.electricityPerKwh}
            onChange={set("electricityPerKwh")}
            className={inputCls + " mt-1"}
          />
        </label>
      </div>

      {diff > 0 && (
        <p className="mb-5 rounded-lg bg-slate-50 px-4 py-3 text-sm">
          With your driving, the{" "}
          <span className="font-semibold">
            {cheaper.make} {cheaper.model}
          </span>{" "}
          saves about <span className="font-semibold text-brand-dark">{usd(diff)}</span> over{" "}
          {profile.years} years.
        </p>
      )}

      {[
        { v: a, t: tcoA },
        { v: b, t: tcoB },
      ].map(({ v, t }) => (
        <div key={v.slug} className="mb-5">
          <div className="mb-1 flex items-baseline justify-between">
            <p className="font-medium">
              {v.make} {v.model}
            </p>
            <p className="font-semibold">
              {usd(t.total)}{" "}
              <span className="text-sm font-normal text-ink-faint">
                over {profile.years} years
              </span>
            </p>
          </div>
          <div className="flex h-4 w-full overflow-hidden rounded bg-slate-100">
            {SEGMENTS.map((s) => (
              <div
                key={s.key}
                className={`h-4 ${s.color} transition-all duration-300`}
                style={{ width: `${(t[s.key] / maxTco) * 100}%` }}
                title={`${s.label}: ${usd(t[s.key])}`}
              />
            ))}
          </div>
          <p className="mt-1 text-xs text-ink-faint">
            Fuel {usd(t.fuel)} · Insurance {usd(t.insurance)} · Maintenance {usd(t.maintenance)} ·
            Depreciation {usd(t.depreciation)}
          </p>
        </div>
      ))}

      <div className="mb-3 flex flex-wrap gap-4">
        {SEGMENTS.map((s) => (
          <span key={s.key} className="flex items-center gap-1.5 text-xs text-ink-soft">
            <span className={`inline-block h-2.5 w-2.5 rounded-sm ${s.color}`} />
            {s.label}
          </span>
        ))}
      </div>
      <p className="text-xs text-ink-faint">
        Insurance, maintenance and depreciation are class averages - see{" "}
        <Link href="/methodology" className="underline hover:text-ink">
          how we calculate
        </Link>
        . Your quotes may differ.
      </p>
    </section>
  );
}
