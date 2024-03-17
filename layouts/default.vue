<script setup lang="ts">
import { sha } from '~build/git';

import {
  Menubar,
  MenubarCheckboxItem,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarRadioGroup,
  MenubarRadioItem,
  MenubarSeparator,
  MenubarShortcut,
  MenubarSub,
  MenubarSubContent,
  MenubarSubTrigger,
  MenubarTrigger,
  MenubarButton
} from '@/components/ui/menubar';

const settingStore = useSettingStore()
</script>

<template>
  <div>
    <nav class="border-b pt-12 mb-4">
      <div class="main">
        <div>
          <NuxtLink to="/" class="text-2xl font-bold hover:text-base-600 select-none">雷索纳斯市场</NuxtLink>
        </div>
        <Menubar class="mt-4">
          <MenubarButton>
            <NuxtLink to="/">首页</NuxtLink>
          </MenubarButton>
          <MenubarMenu>
            <MenubarTrigger>商品</MenubarTrigger>
            <MenubarContent>
              <MenubarSub v-for="city in cities" :key="city.name">
                <MenubarSubTrigger>{{ city.name }}</MenubarSubTrigger>
                <MenubarSubContent>
                  <MenubarItem v-for="product in city.products" :key="product.name" as-child>
                    <NuxtLink :to="`/product/${city.name}/${product.name}`">{{ product.name }}</NuxtLink>
                  </MenubarItem>
                </MenubarSubContent>
              </MenubarSub>
            </MenubarContent>
          </MenubarMenu>
          <MenubarMenu>
            <MenubarTrigger>上报价格</MenubarTrigger>
            <MenubarContent>
              <MenubarSub>
                <MenubarSubTrigger>在城市买入</MenubarSubTrigger>
                <MenubarSubContent>
                  <MenubarItem v-for="city in cities" :key="city.name" as-child>
                    <NuxtLink :to="`/report/buy/${city.name}`">{{ city.name }}</NuxtLink>
                  </MenubarItem>
                </MenubarSubContent>
              </MenubarSub>
              <MenubarSub>
                <MenubarSubTrigger>在城市卖出</MenubarSubTrigger>
                <MenubarSubContent>
                  <MenubarItem v-for="city in cities" :key="city.name" as-child>
                    <NuxtLink :to="`/report/sell/${city.name}`">{{ city.name }}</NuxtLink>
                  </MenubarItem>
                </MenubarSubContent>
              </MenubarSub>
            </MenubarContent>
          </MenubarMenu>
          <MenubarMenu>
            <MenubarTrigger>设置</MenubarTrigger>
            <MenubarContent>
              <MenubarItem as-child>
                <a
                  class="hover:bg-gray-100 cursor-pointer flex justify-between"
                  @click="settingStore.switchListSortModeTo('byCity')"
                >
                  <div class="flex items-center">
                    <span class="i-icon-park-outline-city-one mr-1 block w-4"></span>
                    <span>按城市排序</span>
                  </div>
                  <span v-if="settingStore.listSortMode === 'byCity'" class="i-material-symbols-check"></span>
                </a>
              </MenubarItem>
              <MenubarItem as-child>
                <a
                  class="hover:bg-gray-100 cursor-pointer flex justify-between"
                  @click="settingStore.switchListSortModeTo('byProfit')"
                >
                  <div class="flex items-center">
                    <span class="i-icon-park-outline-income-one mr-1 block w-4"></span>
                    <span>按利润排序</span>
                  </div>
                  <span v-if="settingStore.listSortMode === 'byProfit'" class="i-material-symbols-check"></span>
                </a>
              </MenubarItem>
            </MenubarContent>
          </MenubarMenu>
          <MenubarMenu>
            <MenubarTrigger>关于</MenubarTrigger>
            <MenubarContent>
              <MenubarItem as-child>
                <a href="https://github.com/yjl9903/resonance-market" target="_blank">
                  <span i-carbon-logo-github mr-1 block w-4></span><span>GitHub</span>
                </a>
              </MenubarItem>
              <MenubarItem as-child>
                <a href="https://space.bilibili.com/1631015691" target="_blank">
                  <span i-simple-icons-bilibili mr-1 block w-4></span>
                  <span>雷索纳斯官方 Bilibili</span>
                </a>
              </MenubarItem>
            </MenubarContent>
          </MenubarMenu>
        </Menubar>
      </div>
    </nav>

    <main>
      <slot></slot>
    </main>

    <footer class="block pb8 w-full text-center text-base-500">
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
