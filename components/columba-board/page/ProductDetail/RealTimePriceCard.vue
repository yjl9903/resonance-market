<script setup lang="ts">
const props = defineProps<{
  productInfo: {
    originCities: CityInfo[],
    name: string
  }
  city: CityInfo
}>()

const store = useLatestLogs()

// 找到最新的上报记录
const latestLog = computed(() => {
  return store.getLatestLog(props.city.name, props.productInfo.name, props.city.name)
})

// 是否已失效
const isOutdated = computed(() => {
  if (!latestLog.value) return true
  return isLogValid(latestLog.value)
})

// 计算更新时间在多久之前
const updateTime = computed(() => {
  if (!latestLog.value) return "--"
  const now = new Date()
  const offset = now.getTime() - latestLog.value.uploadedAt.getTime()
  if (offset <= 60 * 1000) {
    return `刚刚`
  } else if (offset <= 3600 * 1000) {
    return `${Math.floor(offset / (60 * 1000))} 分前`
  } else if (offset <= 24 * 3600 * 1000) {
    return `${Math.floor(offset / (3600 * 1000))} 小时前`
  }
  return "太久了"
})
</script>

<template>
  <CardBox>
    <!-- 报价城市名称 -->
    <div class="pb-2 border-b">
      {{ props.city.name }}
    </div>
    <div class="mt-2 grid grid-cols-3 gap-4">
      <!-- 当前价格百分比 -->
      <div class="flex flex-col">
        <div :class="['text-2xl font-bold', { 'line-through': isOutdated }]">
          <div
            v-if="latestLog"
            class="flex items-center"
            :class="{
              'text-red': latestLog.percent < 100,
              'text-green': latestLog.percent > 100
            }"
          >
            <span>{{ latestLog.percent }}%</span>
            <span class="text-xl mt-1">
              <span
                :class="{
                  'i-material-symbols-trending-up': latestLog.trend === 'up',
                  'i-material-symbols-trending-down' : latestLog.trend === 'down',
                  'i-material-symbols-trending-flat': latestLog.trend === 'same',
                }"
              ></span>
            </span>
          </div>
          <span v-else>无上报数据</span>
        </div>
        <div class="text-sm text-gray-500">当前行情</div>
      </div>
      
      <!-- 当前实际价格 -->
      <div class="flex flex-col">
        <div :class="['text-2xl font-bold', { 'line-through': isOutdated }]">{{ latestLog?.price }}</div>
        <div class="text-sm text-gray-500">当前实际价格</div>
      </div>

      <!-- 更新时间 -->
      <div class="flex flex-col">
        <div class="text-2xl font-bold">{{ updateTime }}</div>
        <div class="text-sm text-gray-500">更新时间</div>
      </div>
    </div>
  </CardBox>
</template>