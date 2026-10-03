import { formatClock, formatDuration, formatRelativeDay, timeOfDayLabel } from '../time';

describe('time', () => {
  it('formats durations', () => {
    expect(formatDuration(0)).toBe('0m');
    expect(formatDuration(42 * 60 + 59)).toBe('42m');
    expect(formatDuration(3900)).toBe('1h 05m');
  });

  it('formats clocks', () => {
    expect(formatClock(45)).toBe('0:45');
    expect(formatClock(90)).toBe('1:30');
    expect(formatClock(44.2)).toBe('0:45');
    expect(formatClock(3725)).toBe('1:02:05');
    expect(formatClock(-3)).toBe('0:00');
  });

  it('formats relative days', () => {
    const now = new Date(2026, 8, 30, 18, 0).getTime();
    expect(formatRelativeDay(new Date(2026, 8, 30, 7).getTime(), now)).toBe('Today');
    expect(formatRelativeDay(new Date(2026, 8, 29, 23).getTime(), now)).toBe('Yesterday');
    expect(formatRelativeDay(new Date(2026, 8, 27).getTime(), now)).toBe('Sunday');
    expect(formatRelativeDay(new Date(2026, 8, 12).getTime(), now)).toBe('12 Sep');
    expect(formatRelativeDay(new Date(2025, 8, 12).getTime(), now)).toBe('12 Sep 2025');
  });

  it('labels time of day', () => {
    expect(timeOfDayLabel(new Date(2026, 0, 1, 7).getTime())).toBe('Morning');
    expect(timeOfDayLabel(new Date(2026, 0, 1, 13).getTime())).toBe('Afternoon');
    expect(timeOfDayLabel(new Date(2026, 0, 1, 19).getTime())).toBe('Evening');
    expect(timeOfDayLabel(new Date(2026, 0, 1, 2).getTime())).toBe('Night');
  });
});
