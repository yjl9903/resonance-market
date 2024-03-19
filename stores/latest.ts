import type { Log } from '~/drizzle/schema'

export const useLatestLogs = defineStore('latest_logs', () => {
  const logs = ref<Log[]>([])
  const transactionMap = ref<Map<string, Log>>(new Map())

  const fetch = async () => {
    const resp = await $fetch(`/api/product`, { retry: 3 })
    logs.value = resp.latest.map(log => ({ ...log, uploadedAt: new Date(log.uploadedAt) }))
    // 将数据转换为 Map 方便查询
    transactionMap.value.clear()
    logs.value.forEach(log => {
      const key = `${log.name}-from${log.sourceCity}to${log.targetCity}`
      transactionMap.value.set(key, log)
    })
  }

  return {
    logs,
    getLatestLog(sourceCity: string, productName: string, targetCity: string) {
      return transactionMap.value.get(`${productName}-from${sourceCity}to${targetCity}`)
    },
    fetch
  }
})
