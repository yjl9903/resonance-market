<script setup lang="ts">
const { title } = defineProps<{
  title?: string
}>()
</script>

<template>
  <div class="card-box rounded-lg p-3 mb-3 bg-white">
    <slot name="title">
      <div v-if="title" class="text-lg text-base-600 mb-2">{{ title }}</div>
    </slot>
    <slot></slot>
  </div>
</template>

<style lang="scss" scoped>
.card-box:last-child{
  margin-bottom: 0;
}
</style>