"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, Minus, X } from "lucide-react";
import type { Aircraft, CompatCell, CompatLevel, Uld } from "@/lib/data/types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

interface CompatibilityMatrixProps {
  aircraft: Aircraft[];
  ulds: Uld[];
  matrix: CompatCell[];
}

interface Selection {
  cell: CompatCell;
  aircraft: Aircraft;
  uld: Uld;
}

const LEVEL_STYLES: Record<CompatLevel, string> = {
  full: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300",
  partial: "bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300",
  none: "text-muted-foreground/50",
};

function LevelMark({ level }: { level: CompatLevel }) {
  if (level === "full") return <Check className="size-4" aria-label="Full fit" />;
  if (level === "partial")
    return (
      <span className="text-base leading-none font-bold" aria-label="Partial fit">
        ~
      </span>
    );
  return <Minus className="size-3.5" aria-label="Not compatible" />;
}

export function CompatibilityMatrix({
  aircraft,
  ulds,
  matrix,
}: CompatibilityMatrixProps) {
  const [aircraftFilter, setAircraftFilter] = useState<string>("all");
  const [uldFilter, setUldFilter] = useState<string>("all");
  const [selected, setSelected] = useState<Selection | null>(null);

  const cellMap = useMemo(() => {
    const m = new Map<string, CompatCell>();
    for (const c of matrix) m.set(`${c.aircraftId}:${c.uldCode}`, c);
    return m;
  }, [matrix]);

  const isRowActive = (id: string) =>
    aircraftFilter === "all" || aircraftFilter === id;
  const isColActive = (code: string) =>
    uldFilter === "all" || uldFilter === code;

  return (
    <div className="flex flex-col gap-5">
      {/* Filters */}
      <div className="flex flex-wrap items-end gap-4">
        <Field label="Aircraft">
          <Select
            value={aircraftFilter}
            onValueChange={(v) => setAircraftFilter((v as string) ?? "all")}
          >
            <SelectTrigger className="w-48">
              <SelectValue placeholder="All aircraft" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All aircraft</SelectItem>
              {aircraft.map((a) => (
                <SelectItem key={a.id} value={a.id}>
                  {a.code}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>
        <Field label="ULD type">
          <Select
            value={uldFilter}
            onValueChange={(v) => setUldFilter((v as string) ?? "all")}
          >
            <SelectTrigger className="w-48">
              <SelectValue placeholder="All ULDs" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All ULDs</SelectItem>
              {ulds.map((u) => (
                <SelectItem key={u.code} value={u.code}>
                  {u.code}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>

        <div className="ml-auto flex flex-wrap items-center gap-4 text-sm">
          <LegendItem level="full" label="Full" />
          <LegendItem level="partial" label="Partial" />
          <LegendItem level="none" label="None" />
        </div>
      </div>

      {/* Matrix */}
      <div className="overflow-x-auto rounded-xl ring-1 ring-foreground/10">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr>
              <th className="sticky left-0 z-20 bg-dhl-red px-3 py-2.5 text-left font-heading text-xs font-semibold text-white">
                Aircraft \ ULD
              </th>
              {ulds.map((u) => (
                <th
                  key={u.code}
                  className={cn(
                    "min-w-14 bg-dhl-red px-2 py-2.5 text-center font-mono text-xs font-semibold text-white transition-opacity",
                    !isColActive(u.code) && "opacity-30",
                  )}
                  title={u.name}
                >
                  {u.code}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {aircraft.map((a, rowIdx) => (
              <tr
                key={a.id}
                className={cn(
                  "transition-opacity",
                  rowIdx % 2 === 1 && "bg-muted/30",
                  !isRowActive(a.id) && "opacity-30",
                )}
              >
                <th
                  scope="row"
                  className={cn(
                    "sticky left-0 z-10 whitespace-nowrap border-r border-border px-3 py-2 text-left font-mono text-xs font-medium text-dhl-ink",
                    rowIdx % 2 === 1 ? "bg-[#f6f3f3] dark:bg-muted/60" : "bg-card",
                  )}
                >
                  {a.code}
                </th>
                {ulds.map((u) => {
                  const cell = cellMap.get(`${a.id}:${u.code}`);
                  const level: CompatLevel = cell?.level ?? "none";
                  const dimmed = !isRowActive(a.id) || !isColActive(u.code);
                  const isSelected =
                    selected?.cell.aircraftId === a.id &&
                    selected?.cell.uldCode === u.code;
                  return (
                    <td key={u.code} className="p-0 text-center">
                      <button
                        type="button"
                        onClick={() =>
                          cell && setSelected({ cell, aircraft: a, uld: u })
                        }
                        aria-label={`${a.code} and ${u.code}: ${level} compatibility`}
                        className={cn(
                          "flex h-10 w-full items-center justify-center transition-colors",
                          LEVEL_STYLES[level],
                          !dimmed && "hover:brightness-95",
                          isSelected && "ring-2 ring-inset ring-dhl-red",
                        )}
                      >
                        <LevelMark level={level} />
                      </button>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Cell detail panel */}
      <AnimatePresence mode="wait">
        {selected && (
          <motion.div
            key={`${selected.cell.aircraftId}:${selected.cell.uldCode}`}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.2 }}
            className="rounded-xl border border-border bg-card p-4 ring-1 ring-foreground/5"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <LevelBadge level={selected.cell.level} />
                  <span className="font-heading text-base font-semibold text-dhl-ink">
                    {selected.aircraft.code} × {selected.uld.code}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">
                  {selected.aircraft.name} · {selected.uld.name}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelected(null)}
                aria-label="Dismiss"
                className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-dhl-ink focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
              >
                <X className="size-4" />
              </button>
            </div>
            <p className="mt-2 text-sm leading-relaxed text-dhl-ink">
              {selected.cell.note ??
                (selected.cell.level === "full"
                  ? `The ${selected.uld.code} loads into standard ${selected.aircraft.code} positions.`
                  : `The ${selected.aircraft.code} does not carry the ${selected.uld.code}.`)}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-xs font-medium text-muted-foreground">{label}</span>
      {children}
    </label>
  );
}

function LegendItem({ level, label }: { level: CompatLevel; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-muted-foreground">
      <span
        className={cn(
          "flex size-5 items-center justify-center rounded-sm ring-1 ring-foreground/10",
          LEVEL_STYLES[level],
        )}
      >
        <LevelMark level={level} />
      </span>
      {label}
    </span>
  );
}

function LevelBadge({ level }: { level: CompatLevel }) {
  return (
    <span
      className={cn(
        "flex size-6 items-center justify-center rounded-md ring-1 ring-foreground/10",
        LEVEL_STYLES[level],
      )}
    >
      <LevelMark level={level} />
    </span>
  );
}
