import type { H3Event } from 'h3';

import { type DrizzleD1Database } from 'drizzle-orm/d1';

import { connect } from '~/drizzle/prod/connect';
import { users, products, logs } from '~/drizzle/schema';

export async function connectDatabase(
  event: H3Event
): Promise<
  DrizzleD1Database<{ users: typeof users; products: typeof products; logs: typeof logs }>
> {
  if (import.meta.dev) {
    const { database } = await import('~/drizzle/dev/connect');
    return database as any;
  } else {
    console.log(
      // @ts-ignore
      globalThis.__env__,
      // @ts-ignore
      globalThis.__env__?.DATABASE
    );

    return connect((globalThis as any).__env__);
  }
}
