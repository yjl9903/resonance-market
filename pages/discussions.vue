<script setup lang="ts">
import Giscus from '@giscus/vue';
</script>

<template>
  <div class="main pb-12">
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
          inputPosition="top"
          theme="preferred_color_scheme"
          lang="zh-CN"
        />
      </div>
    </ClientOnly>
  </div>
</template>
