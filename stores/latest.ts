import type { Log } from '~/drizzle/schema';

export const useLatestLogs = defineStore('latest_logs', () => {
  const logs = ref<Log[]>([]);
  const transactionMap = ref<Map<string, Log>>(new Map());

  const update = (latest: Log[]) => {
    logs.value = latest.map((log) => ({ ...log, uploadedAt: new Date(log.uploadedAt) }));
    // 将数据转换为 Map 方便查询
    transactionMap.value.clear();
    logs.value.forEach((log) => {
      const key = `${log.name}-from${log.sourceCity}to${log.targetCity}`;
      transactionMap.value.set(key, log);
    });
  };

  const startGetData = async () => {
    await fetch();

    // 每隔 10 秒重新获取数据
    // setTimeout(startGetData, 10 * 1000);

    if (!import.meta.env.SSR) {
      // Server send events
      const eventSource = new EventSource('/api/stream/product');
      eventSource.addEventListener('message', (event) => {
        const resp = JSON.parse(event.data) as any;
        console.log(`Receive ${resp.latest.length} latest logs at ${new Date().toLocaleString()}`);
        if (Array.isArray(resp.latest) && resp.latest.length > 0) {
          update(resp.latest as any);
        }
      });
    }
  };

  const fetch = async () => {
    const resp = await $fetch(`/api/product`, { retry: 3 });
    if (Array.isArray(resp.latest) && resp.latest.length > 0) {
      update(resp.latest as any);
    }
  };

  const getLatestLog = (sourceCity: string, productName: string, targetCity: string) => {
    return transactionMap.value.get(`${productName}-from${sourceCity}to${targetCity}`);
  };

  return {
    logs,
    getLatestLog,
    fetch,
    startGetData
  };
});
