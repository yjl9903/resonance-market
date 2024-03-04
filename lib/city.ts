export interface ProductInfo {
  name: string;
}

export interface CityInfo {
  name: string;

  products: ProductInfo[];
}

export const cities: CityInfo[] = [
  {
    name: '修格里城',
    products: [
      { name: '发动机' },
      { name: '弹丸加速装置' },
      { name: '红茶' },
      { name: '修格里严选礼包' }
    ]
  },
  {
    name: '铁盟哨站',
    products: [
      { name: '防弹背心' },
      { name: '弹丸加速装置' },
      { name: '精钢' },
      { name: '炮弹' },
      { name: '塑胶炸药' }
    ]
  },
  {
    name: '7号自由港',
    products: [
      { name: '桦石发财树' },
      { name: '石墨烯' },
      { name: '人工晶花' },
      { name: '班节虾' },
      { name: '年货大礼包' }
    ]
  },
  {
    name: '澄明数据中心',
    products: [{ name: '游戏机' }, { name: '银矿石' }, { name: '游戏卡带' }, { name: '扬声器' }]
  },
  {
    name: '阿妮塔战备工厂',
    products: [
      { name: '火澄石' },
      { name: '负片炮弹' },
      { name: '阿妮塔202军用无人机' },
      { name: '抗污染防护服' },
      { name: '钛合金' }
    ]
  },
  {
    name: '阿妮塔能源研究所',
    products: [
      { name: '阿妮塔小型桦树发电机' },
      { name: '石墨烯电池' },
      { name: '阿妮塔101民用无人机' },
      { name: '家用太阳能电池组' }
    ]
  },
  {
    name: '荒原站',
    products: [{ name: '孔雀石' }, { name: '琥珀' }, { name: '绿松石' }]
  },
  {
    name: '曼德矿场',
    products: [
      { name: '图形加速卡' },
      { name: '钛矿石' },
      { name: '铁轨用特种钢材' },
      { name: '曼德工具箱' }
    ]
  },
  {
    name: '淘金乐园',
    products: [
      { name: '沙金' },
      { name: '青金石' },
      { name: '玛瑙' },
      { name: '金箔' },
      { name: '纯金线材' }
    ]
  }
];
