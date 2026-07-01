"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import type { ContourType, Uld } from "@/lib/data/types";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UldCard } from "./UldCard";

type Filter = "all" | ContourType;

const FILTERS: { value: Filter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "lower-deck", label: "Lower deck" },
  { value: "main-deck", label: "Main deck" },
  { value: "pallet", label: "Pallets" },
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
};

const item = {
  hidden: { opacity: 0, y: 18 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] as const },
  },
};

interface UldCatalogProps {
  ulds: Uld[];
  aircraftCodeById: Record<string, string>;
}

/** Client island: contour filter + staggered, flippable ULD card grid. */
export function UldCatalog({ ulds, aircraftCodeById }: UldCatalogProps) {
  const [filter, setFilter] = useState<Filter>("all");

  const visible = useMemo(
    () => (filter === "all" ? ulds : ulds.filter((u) => u.contour === filter)),
    [ulds, filter],
  );

  return (
    <div className="flex flex-col gap-5">
      <Tabs
        value={filter}
        onValueChange={(v) => setFilter(v as Filter)}
        className="w-full"
      >
        <TabsList className="flex-wrap">
          {FILTERS.map((f) => (
            <TabsTrigger key={f.value} value={f.value}>
              {f.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      <motion.div
        key={filter}
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3"
      >
        {visible.map((uld) => (
          <motion.div key={uld.code} variants={item}>
            <UldCard uld={uld} aircraftCodeById={aircraftCodeById} />
          </motion.div>
        ))}
      </motion.div>

      {visible.length === 0 && (
        <p className="py-12 text-center text-sm text-muted-foreground">
          No ULDs match this filter.
        </p>
      )}
    </div>
  );
}
