<script setup lang="ts">
const route = useRoute();
const sourceCityName = route.params.source;
const productName = route.params.name;
const targetCityName = route.params.target;

useHead({
  title: `贸易 ${sourceCityName} 一 ${productName} → ${targetCityName} | 雷索纳斯市场`
});
</script>

<template>
  <div class="main pb-12">
    <h1 class="font-bold text-lg mb-4">
      贸易
      <NuxtLink :to="`/product/${sourceCityName}/${productName}`" class="text-link-active"
        >{{ sourceCityName }} 一 {{ productName }}</NuxtLink
      >
      → {{ targetCityName }}
    </h1>
    <div>施工中...</div>
    <!-- <ClientOnly>
      <div class="pt-8">
        <Giscus
          id="comments"
          repo="yjl9903/resonance-market"
          repoId="R_kgDOLbiZ1A"
          mapping="number"
          term="7"
          reactionsEnabled="0"
          emitMetadata="0"
          inputPosition="bottom"
          theme="preferred_color_scheme"
          lang="zh-CN"
        />
      </div>
    </ClientOnly> -->
  </div>
</template>
