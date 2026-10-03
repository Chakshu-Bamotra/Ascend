import type { Units } from '@/types/domain';

/** Exact international avoirdupois pound. */
export const KG_PER_LB = 0.45359237;

export const kgToLb = (kg: number): number => kg / KG_PER_LB;
export const lbToKg = (lb: number): number => lb * KG_PER_LB;

/** kg (stored) → number in the user's units, unrounded. */
export const fromKg = (kg: number, units: Units): number => (units === 'kg' ? kg : kgToLb(kg));

/** Number in the user's units → kg for storage, unrounded. */
export const toKg = (value: number, units: Units): number =>
  units === 'kg' ? value : lbToKg(value);

/** Max 1 decimal, trailing ".0" dropped. 102.058 kg in lb → "225". */
export function formatNumber(value: number): string {
  const rounded = Math.round(value * 10) / 10;
  const clean = Object.is(rounded, -0) ? 0 : rounded;
  return Number.isInteger(clean) ? String(clean) : clean.toFixed(1);
}

/** For input fields: "100", "225", "22.5". Empty string for null. */
export function toDisplayWeight(kg: number | null, units: Units): string {
  if (kg === null) return '';
  return formatNumber(fromKg(kg, units));
}

/** For labels: "100 kg", "225 lb". */
export function formatWeight(kg: number, units: Units): string {
  return `${formatNumber(fromKg(kg, units))} ${units}`;
}

/**
 * Parses user input (accepts "," or "." as decimal separator) to kg.
 * Returns null for empty or invalid input. Negative values are invalid.
 */
export function parseWeightInput(input: string, units: Units): number | null {
  const normalized = input.trim().replace(',', '.');
  if (normalized === '' || !/^\d*\.?\d*$/.test(normalized) || normalized === '.') return null;
  const value = Number(normalized);
  if (!Number.isFinite(value) || value < 0) return null;
  return toKg(value, units);
}
