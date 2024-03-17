import { skipHydrate  } from 'pinia'
import { useStorage } from '@vueuse/core'

export type ListSortMode = 'byCity' | 'byProfit' | 'byPerTicketProfit'
export type ProfitComputeRule = 'maxPriceChange' | 'noChange'

export const useSettingStore = defineStore('setting', () => {
  const listSortMode = useStorage<ListSortMode>('listSortMode', 'byCity')
  const profitComputeRule = useStorage<ProfitComputeRule>('profitComputeRule', 'noChange')

  // 切换列表排序模式
  const switchListSortModeTo = (targetMode: ListSortMode) => {
    listSortMode.value = targetMode
  }

  // 切换利润计算规则
  const switchProfitComputeRuleTo = (targetRule: ProfitComputeRule) => {
    profitComputeRule.value = targetRule
  }

  return {
    listSortMode: skipHydrate(listSortMode),
    switchListSortModeTo,
    profitComputeRule: skipHydrate(profitComputeRule),
    switchProfitComputeRuleTo
  }
})
