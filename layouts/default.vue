<script setup lang="ts">
import { sha } from '~build/git';
</script>

<template>
  <div>
    <nav class="main">
      <div class="mt-12 pb-4 mb-4 text-2xl font-bold border-b hover:text-base-600 select-none flex justify-between">
        <NuxtLink to="/">雷索纳斯市场</NuxtLink>
        <div class="text-base-500">
          <NuxtLink to="/columba-board/product-list">科伦巴商会看板</NuxtLink>
        </div>
      </div>
    </nav>

    <main>
      <slot></slot>
    </main>

    <footer class="main block pb8 w-full text-center text-base-500">
      <div border="b-2 base" mb8></div>
      <div flex items-center justify-center gap1 align-middle>
        <a
          class="flex items-center gap-1 text-gray-500/70 hover:text-gray-500"
          :href="`https://github.com/yjl9903/resonance-market/tree/${sha}`"
          target="_blank"
        >
          <span i-carbon-logo-github text-lg></span>
          <span font-mono>yjl9903/resonance-market</span>
        </a>
      </div>
    </footer>
  </div>
</template>

<style>
/* Global variables */
:root {
  --c-selection-color: inherit;
  --c-selection-bg: #cce2ff;
  --c-input-selection-color: rgba(0, 0, 0, 0.87);
  --c-input-selection-bg: #cce2ff;
}

.main {
  @apply: mx-auto xl:w-7xl lg:w-4xl md:w-3xl lt-md:w-[95vw] lt-md:px-3 lt-sm:w-[100vw];
}

.text-link {
  @apply: text-blue hover:text-blue-600;
}

.text-link-active {
  @apply: hover:text-blue-600;
}

/* selection */
::-webkit-selection {
  color: var(--c-selection-color);
  background-color: var(--c-selection-bg);
}
::-moz-selection {
  color: var(--c-selection-color);
  background-color: var(--c-selection-bg);
}
::selection {
  color: var(--c-selection-color);
  background-color: var(--c-selection-bg);
}
input::-webkit-selection,
textarea::-webkit-selection {
  color: var(--c-input-selection-color);
  background-color: var(--c-input-selection-bg);
}
input::-moz-selection,
textarea::-moz-selection {
  color: var(--c-input-selection-color);
  background-color: var(--c-input-selection-bg);
}
input::selection,
textarea::selection {
  color: var(--c-input-selection-color);
  background-color: var(--c-input-selection-bg);
}
</style>
