"use client";

import { motion } from "framer-motion";
import { Gauge, Route, LayoutPanelTop, PanelBottom, Maximize2 } from "lucide-react";
import type { Aircraft } from "@/lib/data/types";
import { AircraftSilhouette } from "@/components/aircraft/AircraftSilhouette";
import { variantForAircraftId } from "@/components/aircraft/aircraft-variant";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

function fmt(n: number): string {
  return n.toLocaleString("en-US");
}

function summarize(positions: { uldType: string; count: number }[]): string {
  return positions.map((p) => `${p.uldType} ×${p.count}`).join(" · ");
}

const cardVariants = {
  hidden: { opacity: 0, y: 18 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] as const },
  },
};

interface AircraftCardProps {
  aircraft: Aircraft;
  onOpenDiagram: (aircraft: Aircraft) => void;
}

export function AircraftCard({ aircraft, onOpenDiagram }: AircraftCardProps) {
  return (
    <motion.article
      variants={cardVariants}
      className="group flex flex-col overflow-hidden rounded-xl bg-card ring-1 ring-foreground/10 transition-shadow hover:shadow-md"
    >
      {/* Silhouette banner */}
      <div className="dhl-gradient-soft relative flex items-center justify-center px-6 py-7">
        <Badge
          variant="outline"
          className="absolute top-3 right-3 bg-card/80 backdrop-blur-sm"
        >
          {aircraft.bodyType === "wide" ? "Widebody" : "Narrowbody"}
        </Badge>
        <AircraftSilhouette
          variant={variantForAircraftId(aircraft.id)}
          color="var(--dhl-ink)"
          className="max-w-[260px] transition-transform duration-500 group-hover:scale-[1.03]"
        />
      </div>

      <div className="flex flex-1 flex-col gap-3 p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <h2 className="font-heading text-lg font-semibold tracking-tight text-dhl-ink">
              {aircraft.name}
            </h2>
            <p className="font-mono text-xs text-muted-foreground">{aircraft.code}</p>
          </div>
          <Badge
            className={
              aircraft.manufacturer === "Boeing"
                ? "bg-dhl-red"
                : "bg-dhl-ink text-white"
            }
          >
            {aircraft.manufacturer}
          </Badge>
        </div>

        {/* Key stats */}
        <div className="grid grid-cols-2 gap-3">
          <Stat icon={Gauge} label="Max payload">
            <span className="font-semibold text-dhl-ink">
              {fmt(aircraft.maxPayloadKg)} kg
            </span>
            <span className="block text-xs text-muted-foreground">
              {fmt(aircraft.maxPayloadLbs)} lbs
            </span>
          </Stat>
          <Stat icon={Route} label="Range">
            <span className="font-semibold text-dhl-ink">
              {fmt(aircraft.rangeKm)} km
            </span>
            <span className="block text-xs text-muted-foreground">
              {fmt(aircraft.rangeNm)} nm
            </span>
          </Stat>
        </div>

        <Separator />

        {/* Deck positions */}
        <div className="flex flex-col gap-2 text-sm">
          <Stat icon={LayoutPanelTop} label="Main deck">
            <span className="font-medium text-dhl-ink">
              {summarize(aircraft.mainDeck)}
            </span>
          </Stat>
          <Stat icon={PanelBottom} label="Lower deck">
            <span className="font-medium text-dhl-ink">
              {summarize(aircraft.lowerDeck)}
            </span>
          </Stat>
        </div>

        {/* Compatible ULDs */}
        <div>
          <p className="mb-1.5 text-xs font-medium text-dhl-ink">Compatible ULDs</p>
          <div className="flex flex-wrap gap-1">
            {aircraft.compatibleUlds.map((code) => (
              <Badge key={code} variant="secondary" className="font-mono">
                {code}
              </Badge>
            ))}
          </div>
        </div>

        <button
          type="button"
          onClick={() => onOpenDiagram(aircraft)}
          className="mt-auto inline-flex items-center justify-center gap-1.5 rounded-lg bg-dhl-red px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-dhl-red-dark focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
        >
          <Maximize2 className="size-4" aria-hidden />
          Loading diagram
        </button>
      </div>
    </motion.article>
  );
}

function Stat({
  icon: Icon,
  label,
  children,
}: {
  icon: typeof Gauge;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-2">
      <Icon className="mt-0.5 size-4 shrink-0 text-dhl-red" aria-hidden />
      <div className="min-w-0">
        <span className="block text-xs text-muted-foreground">{label}</span>
        {children}
      </div>
    </div>
  );
}
