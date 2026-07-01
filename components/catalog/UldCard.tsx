"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { RotateCw, Ruler, Weight, Box, Layers, Plane } from "lucide-react";
import type { Uld } from "@/lib/data/types";
import { UldIllustration } from "@/components/uld/UldIllustration";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const CONTOUR_LABEL: Record<Uld["contour"], string> = {
  "lower-deck": "Lower deck",
  "main-deck": "Main deck",
  pallet: "Pallet",
};

function fmt(n: number): string {
  return n.toLocaleString("en-US");
}

interface UldCardProps {
  uld: Uld;
  /** Map of aircraft id → short code, for the compatible-aircraft chips. */
  aircraftCodeById: Record<string, string>;
}

/**
 * A single ULD catalog card with a 3D flip:
 * front = illustration + identity, back = full spec sheet + compatibility.
 */
export function UldCard({ uld, aircraftCodeById }: UldCardProps) {
  const [flipped, setFlipped] = useState(false);

  const compatCodes = uld.compatibleAircraft
    .map((id) => aircraftCodeById[id])
    .filter(Boolean);

  return (
    <div className="h-[360px] [perspective:1600px]">
      <motion.button
        type="button"
        onClick={() => setFlipped((f) => !f)}
        aria-pressed={flipped}
        aria-label={`${uld.code} — ${uld.name}. Show ${flipped ? "overview" : "full specifications"}.`}
        className="relative h-full w-full rounded-xl text-left outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* ---------- FRONT ---------- */}
        <div
          className="absolute inset-0 flex flex-col overflow-hidden rounded-xl bg-card ring-1 ring-foreground/10 transition-shadow [backface-visibility:hidden] hover:shadow-md"
          aria-hidden={flipped}
        >
          <div className="dhl-gradient-soft relative flex flex-1 items-center justify-center">
            <UldIllustration shape={uld.shape} accent={uld.accentColor} size={180} />
            <Badge
              variant="outline"
              className="absolute top-3 left-3 bg-card/80 backdrop-blur-sm"
            >
              {CONTOUR_LABEL[uld.contour]}
            </Badge>
            {uld.iataName !== "—" && (
              <Badge className="absolute top-3 right-3 bg-dhl-red">
                {uld.iataName}
              </Badge>
            )}
          </div>
          <div className="flex items-end justify-between gap-2 border-t border-border px-4 py-3">
            <div className="min-w-0">
              <div className="font-heading text-2xl font-bold tracking-tight text-dhl-ink">
                {uld.code}
              </div>
              <p className="truncate text-sm text-muted-foreground">{uld.name}</p>
            </div>
            <span className="flex shrink-0 items-center gap-1 text-xs font-medium text-dhl-red">
              <RotateCw className="size-3.5" aria-hidden />
              Specs
            </span>
          </div>
        </div>

        {/* ---------- BACK ---------- */}
        <div
          className="absolute inset-0 flex flex-col overflow-hidden rounded-xl bg-card ring-1 ring-foreground/10 [backface-visibility:hidden] [transform:rotateY(180deg)]"
          aria-hidden={!flipped}
        >
          <div className="flex items-center justify-between gap-2 border-b border-border bg-dhl-surface px-4 py-2.5">
            <span className="font-heading text-base font-semibold text-dhl-ink">
              {uld.code}
            </span>
            <span className="flex items-center gap-1 text-xs font-medium text-dhl-red">
              <RotateCw className="size-3.5" aria-hidden />
              Overview
            </span>
          </div>

          <div className="flex flex-1 flex-col gap-2.5 overflow-y-auto px-4 py-3 text-sm">
            <SpecRow icon={Ruler} label="Dimensions">
              <span>
                {uld.dimensionsCm.l}×{uld.dimensionsCm.w}×{uld.dimensionsCm.h} cm
              </span>
              <span className="text-muted-foreground">
                {uld.dimensionsIn.l}×{uld.dimensionsIn.w}×{uld.dimensionsIn.h} in
              </span>
            </SpecRow>
            <SpecRow icon={Weight} label="Max gross">
              <span>{fmt(uld.maxGrossWeightKg)} kg</span>
              <span className="text-muted-foreground">
                {fmt(uld.maxGrossWeightLbs)} lbs
              </span>
            </SpecRow>
            <SpecRow icon={Box} label="Volume">
              <span>{uld.volumeM3} m³</span>
            </SpecRow>
            <SpecRow icon={Layers} label="Contour">
              <span>{CONTOUR_LABEL[uld.contour]}</span>
            </SpecRow>

            <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">
              {uld.useCase}
            </p>

            <div className="mt-auto border-t border-border pt-2.5">
              <div className="mb-1.5 flex items-center gap-1.5 text-xs font-medium text-dhl-ink">
                <Plane className="size-3.5 text-dhl-red" aria-hidden />
                Compatible aircraft
              </div>
              {compatCodes.length > 0 ? (
                <div className="flex flex-wrap gap-1">
                  {compatCodes.map((code) => (
                    <Badge key={code} variant="secondary" className="font-mono">
                      {code}
                    </Badge>
                  ))}
                </div>
              ) : (
                <Badge variant="outline" className="border-dashed text-muted-foreground">
                  Reference only — not in the DHL freighter fleet
                </Badge>
              )}
            </div>
          </div>
        </div>
      </motion.button>
    </div>
  );
}

function SpecRow({
  icon: Icon,
  label,
  children,
}: {
  icon: typeof Ruler;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-2.5">
      <Icon className="mt-0.5 size-4 shrink-0 text-dhl-red" aria-hidden />
      <div className="flex min-w-0 flex-1 flex-col">
        <span className="text-xs text-muted-foreground">{label}</span>
        <div className={cn("flex flex-wrap items-baseline gap-x-2 font-medium text-dhl-ink")}>
          {children}
        </div>
      </div>
    </div>
  );
}
