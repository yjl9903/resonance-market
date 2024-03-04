import type { H3Event } from 'h3';

import { type DrizzleD1Database, drizzle } from 'drizzle-orm/d1';

import { users, products, logs } from '~/drizzle/schema';

export async function connectDatabase(
  event: H3Event
): Promise<
  DrizzleD1Database<{ users: typeof users; products: typeof products; logs: typeof logs }>
> {
  const { cloudflare } = event.context;
  console.log(cloudflare);

  if (cloudflare) {
    const db = drizzle(cloudflare.env.DATABASE, {
      logger: false,
      schema: { users, products, logs }
    });
    return db;
  } else {
    const { database } = await import('~/drizzle/connect');
    return database as any;
  }
}
