import * as z from 'zod';

import { logs, type NewLog } from '~/drizzle/schema';

import { cacheProducts } from '../utils/cache';
import { connectDatabase } from '../utils/database';

const schema = z.object({
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
  const db = await connectDatabase(event);
  const body = await readBody<Omit<NewLog, 'uploaderId'>>(event);

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
      cacheProducts.dirty = true;
    }

    return { count: resp.length };
  } else {
    setResponseStatus(event, 400);
    return { count: 0, error: 'Body is invalid' };
  }
});
