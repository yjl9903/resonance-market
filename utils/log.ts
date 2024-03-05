import type { Log } from '~/drizzle/schema';

export function isLogValid(log: Log | undefined | null): log is Log {
  if (!log) return false;
  const uploadedAt = log.uploadedAt.getTime();
  return new Date().getTime() - uploadedAt > 3600 * 1000;
}
