// Shared localStorage contract for the DHL ULD Academy interactive pages.
//
// The Learn (flashcards) and Quiz pages write progress here; the Home page's
// "Continue learning" widget reads it back. Keys are versioned so the shape can
// evolve without colliding with stale data on returning users.

/** Flashcard deck progress, written by /learn, read by the home widget. */
export interface LearnProgress {
  /** Distinct ULD codes the learner has marked "I knew it" in the current run. */
  known: number;
  /** Total cards in the deck. */
  total: number;
  /** Code of the most recently shown card (for "continue where you left off"). */
  lastCode: string | null;
  /** Epoch ms of the last update. */
  updatedAt: number;
}

/** Quiz results summary, written by /quiz, read by the home widget. */
export interface QuizHighScore {
  /** Best score (correct answers) ever achieved in a run. */
  best: number;
  /** Questions per run (the denominator for `best`). */
  total: number;
  /** Score from the most recent completed run. */
  lastScore: number;
  /** Number of completed runs. */
  runs: number;
  /** Epoch ms of the last completed run. */
  updatedAt: number;
}

export const STORAGE_KEYS = {
  learnProgress: "uld-academy:learn-progress:v1",
  quizHighScore: "uld-academy:quiz-highscore:v1",
} as const;

export const EMPTY_LEARN_PROGRESS: LearnProgress = {
  known: 0,
  total: 0,
  lastCode: null,
  updatedAt: 0,
};

export const EMPTY_QUIZ_HIGH_SCORE: QuizHighScore = {
  best: 0,
  total: 0,
  lastScore: 0,
  runs: 0,
  updatedAt: 0,
};
