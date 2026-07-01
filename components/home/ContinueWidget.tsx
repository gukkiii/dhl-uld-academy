"use client";

import Link from "next/link";
import { GraduationCap, ClipboardCheck, Sparkles, ArrowRight } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useLocalStorage } from "@/lib/hooks/useLocalStorage";
import {
  STORAGE_KEYS,
  EMPTY_LEARN_PROGRESS,
  EMPTY_QUIZ_HIGH_SCORE,
} from "@/lib/hooks/academyStorage";
import { getUldByCode } from "@/lib/data";
import { cn } from "@/lib/utils";

/**
 * "Continue learning" widget. Reads the learner's flashcard progress and best
 * quiz score from localStorage and surfaces a resume CTA. Before hydration and
 * for first-time visitors it shows an inviting empty state instead of zeros.
 */
export function ContinueWidget() {
  const [learn, , learnHydrated] = useLocalStorage(
    STORAGE_KEYS.learnProgress,
    EMPTY_LEARN_PROGRESS,
  );
  const [quiz, , quizHydrated] = useLocalStorage(
    STORAGE_KEYS.quizHighScore,
    EMPTY_QUIZ_HIGH_SCORE,
  );

  const hydrated = learnHydrated && quizHydrated;
  const hasLearn = learn.total > 0 && learn.updatedAt > 0;
  const hasQuiz = quiz.runs > 0;
  const isFirstTime = hydrated && !hasLearn && !hasQuiz;

  // Stable placeholder until storage is read — avoids a flash of empty state.
  if (!hydrated) {
    return (
      <Card className="h-full">
        <CardContent className="flex h-full min-h-40 items-center justify-center">
          <div className="h-4 w-40 animate-pulse rounded bg-muted" />
        </CardContent>
      </Card>
    );
  }

  if (isFirstTime) {
    return (
      <Card className="h-full overflow-hidden">
        <CardContent className="flex h-full flex-col gap-3">
          <div className="flex size-10 items-center justify-center rounded-lg bg-dhl-yellow-soft text-dhl-ink">
            <Sparkles className="size-5" aria-hidden />
          </div>
          <div>
            <h3 className="font-heading text-base font-semibold text-dhl-ink">
              Start your training
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Flip through the flashcards or take a quiz — your progress shows up
              here so you can pick up where you left off.
            </p>
          </div>
          <div className="mt-auto flex flex-wrap gap-2 pt-2">
            <Link href="/learn" className={buttonVariants({ size: "sm" })}>
              <GraduationCap className="size-4" aria-hidden />
              Flashcards
            </Link>
            <Link
              href="/quiz"
              className={buttonVariants({ size: "sm", variant: "outline" })}
            >
              <ClipboardCheck className="size-4" aria-hidden />
              Quiz
            </Link>
          </div>
        </CardContent>
      </Card>
    );
  }

  const lastUld = learn.lastCode ? getUldByCode(learn.lastCode) : undefined;
  const learnPct = hasLearn ? Math.round((learn.known / learn.total) * 100) : 0;
  const quizPct = hasQuiz && quiz.total > 0 ? Math.round((quiz.best / quiz.total) * 100) : 0;

  return (
    <Card className="h-full overflow-hidden">
      <CardContent className="flex h-full flex-col gap-4">
        <div className="flex items-center gap-2">
          <h3 className="font-heading text-base font-semibold text-dhl-ink">
            Continue learning
          </h3>
        </div>

        {/* Flashcards row */}
        <div className="rounded-lg border border-border bg-dhl-surface/60 p-3">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 text-sm font-medium text-dhl-ink">
              <GraduationCap className="size-4 text-dhl-red" aria-hidden />
              Flashcards
            </div>
            {hasLearn ? (
              <span className="text-xs tabular-nums text-muted-foreground">
                {learn.known}/{learn.total} mastered
              </span>
            ) : (
              <span className="text-xs text-muted-foreground">Not started</span>
            )}
          </div>
          {hasLearn && (
            <>
              <Progress value={learnPct} className="mt-2.5" />
              {lastUld && (
                <p className="mt-2 text-xs text-muted-foreground">
                  Last card:{" "}
                  <span className="font-medium text-dhl-ink">
                    {lastUld.code} · {lastUld.name}
                  </span>
                </p>
              )}
            </>
          )}
        </div>

        {/* Quiz row */}
        <div className="rounded-lg border border-border bg-dhl-surface/60 p-3">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 text-sm font-medium text-dhl-ink">
              <ClipboardCheck className="size-4 text-dhl-red" aria-hidden />
              Quiz best
            </div>
            {hasQuiz ? (
              <span className="text-xs tabular-nums text-muted-foreground">
                {quiz.best}/{quiz.total} · {quizPct}%
              </span>
            ) : (
              <span className="text-xs text-muted-foreground">Not started</span>
            )}
          </div>
          {hasQuiz && <Progress value={quizPct} className="mt-2.5" />}
        </div>

        <div className="mt-auto flex flex-wrap gap-2 pt-1">
          <Link
            href="/learn"
            className={cn(buttonVariants({ size: "sm" }), "gap-1.5")}
          >
            Resume flashcards
            <ArrowRight className="size-4" aria-hidden />
          </Link>
          <Link
            href="/quiz"
            className={buttonVariants({ size: "sm", variant: "outline" })}
          >
            Take a quiz
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
