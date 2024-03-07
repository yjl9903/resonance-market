<script setup lang="ts">
const { productInfo } = defineProps<{
  productInfo: {
    originCities: CityInfo[],
    name: string
  }
}>()
</script>

<template>
  <div class="flex flex-col bg-blue-400 text-white px-3 pt-3 -mx-3 -mt-3 pb-20 -mb-16">
    <div class="text-xs">
      原产地：{{ productInfo.originCities.map(city => city.name).join(', ') }}
    </div>
    <div class="text-2xl font-bold my-1">{{ productInfo.name }}</div>
    <div class="flex flex-row space-x-2 overflow-x-auto mt-1">
      <span class="px-2 py-1 text-xs bg-yellow-500 rounded-md">特产</span>
    </div>
  </div>
</template>