import vehiclesJson from "../../data/vehicles.json";
import safetyJson from "../../data/safety.json";

export interface Vehicle {
  slug: string;
  make: string;
  model: string;
  year: number;
  trim: string;
  bodyType: string;
  fuelType: "gas" | "hybrid" | "ev";
  msrp: number;
  mpgCity: number;
  mpgHighway: number;
  mpgCombined: number;
  evKwhPer100Mi?: number;
  horsepower: number;
  seats: number;
  cargoCuFt: number;
  nhtsaOverall: number;
  drivetrain: string;
  goodFor: string[];
  notFor: string[];
  watchOuts: string[];
}

export interface SafetyInfo {
  recallsCount: number;
  complaintsCount: number;
  recallSummaries: string[];
}

export const vehicles = vehiclesJson as Vehicle[];

const safetyData = safetyJson as Record<string, SafetyInfo>;

export const dataStatus = {
  vehicles: vehicles.length,
  makes: [...new Set(vehicles.map((v) => v.make))].length,
  updated: "August 2026",
};

export function getSafety(slug: string): SafetyInfo | undefined {
  return safetyData[slug];
}

export function getVehicle(slug: string): Vehicle | undefined {
  return vehicles.find((v) => v.slug === slug);
}

export interface Comparison {
  slug: string;
  a: string;
  b: string;
  verdict: string;
}

export const comparisons: Comparison[] = [
  {
    slug: "honda-cr-v-vs-toyota-rav4",
    a: "honda-cr-v-2025",
    b: "toyota-rav4-2025",
    verdict:
      "The RAV4 undercuts the CR-V on price and holds its value slightly better, while the CR-V counters with more cargo space and a more refined ride. Fuel costs are a wash at 30 MPG combined for both. If you haul family gear weekly, the CR-V's extra space wins; if you want the lower 5-year total cost, take the RAV4.",
  },
  {
    slug: "honda-civic-vs-toyota-corolla",
    a: "honda-civic-2025",
    b: "toyota-corolla-2025",
    verdict:
      "The Corolla is the value pick: lower MSRP and slightly better fuel economy keep its 5-year cost below the Civic's. The Civic answers with sharper handling, a roomier trunk and a nicer interior. Buy the Corolla as an appliance, the Civic if you actually like driving.",
  },
  {
    slug: "toyota-camry-vs-honda-accord",
    a: "toyota-camry-2025",
    b: "honda-accord-2025",
    verdict:
      "The 2025 Camry is hybrid-only, and its 51 MPG combined crushes the base Accord's 32 MPG - that alone saves roughly $2,800 in fuel over 5 years. The Accord offers a bigger trunk and a quieter highway ride. Unless you specifically want the Accord's cabin, the Camry hybrid is the rational choice.",
  },
  {
    slug: "tesla-model-y-vs-toyota-rav4",
    a: "tesla-model-y-2025",
    b: "toyota-rav4-2025",
    verdict:
      "The Model Y costs about $12,700 more upfront but spends roughly a third as much on energy per mile. Over 5 years the gap narrows yet the RAV4 still wins on total cost for most drivers; the Model Y wins on performance (384 hp), tech and home-charging convenience. Choose by budget first, charging access second.",
  },
  {
    slug: "tesla-model-3-vs-toyota-camry",
    a: "tesla-model-3-2025",
    b: "toyota-camry-2025",
    verdict:
      "The Camry hybrid is so efficient that the Model 3's electricity advantage shrinks to a few hundred dollars a year. With a ~$13,800 lower MSRP, the Camry wins the 5-year cost race comfortably. The Model 3 is the pick for performance and tech, not for savings.",
  },
  {
    slug: "honda-cr-v-vs-tesla-model-y",
    a: "honda-cr-v-2025",
    b: "tesla-model-y-2025",
    verdict:
      "A practical-family classic versus the default EV. The CR-V is cheaper to buy and offers more cargo room; the Model Y is far quicker and cheaper per mile if you can charge at home. Without home charging, stick with the CR-V - public-charger pricing erases most of the EV savings.",
  },
];

export function getComparison(slug: string) {
  const c = comparisons.find((x) => x.slug === slug);
  if (!c) return undefined;
  const a = getVehicle(c.a);
  const b = getVehicle(c.b);
  if (!a || !b) return undefined;
  return { ...c, vehicleA: a, vehicleB: b };
}

export function buildPairSlug(aSlug: string, bSlug: string): string {
  const curated = comparisons.find(
    (comparison) =>
      (comparison.a === aSlug && comparison.b === bSlug) ||
      (comparison.a === bSlug && comparison.b === aSlug)
  );
  if (curated) return curated.slug;
  return [aSlug, bSlug].sort().join("-vs-");
}

export function autoVerdict(a: Vehicle, b: Vehicle): string {
  const ta = calcTco(a);
  const tb = calcTco(b);
  const parts: string[] = [];
  const priceCheap = a.msrp <= b.msrp ? a : b;
  const priceExp = a.msrp <= b.msrp ? b : a;
  parts.push(
    `The ${priceCheap.make} ${priceCheap.model} starts lower at ${usd(priceCheap.msrp)} vs ${usd(priceExp.msrp)} for the ${priceExp.make} ${priceExp.model}.`
  );
  if (a.mpgCombined !== b.mpgCombined) {
    const eff = a.mpgCombined > b.mpgCombined ? a : b;
    const other = eff === a ? b : a;
    const unit = eff.fuelType === "ev" || other.fuelType === "ev" ? "MPG/MPGe" : "MPG";
    parts.push(
      `The ${eff.model} is more efficient (${eff.mpgCombined} vs ${other.mpgCombined} ${unit} combined).`
    );
  }
  if (a.cargoCuFt !== b.cargoCuFt) {
    const roomy = a.cargoCuFt > b.cargoCuFt ? a : b;
    parts.push(`The ${roomy.model} offers more cargo space.`);
  }
  const tcoWinner = ta.total <= tb.total ? a : b;
  const diff = Math.abs(ta.total - tb.total);
  parts.push(
    `Bottom line: over 5 years the ${tcoWinner.make} ${tcoWinner.model} costs about ${usd(diff)} less to own.`
  );
  return parts.join(" ");
}

export function resolvePair(slug: string) {
  const curated = getComparison(slug);
  if (curated) return curated;
  const parts = slug.split("-vs-");
  if (parts.length !== 2) return undefined;
  const a = getVehicle(parts[0]);
  const b = getVehicle(parts[1]);
  if (!a || !b || a.slug === b.slug) return undefined;
  return { slug, a: a.slug, b: b.slug, verdict: autoVerdict(a, b), vehicleA: a, vehicleB: b };
}

const ASSUMPTIONS = {
  milesPerYear: 15000,
  years: 5,
  gasPricePerGallon: 3.2,
  electricityPerKwh: 0.16,
  insurancePerYear: { gas: 1850, hybrid: 1900, ev: 2350 },
  maintenancePerYear: { gas: 720, hybrid: 680, ev: 420 },
  depreciationPct: { gas: 0.45, hybrid: 0.42, ev: 0.5 },
};

export interface Tco {
  fuel: number;
  insurance: number;
  maintenance: number;
  depreciation: number;
  total: number;
}

export type TcoOverrides = Partial<
  Pick<typeof ASSUMPTIONS, "milesPerYear" | "years" | "gasPricePerGallon" | "electricityPerKwh">
>;

export function calcTco(v: Vehicle, o: TcoOverrides = {}): Tco {
  const milesPerYear = o.milesPerYear ?? ASSUMPTIONS.milesPerYear;
  const years = o.years ?? ASSUMPTIONS.years;
  const gasPrice = o.gasPricePerGallon ?? ASSUMPTIONS.gasPricePerGallon;
  const kwhPrice = o.electricityPerKwh ?? ASSUMPTIONS.electricityPerKwh;
  const fuel =
    v.fuelType === "ev" && v.evKwhPer100Mi
      ? (milesPerYear / 100) * v.evKwhPer100Mi * kwhPrice * years
      : (milesPerYear / v.mpgCombined) * gasPrice * years;
  const insurance = ASSUMPTIONS.insurancePerYear[v.fuelType] * years;
  const maintenance = ASSUMPTIONS.maintenancePerYear[v.fuelType] * years;
  const depreciation =
    v.msrp * Math.min(0.8, ASSUMPTIONS.depreciationPct[v.fuelType] * (years / 5));
  const total = fuel + insurance + maintenance + depreciation;
  return {
    fuel: Math.round(fuel),
    insurance: Math.round(insurance),
    maintenance: Math.round(maintenance),
    depreciation: Math.round(depreciation),
    total: Math.round(total),
  };
}

export const tcoAssumptions = ASSUMPTIONS;

export function usd(n: number): string {
  return "$" + n.toLocaleString("en-US");
}

export interface Scenario {
  slug: string;
  title: string;
  intro: string;
  picks: { vehicle: string; blurb: string }[];
}

export const scenarios: Scenario[] = [
  {
    slug: "best-family-suv-under-40k",
    title: "Best family SUV under $40k",
    intro:
      "Two compact SUVs dominate this budget for a reason: room for a family, 30 MPG and top safety ratings. We ranked them by 5-year cost of ownership and day-to-day usability, with one over-budget stretch pick.",
    picks: [
      {
        vehicle: "toyota-rav4-2025",
        blurb:
          "The value leader: lowest sticker price here, identical 30 MPG to the CR-V and the strongest resale value in the class. The trade-off is a louder cabin and firmer ride.",
      },
      {
        vehicle: "honda-cr-v-2025",
        blurb:
          "The comfort pick: more cargo space than the RAV4, a quieter ride and a nicer interior. Costs slightly more to buy and own - worth it if you do long family trips.",
      },
      {
        vehicle: "tesla-model-y-2025",
        blurb:
          "The stretch pick at $44,990: triple the horsepower, a fraction of the energy cost per mile if you charge at home. Skip it if you can't charge at home or insurance quotes come back high.",
      },
    ],
  },
  {
    slug: "best-commuter-car",
    title: "Best commuter car for high mileage",
    intro:
      "If you drive 15,000+ miles a year, fuel economy is the whole game. These four are ranked by real cost per mile, using EPA data and our 5-year ownership model.",
    picks: [
      {
        vehicle: "toyota-camry-2025",
        blurb:
          "51 MPG combined makes the hybrid Camry the cheapest gas car to run, period. It beats even EVs once you factor in the purchase price.",
      },
      {
        vehicle: "tesla-model-3-2025",
        blurb:
          "Cheapest per mile with home charging (~4¢/mile), quick and quiet. The catch: higher purchase price and insurance eat much of the fuel savings.",
      },
      {
        vehicle: "toyota-corolla-2025",
        blurb:
          "The budget answer: $23,520 to buy, 35 MPG, legendary durability. Nothing about it excites, everything about it works.",
      },
      {
        vehicle: "honda-civic-2025",
        blurb:
          "Nearly Corolla economy with actual driving enjoyment and a roomier trunk. Pay about $2,800 more upfront for the privilege.",
      },
    ],
  },
  {
    slug: "best-american-cars",
    title: "Best American cars in 2026",
    intro:
      "With the Camaro and Challenger discontinued, the American performance and truck market has consolidated around a few icons. Here's what still makes the case - and what to watch out for.",
    picks: [
      {
        vehicle: "ford-f-150-2025",
        blurb:
          "America's best-selling vehicle for four decades. The 2.7L EcoBoost XLT is the smart configuration: real towing ability without the Raptor price. Watch the options list - it inflates fast.",
      },
      {
        vehicle: "ford-mustang-2025",
        blurb:
          "The last affordable American sports coupe standing. The EcoBoost delivers 315 hp and 33 MPG highway; the V8 GT is the emotional choice at a higher budget.",
      },
      {
        vehicle: "tesla-model-y-2025",
        blurb:
          "Often forgotten in this conversation: built in Texas and California, and the best-selling American-made vehicle globally. The strongest tech of anything on this page.",
      },
    ],
  },
  {
    slug: "best-first-car",
    title: "Best first car under $30k",
    intro:
      "A first car should be cheap to insure, hard to break and tolerant of mistakes. Both picks here have 5-star NHTSA ratings, modest power and the lowest running costs in our database.",
    picks: [
      {
        vehicle: "toyota-corolla-2025",
        blurb:
          "The default first car: lowest price and insurance in our database, bulletproof reputation, 35 MPG. Boring is a feature when you're learning.",
      },
      {
        vehicle: "honda-civic-2025",
        blurb:
          "For the new driver who actually likes driving: sharper handling and a nicer cabin than the Corolla, still cheap to run. Costs a bit more to buy and insure.",
      },
    ],
  },
];

export function getScenario(slug: string): Scenario | undefined {
  return scenarios.find((s) => s.slug === slug);
}

export function dealerQuestions(v: Vehicle, s?: SafetyInfo): string[] {
  const qs: string[] = [
    "What's the out-the-door price with every fee and dealer add-on itemized in writing?",
    "Can I see the window sticker and a list of any dealer-installed options I'm being charged for?",
  ];
  if (s && s.recallsCount > 0) {
    qs.push(
      `NHTSA lists ${s.recallsCount} ${s.recallsCount === 1 ? "recall" : "recalls"} for the ${v.year} ${v.model} - can you show written proof the recall work has been completed on this VIN?`
    );
  }
  if (v.fuelType === "ev") {
    qs.push(
      "Can you provide a battery health report and confirm exactly when the battery warranty started?"
    );
  }
  if (v.fuelType === "hybrid") {
    qs.push(
      "How much of the hybrid battery warranty (10 years / 150k miles) remains from the original in-service date?"
    );
  }
  qs.push("If I'm not financing through you, does the price change - and by how much?");
  return qs;
}
