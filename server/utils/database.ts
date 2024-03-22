import { createStorage } from 'unstorage';
import memoryDriver from 'unstorage/drivers/memory';
import cloudflareKVBindingDriver from 'unstorage/drivers/cloudflare-kv-binding';

import { type DrizzleD1Database } from 'drizzle-orm/d1';

import { connect } from '~/drizzle/d1/connect';

// import { initialize } from '~/drizzle/d1/initialize';
import type { logs, products, users } from '~/drizzle/schema';

export async function connectDatabase(): Promise<
  DrizzleD1Database<{ users: typeof users; products: typeof products; logs: typeof logs }>
  > {
  if (import.meta.dev) {
    const { database } = await import('~/drizzle/dev/connect');

    return database as any;
  }
  else {
    // await initialize(db);

    return connect((globalThis as any).__env__);
  }
}

export function connectStorage() {
  if (import.meta.dev) {
    return createStorage({
      driver: memoryDriver()
    });
  }
  else {
    return createStorage({
      driver: cloudflareKVBindingDriver({ binding: globalThis.__env__?.STORAGE })
    });
  }
}
