<script setup lang="ts">
const props = defineProps<{
  title?: string
  backgroundColorClass?: string
}>()
const router = useRouter()
</script>

<template>
  <header class="px-3" :class="[backgroundColorClass, {'text-white': backgroundColorClass}]">
    <div class="flex items-center h-12">
      <div
        class="mx-2 rounded-full hover:bg-gray-200 cursor-pointer flex items-center justify-center w-8 h-8" 
        @click="router.back()"
      >
        <span class="i-material-symbols:keyboard-backspace-rounded w-6 h-6"></span>
      </div>
      <h1 class="text-xl">{{ props.title }}</h1>
    </div>
  </header>
</template>