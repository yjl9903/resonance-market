export type ListSortMode = 'byCity' | 'byProfit'

export const useSettingStore = defineStore('setting', () => {
  const listSortMode = ref<ListSortMode>('byCity')

  // 切换列表排序模式
  const switchListSortModeTo = (targetMode: ListSortMode) => {
    listSortMode.value = targetMode
  }

  return {
    listSortMode,
    switchListSortModeTo
  }
})
