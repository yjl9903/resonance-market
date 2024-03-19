<script setup lang="ts">
import '@/utils/info'
import { Toaster } from '@/components/ui/sonner'
</script>

<template>
  <Toaster richColors closeButton position="top-right" />
  <NuxtLoadingIndicator />
  <NuxtLayout>
    <NuxtLoadingIndicator />
    <NuxtPage />
  </NuxtLayout>
</template>
