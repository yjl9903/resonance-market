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
      globalThis.__cf_env__,
      // @ts-ignore
      globalThis.__cf_env__?.DATABASE,
      // @ts-ignore
      globalThis.__env__,
      // @ts-ignore
      globalThis.__env__?.DATABASE
    );

    const runtime = useRuntimeConfig();
    console.log(runtime);

    return connect();

    // @ts-ignore
    // const runtime = useRuntimeConfig(event);
    // const { cloudflare } = event.context;
    // const db = drizzle(cloudflare.env.DATABASE, {
    //   logger: false,
    //   schema: { users, products, logs }
    // });

    // return db;
  }
}
