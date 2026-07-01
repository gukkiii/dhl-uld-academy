import type { Metadata } from "next";
import { ClipboardCheck } from "lucide-react";
import { Quiz } from "@/components/quiz/Quiz";
import { quizQuestions } from "@/lib/data";

export const metadata: Metadata = {
  title: "Quiz",
  description:
    "Test your knowledge of DHL ULD types, aircraft compatibility and IATA standards with a 10-question multiple-choice quiz.",
};

export default function QuizPage() {
  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-8">
      <header className="flex flex-col gap-3">
        <div className="flex items-center gap-2 text-sm font-medium text-dhl-red">
          <ClipboardCheck className="size-4" aria-hidden />
          Quiz
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-dhl-ink sm:text-4xl">
          Test your knowledge
        </h1>
        <div className="h-1 w-24 rounded-full dhl-gradient" aria-hidden />
        <p className="max-w-prose text-base leading-relaxed text-muted-foreground">
          Ten questions sampled from the bank, spanning ULD specifications,
          aircraft compatibility, the freighter fleet and IATA handling
          standards.
        </p>
      </header>

      <Quiz questions={quizQuestions} />
    </div>
  );
}
