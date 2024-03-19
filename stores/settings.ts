import { skipHydrate  } from 'pinia'
import { useStorage } from '@vueuse/core'

export type ListSortMode = 'byCity' | 'byProfit'
export type ProfitComputeRule = 'maxPriceChange' | 'noChange'
export type DataDisplayItems = 'profit' | 'perTicketProfit'

export const useSettingStore = defineStore('setting', () => {
  // const listSortMode = useStorage<ListSortMode>('listSortMode', 'byCity')
  // const profitComputeRule = useStorage<ProfitComputeRule>('profitComputeRule', 'noChange')
  
  const listSortMode = ref<ListSortMode>('byCity')
  const dataDisplayItems = ref<DataDisplayItems[]>(['profit', 'perTicketProfit'])
  const profitComputeRule = ref<ProfitComputeRule>('maxPriceChange')

  // 切换列表排序模式
  const switchListSortModeTo = (targetMode: ListSortMode) => {
    listSortMode.value = targetMode
  }

  // 切换利润计算规则
  const switchProfitComputeRuleTo = (targetRule: ProfitComputeRule) => {
    profitComputeRule.value = targetRule
  }

  // 切换数据显示项
  const switchDataDisplayItems = (targetItem: DataDisplayItems) => {
    if (dataDisplayItems.value.includes(targetItem)) {
      dataDisplayItems.value = dataDisplayItems.value.filter(item => item !== targetItem)
    } else {
      dataDisplayItems.value.push(targetItem)
    }
  }

  return {
    listSortMode: listSortMode,
    // listSortMode: skipHydrate(listSortMode),
    switchListSortModeTo,
    profitComputeRule: profitComputeRule,
    // profitComputeRule: skipHydrate(profitComputeRule),
    switchProfitComputeRuleTo,
    dataDisplayItems: dataDisplayItems,
    // dataDisplayItems: skipHydrate(dataDisplayItems),
    switchDataDisplayItems
  }
})
