// ── Scoring Utilities ─────────────────────────────────────────────────────────
// Shared normalization and weighting functions.
// Also re-exports engine helpers to keep imports clean.

export { calcMasteryScore, calcReadinessPct } from '../engine/progressionEngine';

/** Clamp a value to [min, max] */
export const clamp = (value: number, min = 0, max = 100): number =>
  Math.max(min, Math.min(max, value));

/** Linear interpolation between two scores with a 0-1 weight */
export const lerp = (a: number, b: number, t: number): number =>
  Math.round(a + (b - a) * clamp(t, 0, 1));

/** Normalise a raw score to a 0-100 scale given observed min/max */
export const normaliseScore = (
  raw: number, min: number, max: number
): number => {
  if (max === min) return 50;
  return Math.round(clamp(((raw - min) / (max - min)) * 100));
};

/** Weighted average of score–weight pairs */
export const weightedAverage = (
  entries: { score: number; weight: number }[]
): number => {
  const totalWeight = entries.reduce((s, e) => s + e.weight, 0);
  if (totalWeight === 0) return 0;
  const sum = entries.reduce((s, e) => s + e.score * e.weight, 0);
  return Math.round(sum / totalWeight);
};

/** Compute confidence level label from a 0-100 numeric score */
export const confidenceLabel = (score: number): 'high' | 'medium' | 'low' =>
  score >= 75 ? 'high' : score >= 50 ? 'medium' : 'low';

/** Score gap severity from a raw confidence score */
export const gapFromConfidence = (confidence: number): 'Critical' | 'Moderate' | 'Low' | 'None' =>
  confidence < 50 ? 'Critical' :
  confidence < 65 ? 'Moderate' :
  confidence < 80 ? 'Low' : 'None';
