import type { Log } from '~/drizzle/schema';

export function isLogValid(log: Log | undefined | null) {
  if (!log) return false;
  const uploadedAt = log.uploadedAt.getTime();
  // 60 分钟
  return new Date().getTime() - uploadedAt < 3600 * 1000;
}
