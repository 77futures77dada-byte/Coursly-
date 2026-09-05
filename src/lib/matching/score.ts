/**
 * MVP matching: a transparent weighted score, NOT ML.
 * There is no booking history yet — an ML recommender would just be noise.
 * Revisit once there is real usage data. (Spec section 7.)
 *
 * Weights sum to 1.0. The original 8 factors are spec section 7's weights each
 * scaled down 8% to make room for `reliability`, so their relative proportions
 * to each other are unchanged.
 *
 * `reliability` is not computed by anything yet — `computeMatch()` below has no
 * caller in this codebase. Once one exists, pass
 * `1 - tutorProfiles.cancellation_rate` (clamped to [0, 1]) as its factor score;
 * `cancellation_rate` is maintained by the `trg_after_booking_cancellation`
 * trigger in supabase/migrations/0003_cancellation_policy.sql.
 */
export const MATCH_WEIGHTS = {
  subject: 0.276,
  level: 0.138,
  goal: 0.138,
  language: 0.092,
  availability: 0.092,
  price: 0.092,
  rating: 0.046,
  experience: 0.046,
  reliability: 0.08,
} as const;

export type MatchFactor = keyof typeof MATCH_WEIGHTS;

/** Each factor is scored 0..1 by the caller; this blends them into a 0..100 score. */
export type FactorScores = Record<MatchFactor, number>;

export interface MatchResult {
  score: number; // 0..100, rounded
  breakdown: { factor: MatchFactor; weight: number; value: number; contribution: number }[];
}

export function computeMatch(factors: FactorScores): MatchResult {
  const breakdown = (Object.keys(MATCH_WEIGHTS) as MatchFactor[]).map((factor) => {
    const weight = MATCH_WEIGHTS[factor];
    const value = clamp01(factors[factor] ?? 0);
    return { factor, weight, value, contribution: weight * value };
  });

  const raw = breakdown.reduce((sum, f) => sum + f.contribution, 0);
  return { score: Math.round(raw * 100), breakdown };
}

function clamp01(n: number): number {
  if (Number.isNaN(n)) return 0;
  return Math.min(1, Math.max(0, n));
}
