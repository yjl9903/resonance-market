<template>
  <div class="product-cell flex-shrink-0">
    <div class="name">{{ props.name }}</div>
    <div class="origin text-xs text-gray-400">原产地：{{ props.origin }}</div>
  </div>
</template>
  
<script setup lang='ts'>
const props = defineProps<{
  name: string
  origin: string
}>() 
</script>