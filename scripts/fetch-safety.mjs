// Fetches recalls and complaint counts from NHTSA (free, no key) into data/safety.json.
// Usage: node scripts/fetch-safety.mjs   (re-run to resume; pass --force to refetch all)
// Re-run periodically (e.g. monthly) and commit the updated JSON.

import { readFileSync, writeFileSync, existsSync } from "node:fs";

const VEHICLES = new URL("../data/vehicles.json", import.meta.url);
const OUT = new URL("../data/safety.json", import.meta.url);
const force = process.argv.includes("--force");

async function getJson(url) {
  const res = await fetch(url, { headers: { Accept: "application/json" } });
  if (!res.ok) throw new Error(`${res.status} ${url}`);
  return res.json();
}

const vehicles = JSON.parse(readFileSync(VEHICLES, "utf8"));
const safety = existsSync(OUT) && !force ? JSON.parse(readFileSync(OUT, "utf8")) : {};

for (const v of vehicles) {
  if (safety[v.slug]) continue;
  const make = encodeURIComponent(v.make);
  const model = encodeURIComponent(v.model);
  try {
    const recalls = await getJson(
      `https://api.nhtsa.gov/recalls/recallsByVehicle?make=${make}&model=${model}&modelYear=${v.year}`
    );
    const complaints = await getJson(
      `https://api.nhtsa.gov/complaints/complaintsByVehicle?make=${make}&model=${model}&modelYear=${v.year}`
    );
    safety[v.slug] = {
      recallsCount: recalls.Count ?? 0,
      complaintsCount: complaints.Count ?? 0,
      recallSummaries: (recalls.results ?? [])
        .slice(0, 3)
        .map((r) => `${r.Component}: ${(r.Summary ?? "").slice(0, 160)}`),
    };
    console.log(`${v.slug}: ${safety[v.slug].recallsCount} recalls, ${safety[v.slug].complaintsCount} complaints`);
    writeFileSync(OUT, JSON.stringify(safety, null, 2) + "\n");
  } catch (e) {
    console.warn(`skip ${v.slug}: ${e.message}`);
  }
}
console.log("done: data/safety.json");
