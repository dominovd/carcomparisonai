import { useGarage } from "@/components/profile";

export default function GarageButton({ slug, label }: { slug: string; label: string }) {
  const [garage, toggle] = useGarage();
  const saved = garage.includes(slug);
  return (
    <button
      onClick={() => toggle(slug)}
      className={
        "rounded-full border px-4 py-1.5 text-sm font-medium transition " +
        (saved
          ? "border-brand bg-brand-light text-brand-dark"
          : "border-slate-200 text-ink-soft hover:border-brand hover:text-ink")
      }
    >
      {saved ? `✓ ${label} in garage` : `+ Save ${label}`}
    </button>
  );
}
