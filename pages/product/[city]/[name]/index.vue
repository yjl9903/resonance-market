<script setup lang="ts">
const route = useRoute()
const cityName = route.params.city as string
const productName = route.params.name as string

useHead({
  title: `商品 ${cityName} - ${productName} | 雷索纳斯市场`,
})

const product = getProductInfo(cityName, productName)!

if (!product)
  navigateTo('/')
</script>

<template>
  <div class="main pb-12">
    <h1 class="font-bold text-lg mb-4">
      商品 {{ cityName }} - {{ productName }}
    </h1>

    <div class="mb-4 space-y-2">
      <div v-for="tr in product.transactions">
        <NuxtLink
          :to="`/transaction/${tr.sourceCity}/${tr.name}/${tr.targetCity}`"
          class="text-link"
        >
          {{ tr.sourceCity }} 一 {{ tr.name }} → {{ tr.targetCity }}
        </NuxtLink>
      </div>
    </div>

    <div>施工中...</div>
    <!--
      <ClientOnly>
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
      </ClientOnly>
    -->
  </div>
</template>
