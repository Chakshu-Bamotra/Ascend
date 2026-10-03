const pad = (n: number) => String(n).padStart(2, '0');

/** Workout durations: "42m", "1h 05m". Under a minute: "0m". */
export function formatDuration(totalSeconds: number): string {
  const s = Math.max(0, Math.floor(totalSeconds));
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  return h > 0 ? `${h}h ${pad(m)}m` : `${m}m`;
}

/** Timers: "0:45", "1:30", "1:02:05". */
export function formatClock(totalSeconds: number): string {
  const s = Math.max(0, Math.ceil(totalSeconds));
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  return h > 0 ? `${h}:${pad(m)}:${pad(sec)}` : `${m}:${pad(sec)}`;
}

// Fixed English labels: Hermes/ICU locale output differs across devices.
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const WEEKDAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const startOfDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();

/** "Today", "Yesterday", weekday within 6 days, else "12 Sep" / "12 Sep 2025". */
export function formatRelativeDay(timestamp: number, now: number = Date.now()): string {
  const date = new Date(timestamp);
  const diffDays = Math.round((startOfDay(new Date(now)) - startOfDay(date)) / 86_400_000);
  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays > 1 && diffDays < 7) return WEEKDAYS[date.getDay()]!;
  const base = `${date.getDate()} ${MONTHS[date.getMonth()]}`;
  return date.getFullYear() === new Date(now).getFullYear()
    ? base
    : `${base} ${date.getFullYear()}`;
}

/** "Morning Workout" etc., used as the default workout name. */
export function timeOfDayLabel(timestamp: number = Date.now()): string {
  const h = new Date(timestamp).getHours();
  if (h >= 5 && h < 12) return 'Morning';
  if (h >= 12 && h < 17) return 'Afternoon';
  if (h >= 17 && h < 22) return 'Evening';
  return 'Night';
}
