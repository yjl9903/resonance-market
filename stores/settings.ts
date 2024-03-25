// import { umami } from '~analytics/umami';

export type ListSortMode = 'byCity' | 'byProfit';
export type DataDisplayItems = 'profit' | 'perTicketProfit';

export const useSettingStore = defineStore('setting', () => {
  // const listSortMode = useStorage<ListSortMode>('listSortMode', 'byCity')

  const listSortMode = ref<ListSortMode>('byCity');
  const dataDisplayItems = ref<DataDisplayItems[]>(['profit', 'perTicketProfit']);
  const taxRate = ref<number>(0.08);
  const priceChangeRate = ref<number>(0.2);

  // 切换列表排序模式
  const switchListSortModeTo = (targetMode: ListSortMode) => {
    listSortMode.value = targetMode;

    // umami?.track(`switch list mode to ${targetMode}`).catch(() => {});
  };

  /**
   * 根据设置中的配置计算利润
   * @param sourceCityPrice 买入价格
   * @param targetCityPrice 卖出价格
   * @returns
   */
  const getProfitWithRule = (sourceCityPrice: number | undefined, targetCityPrice: number, productName: string) => {
    // 买入价格不存在时，返回-9999
    if (!sourceCityPrice) return -9999;
    // 红茶战争活动临时特殊逻辑
    if (productName === '红茶') {
      const finalSourceCityPrice = sourceCityPrice * (1 - priceChangeRate.value) * (1 + taxRate.value - 0.05);
      const finalTargetCityPrice = targetCityPrice * (1 + priceChangeRate.value) * (1 - taxRate.value + 0.05);
      return Math.round(finalTargetCityPrice - finalSourceCityPrice);
    }
    const finalSourceCityPrice = sourceCityPrice * (1 - priceChangeRate.value) * (1 + taxRate.value);
    const finalTargetCityPrice = targetCityPrice * (1 + priceChangeRate.value) * (1 - taxRate.value);
    return Math.round(finalTargetCityPrice - finalSourceCityPrice);
  };

  // 切换数据显示项
  const switchDataDisplayItems = (targetItem: DataDisplayItems) => {
    if (dataDisplayItems.value.includes(targetItem)) {
      dataDisplayItems.value = dataDisplayItems.value.filter((item) => item !== targetItem);
    } else {
      dataDisplayItems.value.push(targetItem);
    }
  };

  return {
    listSortMode: listSortMode,
    switchListSortModeTo,
    taxRate,
    priceChangeRate,
    getProfitWithRule,
    dataDisplayItems,
    switchDataDisplayItems
  };
});
