<script setup lang="ts">
import { toast } from 'vue-sonner';

import '@/utils/info';
import { Toaster } from '@/components/ui/sonner';

onMounted(() => {
  toast(`网站仍在开发中`, {
    description: '建议反馈: https://github.com/yjl9903/resonance-market/issues'
  });
});
</script>

<template>
  <Toaster richColors closeButton position="top-right" />
  <NuxtLoadingIndicator />
  <NuxtLayout>
    <NuxtLoadingIndicator />
    <NuxtPage />
  </NuxtLayout>
</template>
