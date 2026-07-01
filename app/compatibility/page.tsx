import type { Metadata } from "next";
import { aircraft, compatibilityMatrix, ulds } from "@/lib/data";
import { CompatibilityMatrix } from "@/components/compatibility/CompatibilityMatrix";

export const metadata: Metadata = {
  title: "Compatibility",
  description:
    "Interactive aircraft × ULD compatibility matrix for the DHL freighter fleet. Filter by aircraft or ULD and inspect each fit, including position restrictions.",
};

export default function CompatibilityPage() {
  return (
    <div className="flex flex-col gap-8">
      <header className="flex flex-col gap-3">
        <div className="dhl-accent-bar h-1 w-24 rounded-full" aria-hidden />
        <h1 className="text-3xl font-bold tracking-tight text-dhl-ink sm:text-4xl">
          ULD ↔ Aircraft{" "}
          <span className="text-dhl-red">Compatibility</span>
        </h1>
        <p className="max-w-prose text-base leading-relaxed text-muted-foreground">
          Which ULD loads onto which freighter. Filter the matrix by aircraft or
          ULD type, and tap any cell for the detail — including the partial fits
          that are restricted to specific positions.
        </p>
      </header>

      <CompatibilityMatrix
        aircraft={aircraft}
        ulds={ulds}
        matrix={compatibilityMatrix}
      />
    </div>
  );
}
