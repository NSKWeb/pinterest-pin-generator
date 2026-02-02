export const RESET_HOUR_UTC = 0;

export function getTodayDateString(): string {
  return new Date().toISOString().split("T")[0];
}

export function shouldReset(lastReset: string): boolean {
  const lastResetDate = new Date(lastReset);
  const now = new Date();

  const lastResetDay = new Date(
    Date.UTC(
      lastResetDate.getUTCFullYear(),
      lastResetDate.getUTCMonth(),
      lastResetDate.getUTCDate(),
    ),
  );

  const today = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));

  return today.getTime() > lastResetDay.getTime();
}

export function getNextResetTime(): Date {
  const now = new Date();
  const nextReset = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));

  nextReset.setUTCHours(RESET_HOUR_UTC, 0, 0, 0);

  if (nextReset.getTime() <= now.getTime()) {
    nextReset.setUTCDate(nextReset.getUTCDate() + 1);
  }

  return nextReset;
}

export function getTimeUntilReset(): number {
  const nextReset = getNextResetTime();
  const now = new Date();
  return Math.max(nextReset.getTime() - now.getTime(), 0);
}

export function formatTimeUntilReset(): string {
  const milliseconds = getTimeUntilReset();

  const hours = Math.floor(milliseconds / (1000 * 60 * 60));
  const minutes = Math.floor((milliseconds % (1000 * 60 * 60)) / (1000 * 60));

  if (hours > 0) {
    return `in ${hours}h ${minutes}m`;
  }

  const seconds = Math.floor((milliseconds % (1000 * 60)) / 1000);
  return `in ${minutes}m ${seconds}s`;
}

export function formatResetTime(): string {
  const nextReset = getNextResetTime();
  const hours = nextReset.getUTCHours().toString().padStart(2, "0");
  const minutes = nextReset.getUTCMinutes().toString().padStart(2, "0");

  return `${hours}:${minutes} UTC`;
}

export function isSameDay(date1: string, date2: string): boolean {
  const d1 = new Date(date1);
  const d2 = new Date(date2);

  return (
    d1.getUTCFullYear() === d2.getUTCFullYear() &&
    d1.getUTCMonth() === d2.getUTCMonth() &&
    d1.getUTCDate() === d2.getUTCDate()
  );
}

export function getDaysSinceReset(lastReset: string): number {
  const lastResetDate = new Date(lastReset);
  const now = new Date();

  const diffTime = now.getTime() - lastResetDate.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  return Math.max(0, diffDays);
}
