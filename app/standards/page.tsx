import type { Metadata } from "next";
import {
  Scale,
  AlertTriangle,
  Tag,
  Ruler,
  Network,
  ShieldCheck,
  Check,
  BookOpen,
  type LucideIcon,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { standards } from "@/lib/data";

export const metadata: Metadata = {
  title: "Standards",
  description:
    "IATA ULD Regulations quick reference — weight & balance, damage reporting, tagging, build-up contour, securing and regulatory accountability.",
};

/**
 * Explicit name → component map for the lucide icons referenced by the
 * standards data. A static record keeps icons tree-shakeable (no dynamic import
 * by string) and renders fine inside a Server Component.
 */
const ICONS: Record<string, LucideIcon> = {
  Scale,
  AlertTriangle,
  Tag,
  Ruler,
  Network,
  ShieldCheck,
};

export default function StandardsPage() {
  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <header className="flex flex-col gap-3">
        <div className="flex items-center gap-2 text-sm font-medium text-dhl-red">
          <BookOpen className="size-4" aria-hidden />
          Reference
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-dhl-ink sm:text-4xl">
          ULD Standards &amp; Handling
        </h1>
        <div className="h-1 w-24 rounded-full dhl-gradient" aria-hidden />
        <p className="max-w-prose text-base leading-relaxed text-muted-foreground">
          Key points from the IATA ULD Regulations (ULDR) and ULD Technical
          Manual, distilled into scannable cards. Use these as a build-up and
          handling checklist — they are not a substitute for the full regulations.
        </p>
      </header>

      {/* Cards */}
      <section className="grid gap-5 md:grid-cols-2">
        {standards.map((section) => {
          const Icon = ICONS[section.icon] ?? ShieldCheck;
          return (
            <Card key={section.id} className="h-full">
              <CardHeader className="border-b pb-4">
                <div className="flex items-center gap-3">
                  <div className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-dhl-red/10 text-dhl-red">
                    <Icon className="size-5" aria-hidden />
                  </div>
                  <CardTitle className="text-lg leading-tight">
                    {section.title}
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="flex flex-col gap-3">
                  {section.points.map((point, i) => (
                    <li key={i} className="flex gap-2.5 text-sm leading-relaxed">
                      <Check
                        className="mt-0.5 size-4 shrink-0 text-dhl-red"
                        aria-hidden
                      />
                      <span className="text-dhl-ink/85">{point}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          );
        })}
      </section>
    </div>
  );
}
