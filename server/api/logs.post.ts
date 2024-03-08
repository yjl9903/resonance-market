import * as z from 'zod';

import { logs, type NewLog } from '~/drizzle/schema';

import { connectDatabase } from '../utils/database';
import { invalidateValuableLogsCache } from '../utils/cache';

import { schema } from './log.post';

export default defineEventHandler(async (event) => {
  const db = await connectDatabase();
  const body = await readBody<Omit<NewLog, 'uploaderId'>>(event);

  const data = z.array(schema).safeParse(body);
  if (data.success) {
    const resp = await db
      .insert(logs)
      .values(
        data.data.map((data) => ({
          ...data,
          // anonymous
          uploaderId: 1
        }))
      )
      .onConflictDoNothing()
      .returning({ id: logs.id });

    if (resp.length > 0) {
      // Mark cache invalidated
      await invalidateValuableLogsCache();
    }

    return { count: resp.length };
  } else {
    setResponseStatus(event, 400);
    return { count: 0, error: 'Body is invalid' };
  }
});
