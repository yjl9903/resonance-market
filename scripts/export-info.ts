import fs from 'node:fs/promises';
import { parse } from 'csv-parse/sync';

import type { ProductInfo } from '~/utils/types';

const content = (await fs.readFile(`./scripts/全商品统计.csv`, 'utf-8')).split('\n');

const header = content[0].split(',');
const body = content.slice(1).join('\n');

const data = parse(body, {
  columns(input) {
    const expand: string[] = [];
    for (let id = 0; id < input.length; id++) {
      const item = input[id];
      if (item === '产地') {
        expand.push('sourceCity');
      } else if (item === '商品') {
        expand.push('name');
      } else if (item === '基础货量') {
        expand.push('baseVolume');
      } else if (item === '基准价格' && id < 6) {
        expand.push('basePrice');
      } else if (item === '类型') {
        expand.push('type');
      } else if (item === '解锁条件') {
        expand.push('condition');
      } else if (item === '成本') {
        expand.push('cost');
      } else {
        const city = (() => {
          for (let i = id; i >= 0; i--) {
            if (header[i]) {
              return header[i];
            }
          }
          throw new Error('');
        })();
        const key = (() => {
          if (item === '里程(km)') {
            return 'mileage';
          } else if (item === '基准价格') {
            return 'basePrice';
          } else if (item === '净差值') {
            return 'delta';
          } else if (item === '里程加值') {
            return 'addition';
          } else {
            throw new Error('');
          }
        })();
        expand.push(city + '_' + key);
      }
    }
    return expand;
  }
});

const cities = new Set<string>();
for (const row of data) {
  if (!!row.sourceCity) {
    cities.add(row.sourceCity);
  }
}

const products: ProductInfo[] = [];

let sourceCity = '';
for (const row of data) {
  if (!!row.sourceCity) {
    sourceCity = row.sourceCity;
  }
  const product: ProductInfo = {
    name: row.name,
    city: sourceCity,
    type: row.type === '制造' ? 'manufacture' : row.type === '普通' ? 'normal' : 'specialty',
    valuable: true,
    baseVolume: row.baseVolume !== 'None' ? +row.baseVolume : null,
    basePrice: row.basePrice !== '' ? +row.basePrice : 0,
    cost: row.cost === '时价' ? null : row.cost !== '' ? +row.cost : 0,
    transactions: []
  };

  for (const city of cities) {
    if (!row[`${city}_mileage`]) continue;
    const trans = {
      name: product.name,
      sourceCity: product.city,
      targetCity: city,
      mileage: +row[`${city}_mileage`],
      basePrice: +row[`${city}_basePrice`]
    };
    if (Number.isNaN(trans.mileage) || Number.isNaN(trans.basePrice)) {
      throw new Error();
    }
    product.transactions.push(trans);
  }

  products.push(product);
}

console.log(JSON.stringify(products, null, 2));
await fs.writeFile(`./data.json`, JSON.stringify(products, null, 2), 'utf-8');
