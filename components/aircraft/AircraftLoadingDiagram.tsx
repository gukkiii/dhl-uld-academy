import type { Aircraft, DeckPosition } from "@/lib/data/types";
import { cn } from "@/lib/utils";

interface AircraftLoadingDiagramProps {
  aircraft: Aircraft;
  className?: string;
}

const RED = "var(--dhl-red)";
const YELLOW = "var(--dhl-yellow)";

function sumCount(positions: DeckPosition[]): number {
  return positions.reduce((acc, p) => acc + p.count, 0);
}

function summarize(positions: DeckPosition[]): string {
  return positions.map((p) => `${p.uldType} ×${p.count}`).join(" · ");
}

/** Draw a row of evenly spaced unit boxes inside the given band. */
function DeckRow({
  x,
  y,
  width,
  height,
  drawn,
  fill,
}: {
  x: number;
  y: number;
  width: number;
  height: number;
  drawn: number;
  fill: string;
}) {
  const gap = 4;
  const boxW = (width - gap * (drawn - 1)) / drawn;
  return (
    <g>
      {Array.from({ length: drawn }, (_, i) => (
        <rect
          key={i}
          x={x + i * (boxW + gap)}
          y={y}
          width={boxW}
          height={height}
          rx={3}
          fill={fill}
          stroke="rgba(20,23,28,0.18)"
          strokeWidth={1}
        />
      ))}
    </g>
  );
}

/**
 * Schematic side cross-section of a freighter: main-deck pallet row above the
 * cabin floor, lower-deck container row below. On-brand, not to scale.
 * Widebodies show a tall double-deck belly; the 757 narrowbody is slimmer with
 * a shallow lower hold.
 */
export function AircraftLoadingDiagram({
  aircraft,
  className,
}: AircraftLoadingDiagramProps) {
  const wide = aircraft.bodyType === "wide";

  // Artboard
  const W = 480;
  const H = wide ? 220 : 188;
  const padX = 24;

  // Fuselage body box (cabin region), nose to the right.
  const bodyLeft = padX + 18; // tail taper space
  const bodyRight = W - padX - 70; // nose cone space
  const bodyW = bodyRight - bodyLeft;
  const bodyTop = 30;
  const bodyBottom = H - 34;

  // Decks
  const floorY = wide ? bodyTop + (bodyBottom - bodyTop) * 0.52 : bodyTop + (bodyBottom - bodyTop) * 0.58;
  const mainCount = sumCount(aircraft.mainDeck);
  const lowerCount = sumCount(aircraft.lowerDeck);
  const mainDrawn = Math.min(Math.max(mainCount, 1), wide ? 9 : 7);
  const lowerDrawn = Math.min(Math.max(lowerCount, 1), wide ? 11 : 7);

  const cy = (bodyTop + bodyBottom) / 2;

  return (
    <svg
      role="img"
      aria-label={`${aircraft.name} loading diagram: main deck ${summarize(
        aircraft.mainDeck,
      )}, lower deck ${summarize(aircraft.lowerDeck)}`}
      viewBox={`0 0 ${W} ${H}`}
      className={cn("block h-auto w-full", className)}
    >
      {/* ---- Fuselage outline ---- */}
      <path
        d={[
          `M ${bodyLeft} ${bodyTop}`,
          `L ${bodyRight} ${bodyTop}`,
          // nose cone
          `Q ${bodyRight + 64} ${bodyTop} ${bodyRight + 66} ${cy}`,
          `Q ${bodyRight + 64} ${bodyBottom} ${bodyRight} ${bodyBottom}`,
          `L ${bodyLeft} ${bodyBottom}`,
          // tail taper
          `Q ${padX - 6} ${bodyBottom} ${padX} ${cy}`,
          `Q ${padX - 6} ${bodyTop} ${bodyLeft} ${bodyTop}`,
          "Z",
        ].join(" ")}
        fill="var(--dhl-surface)"
        stroke="rgba(20,23,28,0.22)"
        strokeWidth={2}
      />

      {/* cockpit window */}
      <path
        d={`M ${bodyRight + 28} ${bodyTop + 8} Q ${bodyRight + 52} ${bodyTop + 10} ${bodyRight + 54} ${cy - 8} L ${bodyRight + 40} ${cy - 8} Z`}
        fill="rgba(20,23,28,0.30)"
      />

      {/* cabin floor */}
      <line
        x1={bodyLeft}
        y1={floorY}
        x2={bodyRight + 6}
        y2={floorY}
        stroke="rgba(20,23,28,0.30)"
        strokeWidth={1.5}
        strokeDasharray="5 4"
      />

      {/* ---- Main deck (pallets, yellow) ---- */}
      <DeckRow
        x={bodyLeft + 8}
        y={bodyTop + 10}
        width={bodyW - 4}
        height={floorY - bodyTop - 20}
        drawn={mainDrawn}
        fill={YELLOW}
      />

      {/* ---- Lower deck (containers, red) ---- */}
      <DeckRow
        x={bodyLeft + 8}
        y={floorY + 8}
        width={bodyW - 4}
        height={bodyBottom - floorY - 16}
        drawn={lowerDrawn}
        fill={RED}
      />

      {/* ---- Labels ---- */}
      <g fontSize={12} fontWeight={600} fill="var(--dhl-ink)">
        <text x={padX} y={20}>
          Main deck
        </text>
        <text x={padX} y={H - 12}>
          Lower deck
        </text>
      </g>
      <g fontSize={11} fill="var(--muted-foreground)">
        <text x={padX + 78} y={20}>
          {summarize(aircraft.mainDeck)}
        </text>
        <text x={padX + 78} y={H - 12}>
          {summarize(aircraft.lowerDeck)}
        </text>
      </g>
    </svg>
  );
}
