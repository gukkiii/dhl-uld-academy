import type { Metadata } from "next";
import { aircraft, ulds } from "@/lib/data";
import { AircraftGallery } from "@/components/aircraft/AircraftGallery";

export const metadata: Metadata = {
  title: "Aircraft",
  description:
    "The DHL freighter fleet — from the four-engine Boeing 747-8F to widebody twins and the 757 narrowbody. Payload, range, deck configuration and loading diagrams.",
};

export default function AircraftPage() {
  return (
    <div className="flex flex-col gap-8">
      <header className="flex flex-col gap-3">
        <div className="dhl-accent-bar h-1 w-24 rounded-full" aria-hidden />
        <h1 className="text-3xl font-bold tracking-tight text-dhl-ink sm:text-4xl">
          Aircraft <span className="text-dhl-red">Fleet</span>
        </h1>
        <p className="max-w-prose text-base leading-relaxed text-muted-foreground">
          The {aircraft.length} freighters of the DHL fleet, each profiled with
          payload, range and deck configuration. Open the loading diagram to see
          how main-deck pallets and lower-deck containers stow.
        </p>
      </header>

      <AircraftGallery aircraft={aircraft} ulds={ulds} />
    </div>
  );
}
