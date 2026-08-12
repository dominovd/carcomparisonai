import { useGarage } from "@/components/profile";

export default function GarageLink() {
  const [garage] = useGarage();
  return (
    <a href="/garage" className="hover:text-ink">
      Garage{garage.length > 0 ? ` (${garage.length})` : ""}
    </a>
  );
}
