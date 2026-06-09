// ── Formatters ────────────────────────────────────────────────────────────────
// Shared display-formatting utilities for LearnPath AI.
// Use these wherever numeric values are rendered as percentages.

/**
 * Format a number as a clean percentage string.
 *
 * Rules:
 *   - Integer results → no decimal  (76 → "76")
 *   - One decimal place when fractional and trailing zero → omitted  (76.1 → "76.1")
 *   - Max 2 decimal places  (76.856... → "76.86")
 *   - No floating-point artifacts  (76.85000000000001 → "76.85")
 *
 * @param value  Raw numeric value (0–100)
 * @param suffix Append "%" when true (default true)
 */
export const formatPct = (value: number, suffix = true): string => {
  // Round to 2 decimal places to eliminate floating-point noise, then parse
  // back through Number to drop trailing zeros (e.g., 76.10 → 76.1).
  const rounded = Math.round(value * 100) / 100;
  const str = Number(rounded.toFixed(2)).toString();
  return suffix ? `${str}%` : str;
};

/**
 * Round an intelligence-derived score to a whole number.
 * Use in calculations before passing to UI, not at the display layer.
 */
export const roundScore = (value: number): number => Math.round(value);
