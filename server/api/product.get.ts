import { eq, and, max } from 'drizzle-orm';
import { memoAsync } from 'memofunc';

import { products, logs, type Log } from '~/drizzle/schema';

import { connectDatabase } from '../utils/database';

export const queryValuableLogs = memoAsync(
  async (db: Awaited<ReturnType<typeof connectDatabase>>) => {
    const latestLogSubQuery = db
      .select({
        name: logs.name,
        city: logs.sourceCity,
        target_city: logs.targetCity,
        max_uploaded_at: max(logs.uploadedAt).as('max_uploaded_at')
      })
      .from(logs)
      .groupBy(logs.name, logs.sourceCity, logs.targetCity)
      .as('latest_log');

    const query = await db
      .select({
        id: logs.id,
        name: products.name,
        sourceCity: products.city,
        targetCity: logs.targetCity,
        type: logs.type,
        trend: logs.trend,
        price: logs.price,
        percent: logs.percent,
        uploadedAt: logs.uploadedAt
      })
      .from(products)
      .where(eq(products.valuable, true))
      .innerJoin(
        latestLogSubQuery,
        and(eq(products.name, latestLogSubQuery.name), eq(products.city, latestLogSubQuery.city))
      )
      .innerJoin(
        logs,
        and(
          eq(logs.name, products.name),
          eq(logs.sourceCity, products.city),
          eq(logs.targetCity, latestLogSubQuery.target_city),
          eq(logs.uploadedAt, latestLogSubQuery.max_uploaded_at)
        )
      );

    return query as Log[];
  },
  {
    serialize() {
      return [];
    }
  }
);

setInterval(() => {
  queryValuableLogs.clear();
}, 10 * 1000);

export default defineEventHandler(async (event) => {
  const db = await connectDatabase(event as any);

  const query = await queryValuableLogs.get(db);

  return {
    latest: query
  };
});
