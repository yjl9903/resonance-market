import fs from 'node:fs/promises';
import { parse } from 'csv-parse/sync';

import type { ProductInfo } from '~/utils/types';

const content = (await fs.readFile(`./scripts/全商品统计.csv`, 'utf-8'))
  .replace(/阿妮塔战备工厂\(lv40\)/g, '阿妮塔战备工厂')
  .replace(/七号自由港/g, '7号自由港')
  .split('\n');

const header = content[0].split(',');
const body = content.slice(1).join('\n');

const data = parse(body, {
  columns(input) {
    const expand: string[] = [];
    for (let id = 0; id < input.length; id++) {
      const item = input[id];
      switch (item) {
        case '产地':
          expand.push('sourceCity');
          break;
        case '商品':
          expand.push('name');
          break;
        case '基础货量':
          expand.push('baseVolume');
          break;
        case '类型':
          expand.push('type');
          break;
        case '解锁条件':
          expand.push('condition');
          break;
        case '成本':
          expand.push('cost');
          break;
        case '基准价格':
          if (id < 6) {
            expand.push('basePrice');
            break;
          }
        default:
          const city = (() => {
            for (let i = id; i >= 0; i--) {
              if (header[i]) {
                return header[i];
              }
            }
            throw new Error('');
          })();
          const key = (() => {
            switch (item) {
              case '里程(km)':
                return 'mileage';
              case '基准价格':
                return 'basePrice';
              case '净差值':
                return 'delta';
              case '里程加值':
                return 'addition';
              default:
                throw new Error('');
            }
          })();
          expand.push(city + '_' + key);
          break;
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

const valuable = new Set([
  '修格里城:发动机',
  '修格里城:弹丸加速装置',
  '修格里城:红茶',
  '修格里城:修格里严选礼包',
  '铁盟哨站:防弹背心',
  '铁盟哨站:弹丸加速装置',
  '铁盟哨站:精钢',
  '铁盟哨站:炮弹',
  '铁盟哨站:塑胶炸药',
  '7号自由港:桦石发财树',
  '7号自由港:石墨烯',
  '7号自由港:人工晶花',
  '7号自由港:班节虾',
  '7号自由港:年货大礼包',
  '澄明数据中心:游戏机',
  '澄明数据中心:银矿石',
  '澄明数据中心:游戏卡带',
  '澄明数据中心:扬声器',
  '阿妮塔战备工厂:火澄石',
  '阿妮塔战备工厂:负片炮弹',
  '阿妮塔战备工厂:阿妮塔202军用无人机',
  '阿妮塔战备工厂:抗污染防护服',
  '阿妮塔战备工厂:钛合金',
  '阿妮塔战备工厂:碳纤维',
  '阿妮塔能源研究所:阿妮塔小型桦树发电机',
  '阿妮塔能源研究所:石墨烯电池',
  '阿妮塔能源研究所:阿妮塔101民用无人机',
  '阿妮塔能源研究所:家用太阳能电池组',
  '荒原站:棉花',
  '荒原站:孔雀石',
  '荒原站:琥珀',
  '荒原站:绿松石',
  '曼德矿场:图形加速卡',
  '曼德矿场:钛矿石',
  '曼德矿场:铁轨用特种钢材',
  '曼德矿场:曼德工具箱',
  '淘金乐园:沙金',
  '淘金乐园:青金石',
  '淘金乐园:玛瑙',
  '淘金乐园:金箔',
  '淘金乐园:纯金线材'
]);

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
    valuable: valuable.has(sourceCity + ':' + row.name),
    baseVolume: row.baseVolume !== 'None' ? +row.baseVolume : null,
    basePrice: row.basePrice !== '' ? +row.basePrice : 0,
    cost: row.cost === '时价' ? null : row.cost !== '' ? +row.cost : 0,
    transactions: []
  };
  console.log(row);

  for (const city of cities) {
    if (!row[`${city}_mileage`] || row[`${city}_basePrice`] === '') continue;
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

await fs.writeFile(`./utils/products.json`, JSON.stringify(products, null, 2), 'utf-8');
