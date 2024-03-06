import type { CityInfo } from './types';

import { groupBy } from './map';
import { products } from './products';

const citiesMap = groupBy(products, (p) => p.city);

export const cities: CityInfo[] = [...citiesMap].map((i) => ({
  name: i[0],
  products: i[1]
}));

export function getProductInfo(city: string, name: string) {
  return citiesMap.get(city)?.find((p) => p.name === name);
}
