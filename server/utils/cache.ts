import { queryValuableLogs } from '../api/product.get';

export function invalidateValuableLogsCache() {
  queryValuableLogs.clear();
}
