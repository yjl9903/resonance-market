<template>
  <div class="city-quotation-cell flex">
    <PriceCell
      v-for="cityQuotation in data"
      :key="cityQuotation.cityName"
      :data="cityQuotation"
    />
  </div>
</template>
  
<script setup lang='ts'>
import PriceCell from './PriceCell.vue'

const { data } = defineProps<{
  data: CityPrice[]
}>()
</script>

<style lang="scss" scoped>
</style>