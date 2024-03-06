import { sql, eq, and, desc } from 'drizzle-orm';

import { products, logs, type Log } from '~/drizzle/schema';

import { connectDatabase } from '@/server/utils/database';

export default defineEventHandler(async (event) => {
  const sourceCityName = getRouterParam(event, 'source');
  const productName = getRouterParam(event, 'name');
  const targetCityName = getRouterParam(event, 'target');
  if (!sourceCityName || !productName || !targetCityName) {
    setResponseStatus(event, 400);
    return { latest: [], error: 'Body is invalid' };
  }

  const query = getQuery(event);
  const page = typeof query.page === 'string' && /^\d+&/.test(query.page) ? +query.page : 1;
  const pageSize = 100;

  const db = await connectDatabase(event);

  const latestLogs = await db
    .select({
      id: logs.id,
      name: logs.name,
      sourceCity: logs.sourceCity,
      targetCity: logs.targetCity,
      type: logs.type,
      trend: logs.trend,
      price: logs.price,
      percent: logs.percent,
      uploadedAt: logs.uploadedAt,
      uploaderId: logs.uploaderId
    })
    .from(logs)
    .where(
      and(
        eq(logs.sourceCity, decodeURIComponent(sourceCityName)),
        eq(logs.name, decodeURIComponent(productName)),
        eq(logs.targetCity, decodeURIComponent(targetCityName))
      )
    )
    .offset(pageSize * (page - 1))
    .limit(pageSize)
    .orderBy(desc(logs.uploadedAt));

  return {
    latest: latestLogs as Log[]
  };
});
