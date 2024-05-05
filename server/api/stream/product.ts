import { memoAsync } from 'memofunc';

// import { connectDatabase } from '~/server/utils/database';
// import { queryValuableLogs } from '~/server/utils/query';
import { addHandler, removeHandler, type HandlerFn } from '~/server/utils/cache';

export default defineEventHandler(async (event) => {
  // const db = await connectDatabase();

  const eventStream = createEventStream(event);

  const rawQuery: HandlerFn = async (result) => {
    eventStream.push(JSON.stringify({ latest: result }));
  };
  const query = memoAsync(rawQuery, { serialize: () => [], expirationTtl: 10 });

  addHandler(query);
  eventStream.onClosed(async () => {
    removeHandler(query);
    await eventStream.close();
  });

  // Start scheduling
  // startTimer();

  return eventStream.send();
});
