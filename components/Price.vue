<script setup lang="ts">
import type { Log } from '~/drizzle/schema';

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { format } from '@formkit/tempo';

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
          <div>
            <div>
              <span>{{ log.price }}</span>
            </div>
            <div>
              <span :class="{ 'text-red': log.percent < 100, 'text-green': log.percent > 100 }"
                >{{ log.percent }}%</span
              >
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
