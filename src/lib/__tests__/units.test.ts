import {
  formatNumber,
  formatWeight,
  kgToLb,
  lbToKg,
  parseWeightInput,
  toDisplayWeight,
} from '../units';

describe('units', () => {
  it('round-trips lb through kg without drift', () => {
    const kg = parseWeightInput('225', 'lb');
    expect(kg).not.toBeNull();
    expect(toDisplayWeight(kg, 'lb')).toBe('225');
  });

  it('converts kg and lb', () => {
    expect(kgToLb(100)).toBeCloseTo(220.462, 3);
    expect(lbToKg(45)).toBeCloseTo(20.4117, 4);
  });

  it('formats to max one decimal and drops trailing .0', () => {
    expect(formatNumber(100)).toBe('100');
    expect(formatNumber(22.5)).toBe('22.5');
    expect(formatNumber(22.46)).toBe('22.5');
    expect(formatNumber(-0.01)).toBe('0');
    expect(formatWeight(100, 'kg')).toBe('100 kg');
    expect(formatWeight(100, 'lb')).toBe('220.5 lb');
  });

  it('parses input', () => {
    expect(parseWeightInput('', 'kg')).toBeNull();
    expect(parseWeightInput('.', 'kg')).toBeNull();
    expect(parseWeightInput('abc', 'kg')).toBeNull();
    expect(parseWeightInput('-5', 'kg')).toBeNull();
    expect(parseWeightInput('1.2.3', 'kg')).toBeNull();
    expect(parseWeightInput('22,5', 'kg')).toBe(22.5);
    expect(parseWeightInput(' 60 ', 'kg')).toBe(60);
    expect(parseWeightInput('0', 'kg')).toBe(0);
  });

  it('returns empty display for null', () => {
    expect(toDisplayWeight(null, 'kg')).toBe('');
  });
});
