import { cn } from "@/lib/utils";

export type UldShape =
  | "container"
  | "container-tall"
  | "pallet"
  | "reefer"
  | "contoured"
  | "container-full";

interface UldIllustrationProps {
  shape: UldShape;
  /** Highlight color for the front face of the load. Defaults to DHL red. */
  accent?: string;
  className?: string;
  /** Rendered size in px (the SVG is square). */
  size?: number;
}

/* ---- Isometric projection helpers (module scope, pure) ---- */
type Pt = readonly [number, number];

const COS30 = Math.cos(Math.PI / 6); // ≈ 0.866
const U = 27; // unit size in px
const OX = 100; // origin x within the 200×200 artboard
const OY = 104; // origin y

/** Project a 3D point (x right, y depth, z up) onto the 2D isometric plane. */
function project(x: number, y: number, z: number): Pt {
  return [OX + (x - y) * COS30 * U, OY + ((x + y) / 2 - z) * U];
}

function toPoints(pts: Pt[]): string {
  return pts.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(" ");
}

function lerp(a: Pt, b: Pt, t: number): Pt {
  return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];
}

/* ---- Shared face palette ---- */
const TOP_FILL = "#eceef1";
const SIDE_FILL = "#cdd3db";
const EDGE = "rgba(20,23,28,0.24)";
const EDGE_W = 1.3;
const STEEL_TOP = "#dfe3e8";
const STEEL_SIDE = "#c2c8d0";
const STEEL_FRONT = "#d2d7de";

interface FaceFills {
  top: string;
  front: string; // y = d face (the highlight face)
  side: string; // x = w face
}

/**
 * A box with three visible isometric faces. Optionally chamfers the lower
 * front-left corner (the characteristic LD3 cutaway).
 */
function IsoBox({
  w,
  d,
  h,
  z0 = 0,
  fills,
  cut,
}: {
  w: number;
  d: number;
  h: number;
  z0?: number;
  fills: FaceFills;
  cut?: { w: number; h: number };
}) {
  const top = z0 + h;
  const topFace: Pt[] = [
    project(0, 0, top),
    project(w, 0, top),
    project(w, d, top),
    project(0, d, top),
  ];
  const sideFace: Pt[] = [
    project(w, 0, top),
    project(w, d, top),
    project(w, d, z0),
    project(w, 0, z0),
  ];
  const frontFace: Pt[] = cut
    ? [
        project(0, d, top),
        project(w, d, top),
        project(w, d, z0),
        project(cut.w, d, z0),
        project(0, d, z0 + cut.h),
      ]
    : [
        project(0, d, top),
        project(w, d, top),
        project(w, d, z0),
        project(0, d, z0),
      ];

  return (
    <g stroke={EDGE} strokeWidth={EDGE_W} strokeLinejoin="round">
      <polygon points={toPoints(topFace)} fill={fills.top} />
      <polygon points={toPoints(sideFace)} fill={fills.side} />
      <polygon points={toPoints(frontFace)} fill={fills.front} />
    </g>
  );
}

/** Cargo-net straps drawn across the front face of a load box. */
function NetStraps({
  w,
  d,
  zTop,
  zBottom,
}: {
  w: number;
  d: number;
  zTop: number;
  zBottom: number;
}) {
  const TL = project(0, d, zTop);
  const TR = project(w, d, zTop);
  const BL = project(0, d, zBottom);
  const BR = project(w, d, zBottom);
  const lines: Pt[][] = [];
  for (const t of [0.2, 0.4, 0.6, 0.8]) {
    lines.push([lerp(TL, TR, t), lerp(BL, BR, t)]);
  }
  for (const t of [0.33, 0.66]) {
    lines.push([lerp(TL, BL, t), lerp(TR, BR, t)]);
  }
  return (
    <g
      stroke="rgba(20,23,28,0.32)"
      strokeWidth={1}
      strokeLinecap="round"
      fill="none"
    >
      {lines.map((ln, i) => (
        <line
          key={i}
          x1={ln[0][0]}
          y1={ln[0][1]}
          x2={ln[1][0]}
          y2={ln[1][1]}
        />
      ))}
    </g>
  );
}

function ContouredLoad({ w, d, z0, accent }: { w: number; d: number; z0: number; accent: string }) {
  const N = 18;
  const edgeH = 0.5;
  const archH = 1.4;
  const profile = (x: number) => z0 + edgeH + archH * Math.sin(Math.PI * (x / w));

  const frontArc: Pt[] = [];
  const backArc: Pt[] = [];
  for (let i = 0; i <= N; i++) {
    const x = (w * i) / N;
    frontArc.push(project(x, d, profile(x)));
    backArc.push(project(x, 0, profile(x)));
  }

  // Front (accent) curved face: bottom edge, up the right, across the arc.
  const frontFace: Pt[] = [
    project(0, d, z0),
    project(w, d, z0),
    ...[...frontArc].reverse(),
  ];
  // Top strip between front and back arcs.
  const topFace: Pt[] = [...frontArc, ...[...backArc].reverse()];
  // Right side face.
  const sideFace: Pt[] = [
    project(w, d, z0),
    project(w, 0, z0),
    backArc[N],
    frontArc[N],
  ];

  return (
    <g stroke={EDGE} strokeWidth={EDGE_W} strokeLinejoin="round">
      <polygon points={toPoints(topFace)} fill={TOP_FILL} />
      <polygon points={toPoints(sideFace)} fill={SIDE_FILL} />
      <polygon points={toPoints(frontFace)} fill={accent} />
    </g>
  );
}

/**
 * Reusable isometric illustration of a ULD, selected by `shape`.
 * Pure SVG — no external assets. Greys carry the structure; `accent`
 * highlights the front (load) face.
 */
export function UldIllustration({
  shape,
  accent = "var(--dhl-red)",
  className,
  size = 160,
}: UldIllustrationProps) {
  const accentFills: FaceFills = {
    top: TOP_FILL,
    front: accent,
    side: SIDE_FILL,
  };
  const steelFills: FaceFills = {
    top: STEEL_TOP,
    front: STEEL_FRONT,
    side: STEEL_SIDE,
  };

  let body: React.ReactNode;

  switch (shape) {
    case "container":
      body = (
        <IsoBox w={2.7} d={2.2} h={2.4} fills={accentFills} cut={{ w: 0.95, h: 1.0 }} />
      );
      break;

    case "container-tall":
      body = (
        <IsoBox w={2.5} d={2.1} h={3.3} fills={accentFills} cut={{ w: 0.9, h: 1.1 }} />
      );
      break;

    case "container-full":
      body = <IsoBox w={3.0} d={2.2} h={2.6} fills={accentFills} />;
      break;

    case "reefer":
      body = (
        <>
          <IsoBox w={3.0} d={2.2} h={2.6} fills={accentFills} />
          {/* Cooling unit panel + vents on the front face */}
          <g stroke={EDGE} strokeWidth={1}>
            <polygon
              points={toPoints([
                project(0.35, 2.2, 2.25),
                project(1.55, 2.2, 2.25),
                project(1.55, 2.2, 0.55),
                project(0.35, 2.2, 0.55),
              ])}
              fill="#9aa1ab"
            />
          </g>
          <g stroke="rgba(20,23,28,0.4)" strokeWidth={0.9} strokeLinecap="round">
            {[0.85, 1.15, 1.45, 1.75].map((z, i) => (
              <line
                key={i}
                x1={project(0.5, 2.2, z)[0]}
                y1={project(0.5, 2.2, z)[1]}
                x2={project(1.4, 2.2, z)[0]}
                y2={project(1.4, 2.2, z)[1]}
              />
            ))}
          </g>
        </>
      );
      break;

    case "pallet":
      body = (
        <>
          {/* Flat aluminium pallet base */}
          <IsoBox w={3.2} d={2.6} h={0.32} fills={steelFills} />
          {/* Wrapped / netted load */}
          <IsoBox w={2.7} d={2.1} h={1.9} z0={0.32} fills={accentFills} />
          <NetStraps w={2.7} d={2.1} zTop={2.22} zBottom={0.32} />
        </>
      );
      break;

    case "contoured":
      body = (
        <>
          <IsoBox w={3.2} d={2.6} h={0.32} fills={steelFills} />
          <ContouredLoad w={3.0} d={2.4} z0={0.32} accent={accent} />
        </>
      );
      break;
  }

  return (
    <svg
      role="img"
      aria-label={`${shape} ULD illustration`}
      viewBox="0 0 200 200"
      width={size}
      height={size}
      className={cn("block", className)}
    >
      {/* Soft contact shadow on the ground plane */}
      <ellipse
        cx={OX}
        cy={OY + 92}
        rx={78}
        ry={17}
        fill="rgba(20,23,28,0.10)"
      />
      {body}
    </svg>
  );
}
