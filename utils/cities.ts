import type { CityInfo, ProductInfo } from './types';

// @ts-ignore
import allProducts from './products';
import { groupBy } from './map';

export const products = allProducts as ProductInfo[];

const citiesMap = groupBy(products, (p) => p.city);

export const cities: CityInfo[] = [...citiesMap].map((i) => ({
  name: i[0],
  products: i[1]
}));

export function getProductInfo(city: string, name: string) {
  return citiesMap.get(city)?.find((p) => p.name === name);
}

export function getTransactionInfo(source: string, name: string, target: string) {
  return citiesMap
    .get(source)
    ?.find((p) => p.name === name)
    ?.transactions.find((t) => t.targetCity === target);
}
