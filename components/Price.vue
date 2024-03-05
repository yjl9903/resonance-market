<script setup lang="ts">
import { format } from '@formkit/tempo';

import type { Log } from '~/drizzle/schema';

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

const props = defineProps<{ timestamp: number; log: Log | undefined }>();

const isOutdated = computed(() => {
  if (!props.log) return true;
  const uploadedAt = props.log.uploadedAt.getTime();
  return props.timestamp - uploadedAt > 3600 * 1000;
});
</script>

<template>
  <div v-if="log" :class="{ 'line-through': isOutdated, 'op-50': isOutdated }">
    <TooltipProvider :delayDuration="300" :skipDelayDuration="100">
      <Tooltip>
        <TooltipTrigger as-child>
          <div class="flex gap-1 items-center">
            <div :class="{ 'text-red': log.percent < 100, 'text-green': log.percent > 100 }">
              <div>
                <span>{{ log.price }}</span>
              </div>
              <div>
                <span>{{ log.percent }}%</span>
              </div>
            </div>
            <div v-if="!isOutdated" class="text-2xl">
              <span v-if="log.trend === 'up'" class="i-carbon-arrow-up text-green"></span>
              <span v-else-if="log.trend === 'down'" class="i-carbon-arrow-down text-red"></span>
              <span v-else class="w-4"></span>
            </div>
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p>最近更新于 {{ format(log.uploadedAt, { date: 'long', time: 'medium' }) }}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  </div>
</template>
