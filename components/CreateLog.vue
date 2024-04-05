<script setup lang="ts">
import ReportLogForm from './ReportLogForm.vue';
import type { ProductInfo } from '@/utils/types';

const props = defineProps<{
  sourceCityName: string; // 原产地城市
  targetCityName?: string; // 目标城市
  product: ProductInfo; // 货物信息
}>();

const open = defineModel('open', {
  type: Boolean,
  default: false
});

const reportLogForm = ref<InstanceType<typeof ReportLogForm> | null>(null);

watch(open, open => {
  if (open) {
    nextTick(() => {
      reportLogForm.value?.form.resetForm();
    });
  }
});
</script>

<template>
  <Dialog v-model:open="open">
    <DialogTrigger as-child>
      <slot><div></div></slot>
    </DialogTrigger>
    <DialogContent class="sm:max-w-[625px]">
      <DialogHeader>
        <DialogTitle>上报价格变动</DialogTitle>
      </DialogHeader>

      <ReportLogForm
        ref="reportLogForm"
        :source-city-name="props.sourceCityName"
        :target-city-name="props.targetCityName"
        :product="props.product"
        @submit-success="open = false"
      />
    </DialogContent>
  </Dialog>
</template>
