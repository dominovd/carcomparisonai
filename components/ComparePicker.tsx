"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { buildPairSlug, vehicles, type Vehicle } from "@/lib/vehicles";

function vehicleLabel(v: Vehicle) {
  return `${v.year} ${v.make} ${v.model}`;
}

function vehicleSearchText(v: Vehicle) {
  return `${v.year} ${v.make} ${v.model} ${v.trim} ${v.bodyType} ${v.fuelType} ${v.drivetrain}`.toLowerCase();
}

function VehicleCombobox({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (slug: string) => void;
}) {
  const selected = vehicles.find((v) => v.slug === value) ?? vehicles[0];
  const [query, setQuery] = useState(vehicleLabel(selected));
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const listId = `${label.toLowerCase().replace(/\s+/g, "-")}-results`;

  useEffect(() => {
    setQuery(vehicleLabel(selected));
  }, [selected.slug]);

  useEffect(() => {
    function onPointerDown(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
        setQuery(vehicleLabel(selected));
      }
    }

    document.addEventListener("mousedown", onPointerDown);
    return () => document.removeEventListener("mousedown", onPointerDown);
  }, [selected]);

  const matches = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized || normalized === vehicleLabel(selected).toLowerCase()) {
      return vehicles.slice(0, 8);
    }

    return vehicles
      .filter((vehicle) => vehicleSearchText(vehicle).includes(normalized))
      .slice(0, 8);
  }, [query, selected]);

  function pick(vehicle: Vehicle) {
    onChange(vehicle.slug);
    setQuery(vehicleLabel(vehicle));
    setOpen(false);
  }

  return (
    <div ref={rootRef} className="relative">
      <label className="sr-only" htmlFor={listId}>
        {label}
      </label>
      <div className="relative">
        <input
          id={listId}
          type="search"
          role="combobox"
          aria-label={label}
          aria-expanded={open}
          aria-controls={`${listId}-listbox`}
          aria-autocomplete="list"
          value={query}
          onFocus={(event) => {
            setOpen(true);
            event.currentTarget.select();
          }}
          onChange={(event) => {
            setQuery(event.target.value);
            setOpen(true);
          }}
          onKeyDown={(event) => {
            if (event.key === "Escape") {
              setOpen(false);
              setQuery(vehicleLabel(selected));
            }
            if (event.key === "Enter" && matches[0]) {
              event.preventDefault();
              pick(matches[0]);
            }
          }}
          placeholder="Search make, model, trim..."
          className="h-12 w-full rounded-lg border border-slate-300 bg-white pl-10 pr-9 text-sm text-ink shadow-sm outline-none transition placeholder:text-ink-faint focus:border-brand focus:ring-2 focus:ring-brand-light"
        />
        <svg
          viewBox="0 0 20 20"
          aria-hidden="true"
          className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-faint"
        >
          <path
            d="m14 14 3 3M8.5 15a6.5 6.5 0 1 1 0-13 6.5 6.5 0 0 1 0 13Z"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeWidth="1.8"
          />
        </svg>
        <svg
          viewBox="0 0 20 20"
          aria-hidden="true"
          className={[
            "pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-faint transition",
            open ? "rotate-180" : "",
          ].join(" ")}
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
      </div>

      {open && (
        <div
          id={`${listId}-listbox`}
          role="listbox"
          className="absolute left-0 right-0 top-14 z-30 max-h-80 overflow-auto rounded-xl border border-slate-200 bg-white p-1.5 shadow-2xl shadow-slate-900/15"
        >
          {matches.length > 0 ? (
            matches.map((vehicle) => (
              <button
                key={vehicle.slug}
                type="button"
                role="option"
                aria-selected={vehicle.slug === value}
                onClick={() => pick(vehicle)}
                className={[
                  "flex w-full items-start justify-between gap-3 rounded-lg px-3 py-2.5 text-left transition hover:bg-slate-50",
                  vehicle.slug === value ? "bg-brand-light" : "",
                ].join(" ")}
              >
                <span>
                  <span className="block text-sm font-semibold text-ink">
                    {vehicleLabel(vehicle)}
                  </span>
                  <span className="mt-0.5 block text-xs text-ink-soft">
                    {vehicle.trim} · {vehicle.bodyType} · {vehicle.mpgCombined} MPG
                  </span>
                </span>
                {vehicle.slug === value && (
                  <span className="mt-0.5 text-sm font-semibold text-brand-dark">Selected</span>
                )}
              </button>
            ))
          ) : (
            <div className="px-3 py-4 text-sm text-ink-soft">
              No cars found. Try a make, model, body type or year.
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function ComparePicker() {
  const router = useRouter();
  const [a, setA] = useState(vehicles[0].slug);
  const [b, setB] = useState(vehicles[1].slug);
  const same = a === b;

  return (
    <div className="mt-8 max-w-3xl rounded-2xl border border-slate-200 bg-white/95 p-3 shadow-xl shadow-slate-200/70 sm:p-4">
      <div className="mb-3 flex items-center justify-between gap-3 px-1 text-xs font-semibold uppercase tracking-wide text-ink-faint">
        <span>Build a comparison</span>
        <span className="hidden text-brand-dark sm:inline">Search by make, model, trim or type</span>
      </div>
      <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)_auto] lg:items-center">
        <VehicleCombobox label="First car" value={a} onChange={setA} />
        <span className="shrink-0 text-center text-sm font-semibold text-ink-faint">vs</span>
        <VehicleCombobox label="Second car" value={b} onChange={setB} />
        <button
          onClick={() => router.push(`/compare/${buildPairSlug(a, b)}`)}
          disabled={same}
          className="h-12 shrink-0 rounded-lg bg-brand px-6 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-dark disabled:cursor-not-allowed disabled:opacity-40"
        >
          Compare
        </button>
      </div>
      <div className="mt-3 flex flex-wrap items-center justify-between gap-2 px-1">
        <p className="text-xs text-ink-faint">Tip: type “Toyota”, “SUV”, “hybrid”, “Tesla” or “2025”.</p>
        {same && (
          <p className="text-xs font-medium text-red-600">Pick two different cars to compare.</p>
        )}
      </div>
    </div>
  );
}
