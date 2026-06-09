// ── XP Utilities ──────────────────────────────────────────────────────────────
// Reusable XP scaling and formatting helpers.

/** Compute XP level from raw total */
export const xpToLevel = (xp: number, perLevel = 1000): number =>
  Math.floor(xp / perLevel) + 1;

/** XP needed to reach the next level */
export const xpToNextLevel = (xp: number, perLevel = 1000): number =>
  perLevel - (xp % perLevel);

/** Progress percentage within the current level (0-100) */
export const xpLevelProgress = (xp: number, perLevel = 1000): number =>
  Math.round(((xp % perLevel) / perLevel) * 100);

/** Format XP with K suffix above 10000 */
export const formatXP = (xp: number): string =>
  xp >= 10000 ? `${(xp / 1000).toFixed(1)}K` : xp.toLocaleString();

/** Apply a difficulty weight multiplier to base XP */
export const weightedXP = (
  base: number,
  difficulty: 'Foundational' | 'Intermediate' | 'Advanced' | 'Expert'
): number => {
  const multipliers = { Foundational: 0.8, Intermediate: 1.0, Advanced: 1.3, Expert: 1.6 };
  return Math.round(base * multipliers[difficulty]);
};

/** Compute weekly XP goal based on streak and level */
export const weeklyXPGoal = (level: number, streak: number): number =>
  Math.round(500 + level * 80 + streak * 20);
