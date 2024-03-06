<template>
  <div class="price-cell flex-shrink-0 pl-2 pr-2">
    <div class="city-name">{{ data.cityName }}</div>
    <div class="price-percent" :class="priceColor">
      <span class="percent">{{ data.pricePercent }}%</span>
      <span class="trend-icon">
        <span v-if="data.trend === 'up'">↑</span>
        <span v-else-if="data.trend === 'down'">↓</span>
      </span>
    </div>
    <div class="price">{{ data.price }}</div>
  </div>
</template>
  
<script setup lang='ts'>
import { computed } from 'vue'
const { data } = defineProps<{
  data: CityPrice
}>()

const priceColor = computed(() => {
  if (data.trend === 'up') {
    return 'text-green-500'
  } else if (data.trend === 'down') {
    return 'text-red-500'
  } else {
    return 'text-gray-500'
  }
})
</script>

<style lang="scss" scoped>
.price-cell {
  min-width: 130px;
}
</style>