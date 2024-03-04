import { users, logs, type NewLog } from '~/drizzle/schema';

import { connectDatabase } from '../utils/database';

export default defineEventHandler(async (event) => {
  const db = await connectDatabase(event);
  const body = await readBody<Omit<NewLog, 'uploaderId'>>(event);

  await db
    .insert(users)
    .values({ id: 1, name: 'root' })
    .onConflictDoNothing()
    .returning({ id: users.id });

  const resp = await db
    .insert(logs)
    .values({
      ...body,
      uploaderId: 1
    })
    .returning({ id: logs.id });

  return { count: resp.length };
});
