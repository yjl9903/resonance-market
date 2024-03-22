<script setup lang="ts">
import Giscus from '@giscus/vue'
</script>

<template>
  <div class="main pb-12">
    <ClientOnly>
      <div class="pt-8">
        <Giscus
          id="comments"
          repo="yjl9903/resonance-market"
          repo-id="R_kgDOLbiZ1A"
          mapping="number"
          term="7"
          reactions-enabled="0"
          emit-metadata="0"
          input-position="top"
          theme="preferred_color_scheme"
          lang="zh-CN"
        />
      </div>
    </ClientOnly>
  </div>
</template>
