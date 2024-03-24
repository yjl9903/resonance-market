<script setup lang="ts">
import { ref } from 'vue';

const isComeAndGo = ref('往返'); // 是否往返
</script>

<template>
  <div class="main pb-12">
    <div class="flex flex-wrap gap-4 mb-4">
      <Button
        v-for="item in ['单程', '往返']"
        :key="item"
        @click="isComeAndGo = item"
        :variant="isComeAndGo == item ? 'default' : 'outline'"
        size="sm"
      >{{ item }}</Button>
    </div>

    <div class="space-y-4">
      <CityPerTicketProfitTable :isComeAndGo="isComeAndGo == '往返'" />
    </div>
  </div>
</template>
