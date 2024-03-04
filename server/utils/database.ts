import type { H3Event } from 'h3';

import { type DrizzleD1Database, drizzle } from 'drizzle-orm/d1';

import { users, products, logs } from '~/drizzle/schema';

export async function connectDatabase(
  event: H3Event
): Promise<
  DrizzleD1Database<{ users: typeof users; products: typeof products; logs: typeof logs }>
> {
  if (import.meta.dev) {
    const { database } = await import('~/drizzle/connect');
    return database as any;
  } else {
    // @ts-ignore
    const runtime = useRuntimeConfig(event);
    console.log(runtime, JSON.stringify(runtime));
    const { cloudflare } = event.context;
    console.log(cloudflare, event.context, JSON.stringify(event.context));
    const db = drizzle(cloudflare.env.DATABASE, {
      logger: false,
      schema: { users, products, logs }
    });
    return db;
  }
}
