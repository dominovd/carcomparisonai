import { buildPairSlug, calcTco, usd, vehicles } from "@/lib/vehicles";
import { useGarage, useProfile } from "@/components/profile";

export default function GarageContent() {
  const [garage, toggle] = useGarage();
  const [profile] = useProfile();
  const saved = garage
    .map((slug) => vehicles.find((v) => v.slug === slug))
    .filter((v) => v !== undefined);

  const pairs: [string, string][] = [];
  for (let i = 0; i < saved.length; i++)
    for (let j = i + 1; j < saved.length; j++) pairs.push([saved[i]!.slug, saved[j]!.slug]);

  return (
    <div className="mx-auto max-w-3xl px-4">
      <section className="py-12">
        <h1 className="text-3xl font-bold tracking-tight">My garage</h1>
        <p className="mt-3 text-ink-soft">
          Your shortlist, saved on this device. Costs use your profile ({" "}
          {profile.milesPerYear.toLocaleString()} mi/yr, {profile.years} years ).
        </p>
      </section>

      {saved.length === 0 && (
        <div className="rounded-xl border border-dashed border-slate-300 p-10 text-center">
          <p className="text-ink-soft">
            Nothing saved yet. Open any{" "}
            <a href="/" className="font-medium text-brand hover:text-brand-dark">
              comparison
            </a>{" "}
            and hit “Save” under the title.
          </p>
        </div>
      )}

      <section className="space-y-4">
        {saved.map((v) => {
          const t = calcTco(v!, profile);
          return (
            <div
              key={v!.slug}
              className="flex flex-col justify-between gap-3 rounded-xl border border-slate-200 p-5 sm:flex-row sm:items-center"
            >
              <div>
                <p className="font-semibold">
                  {v!.year} {v!.make} {v!.model}{" "}
                  <span className="font-normal text-ink-faint">({v!.trim})</span>
                </p>
                <p className="mt-1 text-sm text-ink-soft">
                  {usd(v!.msrp)} MSRP · {v!.mpgCombined}{" "}
                  {v!.fuelType === "ev" ? "MPGe" : "MPG"} · {profile.years}-yr cost ~{usd(t.total)}
                </p>
              </div>
              <button
                onClick={() => toggle(v!.slug)}
                className="shrink-0 self-start rounded-full border border-slate-200 px-4 py-1.5 text-sm text-ink-soft transition hover:border-red-300 hover:text-red-600 sm:self-auto"
              >
                Remove
              </button>
            </div>
          );
        })}
      </section>

      {pairs.length > 0 && (
        <section className="mt-10">
          <h2 className="mb-4 text-xl font-semibold tracking-tight">Compare your picks</h2>
          <div className="flex flex-wrap gap-2">
            {pairs.slice(0, 10).map(([x, y]) => {
              const vx = vehicles.find((v) => v.slug === x)!;
              const vy = vehicles.find((v) => v.slug === y)!;
              return (
                <a
                  key={x + y}
                  href={`/compare/${buildPairSlug(x, y)}`}
                  className="rounded-full border border-slate-200 px-4 py-1.5 text-sm text-ink-soft transition hover:border-brand hover:text-ink"
                >
                  {vx.model} vs {vy.model}
                </a>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}
