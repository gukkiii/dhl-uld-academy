"use client";

import { useCallback, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  RotateCcw,
  Check,
  X,
  Eye,
  Shuffle,
  PartyPopper,
  Ruler,
  Weight,
  Box,
} from "lucide-react";
import type { Uld } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { UldIllustration } from "@/components/uld/UldIllustration";
import { useLocalStorage } from "@/lib/hooks/useLocalStorage";
import { useIsClient } from "@/lib/hooks/useIsClient";
import { STORAGE_KEYS, EMPTY_LEARN_PROGRESS } from "@/lib/hooks/academyStorage";
import { cn } from "@/lib/utils";

interface FlashcardsProps {
  ulds: Uld[];
}

/** Position a missed card is re-inserted at — soon, but not immediately. */
const REQUEUE_OFFSET = 3;

function shuffle<T>(input: readonly T[]): T[] {
  const arr = [...input];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/**
 * Flashcard deck with a flip-to-reveal interaction and spaced-repetition-lite
 * weighting: cards marked "Missed it" are re-queued a few positions back so
 * they come around again before the deck is cleared, while "I knew it" cards
 * are retired. Progress and the best-known count are mirrored to localStorage
 * for the home page's continue widget.
 */
export function Flashcards({ ulds }: FlashcardsProps) {
  const reduce = useReducedMotion();
  const isClient = useIsClient();
  const total = ulds.length;

  // Lazy initial shuffle. This runs on the server too, but the deck is never
  // rendered until `isClient` is true, so the (different) client shuffle never
  // produces a hydration mismatch.
  const [deck, setDeck] = useState<string[]>(() =>
    shuffle(ulds.map((u) => u.code)),
  );
  const [mastered, setMastered] = useState<string[]>([]);
  const [flipped, setFlipped] = useState(false);

  const [, setProgress] = useLocalStorage(
    STORAGE_KEYS.learnProgress,
    EMPTY_LEARN_PROGRESS,
  );

  const persist = useCallback(
    (knownCount: number, lastCode: string | null) => {
      setProgress({
        known: knownCount,
        total,
        lastCode,
        updatedAt: Date.now(),
      });
    },
    [setProgress, total],
  );

  const currentCode = deck[0];
  const currentUld = currentCode
    ? ulds.find((u) => u.code === currentCode)
    : undefined;
  const done = isClient && deck.length === 0;

  const handleKnew = useCallback(() => {
    if (!currentCode) return;
    const nextMastered = mastered.includes(currentCode)
      ? mastered
      : [...mastered, currentCode];
    setMastered(nextMastered);
    setDeck((d) => d.slice(1));
    setFlipped(false);
    persist(nextMastered.length, currentCode);
  }, [currentCode, mastered, persist]);

  const handleMissed = useCallback(() => {
    if (!currentCode) return;
    setDeck((d) => {
      const [head, ...rest] = d;
      const insertAt = Math.min(REQUEUE_OFFSET, rest.length);
      rest.splice(insertAt, 0, head);
      return rest;
    });
    setFlipped(false);
    persist(mastered.length, currentCode);
  }, [currentCode, mastered.length, persist]);

  const restart = useCallback(() => {
    setDeck(shuffle(ulds.map((u) => u.code)));
    setMastered([]);
    setFlipped(false);
    persist(0, null);
  }, [ulds, persist]);

  const masteredPct = total > 0 ? Math.round((mastered.length / total) * 100) : 0;

  // ---- Loading / completion states ----
  if (!isClient) {
    return (
      <Card className="flex min-h-[28rem] items-center justify-center">
        <div className="h-4 w-40 animate-pulse rounded bg-muted" />
      </Card>
    );
  }

  return (
    <div className="flex flex-col gap-5">
      {/* Progress header */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between gap-3 text-sm">
          <span className="font-medium text-dhl-ink">
            {mastered.length} of {total} mastered
          </span>
          <span className="tabular-nums text-muted-foreground">
            {done ? "Complete" : `${deck.length} left`}
          </span>
        </div>
        <Progress value={masteredPct} />
      </div>

      {done ? (
        <Card className="flex min-h-[24rem] flex-col items-center justify-center gap-4 p-8 text-center">
          <div className="flex size-14 items-center justify-center rounded-full bg-dhl-yellow-soft text-dhl-ink">
            <PartyPopper className="size-7" aria-hidden />
          </div>
          <div>
            <h2 className="font-heading text-2xl font-bold text-dhl-ink">
              Deck complete
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              You worked through all {total} ULD cards. Shuffle and run it again
              to keep it sharp.
            </p>
          </div>
          <Button size="lg" onClick={restart}>
            <RotateCcw className="size-4" aria-hidden />
            Restart deck
          </Button>
        </Card>
      ) : (
        currentUld && (
          <>
            {/* Flip card */}
            <div className="[perspective:1400px]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentCode}
                  initial={reduce ? false : { opacity: 0, x: 40 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={reduce ? { opacity: 0 } : { opacity: 0, x: -40 }}
                  transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                >
                  <motion.div
                    className="relative min-h-[24rem] [transform-style:preserve-3d]"
                    animate={{ rotateY: flipped ? 180 : 0 }}
                    transition={
                      reduce
                        ? { duration: 0 }
                        : { duration: 0.5, ease: [0.22, 1, 0.36, 1] }
                    }
                    onClick={() => setFlipped((f) => !f)}
                    role="button"
                    tabIndex={0}
                    aria-label={
                      flipped
                        ? `Answer: ${currentUld.code}, ${currentUld.name}. Activate to flip back.`
                        : "Flashcard front. Activate to reveal the answer."
                    }
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        setFlipped((f) => !f);
                      }
                    }}
                  >
                    {/* Front */}
                    <Card
                      className={cn(
                        "absolute inset-0 flex cursor-pointer flex-col items-center justify-center gap-4 p-6 [backface-visibility:hidden]",
                      )}
                    >
                      <Badge variant="secondary" className="uppercase tracking-wide">
                        {currentUld.contour.replace("-", " ")}
                      </Badge>
                      <UldIllustration
                        shape={currentUld.shape}
                        accent={currentUld.accentColor}
                        size={200}
                      />
                      <p className="text-sm text-muted-foreground">
                        Which ULD is this?
                      </p>
                      <span className="inline-flex items-center gap-1.5 text-xs font-medium text-dhl-red">
                        <Eye className="size-3.5" aria-hidden />
                        Tap to reveal
                      </span>
                    </Card>

                    {/* Back */}
                    <Card
                      className="absolute inset-0 flex cursor-pointer flex-col gap-4 overflow-y-auto p-6 [backface-visibility:hidden] [transform:rotateY(180deg)]"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <h2 className="font-heading text-2xl font-bold text-dhl-ink">
                              {currentUld.code}
                            </h2>
                            {currentUld.iataName !== "—" && (
                              <Badge>{currentUld.iataName}</Badge>
                            )}
                          </div>
                          <p className="mt-0.5 text-sm font-medium text-dhl-ink">
                            {currentUld.name}
                          </p>
                        </div>
                        <span
                          className="size-8 shrink-0 rounded-lg"
                          style={{ backgroundColor: currentUld.accentColor }}
                          aria-hidden
                        />
                      </div>

                      <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                        <Spec
                          icon={<Ruler className="size-4" aria-hidden />}
                          label="Dimensions (L×W×H)"
                          value={`${currentUld.dimensionsCm.l}×${currentUld.dimensionsCm.w}×${currentUld.dimensionsCm.h} cm`}
                        />
                        <Spec
                          icon={<Weight className="size-4" aria-hidden />}
                          label="Max gross weight"
                          value={`${currentUld.maxGrossWeightKg.toLocaleString()} kg`}
                        />
                        <Spec
                          icon={<Box className="size-4" aria-hidden />}
                          label="Volume"
                          value={`${currentUld.volumeM3} m³`}
                        />
                      </div>

                      <p className="text-sm leading-relaxed text-dhl-ink/80">
                        {currentUld.useCase}
                      </p>
                    </Card>
                  </motion.div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Controls */}
            <div className="flex flex-col gap-3">
              {flipped ? (
                <div className="grid grid-cols-2 gap-3">
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={handleMissed}
                    className="border-dhl-red/30 text-dhl-red hover:bg-dhl-red/5"
                  >
                    <X className="size-4" aria-hidden />
                    Missed it
                  </Button>
                  <Button size="lg" onClick={handleKnew}>
                    <Check className="size-4" aria-hidden />
                    I knew it
                  </Button>
                </div>
              ) : (
                <Button size="lg" onClick={() => setFlipped(true)}>
                  <Eye className="size-4" aria-hidden />
                  Reveal answer
                </Button>
              )}

              <div className="flex justify-center">
                <Button variant="ghost" size="sm" onClick={restart}>
                  <Shuffle className="size-4" aria-hidden />
                  Shuffle &amp; restart
                </Button>
              </div>
            </div>
          </>
        )
      )}
    </div>
  );
}

function Spec({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-lg border border-border bg-dhl-surface/60 p-2.5">
      <div className="flex items-center gap-1.5 text-dhl-red">{icon}</div>
      <p className="mt-1 text-[11px] uppercase tracking-wide text-muted-foreground">
        {label}
      </p>
      <p className="text-sm font-medium tabular-nums text-dhl-ink">{value}</p>
    </div>
  );
}
