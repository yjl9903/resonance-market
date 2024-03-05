import 'dotenv/config';

import { logs } from './drizzle/schema';
import { connect } from './drizzle/prod/connect';

const data: any = await fetch(`https://resonance.breadio.wiki/api/product`).then((r) => r.json());

const database = connect();

for (const log of data.latest) {
  try {
    await database
      .insert(logs)
      .values({
        name: log.name,
        sourceCity: log.sourceCity,
        targetCity: log.targetCity,
        type: log.type,
        trend: log.trend ? log.trend : 'same',
        price: log.price,
        percent: log.percent,
        uploadedAt: new Date(log.uploadedAt),
        uploaderId: 1
      })
      .onConflictDoNothing();
  } catch (error) {
    console.log(error);
    console.log(log);
    process.exit();
  }
}
