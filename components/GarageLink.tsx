"use client";

import Link from "next/link";
import { useGarage } from "@/components/profile";

export default function GarageLink() {
  const [garage] = useGarage();
  return (
    <Link href="/garage" className="hover:text-ink">
      Garage{garage.length > 0 ? ` (${garage.length})` : ""}
    </Link>
  );
}
