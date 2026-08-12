import { useEffect, useState } from "react";
import { tcoAssumptions } from "@/lib/vehicles";

const PROFILE_KEY = "cca-profile";
const GARAGE_KEY = "cca-garage";

export interface Profile {
  milesPerYear: number;
  years: number;
  gasPricePerGallon: number;
  electricityPerKwh: number;
}

export const defaultProfile: Profile = {
  milesPerYear: tcoAssumptions.milesPerYear,
  years: tcoAssumptions.years,
  gasPricePerGallon: tcoAssumptions.gasPricePerGallon,
  electricityPerKwh: tcoAssumptions.electricityPerKwh,
};

export function useProfile(): [Profile, (p: Profile) => void] {
  const [profile, setProfile] = useState<Profile>(defaultProfile);
  useEffect(() => {
    try {
      const raw = localStorage.getItem(PROFILE_KEY);
      if (raw) setProfile({ ...defaultProfile, ...JSON.parse(raw) });
    } catch {}
  }, []);
  const save = (p: Profile) => {
    setProfile(p);
    try {
      localStorage.setItem(PROFILE_KEY, JSON.stringify(p));
    } catch {}
  };
  return [profile, save];
}

function readGarage(): string[] {
  try {
    return JSON.parse(localStorage.getItem(GARAGE_KEY) ?? "[]");
  } catch {
    return [];
  }
}

export function useGarage(): [string[], (slug: string) => void] {
  const [garage, setGarage] = useState<string[]>([]);
  useEffect(() => {
    const load = () => setGarage(readGarage());
    load();
    window.addEventListener("cca-garage", load);
    return () => window.removeEventListener("cca-garage", load);
  }, []);
  const toggle = (slug: string) => {
    try {
      const cur = readGarage();
      const next = cur.includes(slug) ? cur.filter((s) => s !== slug) : [...cur, slug];
      localStorage.setItem(GARAGE_KEY, JSON.stringify(next));
      window.dispatchEvent(new Event("cca-garage"));
    } catch {}
  };
  return [garage, toggle];
}
