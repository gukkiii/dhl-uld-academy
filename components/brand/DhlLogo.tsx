import { cn } from "@/lib/utils";

interface DhlLogoProps {
  /** Visual treatment. "color" = red wordmark on yellow band (the classic lockup).
   *  "onRed" = white wordmark for placement on the red header bar. */
  variant?: "color" | "onRed";
  className?: string;
  /** Height in px of the wordmark. Width scales automatically. */
  height?: number;
}

/**
 * Inline, asset-free DHL-style wordmark.
 * Renders the signature italic "DHL" letters with the swoosh-style yellow band.
 * Drawn entirely in SVG so it stays crisp at any size and needs no image files.
 */
export function DhlLogo({
  variant = "color",
  className,
  height = 28,
}: DhlLogoProps) {
  const onRed = variant === "onRed";
  // Wordmark colors. On the red bar we render white letters on a yellow band.
  const letterFill = onRed ? "#ffffff" : "var(--dhl-red)";
  const bandFill = "var(--dhl-yellow)";
  // Aspect ratio of the artboard.
  const ratio = 300 / 96;

  return (
    <svg
      role="img"
      aria-label="DHL"
      viewBox="0 0 300 96"
      height={height}
      width={height * ratio}
      className={cn("block", className)}
    >
      {/* Rounded yellow band behind the letters — the DHL signature swoosh feel */}
      <rect
        x="0"
        y="14"
        width="300"
        height="68"
        rx="10"
        fill={bandFill}
      />
      {/* Wordmark: bold, italic, condensed — evokes the DHL logotype */}
      <text
        x="150"
        y="65"
        textAnchor="middle"
        fontFamily="var(--font-sans), Inter, system-ui, sans-serif"
        fontWeight="800"
        fontSize="58"
        fontStyle="italic"
        letterSpacing="-1"
        fill={letterFill}
      >
        DHL
      </text>
      {/* The three trailing speed-lines that follow the wordmark */}
      <g fill={letterFill} opacity={onRed ? 0.95 : 1}>
        <rect x="246" y="33" width="40" height="6" rx="3" />
        <rect x="238" y="45" width="48" height="6" rx="3" />
        <rect x="246" y="57" width="40" height="6" rx="3" />
      </g>
    </svg>
  );
}
