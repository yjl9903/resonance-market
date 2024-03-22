import { drizzle } from 'drizzle-orm/d1';

import { logs, products, transactions, users } from '../schema';

export function connect(env = process.env) {
  const { DATABASE } = env ?? {};
  if (!DATABASE) throw new Error('Can not find d1 binding');

  return drizzle(DATABASE as any, {
    logger: false,
    schema: { users, transactions, products, logs }
  });
}
