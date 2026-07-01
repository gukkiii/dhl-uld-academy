"use client";

import { useCallback, useMemo, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  Check,
  X,
  Trophy,
  RotateCcw,
  ArrowRight,
  ClipboardCheck,
  Play,
} from "lucide-react";
import type { QuizQuestion } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useLocalStorage } from "@/lib/hooks/useLocalStorage";
import { STORAGE_KEYS, EMPTY_QUIZ_HIGH_SCORE } from "@/lib/hooks/academyStorage";
import { cn } from "@/lib/utils";

interface QuizProps {
  questions: QuizQuestion[];
}

const QUESTIONS_PER_RUN = 10;

type Phase = "start" | "playing" | "results";

interface AnswerRecord {
  questionId: string;
  category: QuizQuestion["category"];
  correct: boolean;
}

const CATEGORY_LABELS: Record<QuizQuestion["category"], string> = {
  specs: "Specifications",
  compatibility: "Compatibility",
  aircraft: "Aircraft",
  standards: "Standards",
};

function shuffle<T>(input: readonly T[]): T[] {
  const arr = [...input];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/**
 * Ten-question multiple-choice quiz sampled without repetition from the bank.
 * Each question gives immediate feedback with the explanation, then the run
 * ends on a DHL-styled results card showing score, percentage and a per-category
 * breakdown. The best score is persisted to localStorage. Sampling happens only
 * on user action (Start / Retry) so there is no SSR/client mismatch.
 */
export function Quiz({ questions }: QuizProps) {
  const reduce = useReducedMotion();
  const runSize = Math.min(QUESTIONS_PER_RUN, questions.length);

  const [phase, setPhase] = useState<Phase>("start");
  const [run, setRun] = useState<QuizQuestion[]>([]);
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [answers, setAnswers] = useState<AnswerRecord[]>([]);

  const [highScore, setHighScore, hydrated] = useLocalStorage(
    STORAGE_KEYS.quizHighScore,
    EMPTY_QUIZ_HIGH_SCORE,
  );

  const startRun = useCallback(() => {
    setRun(shuffle(questions).slice(0, runSize));
    setIndex(0);
    setSelected(null);
    setAnswers([]);
    setPhase("playing");
  }, [questions, runSize]);

  const current = run[index];
  const answered = selected !== null;
  const isLast = index === run.length - 1;

  const handleSelect = useCallback(
    (optionIndex: number) => {
      if (answered || !current) return;
      setSelected(optionIndex);
      setAnswers((prev) => [
        ...prev,
        {
          questionId: current.id,
          category: current.category,
          correct: optionIndex === current.correctIndex,
        },
      ]);
    },
    [answered, current],
  );

  const finish = useCallback(
    (finalAnswers: AnswerRecord[]) => {
      const score = finalAnswers.filter((a) => a.correct).length;
      setHighScore((prev) => ({
        best: Math.max(prev.best, score),
        total: run.length,
        lastScore: score,
        runs: prev.runs + 1,
        updatedAt: Date.now(),
      }));
      setPhase("results");
    },
    [run.length, setHighScore],
  );

  const handleNext = useCallback(() => {
    if (isLast) {
      finish(answers);
      return;
    }
    setIndex((i) => i + 1);
    setSelected(null);
  }, [isLast, answers, finish]);

  const score = answers.filter((a) => a.correct).length;
  const pct = run.length > 0 ? Math.round((score / run.length) * 100) : 0;
  const progressPct = run.length
    ? Math.round(((index + (answered ? 1 : 0)) / run.length) * 100)
    : 0;

  const categoryBreakdown = useMemo(() => {
    const map = new Map<
      QuizQuestion["category"],
      { correct: number; total: number }
    >();
    for (const a of answers) {
      const entry = map.get(a.category) ?? { correct: 0, total: 0 };
      entry.total += 1;
      if (a.correct) entry.correct += 1;
      map.set(a.category, entry);
    }
    return [...map.entries()];
  }, [answers]);

  // ---- Start screen ----
  if (phase === "start") {
    return (
      <Card className="flex min-h-[24rem] flex-col items-center justify-center gap-5 p-8 text-center">
        <div className="flex size-14 items-center justify-center rounded-full bg-dhl-red/10 text-dhl-red">
          <ClipboardCheck className="size-7" aria-hidden />
        </div>
        <div>
          <h2 className="font-heading text-2xl font-bold text-dhl-ink">
            Ready to test yourself?
          </h2>
          <p className="mx-auto mt-1 max-w-md text-sm text-muted-foreground">
            {runSize} questions drawn at random from the question bank, covering
            ULD specs, compatibility, aircraft and IATA standards. You will see
            the answer and an explanation after each question.
          </p>
        </div>
        {hydrated && highScore.runs > 0 && (
          <div className="flex items-center gap-2 rounded-lg bg-dhl-yellow-soft px-3 py-1.5 text-sm font-medium text-dhl-ink">
            <Trophy className="size-4 text-dhl-red" aria-hidden />
            Best: {highScore.best}/{highScore.total} ({highScore.runs}{" "}
            {highScore.runs === 1 ? "run" : "runs"})
          </div>
        )}
        <Button size="lg" onClick={startRun}>
          <Play className="size-4" aria-hidden />
          Start quiz
        </Button>
      </Card>
    );
  }

  // ---- Results screen ----
  if (phase === "results") {
    const isBest = hydrated && score >= highScore.best && score > 0;
    return (
      <div className="flex flex-col gap-5">
        <Card className="overflow-hidden">
          <div className="dhl-gradient px-6 py-8 text-center text-white">
            <p className="text-sm font-medium uppercase tracking-wide text-white/80">
              Your score
            </p>
            <p className="mt-1 text-5xl font-bold tabular-nums">
              {score}
              <span className="text-2xl text-white/70">/{run.length}</span>
            </p>
            <p className="mt-1 text-lg font-semibold">{pct}%</p>
            {isBest && (
              <div className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1 text-sm font-medium">
                <Trophy className="size-4" aria-hidden />
                New personal best
              </div>
            )}
          </div>
          <CardContent className="flex flex-col gap-4">
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                By category
              </h3>
              <ul className="mt-3 flex flex-col gap-3">
                {categoryBreakdown.map(([category, { correct, total }]) => {
                  const cpct = Math.round((correct / total) * 100);
                  return (
                    <li key={category} className="flex flex-col gap-1.5">
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-medium text-dhl-ink">
                          {CATEGORY_LABELS[category]}
                        </span>
                        <span className="tabular-nums text-muted-foreground">
                          {correct}/{total}
                        </span>
                      </div>
                      <Progress value={cpct} />
                    </li>
                  );
                })}
              </ul>
            </div>
            {hydrated && (
              <p className="text-sm text-muted-foreground">
                Personal best:{" "}
                <span className="font-medium text-dhl-ink">
                  {highScore.best}/{highScore.total}
                </span>{" "}
                across {highScore.runs} {highScore.runs === 1 ? "run" : "runs"}.
              </p>
            )}
          </CardContent>
        </Card>

        <div className="flex flex-wrap justify-center gap-3">
          <Button size="lg" onClick={startRun}>
            <RotateCcw className="size-4" aria-hidden />
            Try again
          </Button>
          <Button size="lg" variant="outline" onClick={() => setPhase("start")}>
            Back to start
          </Button>
        </div>
      </div>
    );
  }

  // ---- Playing ----
  if (!current) return null;

  return (
    <div className="flex flex-col gap-5">
      {/* Progress */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between text-sm">
          <span className="font-medium text-dhl-ink">
            Question {index + 1} of {run.length}
          </span>
          <span className="tabular-nums text-muted-foreground">
            {score} correct
          </span>
        </div>
        <Progress value={progressPct} />
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={current.id}
          initial={reduce ? false : { opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          exit={reduce ? { opacity: 0 } : { opacity: 0, x: -40 }}
          transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
        >
          <Card>
            <CardContent className="flex flex-col gap-5">
              <div className="flex flex-col gap-3">
                <Badge variant="secondary" className="w-fit uppercase tracking-wide">
                  {CATEGORY_LABELS[current.category]}
                </Badge>
                <h2 className="font-heading text-xl font-semibold leading-snug text-dhl-ink">
                  {current.question}
                </h2>
              </div>

              <ul className="flex flex-col gap-2.5">
                {current.options.map((option, i) => {
                  const isCorrect = i === current.correctIndex;
                  const isPicked = i === selected;
                  const showState = answered;
                  return (
                    <li key={i}>
                      <button
                        type="button"
                        disabled={answered}
                        onClick={() => handleSelect(i)}
                        className={cn(
                          "flex w-full items-center justify-between gap-3 rounded-lg border px-4 py-3 text-left text-sm transition-colors",
                          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dhl-red/50",
                          !showState &&
                            "border-border bg-card hover:border-dhl-red/40 hover:bg-dhl-red/5",
                          showState &&
                            isCorrect &&
                            "border-emerald-500 bg-emerald-50 text-emerald-800",
                          showState &&
                            isPicked &&
                            !isCorrect &&
                            "border-dhl-red bg-dhl-red/5 text-dhl-red",
                          showState &&
                            !isCorrect &&
                            !isPicked &&
                            "border-border bg-card opacity-60",
                        )}
                      >
                        <span className="font-medium">{option}</span>
                        {showState && isCorrect && (
                          <Check className="size-4 shrink-0 text-emerald-600" aria-hidden />
                        )}
                        {showState && isPicked && !isCorrect && (
                          <X className="size-4 shrink-0 text-dhl-red" aria-hidden />
                        )}
                      </button>
                    </li>
                  );
                })}
              </ul>

              <AnimatePresence>
                {answered && (
                  <motion.div
                    initial={reduce ? false : { opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.25 }}
                    className="overflow-hidden"
                  >
                    <div className="rounded-lg border border-border bg-dhl-surface/70 p-4 text-sm leading-relaxed text-dhl-ink/85">
                      <span
                        className={cn(
                          "font-semibold",
                          selected === current.correctIndex
                            ? "text-emerald-700"
                            : "text-dhl-red",
                        )}
                      >
                        {selected === current.correctIndex
                          ? "Correct. "
                          : "Not quite. "}
                      </span>
                      {current.explanation}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {answered && (
                <Button size="lg" onClick={handleNext} className="self-end">
                  {isLast ? "See results" : "Next question"}
                  <ArrowRight className="size-4" aria-hidden />
                </Button>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
