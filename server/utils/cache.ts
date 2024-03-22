import { queryValuableLogs } from '../api/product.get'

export async function invalidateValuableLogsCache() {
  await queryValuableLogs.update(await connectDatabase())
}
