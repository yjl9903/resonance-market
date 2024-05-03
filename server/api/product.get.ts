import { connectDatabase } from '../utils/database';
import { queryValuableLogs } from '../utils/query';

export default defineEventHandler(async () => {
  const db = await connectDatabase();

  const query = await queryValuableLogs.get(db);

  return {
    latest: query
  };
});
