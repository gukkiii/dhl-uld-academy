import type { Metadata } from "next";
import { aircraft, ulds } from "@/lib/data";
import { UldCatalog } from "@/components/catalog/UldCatalog";

export const metadata: Metadata = {
  title: "ULD Types",
  description:
    "Catalog of Unit Load Devices used across the DHL freighter fleet — lower-deck containers, main-deck pallets, reefers and contoured units with full specifications.",
};

export default function UldTypesPage() {
  const aircraftCodeById: Record<string, string> = Object.fromEntries(
    aircraft.map((a) => [a.id, a.code]),
  );

  return (
    <div className="flex flex-col gap-8">
      <header className="flex flex-col gap-3">
        <div className="dhl-accent-bar h-1 w-24 rounded-full" aria-hidden />
        <h1 className="text-3xl font-bold tracking-tight text-dhl-ink sm:text-4xl">
          ULD <span className="text-dhl-red">Types</span>
        </h1>
        <p className="max-w-prose text-base leading-relaxed text-muted-foreground">
          The {ulds.length} Unit Load Devices that move air cargo across the DHL
          freighter fleet. Tap any card to flip it for full dimensions, weight
          limits and aircraft compatibility.
        </p>
      </header>

      <UldCatalog ulds={ulds} aircraftCodeById={aircraftCodeById} />
    </div>
  );
}
