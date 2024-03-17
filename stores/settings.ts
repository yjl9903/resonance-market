import { skipHydrate  } from 'pinia'
import { useStorage } from '@vueuse/core'

export type ListSortMode = 'byCity' | 'byProfit' | 'byPerTicketProfit'

export const useSettingStore = defineStore('setting', () => {
  const listSortMode = useStorage<ListSortMode>('listSortMode', 'byCity')

  // 切换列表排序模式
  const switchListSortModeTo = (targetMode: ListSortMode) => {
    listSortMode.value = targetMode
  }

  return {
    listSortMode: skipHydrate(listSortMode),
    switchListSortModeTo
  }
})
