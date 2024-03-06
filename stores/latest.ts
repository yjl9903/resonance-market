import type { Log } from '~/drizzle/schema';

export const useLatestLogs = defineStore('latest_logs', () => {
  const logs = ref<Log[]>([]);
  const maps = new Map<string, Map<string, Log>>();

  const fetch = async () => {
    const resp = await $fetch(`/api/product`, { retry: 3 });
    logs.value = resp.latest.map((l) => ({ ...l, uploadedAt: new Date(l.uploadedAt) }));
    maps.clear();
    for (const log of logs.value) {
      const key = `${log.sourceCity} - ${log.name}`;
      if (!maps.has(key)) {
        maps.set(key, new Map());
      }
      const map = maps.get(key)!;
      map.set(log.targetCity, log);
    }
  };

  return {
    logs,
    getLatestLog(city: string, name: string, target: string) {
      // Track deps
      logs.value;
      const key = `${city} - ${name}`;
      if (!maps.has(key)) {
        return undefined;
      }
      const map = maps.get(key)!;
      return map.get(target);
    },
    fetch
  };
});
