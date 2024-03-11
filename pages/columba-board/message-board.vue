<script setup lang='ts'>
import Giscus from '@giscus/vue'

definePageMeta({
  layout: 'columba-board'
})
</script>

<template>
  <div class="h-full flex flex-col">
    <div class="p-4">
      <h2 class="text-2xl font-bold">留言板</h2>
      <p class="text-gray-500">欢迎留言</p>
    </div>
    
    <h2 class="pl-4 pr-4 text-2xl font-bold">留言列表</h2>
    <div class="m-4 flex-grow flex-shrink overflow-y-auto">
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
  </div>
</template>