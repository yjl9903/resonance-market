<script setup lang="ts">
const store = useLatestLogs();
await store.fetch();

useIntervalFn(async () => {
  await store.fetch();
}, 10 * 1000);
</script>

<template>
  <div class="main pb-12">
    <div class="space-y-4">
      <City v-for="city in cities" :key="city.name" :city="city"></City>
    </div>
  </div>
</template>
