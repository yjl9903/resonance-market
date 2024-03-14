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
    let count = 0;
    const chunks = chunkize(data.data, 10);

    for (const chunk of chunks) {
      const resp = await db
        .insert(logs)
        .values(
          chunk.map((data) => ({
            ...data,
            // anonymous
            uploaderId: 1
          }))
        )
        .onConflictDoNothing()
        .returning({ id: logs.id });

      count += resp.length;
    }

    if (count > 0) {
      // Mark cache invalidated
      await invalidateValuableLogsCache();
    }

    return { count };
  } else {
    setResponseStatus(event, 400);
    return { count: 0, error: 'Body is invalid' };
  }
});

function chunkize<T>(arr: T[], chunkSize: number) {
  const result: T[][] = [];
  for (let i = 0; i < arr.length; i += chunkSize) {
    result.push(arr.slice(i, i + chunkSize));
  }
  return result;
}
