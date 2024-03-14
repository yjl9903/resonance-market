import * as z from 'zod';

import { logs, type NewLog } from '~/drizzle/schema';

import { connectDatabase } from '../utils/database';
import { invalidateValuableLogsCache } from '../utils/cache';

export const schema = z.object({
  name: z.string(),
  sourceCity: z.string(),
  targetCity: z.string(),
  type: z.enum(['buy', 'sell']),
  trend: z.enum(['up', 'same', 'down']),
  price: z.number().gt(0),
  percent: z.number().gt(0).lt(200),
  uploadedAt: z.coerce.date()
});

export default defineEventHandler(async (event) => {
  const db = await connectDatabase();
  const body = await readBody<Omit<NewLog, 'uploaderId'> | Omit<NewLog, 'uploaderId'>[]>(event);

  if (Array.isArray(body)) {
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
    }
  } else {
    const data = schema.safeParse(body);
    if (data.success) {
      const resp = await db
        .insert(logs)
        .values({
          ...data.data,
          // anonymous
          uploaderId: 1
        })
        .returning({ id: logs.id });

      if (resp.length > 0) {
        // Mark cache invalidated
        await invalidateValuableLogsCache();
      }

      return { count: resp.length };
    }
  }

  setResponseStatus(event, 400);
  return { count: 0, error: 'Body is invalid' };
});
