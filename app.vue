<script setup lang="ts">
import { Toaster } from '@/components/ui/sonner';
</script>

<template>
  <Toaster richColors position="top-center" />
  <NuxtLoadingIndicator />
  <NuxtLayout>
    <NuxtLoadingIndicator />
    <NuxtPage />
  </NuxtLayout>
</template>
