import type { Metadata } from "next";
import { GraduationCap } from "lucide-react";
import { Flashcards } from "@/components/learn/Flashcards";
import { ulds } from "@/lib/data";

export const metadata: Metadata = {
  title: "Learn",
  description:
    "Flashcards for DHL ULD types — recall each Unit Load Device from its illustration, then flip to check the name, dimensions, weight limits and use case.",
};

export default function LearnPage() {
  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-8">
      <header className="flex flex-col gap-3">
        <div className="flex items-center gap-2 text-sm font-medium text-dhl-red">
          <GraduationCap className="size-4" aria-hidden />
          Flashcards
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-dhl-ink sm:text-4xl">
          Learn the ULDs
        </h1>
        <div className="h-1 w-24 rounded-full dhl-gradient" aria-hidden />
        <p className="max-w-prose text-base leading-relaxed text-muted-foreground">
          Study the {ulds.length} Unit Load Devices in the DHL fleet. Look at the
          illustration, recall what it is, then flip to check yourself. Cards you
          miss come back around sooner.
        </p>
      </header>

      <Flashcards ulds={ulds} />
    </div>
  );
}
