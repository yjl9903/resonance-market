<script setup lang="ts">
import type { Log } from '~/drizzle/schema';

defineProps<{ log: Log | undefined }>();
</script>

<template>
  <div v-if="log">
    <div>
      <span>{{ log.price }}</span>
    </div>
    <div>
      <span :class="{ 'text-red': log.percent < 100, 'text-green': log.percent > 100 }"
        >{{ log.percent }}%</span
      >
    </div>
  </div>
</template>
