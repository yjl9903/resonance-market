import { hash } from 'ohash';
import { memoAsync } from 'memofunc';

import { queryValuableLogs } from './query';

export type HandlerFn = (result: Awaited<ReturnType<typeof queryValuableLogs>>) => Promise<void>;

const handlers = new Set<HandlerFn>();

export function addHandler(fn: HandlerFn) {
  handlers.add(fn);
}

export function removeHandler(fn: HandlerFn) {
  handlers.delete(fn);
}

export async function invalidateValuableLogsCache() {
  const result = await queryValuableLogs.update(await connectDatabase());
  // Not await
  broadcast(result);
}

async function broadcast(res: Awaited<ReturnType<typeof queryValuableLogs>>) {
  await Promise.all(
    [...handlers].map(async (handler) => {
      try {
        await handler(res);
      } catch (error) {
        console.error(error);
      }
    })
  );
}

export const startTimer = memoAsync(async () => {
  const db = await connectDatabase();

  let lastHash = '';
  const fn = async () => {
    try {
      const res = await queryValuableLogs.update(db);
      const hsh = hash(res);
      if (hsh !== lastHash) {
        lastHash = hsh;
        broadcast(res);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setTimeout(fn, 10 * 1000);
    }
  };

  setTimeout(fn, 10 * 1000);
});
