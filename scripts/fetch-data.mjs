// Refreshes MPG data in data/vehicles.json from FuelEconomy.gov (free, no key).
// Usage: npm run fetch-data
// Note: the API is slow (2-5s per request) - this is fine for 8 vehicles,
// but for hundreds of models download their CSV dumps instead:
// https://www.fueleconomy.gov/feg/download.shtml

import { readFileSync, writeFileSync } from "node:fs";

const FILE = new URL("../data/vehicles.json", import.meta.url);
const BASE = "https://www.fueleconomy.gov/ws/rest";

async function getJson(url) {
  const res = await fetch(url, { headers: { Accept: "application/json" } });
  if (!res.ok) throw new Error(`${res.status} ${url}`);
  return res.json();
}

async function refreshVehicle(v) {
  try {
    const menu = await getJson(
      `${BASE}/vehicle/menu/options?year=${v.year}&make=${encodeURIComponent(v.make)}&model=${encodeURIComponent(v.model)}`
    );
    const items = Array.isArray(menu.menuItem) ? menu.menuItem : [menu.menuItem];
    if (!items[0]) return v;
    const detail = await getJson(`${BASE}/vehicle/${items[0].value}`);
    return {
      ...v,
      mpgCity: Number(detail.city08) || v.mpgCity,
      mpgHighway: Number(detail.highway08) || v.mpgHighway,
      mpgCombined: Number(detail.comb08) || v.mpgCombined,
    };
  } catch (e) {
    console.warn(`skip ${v.slug}: ${e.message}`);
    return v;
  }
}

const vehicles = JSON.parse(readFileSync(FILE, "utf8"));
const updated = [];
for (const v of vehicles) {
  console.log(`fetching ${v.slug}...`);
  updated.push(await refreshVehicle(v));
}
writeFileSync(FILE, JSON.stringify(updated, null, 2) + "\n");
console.log("done: data/vehicles.json updated");
