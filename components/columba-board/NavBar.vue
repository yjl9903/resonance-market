<script setup lang="ts">
import { shallowRef, computed } from 'vue'
import { useRoute } from 'vue-router'
import IconCompass from './icons/IconCompass.vue'
import IconBox from './icons/IconBox.vue'
import IconGraphUp from './icons/IconGraphUp.vue'
import IconCheck from './icons/IconCheck.vue'
import IconChatDot from './icons/IconChatDot.vue'

const route = useRoute()

const navList = shallowRef([
  {
    name: '发现',
    path: '/columba-board',
    icon: IconCompass
  },
  {
    name: '货物总览',
    path: '/columba-board/product-list',
    icon: IconBox
  },
  {
    name: '大盘行情',
    path: '/columba-board/quotation',
    icon: IconGraphUp
  },
  {
    name: '自选货物',
    path: '/columba-board/pick',
    icon: IconCheck
  },
  {
    name: '留言板',
    path: '/columba-board/message-board',
    icon: IconChatDot
  }
])
const activeBar = computed(() => {
  return route.path
})
</script>

<template>
  <!-- 底部导航栏 -->
  <section class="nav-bar flex bg-white h-14 flex-shrink-0">
    <div v-for="item in navList" :key="item.path" class="flex-1 flex justify-center items-center">
      <NuxtLink
        :to="item.path"
        class="flex flex-col items-center"
        :class="{'active': activeBar === item.path}"
      >
        <component :is="item.icon" class="w-6 h-6"></component>
        <span class="text-xs">{{ item.name }}</span>
      </NuxtLink>
    </div>
  </section>
</template>

<style scoped>
.nav-bar {
  border-top: 1px solid #f0f0f0; 
}
.nav-bar .active {
  color: #1989fa;
}
</style>