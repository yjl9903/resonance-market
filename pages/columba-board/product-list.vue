<script setup lang="ts">
definePageMeta({
  layout: 'columba-board'
})

const store = useLatestLogs()
await store.fetch()

onMounted(async () => {
  await store.fetch()
})

useIntervalFn(() => {
  store.fetch()
}, 10 * 1000)
</script>

<template>
  <CityProductList v-for="city in cities" :key="city.name" :city="city"></CityProductList>
</template>
