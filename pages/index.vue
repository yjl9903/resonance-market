<script setup lang="ts">
import { cities } from '~/lib/city';
</script>

<template>
  <div class="main pb-8">
    <h1 class="mt-12 pb-4 mb-4 text-2xl font-bold border-b">雷索纳斯市场</h1>
    <div class="space-y-4">
      <City v-for="city in cities" :key="city.name" :city="city"></City>
    </div>
  </div>
</template>
