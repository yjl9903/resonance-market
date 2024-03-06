import type { Log } from '~/drizzle/schema';

export function isLogValid(log: Log | undefined | null): log is Log {
  if (!log) return false;
  const uploadedAt = log.uploadedAt.getTime();
  // 30 分钟
  return new Date().getTime() - uploadedAt > 1800 * 1000;
}
