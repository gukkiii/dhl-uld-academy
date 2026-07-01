import Link from "next/link";
import { ArrowRight, GraduationCap, Boxes, ArrowLeftRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { HeroScene } from "@/components/home/HeroScene";
import { StatCards } from "@/components/home/StatCards";
import { ContinueWidget } from "@/components/home/ContinueWidget";
import { uldCount, aircraftCount, quizCount } from "@/lib/data";
import { cn } from "@/lib/utils";

export default function Home() {
  return (
    <div className="flex flex-col gap-8">
      {/* Hero */}
      <section className="relative overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
        <div className="dhl-gradient-soft absolute inset-0" aria-hidden />
        <div className="relative grid items-center gap-8 p-6 sm:p-10 lg:grid-cols-2">
          <div className="flex flex-col items-start gap-5 duration-700 animate-in fade-in slide-in-from-bottom-3">
            <Badge variant="outline" className="gap-1.5 bg-card">
              <span className="size-1.5 rounded-full bg-dhl-red" aria-hidden />
              Air Cargo Training
            </Badge>
            <h1 className="text-4xl font-bold tracking-tight text-dhl-ink sm:text-5xl">
              DHL <span className="text-dhl-red">ULD Academy</span>
            </h1>
            <div className="h-1 w-24 rounded-full dhl-gradient" aria-hidden />
            <p className="max-w-prose text-base leading-relaxed text-muted-foreground sm:text-lg">
              Your interactive guide to air cargo Unit Load Devices. Learn the
              container and pallet types, explore the freighter fleet, and master
              exactly what loads where — with flashcards, quizzes and IATA
              standards at your fingertips.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href="/learn" className={buttonVariants({ size: "lg" })}>
                <GraduationCap className="size-4" aria-hidden />
                Start Learning
              </Link>
              <Link
                href="/quiz"
                className={buttonVariants({
                  size: "lg",
                  variant: "outline",
                  className: "bg-card",
                })}
              >
                Take the Quiz
                <ArrowRight className="size-4" aria-hidden />
              </Link>
            </div>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
              <Link
                href="/uld-types"
                className="inline-flex items-center gap-1.5 font-medium text-dhl-red transition-colors hover:text-dhl-red-dark"
              >
                <Boxes className="size-4" aria-hidden />
                Browse ULD types
              </Link>
              <Link
                href="/compatibility"
                className="inline-flex items-center gap-1.5 font-medium text-dhl-red transition-colors hover:text-dhl-red-dark"
              >
                <ArrowLeftRight className="size-4" aria-hidden />
                Compatibility matrix
              </Link>
            </div>
          </div>

          <div className="flex justify-center lg:justify-end">
            <HeroScene />
          </div>
        </div>
      </section>

      {/* Stats + continue learning */}
      <section className="grid gap-6 lg:grid-cols-[2fr_1fr]">
        <div className="flex flex-col gap-4">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            At a glance
          </h2>
          <StatCards
            uldCount={uldCount}
            aircraftCount={aircraftCount}
            quizCount={quizCount}
          />
          <p className="text-sm text-muted-foreground">
            Every figure above is driven live from the academy data set — covering
            the full DHL freighter fleet and the ULDs it carries.
          </p>
        </div>
        <div className="flex flex-col gap-4">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            Your progress
          </h2>
          <ContinueWidget />
        </div>
      </section>

      {/* Standards teaser */}
      <section className="relative overflow-hidden rounded-2xl border border-border bg-dhl-ink p-6 text-white shadow-sm sm:p-8">
        <div className="dhl-accent-bar absolute inset-x-0 top-0 h-1" aria-hidden />
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h2 className="font-heading text-xl font-semibold">
              Know the rules before you build
            </h2>
            <p className="mt-1 max-w-prose text-sm text-white/70">
              Weight &amp; balance, damage reporting, tagging, securing and the
              IATA ULD Regulations — distilled into quick-reference cards.
            </p>
          </div>
          <Link
            href="/standards"
            className={cn(
              buttonVariants({ size: "lg" }),
              "bg-dhl-yellow text-dhl-ink hover:bg-dhl-yellow/90",
            )}
          >
            View standards
            <ArrowRight className="size-4" aria-hidden />
          </Link>
        </div>
      </section>
    </div>
  );
}
