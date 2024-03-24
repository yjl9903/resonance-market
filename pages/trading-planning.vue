<script setup lang="ts">
import { ref } from 'vue';

const settingStore = useSettingStore();

const isComeAndGo = ref('往返'); // 是否往返
</script>

<template>
  <div class="main pb-12">
    <div class="mb-4">
      <span href="#" class="block mt-1 text-lg leading-tight font-bold text-base-800">跑商路线规划</span>
      <div class="mt-2 px-2 text-slate-500">
        <p class="mb-2">亲爱的列车长们: </p>
        <p class="ml-2">这是阿妮塔科技为您整理的两地运输路线收益排行。</p>
        <p class="ml-2">我们建议选择城市售价靠前的商品（一般为城市特产品）作为主攻对象，每次使用5本以内的进货采购书将货物尽可能填满车厢，这样可以在单程收益和进货采购数使用量之间维持一定平衡。</p>
        <p class="ml-2">希望这份排行能为您的运输之路提供参考。</p>
        <p class="ml-2">祝各位列车长旅途顺利，财源滚滚！</p>
        <p class="my-2">阿妮塔科技敬上</p>
        注：各位列车长的个性化配置页面正在开发中，目前展示的收益计算参数为（砍价抬价：{{ settingStore.priceChangeRate * 100 }}%，城市税率{{ settingStore.taxRate * 100 }}%，特产品交易量仅为基础值）。
      </div>
    </div>

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
