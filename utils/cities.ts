import type { CityInfo } from './types';

import { groupBy } from './map';
import { products } from './products';

export const cities: CityInfo[] = groupBy(products, (p) => p.city).map((i) => ({
  name: i[0],
  products: i[1]
}));
