<script setup lang="ts">
import '@/utils/info';
import { Toaster } from '@/components/ui/sonner';
</script>

<template>
  <Toaster rich-colors close-button position="top-right" />
  <NuxtLoadingIndicator />
  <NuxtLayout>
    <NuxtLoadingIndicator />
    <NuxtPage />
  </NuxtLayout>
</template>
