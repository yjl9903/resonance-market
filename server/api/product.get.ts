import { connectDatabase } from '../utils/database';

export default defineEventHandler(async (event) => {
  const db = await connectDatabase(event);

  return {};
});
