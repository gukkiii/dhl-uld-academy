"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import type { Aircraft } from "@/lib/data/types";
import { AircraftCard } from "@/components/aircraft/AircraftCard";
import { AircraftLoadingDiagram } from "@/components/aircraft/AircraftLoadingDiagram";
import { Badge } from "@/components/ui/badge";

function fmt(n: number): string {
  return n.toLocaleString("en-US");
}

const gridVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07 } },
};

interface AircraftGalleryProps {
  aircraft: Aircraft[];
}

export function AircraftGallery({ aircraft }: AircraftGalleryProps) {
  const [selected, setSelected] = useState<Aircraft | null>(null);

  // Close on Escape + lock body scroll while the dialog is open.
  useEffect(() => {
    if (!selected) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelected(null);
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [selected]);

  return (
    <>
      <motion.div
        variants={gridVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3"
      >
        {aircraft.map((ac) => (
          <AircraftCard key={ac.id} aircraft={ac} onOpenDiagram={setSelected} />
        ))}
      </motion.div>

      <AnimatePresence>
        {selected && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* backdrop */}
            <button
              type="button"
              aria-label="Close dialog"
              onClick={() => setSelected(null)}
              className="absolute inset-0 bg-dhl-ink/50 backdrop-blur-sm"
            />

            <motion.div
              role="dialog"
              aria-modal="true"
              aria-label={`${selected.name} loading diagram`}
              initial={{ opacity: 0, scale: 0.96, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 12 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              className="relative z-10 flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl bg-card shadow-xl ring-1 ring-foreground/10"
            >
              <div className="flex items-start justify-between gap-4 border-b border-border px-5 py-4">
                <div>
                  <h2 className="font-heading text-lg font-semibold text-dhl-ink">
                    {selected.name}
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    Loading configuration · {fmt(selected.maxPayloadKg)} kg max payload
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setSelected(null)}
                  aria-label="Close"
                  className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-dhl-ink focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
                >
                  <X className="size-5" />
                </button>
              </div>

              <div className="flex flex-col gap-4 overflow-y-auto p-5">
                <div className="rounded-xl border border-border bg-dhl-surface/60 p-3">
                  <AircraftLoadingDiagram aircraft={selected} />
                </div>

                <div className="flex flex-wrap items-center gap-4 text-sm">
                  <Legend color="var(--dhl-yellow)" label="Main-deck pallets" />
                  <Legend color="var(--dhl-red)" label="Lower-deck containers" />
                </div>

                <div>
                  <p className="mb-1.5 text-xs font-medium text-dhl-ink">
                    Carries
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {selected.compatibleUlds.map((code) => (
                      <Badge key={code} variant="secondary" className="font-mono">
                        {code}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function Legend({ color, label }: { color: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-muted-foreground">
      <span
        className="size-3 rounded-sm ring-1 ring-foreground/15"
        style={{ background: color }}
        aria-hidden
      />
      {label}
    </span>
  );
}
