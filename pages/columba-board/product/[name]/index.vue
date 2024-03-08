<script setup lang="ts">
definePageMeta({
  layout: false,
})
const route = useRoute()
const productName = route.params.name as string
const pageTitle = computed(() => {
  return `货物详情`
})

const productInfo = computed(() => {
  const originCities = cities.filter(city => city.products.find(p => p.name === productName))
  return {
    originCities,
    name: productName
  }
})
</script>

<template>
  <NuxtLayout name="child-page" :title="pageTitle" header-background-color-class="bg-blue-400" >
    <div class="flex flex-col">
      <ProductInfo :product-info="productInfo" />
      <div class="text-2xl text-base-100 font-bold mb-3">实时价格</div>
      <div class="grid grid-cols-1 md:grid-cols-2">
        <RealTimePriceCard
          v-for="city in productInfo.originCities"
          :product-info="productInfo"
          :city="city"
        />
      </div>
      <CardBox title="出手行情">
      </CardBox>
    </div>
  </NuxtLayout>
</template>
