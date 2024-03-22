import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';

import { logs, products, users } from '../schema';

export function connect(env = process.env) {
  const { TURSO_URL, TURSO_AUTH_TOKEN } = env ?? {};
  if (!TURSO_URL || !TURSO_AUTH_TOKEN)
    throw new Error('Can not find connect information');

  const client = createClient({ url: TURSO_URL, authToken: TURSO_AUTH_TOKEN });

  return drizzle(client, { logger: false, schema: { users, products, logs } });
}
