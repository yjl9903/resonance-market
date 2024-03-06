import { sql, eq, and, desc } from 'drizzle-orm';

import { products, logs, type Log } from '~/drizzle/schema';

import { connectDatabase } from '@/server/utils/database';

export default defineEventHandler(async (event) => {
  const sourceCityName = getRouterParam(event, 'source');
  const productName = getRouterParam(event, 'name');
  const targetCityName = getRouterParam(event, 'target');
  const id = getRouterParam(event, 'id');
  if (!sourceCityName || !productName || !targetCityName || !id || !/^\d+$/.test(id)) {
    setResponseStatus(event, 400);
    return { latest: [], error: 'Body is invalid' };
  }

  const db = await connectDatabase(event);

  const resp = await db
    .delete(logs)
    .where(
      and(
        eq(logs.id, +id),
        eq(logs.sourceCity, decodeURIComponent(sourceCityName)),
        eq(logs.name, decodeURIComponent(productName)),
        eq(logs.targetCity, decodeURIComponent(targetCityName))
      )
    )
    .returning({ id: logs.id });

  return {
    count: resp.length
  };
});
