import * as z from 'zod';

import { logs, type NewLog } from '~/drizzle/schema';

import { connectDatabase } from '../utils/database';
import { invalidateValuableLogsCache } from '../utils/cache';

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
  const db = await connectDatabase();
  const body = await readBody<Omit<NewLog, 'uploaderId'> | Omit<NewLog, 'uploaderId'>[]>(event);

  if (Array.isArray(body)) {
    const data = z.array(schema).safeParse(body);
    if (data.success) {
      let count = 0;
      const chunks = chunkize(data.data, 10);

      try {
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
      } catch (error) {
        console.error(error);
        setResponseStatus(event, 500);
        return { count, error: (error as any).message };
      } finally {
        if (count > 0) {
          // Mark cache invalidated
          await invalidateValuableLogsCache();
        }
      }

      return { count };
    }
  } else {
    const data = schema.safeParse(body);
    if (data.success) {
      try {
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
      } catch (error) {
        console.error(error);
        setResponseStatus(event, 500);
        return { count: 0, error: (error as any).message };
      }
    }
  }

  setResponseStatus(event, 400);
  return { count: 0, error: 'Body is invalid' };
});

function chunkize<T>(arr: T[], chunkSize: number) {
  const result: T[][] = [];
  for (let i = 0; i < arr.length; i += chunkSize) {
    result.push(arr.slice(i, i + chunkSize));
  }
  return result;
}
