import type { CityInfo, ProductInfo } from './types';

// @ts-ignore
import allProducts from './products';
import { groupBy } from './map';

export const products = allProducts as ProductInfo[];

const citiesMap = groupBy(products, (p) => p.city);

export const cities: CityInfo[] = [...citiesMap]
  .map((i) => ({
    name: i[0],
    products: i[1]
  }))
  .filter((city) => city.products.find((product) => product.valuable));

export function getProductInfo(city: string, name: string) {
  const productInfo = citiesMap.get(city)?.find((p) => p.name === name);
  // 红茶战争活动临时特殊逻辑
  if (name === '红茶' && productInfo) {
    return {
      ...productInfo,
      baseVolume: Math.round((productInfo.baseVolume || 0) * (1 + 0.5)) // 临时加成50%
    };
  }
  return citiesMap.get(city)?.find((p) => p.name === name);
}

export function getTransactionInfo(source: string, name: string, target: string) {
  return citiesMap
    .get(source)
    ?.find((p) => p.name === name)
    ?.transactions.find((t) => t.targetCity === target);
}
