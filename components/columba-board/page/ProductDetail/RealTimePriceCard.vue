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
    return `${Math.floor(offset / (60 * 1000))}分前`
  } else if (offset <= 24 * 3600 * 1000) {
    return `${Math.floor(offset / (3600 * 1000))}小时前`
  }
  return "很久以前"
})
</script>

<template>
  <CardBox class="shadow-lg p-4">
    <!-- 报价城市名称 -->
    <div class="mb-3 text-base-400">
      {{ props.city.name }}
    </div>
    <div class="mt-2 grid grid-cols-3 gap-4">
      <!-- 当前价格百分比 -->
      <div class="flex flex-col">
        <div :class="['text-2xl font-bold', { 'line-through op-50': isOutdated }]">
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
        <div :class="['text-2xl font-bold', { 'line-through op-50': isOutdated }]">{{ latestLog?.price }}</div>
        <div class="text-sm text-gray-500">当前实际价格</div>
      </div>

      <!-- 更新时间 -->
      <div class="flex flex-col">
        <div class="text-2xl font-bold">{{ updateTime }}</div>
        <div class="text-sm text-gray-500">更新时间</div>
      </div>
    </div>

    <div class="flex gap-4">
      <!-- 趋势图表 -->
      <div class="flex-grow">
        <div v-if="latestLog" id="chart" class="h-full w-full"></div>
        <div v-else class="flex justify-center items-center h-40 text-base-400">
          暂无数据
        </div>
      </div>

      <div class="flex flex-col justify-between">
        <!-- 实时价格 -->
        <div class="text-3xl font-bold">
          {{ latestLog?.percent || "--" }}
        </div>
        <div class="text-base-400">
          {{ latestLog?.price || "--" }}
        </div>
        <div class="text-base-400">
          {{ updateTime }}
        </div>
        <div class="text-base-400">
          <span v-if="isOutdated" class="text-red-500">已失效</span>
        </div>
      </div>
    </div>
  </CardBox>
</template>