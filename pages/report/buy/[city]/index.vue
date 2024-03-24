<script setup lang="ts">
const route = useRoute();
const cityName = route.params.city as string;
const city = cities.filter((c) => c.name === cityName)[0];

if (!city) {
  navigateTo('/');
}

useHead({
  title: `上报 ${cityName} 商品买入价格 | 雷索纳斯市场`
});
</script>

<template>
  <div class="main pb-12">
    <h1 class="font-bold text-lg mb-4">从 {{ cityName }} 买入商品</h1>
    <div class="grid sm:grid-cols-2 gap-6">
      <div
        v-for="p in city.products.filter((p) => p.valuable)"
        :key="p.name"
        class="rounded border px-4"
      >
        <BuyReportForm :city="city" :product="p" />
      </div>
    </div>
  </div>
</template>
