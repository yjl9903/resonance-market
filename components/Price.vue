<script setup lang="ts">
import { format } from '@formkit/tempo';

import type { Log } from '~/drizzle/schema';

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

const props = defineProps<{ timestamp: number; product: ProductInfo; log: Log | undefined }>();

const isOutdated = computed(() => {
  if (!props.log) return true;
  props.timestamp;
  return isLogValid(props.log);
});

const store = useLatestLogs();

const profit = computed(() => {
  if (!props.log || props.log?.type === 'buy') return undefined;

  const productLog = store.getLatestLog(props.log.name, props.log.sourceCity, props.log.sourceCity);
  if (isLogValid(productLog)) {
    return (1.04 * props.log.price - 0.92 * productLog.price).toFixed(0);
  } else {
    return (1.04 * props.log.price - 0.92 * props.product.basePrice).toFixed(0);
  }
});

const profitColor = computed(() => {
  if (profit.value === undefined || isOutdated.value) return undefined;
  const value = +profit.value;
  if (value < 0) {
    const table = [
      { value: -100, color: 'text-red-200 op-80' },
      { value: -200, color: 'text-red-200' },
      { value: -300, color: 'text-red-300' },
      { value: -400, color: 'text-red-400' },
      { value: -500, color: 'text-red-500' },
      { value: -600, color: 'text-red-600' },
      { value: -700, color: 'text-red-700' },
      { value: -800, color: 'text-red-800' },
      { value: Number.MIN_SAFE_INTEGER, color: 'text-red-800' }
    ];
    for (const cond of table) {
      if (value > cond.value) return cond.color;
    }
  } else if (value > 0) {
    const table = [
      { value: 0, color: 'text-green-400 op-60' },
      { value: 100, color: 'text-green-400 op-70' },
      { value: 200, color: 'text-green-400 op-80' },
      { value: 300, color: 'text-green-400' },
      { value: 400, color: 'text-green-500' },
      { value: 600, color: 'text-green-600' },
      { value: 800, color: 'text-green-700' },
      { value: 1000, color: 'text-green-700 font-bold' }
    ];
    for (const cond of table.reverse()) {
      if (value > cond.value) return cond.color;
    }
  }
});
</script>

<template>
  <div>
    <TooltipProvider v-if="log" :delayDuration="300" :skipDelayDuration="100">
      <Tooltip>
        <TooltipTrigger as-child>
          <div :class="{ 'line-through': isOutdated, 'op-50': isOutdated }">
            <div v-if="log.type === 'sell'" class="h-6 flex gap-1 items-center">
              <span class="i-icon-park-income-one text-sm"></span
              ><span :class="[profitColor]">{{ profit }}</span>
            </div>
            <!-- <div v-else="log.type === 'buy'" class="h-6">
              <span></span><span>{{ log.price }}</span>
            </div> -->
            <div class="flex gap-1 items-center h-6">
              <span class="i-icon-park:dollar text-sm"></span>
              <span :class="{ 'text-red': log.percent < 100, 'text-green': log.percent > 100 }"
                >{{ log.percent }}%</span
              >
              <span class="text-xl mt-1"
                ><span
                  v-if="log.trend === 'up'"
                  class="i-material-symbols-trending-up text-green"
                ></span>
                <span
                  v-else-if="log.trend === 'down'"
                  class="i-material-symbols-trending-down text-red"
                ></span>
                <span v-else class="i-material-symbols-trending-flat"></span
              ></span>
            </div>
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <div v-if="log" class="py-1 space-y-1">
            <p class="flex items-center">
              <span class="font-bold mr-2">价格</span>
              <span
                :class="[
                  {
                    'text-red': log.percent < 100,
                    'text-green': log.percent > 100,
                    'line-through': isOutdated,
                    'op-50': isOutdated
                  },
                  'mr-2'
                ]"
                >{{ log.price }} ({{ log.percent }}%)</span
              >
              <span
                v-if="log.trend === 'up'"
                class="i-material-symbols-trending-up text-green text-xl"
              ></span>
              <span
                v-else-if="log.trend === 'down'"
                class="i-material-symbols-trending-down text-red text-xl"
              ></span>
              <span v-else class="i-material-symbols-trending-flat text-xl"></span>
            </p>
            <p v-if="log.type === 'sell'">
              <span class="font-bold mr-2">单位利润</span>
              <span
                :class="{
                  'text-red': log.percent < 100,
                  'text-green': log.percent > 100,
                  'line-through': isOutdated,
                  'op-50': isOutdated
                }"
                >{{ profit }}</span
              >
            </p>
            <p>
              <span class="font-bold mr-2">最近更新于</span>
              <span :class="{ 'op-50': isOutdated }">{{
                format(log.uploadedAt, { date: 'long', time: 'medium' })
              }}</span>
            </p>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  </div>
</template>
