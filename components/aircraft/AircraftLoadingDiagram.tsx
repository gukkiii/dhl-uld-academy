"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Aircraft, Uld } from "@/lib/data/types";
import { cn } from "@/lib/utils";

// Pallets always go on the main deck; everything else is lower-deck
const MAIN_DECK_CODES = new Set(["PMC", "PGA", "AMF", "PKC"]);

const GROUP_COLORS = [
  // [0] main deck – yellow
  { active: "#FFCC00", dim: "rgba(255,204,0,0.15)", stroke: "rgba(160,130,0,0.5)" },
  // [1] lower deck primary (AKE etc.) – DHL red
  { active: "#D40511", dim: "rgba(212,5,17,0.15)", stroke: "rgba(140,0,0,0.45)" },
  // [2] lower deck secondary (AKH etc.) – darker red
  { active: "#922B21", dim: "rgba(146,43,33,0.15)", stroke: "rgba(100,20,10,0.45)" },
] as const;

// ── Domain helpers ────────────────────────────────────────────────────────────

interface Group {
  id: string;
  deck: "main" | "lower";
  primaryCode: string;
  alternateCodes: string[];
  count: number;
  colorIdx: number;
}

function buildGroups(aircraft: Aircraft): Group[] {
  const groups: Group[] = [];

  // Main deck
  const mainCount = aircraft.mainDeck.reduce((s, p) => s + p.count, 0);
  const mainPrimary = aircraft.mainDeck[0]?.uldType ?? "PMC";
  const mainAlts = aircraft.compatibleUlds.filter(
    (c) => MAIN_DECK_CODES.has(c) && c !== mainPrimary,
  );
  groups.push({
    id: "main",
    deck: "main",
    primaryCode: mainPrimary,
    alternateCodes: mainAlts,
    count: mainCount,
    colorIdx: 0,
  });

  // Lower deck (one or two position groups)
  aircraft.lowerDeck.forEach((pos, i) => {
    // For the first lower group, alternates are compatible lower-deck ULDs
    // not claimed by any other explicit lower group
    const alts =
      i === 0
        ? aircraft.compatibleUlds.filter(
            (c) =>
              !MAIN_DECK_CODES.has(c) &&
              c !== pos.uldType &&
              !aircraft.lowerDeck.slice(1).some((p) => p.uldType === c),
          )
        : [];
    groups.push({
      id: `lower-${i}`,
      deck: "lower",
      primaryCode: pos.uldType,
      alternateCodes: alts,
      count: pos.count,
      colorIdx: i + 1,
    });
  });

  return groups;
}

function groupMatches(group: Group, code: string): boolean {
  return group.primaryCode === code || group.alternateCodes.includes(code);
}

// ── Slot row (SVG) ────────────────────────────────────────────────────────────

const MAX_VISUAL = 22;

interface SlotRowProps {
  x: number;
  y: number;
  w: number;
  h: number;
  count: number;
  colors: (typeof GROUP_COLORS)[number];
  dimmed: boolean;
  mountDelay: number;
}

function SlotRow({ x, y, w, h, count, colors, dimmed, mountDelay }: SlotRowProps) {
  const n = Math.min(count, MAX_VISUAL);
  const gap = 3;
  const boxW = Math.max((w - gap * (n - 1)) / n, 6);

  return (
    <>
      {Array.from({ length: n }, (_, i) => (
        <motion.rect
          key={i}
          x={x + i * (boxW + gap)}
          y={y}
          width={boxW}
          height={h}
          rx={2.5}
          initial={{ opacity: 0 }}
          animate={{
            opacity: dimmed ? 0.18 : 1,
            fill: dimmed ? colors.dim : colors.active,
          }}
          transition={{
            opacity: {
              delay: dimmed ? 0 : mountDelay + i * 0.035,
              duration: 0.3,
            },
            fill: { duration: 0.18 },
          }}
          stroke={dimmed ? "transparent" : colors.stroke}
          strokeWidth={0.8}
        />
      ))}
    </>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

interface AircraftLoadingDiagramProps {
  aircraft: Aircraft;
  ulds: Uld[];
  className?: string;
}

export function AircraftLoadingDiagram({
  aircraft,
  ulds,
  className,
}: AircraftLoadingDiagramProps) {
  const [activeCode, setActiveCode] = useState<string | null>(null);

  const groups = buildGroups(aircraft);
  const lowerGroups = groups.filter((g) => g.deck === "lower");
  const mainGroup = groups.find((g) => g.id === "main")!;
  const totalLowerCount = lowerGroups.reduce((s, g) => s + g.count, 0);
  const hasMultipleLower = lowerGroups.length > 1;

  const selectedUld = activeCode ? ulds.find((u) => u.code === activeCode) : null;

  // ── SVG layout ────────────────────────────────────────────────────────────
  const W = 560;
  const H = aircraft.bodyType === "wide" ? 230 : 200;
  const padX = 28;
  const bodyLeft = padX + 14;
  const bodyRight = W - padX - 60;
  const bodyW = bodyRight - bodyLeft;
  const bodyTop = 12;
  const bodyBottom = H - 12;
  const cy = (bodyTop + bodyBottom) / 2;
  const floorY =
    bodyTop + (bodyBottom - bodyTop) * (aircraft.bodyType === "wide" ? 0.5 : 0.56);

  const slotPad = 8;
  const mainSlotX = bodyLeft + slotPad;
  const mainSlotW = bodyW - slotPad * 2;
  const mainSlotY = bodyTop + 20;
  const mainSlotH = floorY - bodyTop - 28;
  const lowerSlotY = floorY + 10;
  const lowerSlotH = bodyBottom - floorY - 18;

  return (
    <div className={cn("flex flex-col gap-4", className)}>

      {/* ── ULD selector pills ────────────────────────────────────────────── */}
      <div>
        <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Tap a ULD to highlight its positions
        </p>
        <div className="flex flex-wrap gap-1.5">
          {aircraft.compatibleUlds.map((code) => {
            const isActive = activeCode === code;
            const label = ulds.find((u) => u.code === code)?.iataName;
            return (
              <button
                key={code}
                type="button"
                onClick={() => setActiveCode(isActive ? null : code)}
                className={cn(
                  "relative rounded-md border px-2.5 py-0.5 font-mono text-[13px] font-semibold transition-all duration-150",
                  isActive
                    ? "border-dhl-ink bg-dhl-ink text-white shadow scale-105"
                    : "border-border bg-card text-dhl-ink hover:border-dhl-red hover:text-dhl-red",
                )}
              >
                {code}
                {label && label !== "—" && (
                  <span className="ml-1 font-sans text-[10px] font-normal opacity-60">
                    {label}
                  </span>
                )}
              </button>
            );
          })}
          {activeCode && (
            <button
              type="button"
              onClick={() => setActiveCode(null)}
              className="rounded-md border border-dashed border-border px-2.5 py-0.5 text-xs text-muted-foreground transition-colors hover:border-dhl-red hover:text-dhl-red"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* ── Fuselage cross-section diagram ───────────────────────────────── */}
      <div className="overflow-hidden rounded-xl border border-border bg-dhl-surface/50">
        <svg
          viewBox={`0 0 ${W} ${H}`}
          className="block h-auto w-full"
          role="img"
          aria-label={`${aircraft.name} ULD position loading diagram`}
        >
          {/* Fuselage body */}
          <path
            d={[
              `M ${bodyLeft} ${bodyTop}`,
              `L ${bodyRight} ${bodyTop}`,
              `Q ${bodyRight + 52} ${bodyTop + 2} ${bodyRight + 56} ${cy}`,
              `Q ${bodyRight + 52} ${bodyBottom - 2} ${bodyRight} ${bodyBottom}`,
              `L ${bodyLeft} ${bodyBottom}`,
              `Q ${padX - 6} ${bodyBottom} ${padX} ${cy}`,
              `Q ${padX - 6} ${bodyTop} ${bodyLeft} ${bodyTop}`,
              "Z",
            ].join(" ")}
            fill="var(--dhl-surface)"
            stroke="rgba(20,23,28,0.2)"
            strokeWidth={2}
          />

          {/* Cockpit glazing */}
          <path
            d={`M ${bodyRight + 22} ${bodyTop + 10}
                Q ${bodyRight + 50} ${bodyTop + 14} ${bodyRight + 52} ${cy - 5}
                L ${bodyRight + 36} ${cy - 5} Z`}
            fill="rgba(20,23,28,0.22)"
          />

          {/* Deck floor */}
          <line
            x1={bodyLeft + 4}
            y1={floorY}
            x2={bodyRight + 6}
            y2={floorY}
            stroke="rgba(20,23,28,0.2)"
            strokeWidth={1.5}
            strokeDasharray="7 5"
          />

          {/* ── Main deck slots ────────────────────────────────────────── */}
          <SlotRow
            x={mainSlotX}
            y={mainSlotY}
            w={mainSlotW}
            h={mainSlotH}
            count={mainGroup.count}
            colors={GROUP_COLORS[mainGroup.colorIdx]}
            dimmed={activeCode !== null && !groupMatches(mainGroup, activeCode)}
            mountDelay={0.08}
          />

          {/* ── Lower deck slot groups ─────────────────────────────────── */}
          {(() => {
            let curX = bodyLeft + slotPad;
            return lowerGroups.map((group, gi) => {
              const proportion = hasMultipleLower
                ? group.count / totalLowerCount
                : 1;
              const available = mainSlotW;
              const groupW = available * proportion - (gi > 0 ? 6 : 0);
              const el = (
                <SlotRow
                  key={group.id}
                  x={curX}
                  y={lowerSlotY}
                  w={groupW}
                  h={lowerSlotH}
                  count={group.count}
                  colors={GROUP_COLORS[group.colorIdx]}
                  dimmed={
                    activeCode !== null && !groupMatches(group, activeCode)
                  }
                  mountDelay={0.18 + gi * 0.12}
                />
              );
              curX += groupW + 6;
              return el;
            });
          })()}

          {/* ── Deck section labels ────────────────────────────────────── */}
          <g fontFamily="inherit" fill="rgba(20,23,28,0.45)" fontSize={10} fontWeight={600}>
            {/* Main deck */}
            <text x={bodyLeft + slotPad} y={mainSlotY - 6}>
              MAIN DECK — {mainGroup.primaryCode} ×{mainGroup.count}
              {mainGroup.alternateCodes.length > 0 &&
                ` (alt: ${mainGroup.alternateCodes.join(", ")})`}
            </text>

            {/* Lower deck groups */}
            {(() => {
              let curX = bodyLeft + slotPad;
              return lowerGroups.map((group, gi) => {
                const proportion = hasMultipleLower
                  ? group.count / totalLowerCount
                  : 1;
                const groupW = mainSlotW * proportion - (gi > 0 ? 6 : 0);
                const labelX = curX;
                curX += groupW + 6;
                return (
                  <text key={group.id} x={labelX} y={lowerSlotY + lowerSlotH + 12}>
                    {group.primaryCode} ×{group.count}
                    {group.alternateCodes.length > 0 &&
                      ` / ${group.alternateCodes.join(", ")}`}
                  </text>
                );
              });
            })()}
          </g>
        </svg>
      </div>

      {/* ── Selected ULD detail card ──────────────────────────────────────── */}
      <AnimatePresence mode="wait">
        {selectedUld ? (
          <motion.div
            key={selectedUld.code}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            transition={{ duration: 0.18 }}
            className="rounded-xl border border-border bg-card p-3.5"
          >
            <div className="flex items-baseline gap-2 mb-1">
              <span className="font-mono text-sm font-bold text-dhl-red">
                {selectedUld.code}
              </span>
              <span className="text-xs text-muted-foreground">
                {selectedUld.iataName !== "—" && `IATA ${selectedUld.iataName} · `}
                {selectedUld.name}
              </span>
            </div>
            <p className="text-xs leading-relaxed text-muted-foreground mb-2">
              {selectedUld.useCase}
            </p>
            <div className="flex flex-wrap gap-4 text-xs">
              <Stat label="Max weight">
                {selectedUld.maxGrossWeightKg.toLocaleString()} kg ·{" "}
                {selectedUld.maxGrossWeightLbs.toLocaleString()} lbs
              </Stat>
              <Stat label="Volume">{selectedUld.volumeM3} m³</Stat>
              <Stat label="Deck">
                {MAIN_DECK_CODES.has(selectedUld.code) ? "Main deck" : "Lower deck"}
              </Stat>
            </div>
          </motion.div>
        ) : activeCode ? (
          <motion.p
            key="none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="rounded-xl border border-dashed border-muted-foreground/30 px-4 py-3 text-sm text-muted-foreground"
          >
            {activeCode} is not in this aircraft&apos;s ULD list — select one of the
            highlighted codes above.
          </motion.p>
        ) : (
          <motion.p
            key="hint"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-xs text-muted-foreground"
          >
            Select a ULD code above to highlight where it sits and see full specifications.
          </motion.p>
        )}
      </AnimatePresence>

      {/* ── Legend ───────────────────────────────────────────────────────── */}
      <div className="flex flex-wrap gap-4 border-t border-border pt-3 text-xs text-muted-foreground">
        <LegendDot color={GROUP_COLORS[0].active} label={`Main deck (${mainGroup.count} positions)`} />
        {lowerGroups.map((g) => (
          <LegendDot
            key={g.id}
            color={GROUP_COLORS[g.colorIdx].active}
            label={`${g.primaryCode} — ${g.count} lower-deck positions`}
          />
        ))}
      </div>
    </div>
  );
}

function Stat({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <span>
      <span className="text-dhl-ink/60">{label}: </span>
      <strong className="font-medium text-dhl-ink">{children}</strong>
    </span>
  );
}

function LegendDot({ color, label }: { color: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <span
        className="inline-block size-2.5 rounded-sm ring-1 ring-foreground/10"
        style={{ background: color }}
        aria-hidden
      />
      {label}
    </span>
  );
}
