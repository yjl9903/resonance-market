<script setup lang="ts">
import Giscus from '@giscus/vue';

const store = useLatestLogs();
await store.fetch();

// HACK: fetch data after rendering on client
onMounted(async () => {
  await store.fetch();
});

useIntervalFn(() => {
  store.fetch();
}, 10 * 1000);
</script>

<template>
  <div class="main pb-12">
    <div class="space-y-4">
      <City v-for="city in cities" :key="city.name" :city="city"></City>
    </div>
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
  </div>
</template>
