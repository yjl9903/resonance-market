<script setup lang="ts">
import { sha } from '~build/git';

import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSub,
  MenubarSubContent,
  MenubarSubTrigger,
  MenubarTrigger,
  MenubarButton
} from '@/components/ui/menubar';
import { toast } from 'vue-sonner';

const settingStore = useSettingStore();
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
                    <NuxtLink :to="`/product/${city.name}/${product.name}`">{{
                      product.name
                    }}</NuxtLink>
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
              <MenubarSub>
                <MenubarSubTrigger>售出排序依据</MenubarSubTrigger>
                <MenubarSubContent>
                  <MenubarItem as-child>
                    <a
                      class="hover:bg-gray-100 cursor-pointer flex justify-between"
                      @click="settingStore.switchListSortModeTo('byCity')"
                    >
                      <div class="flex items-center mr-2">
                        <span class="i-icon-park-outline-city-one mr-1 block w-4"></span>
                        <span>按城市排序</span>
                      </div>
                      <span
                        v-if="settingStore.listSortMode === 'byCity'"
                        class="i-material-symbols-check"
                      ></span>
                    </a>
                  </MenubarItem>
                  <MenubarItem as-child>
                    <a
                      class="hover:bg-gray-100 cursor-pointer flex justify-between"
                      @click="settingStore.switchListSortModeTo('byProfit')"
                    >
                      <div class="flex items-center mr-2">
                        <span class="i-icon-park-outline-income-one mr-1 block w-4"></span>
                        <span>按利润排序</span>
                      </div>
                      <span
                        v-if="settingStore.listSortMode === 'byProfit'"
                        class="i-material-symbols-check"
                      ></span>
                    </a>
                  </MenubarItem>
                </MenubarSubContent>
              </MenubarSub>
              <MenubarSub>
                <MenubarSubTrigger>数据展示</MenubarSubTrigger>
                <MenubarSubContent>
                  <MenubarItem as-child>
                    <a
                      class="hover:bg-gray-100 cursor-pointer flex justify-between"
                      @click="settingStore.switchDataDisplayItems('profit')"
                    >
                      <div class="flex items-center mr-2">
                        <span class="i-icon-park-outline-box mr-1 block w-4"></span>
                        <span>单位利润</span>
                      </div>
                      <span
                        v-show="settingStore.dataDisplayItems.includes('profit')"
                        class="i-material-symbols-check"
                      ></span>
                    </a>
                  </MenubarItem>
                  <MenubarItem as-child>
                    <a
                      class="hover:bg-gray-100 cursor-pointer flex justify-between"
                      @click="settingStore.switchDataDisplayItems('perTicketProfit')"
                    >
                      <div class="flex items-center mr-2">
                        <span class="i-icon-park-outline-ticket mr-1 block w-4"></span>
                        <span>单票利润</span>
                      </div>
                      <span
                        v-show="settingStore.dataDisplayItems.includes('perTicketProfit')"
                        class="i-material-symbols-check"
                      ></span>
                    </a>
                  </MenubarItem>
                </MenubarSubContent>
              </MenubarSub>
              <MenubarSub>
                <MenubarSubTrigger>利润计算规则</MenubarSubTrigger>
                <MenubarSubContent>
                  <MenubarItem as-child>
                    <a
                      class="hover:bg-gray-100 cursor-pointer flex justify-between"
                      @click="toast('功能正在开发中，敬请期待')"
                    >
                      <div class="flex items-center mr-2">
                        <span class="i-icon-park-outline-percentage mr-1 block w-4"></span>
                        <span>买卖税收8%</span>
                      </div>
                      <span class="i-material-symbols-check"></span>
                    </a>
                  </MenubarItem>
                  <MenubarItem as-child>
                    <a
                      class="hover:bg-gray-100 cursor-pointer flex justify-between"
                      @click="toast('功能正在开发中，敬请期待')"
                    >
                      <div class="flex items-center mr-2">
                        <span class="i-icon-park-outline-positive-dynamics mr-1 block w-4"></span>
                        <span>最大砍价抬价</span>
                      </div>
                      <span
                        v-if="settingStore.profitComputeRule === 'maxPriceChange'"
                        class="i-material-symbols-check"
                      ></span>
                    </a>
                  </MenubarItem>
                  <MenubarItem as-child>
                    <a
                      class="hover:bg-gray-100 cursor-pointer flex justify-between"
                      @click="toast('功能正在开发中，敬请期待')"
                    >
                      <div class="flex items-center mr-2">
                        <span class="i-icon-park-outline-negative-dynamics mr-1 block w-4"></span>
                        <span>不砍价不抬价</span>
                      </div>
                      <span
                        v-if="settingStore.profitComputeRule === 'noChange'"
                        class="i-material-symbols-check"
                      ></span>
                    </a>
                  </MenubarItem>
                </MenubarSubContent>
              </MenubarSub>
            </MenubarContent>
          </MenubarMenu>
          <MenubarButton>
            <NuxtLink to="/discussions">讨论区</NuxtLink>
          </MenubarButton>
          <MenubarMenu>
            <MenubarTrigger>关于</MenubarTrigger>
            <MenubarContent>
              <MenubarItem as-child>
                <a href="https://github.com/yjl9903/resonance-market" target="_blank">
                  <span class="i-carbon-logo-github mr-1 block w-4"></span><span>GitHub</span>
                </a>
              </MenubarItem>
              <MenubarItem as-child>
                <a href="https://space.bilibili.com/1631015691" target="_blank">
                  <span class="i-simple-icons-bilibili mr-1 block w-4"></span>
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
      <div class="b-2 base mb8"></div>
      <div class="flex items-center justify-center gap1 align-middle">
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
