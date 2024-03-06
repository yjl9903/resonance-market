<script setup lang="ts">
definePageMeta({
  layout: 'columba-board'
})
</script>

<template>
  <div class="quotation-wrapper h-full">
    <MarketOverview title="买入大盘" chart-id="chart1" />
    <MarketOverview title="卖出大盘" chart-id="chart2" />
  </div>
</template>

<style lang="scss" scoped>

</style>