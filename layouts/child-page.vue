<script setup lang="ts">
const props = defineProps<{
  title?: string
  headerBackgroundColorClass?: string
}>()
</script>

<template>
  <div class="h-screen flex-col flex">
    <PageHeader :title="props.title" :background-color-class="headerBackgroundColorClass" />
    <section class="page-wrapper flex-grow flex-shrink overflow-y-auto p-3">
      <slot></slot>
    </section>
  </div>
</template>

<style scoped>
*,
*::before,
*::after {
  box-sizing: border-box;
  margin: 0;
  font-weight: normal;
}

body {
  min-height: 100vh;
  color: var(--color-text);
  background: var(--color-background);
  transition:
    color 0.5s,
    background-color 0.5s;
  line-height: 1.6;
  font-family:
    Inter,
    -apple-system,
    BlinkMacSystemFont,
    'Segoe UI',
    Roboto,
    Oxygen,
    Ubuntu,
    Cantarell,
    'Fira Sans',
    'Droid Sans',
    'Helvetica Neue',
    sans-serif;
  font-size: 15px;
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.page-wrapper {
  background-color: #F6F6F6;
}
</style>
