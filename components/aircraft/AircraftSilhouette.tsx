import { cn } from "@/lib/utils";

export type AircraftVariant = "b747" | "b777" | "b767" | "b757" | "a300" | "a330";

interface AircraftSilhouetteProps {
  variant: AircraftVariant;
  className?: string;
  /** Silhouette fill color. Defaults to DHL red. */
  color?: string;
}

interface Spec {
  /** Fuselage length in artboard units. */
  len: number;
  /** Fuselage diameter. */
  fh: number;
  /** Boeing 747 raised upper-deck hump. */
  hump: boolean;
  /** Engine nacelles visible per near wing (4-engine jets show 2). */
  engines: number;
  /** Nacelle scale. */
  engSize: number;
  /** Vertical tail fin height. */
  tailH: number;
  /** Wing sweep scale. */
  wing: number;
}

const SPECS: Record<AircraftVariant, Spec> = {
  // 747 — the unmistakable forward hump and four engines (two per side visible).
  b747: { len: 300, fh: 36, hump: true, engines: 2, engSize: 1.0, tailH: 60, wing: 1.12 },
  // 777 — long twin with very large engines.
  b777: { len: 300, fh: 33, hump: false, engines: 1, engSize: 1.55, tailH: 54, wing: 1.06 },
  // 767 — medium widebody twin.
  b767: { len: 246, fh: 30, hump: false, engines: 1, engSize: 1.2, tailH: 50, wing: 1.0 },
  // 757 — slender narrowbody with a notably tall tail.
  b757: { len: 252, fh: 25, hump: false, engines: 1, engSize: 1.1, tailH: 58, wing: 0.95 },
  // A300 — shorter widebody twin.
  a300: { len: 224, fh: 33, hump: false, engines: 1, engSize: 1.28, tailH: 50, wing: 1.0 },
  // A330 — long widebody twin.
  a330: { len: 276, fh: 33, hump: false, engines: 1, engSize: 1.34, tailH: 55, wing: 1.1 },
};

type Pt = readonly [number, number];

function lerp(a: Pt, b: Pt, t: number): Pt {
  return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];
}

function pts(arr: Pt[]): string {
  return arr.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(" ");
}

/**
 * Clean side-profile silhouette of a cargo aircraft. Nose points right.
 * Composed of overlapping same-color shapes that read as one silhouette.
 */
export function AircraftSilhouette({
  variant,
  className,
  color = "var(--dhl-red)",
}: AircraftSilhouetteProps) {
  const s = SPECS[variant];
  const cx = 200;
  const cy = 92;
  const len = s.len;
  const fh = s.fh;
  const top = cy - fh / 2;
  const bottom = cy + fh / 2;
  const tailX = cx - len / 2;
  const noseX = cx + len / 2;

  // ---- Fuselage outline (with optional 747 hump) ----
  const humpStart = tailX + len * 0.26;
  const humpEnd = tailX + len * 0.5;
  const humpH = fh * 0.62;
  const noseTopStart = noseX - fh * 0.85;

  const fuselage = [
    `M ${tailX} ${cy}`,
    `Q ${tailX} ${top} ${tailX + fh * 0.5} ${top}`,
    s.hump
      ? `L ${humpStart} ${top} ` +
        `C ${humpStart + len * 0.05} ${top - humpH} ${humpEnd - len * 0.06} ${top - humpH} ${humpEnd} ${top}`
      : "",
    `L ${noseTopStart} ${top}`,
    // Drooped cockpit nose
    `Q ${noseX} ${top} ${noseX} ${cy - fh * 0.12}`,
    `Q ${noseX + fh * 0.18} ${cy + fh * 0.3} ${noseTopStart} ${bottom}`,
    `L ${tailX + fh * 0.5} ${bottom}`,
    `Q ${tailX} ${bottom} ${tailX} ${cy}`,
    "Z",
  ]
    .filter(Boolean)
    .join(" ");

  // ---- Vertical tail fin (swept up and back/left) ----
  const finBackX = tailX + fh * 0.35;
  const fin: Pt[] = [
    [finBackX, top + 2],
    [finBackX + len * 0.16, top + 2],
    [finBackX + len * 0.06, top - s.tailH],
    [finBackX - fh * 0.05, top - s.tailH * 0.96],
  ];

  // ---- Horizontal stabilizer (rear, pointing left) ----
  const stab: Pt[] = [
    [tailX + len * 0.12, cy - 1],
    [tailX - len * 0.02, cy - fh * 0.62],
    [tailX - len * 0.02, cy - fh * 0.2],
  ];

  // ---- Main wing (swept down-left, edge-on) ----
  const wRootFront: Pt = [cx + len * 0.12, cy + fh * 0.2];
  const wRootBack: Pt = [cx - len * 0.04, cy + fh * 0.28];
  const wTip: Pt = [cx - len * 0.28 * s.wing, cy + fh * 0.55 + 30];
  const wTipBack: Pt = [cx - len * 0.34 * s.wing, cy + fh * 0.55 + 32];
  const wing: Pt[] = [wRootFront, wTip, wTipBack, wRootBack];

  // ---- Engine nacelles under the wing ----
  const engineFractions = s.engines === 2 ? [0.42, 0.74] : [0.58];
  const engW = 26 * s.engSize;
  const engH = 13 * s.engSize;

  return (
    <svg
      role="img"
      aria-label={`${variant.toUpperCase()} aircraft silhouette`}
      viewBox="0 0 400 184"
      className={cn("block h-auto w-full", className)}
      fill={color}
    >
      {/* wing + engines behind the fuselage for correct overlap */}
      <polygon points={pts(wing)} />
      {engineFractions.map((t, i) => {
        const c = lerp(wRootFront, wTip, t);
        const ex = c[0] - engW / 2;
        const ey = c[1] + 4;
        return (
          <g key={i}>
            {/* pylon */}
            <rect x={c[0] - 1.5} y={c[1] - 8} width={3} height={14} />
            {/* nacelle */}
            <rect x={ex} y={ey} width={engW} height={engH} rx={engH / 2} />
          </g>
        );
      })}
      <polygon points={pts(stab)} />
      <path d={fuselage} />
      <polygon points={pts(fin)} />
    </svg>
  );
}
