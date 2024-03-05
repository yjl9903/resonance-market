import { users, logs, type NewLog } from '~/drizzle/schema';

import { connectDatabase } from '../utils/database';

export default defineEventHandler(async (event) => {
  const db = await connectDatabase(event);
  const body = await readBody<Omit<NewLog, 'uploaderId'>>(event);

  const resp = await db
    .insert(logs)
    .values({
      ...body,
      uploadedAt: new Date(body.uploadedAt),
      // anonymous
      uploaderId: 1
    })
    .returning({ id: logs.id });

  return { count: resp.length };
});
