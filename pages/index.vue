<script setup lang="ts">
const store = useLatestLogs();
await store.fetch();

useIntervalFn(async () => {
  await store.fetch();
}, 10 * 1000);

const selectedCity = ref<CityInfo[]>([cities[0]])

const switchCityFilter = (targetCity: CityInfo) => {
  if (selectedCity.value.find(city => city.name == targetCity.name)) {
    selectedCity.value = selectedCity.value.filter(city => city.name !== targetCity.name);
  } else {
    selectedCity.value = [...selectedCity.value, targetCity];
  }
};
</script>

<template>
  <div class="main pb-12">
    <div class="flex space-x-4 mb-4">
      <Button
        v-for="city in cities"
        :key="city.name"
        @click="switchCityFilter(city)"
        :variant="selectedCity.find(item => item.name == city.name) ? 'default' : 'outline'"
        size="sm"
      >{{ city.name }}</Button>
    </div>

    <div class="space-y-4">
      <City v-for="city in selectedCity" :key="city.name" :city="city"></City>
    </div>
  </div>
</template>
