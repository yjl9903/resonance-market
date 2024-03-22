<script setup lang="ts">
import { format } from '@formkit/tempo';

import type { Log } from '~/drizzle/schema';

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

const props = defineProps<{
  timestamp: number;
  product: ProductInfo;
  transaction: TransactionInfo | undefined;
  log: Log | undefined;
}>();

const settingStore = useSettingStore();

const store = useLatestLogs();

// 受控的 Tooltip 打开状态
const openTooltip = ref(false);

// 受控的 上报价格对话框 打开状态
const reportDialogVisible = ref(false);

// 记录是否已过期
const isOutdated = computed(() => {
  if (!props.log) return true;
  props.timestamp;

  return isLogValid(props.log);
});

// 单位利润
const profit = computed(() => {
  if (!props.log || props.log?.type === 'buy') return undefined;

  const sourceCityLatestLog = store.getLatestLog(
    props.log.sourceCity,
    props.log.name,
    props.log.sourceCity
  );

  if (sourceCityLatestLog)
    return Math.round(props.log.price * 1.2 * 0.98 - sourceCityLatestLog.price * 0.8 * 1.08);
  else return undefined;
});

// 单票利润
const perTicketProfit = computed(() => {
  if (!props.product || props.log?.type === 'buy') return 0;

  return (profit.value ?? 0) * (props.product.baseVolume ?? 0);
});

// 单位利润颜色
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

const shortTime = computed(() => {
  if (!props.log) return undefined;
  props.timestamp;

  const now = new Date();
  const offset = now.getTime() - props.log.uploadedAt.getTime();
  if (offset <= 60 * 1000) return '刚刚';
  else if (offset <= 3600 * 1000) return `${Math.floor(offset / (60 * 1000))} 分前`;
  else if (offset <= 24 * 3600 * 1000) return `${Math.floor(offset / (3600 * 1000))} 小时前`;

  return undefined;
});
</script>

<template>
  <TooltipProvider
    v-if="log && shortTime"
    :delay-duration="300"
    :skip-delay-duration="100"
    :disable-closing-trigger="true"
  >
    <Tooltip v-model:open="openTooltip">
      <TooltipTrigger as-child>
        <div class="space-y-1" :class="[{ 'op-50': isOutdated }]" @click="openTooltip = true">
          <!-- 所在城市 -->
          <div
            v-if="['byProfit', 'byPerTicketProfit'].includes(settingStore.listSortMode)"
            class="flex gap-1 items-center text-base-600"
          >
            <span class="i-icon-park-outline-city-one text-sm" />
            <span>{{ log.targetCity }}</span>
          </div>
          <!-- 单位利润 -->
          <div
            v-if="settingStore.dataDisplayItems.includes('profit') && log.type === 'sell'"
            class="h-6 flex gap-1 items-center"
            :class="[{ 'line-through': isOutdated }]"
          >
            <span class="i-icon-park-outline-income-one text-base-600 text-sm" />
            <span :class="[profitColor]">{{ profit }}</span>
          </div>
          <!-- 单票利润 -->
          <div
            v-if="
              settingStore.dataDisplayItems.includes('perTicketProfit') &&
              log.type === 'sell' &&
              product.baseVolume
            "
            class="h-6 flex gap-1 items-center"
            :class="[{ 'line-through': isOutdated }]"
          >
            <span class="i-icon-park-outline-ticket text-base-600 text-sm" />
            <span
              :class="{
                'text-red': perTicketProfit < 0,
                'text-green': perTicketProfit > 0,
                'op-50': isOutdated
              }"
              >{{ perTicketProfit }}</span
            >
          </div>
          <!-- 涨跌百分比 -->
          <div class="h-6 flex gap-1 items-center" :class="[{ 'line-through': isOutdated }]">
            <span class="i-icon-park-outline-chart-line text-base-600 text-sm" />
            <span :class="{ 'text-red': log.percent < 100, 'text-green': log.percent > 100 }"
              >{{ log.percent }}%</span
            >
            <span class="text-xl mt-1">
              <span v-if="log.trend === 'up'" class="i-material-symbols-trending-up text-green" />
              <span
                v-else-if="log.trend === 'down'"
                class="i-material-symbols-trending-down text-red"
              />
              <span v-else class="i-material-symbols-trending-flat" />
            </span>
          </div>
          <div class="flex gap-1 items-center h-6 text-base-600 no-underline">
            <span class="i-icon-park-outline-time text-sm" />
            <span>{{ shortTime }}</span>
          </div>
        </div>
      </TooltipTrigger>
      <TooltipContent>
        <div v-if="log" class="py-1 space-y-1">
          <p class="flex items-center">
            <span class="font-bold mr-2">实时价格</span>
            <span
              class="mr-2"
              :class="[
                {
                  'text-red': log.percent < 100,
                  'text-green': log.percent > 100,
                  'line-through': isOutdated,
                  'op-50': isOutdated
                }
              ]"
              >{{ log.price }} ({{ log.percent }}%)</span
            >
            <span
              v-if="log.trend === 'up'"
              class="i-material-symbols-trending-up text-green text-xl"
            />
            <span
              v-else-if="log.trend === 'down'"
              class="i-material-symbols-trending-down text-red text-xl"
            />
            <span v-else class="i-material-symbols-trending-flat text-xl" />
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
          <p v-if="log.type === 'sell' && product.baseVolume">
            <span class="font-bold mr-2">单票利润</span>
            <span
              :class="{
                'text-red': log.percent < 100,
                'text-green': log.percent > 100,
                'line-through': isOutdated,
                'op-50': isOutdated
              }"
              >{{ +(profit ?? 0) * product.baseVolume }}</span
            >
          </p>
          <p v-if="log.type === 'sell' && transaction?.basePrice">
            <span class="font-bold mr-2">基准价格</span>
            <span>{{ transaction.basePrice }}</span>
          </p>
          <p v-if="log.type === 'buy' && product.baseVolume">
            <span class="font-bold mr-2">基础货量</span>
            <span>{{ product.baseVolume }}</span>
          </p>
          <p v-if="log.type === 'buy' && product.basePrice">
            <span class="font-bold mr-2">基准价格</span>
            <span>{{ product.basePrice }}</span>
          </p>
          <p>
            <span class="font-bold mr-2">更新时间</span>
            <span :class="{ 'op-50': isOutdated }">
              {{ format(log.uploadedAt, { date: 'long', time: 'medium' }) }}
            </span>
          </p>
          <p>
            <NuxtLink
              :to="`/transaction/${log.sourceCity}/${log.name}/${log.targetCity}`"
              class="text-link font-bold"
            >
              查看历史记录
            </NuxtLink>
            <span
              class="text-link font-bold ml-4 cursor-pointer"
              @click="reportDialogVisible = true"
              >快速上报价格</span
            >
          </p>
        </div>
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>

  <CreateLog
    v-if="log"
    v-model:open="reportDialogVisible"
    :source-city-name="log.sourceCity"
    :target-city-name="log.targetCity"
    :product="product"
  />
</template>
