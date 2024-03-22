<script setup lang="ts">
import { useStorage } from '@vueuse/core'

const logStore = useLatestLogs()

await logStore.startGetData()

const selectedCity = ref<CityInfo[]>(cities)

const blockCities = useStorage<string[]>('blockCities', [])

const switchCityFilter = (targetCity: CityInfo) => {
  if (selectedCity.value.find(city => city.name === targetCity.name)) {
    selectedCity.value = selectedCity.value.filter(city => city.name !== targetCity.name)
    blockCities.value.push(targetCity.name)
  }
  else {
    selectedCity.value = [...selectedCity.value, targetCity]
    blockCities.value = blockCities.value.filter(city => city !== targetCity.name)
  }
}

onMounted(() => {
  blockCities.value.forEach(cityName => {
    selectedCity.value = selectedCity.value.filter(city => city.name !== cityName)
  })
})
</script>

<template>
  <div class="main pb-12">
    <div class="flex flex-wrap gap-4 mb-4">
      <Button
        v-for="city in cities"
        :key="city.name"
        :variant="selectedCity.find((item) => item.name === city.name) ? 'default' : 'outline'"
        size="sm"
        @click="switchCityFilter(city)"
      >
        {{ city.name }}
      </Button>
    </div>

    <div class="space-y-4">
      <City
        v-for="city in selectedCity"
        :key="city.name"
        :city="city"
      />
    </div>
  </div>
</template>
