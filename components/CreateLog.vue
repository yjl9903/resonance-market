<script setup lang="ts">
import * as z from 'zod';
import { toast } from 'vue-sonner';
import { useForm } from 'vee-validate';
import { toTypedSchema } from '@vee-validate/zod';

import { Slider } from '@/components/ui/slider';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';

import type { ProductInfo } from '@/utils/types';

const props = defineProps<{
  sourceCityName: string // 原产地城市
  targetCityName?: string // 目标城市
  product: ProductInfo // 货物信息
}>();

const open = defineModel('open', {
  type: Boolean,
  default: false
});

const { form, onSubmit } = useReportForm({
  sourceCity: props.sourceCityName,
  name: props.product.name,
  onSubmitSuccess() {
    open.value = false;
  }
});

watch(open, (open) => {
  if (open) {
    form.resetForm();
    if (props.targetCityName) {
      form.setFieldValue("targetCity", props.targetCityName)
    }
  }
});

const changePricePercent = (type: 'add' | 'reduce') => {
  const percent = form.values.percent?.[0] ?? 100;
  if (type === 'add') {
    form.setFieldValue('percent', [percent + 1]);
  } else {
    form.setFieldValue('percent', [percent - 1]);
  }
}
</script>

<template>
  <Dialog v-model:open="open">
    <DialogTrigger as-child>
      <slot><div></div></slot>
    </DialogTrigger>
    <DialogContent class="sm:max-w-[625px]">
      <DialogHeader>
        <DialogTitle>上报价格变动</DialogTitle>
        <!-- <DialogDescription>
          Make changes to your profile here. Click save when you're done.
        </DialogDescription> -->
      </DialogHeader>
      <form class="grid gap-4 py-4" @submit="onSubmit">
        <div class="space-x-2 text-sm">
          <span class="text-right font-bold">商品</span>
          <span class="">{{ sourceCityName }} - {{ product.name }}</span>
        </div>

        <FormField v-slot="{ componentField }" name="targetCity">
          <FormItem>
            <FormLabel>城市</FormLabel>
            <Select v-bind="componentField">
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="选择城市" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectGroup>
                  <SelectItem v-for="city in cities" :key="city.name" :value="city.name">
                    {{ city.name }}
                  </SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
            <FormDescription>{{
              form.values.targetCity !== sourceCityName ? '售出商品到该城市' : '从该城市买入商品'
            }}</FormDescription>
            <FormMessage />
          </FormItem>
        </FormField>

        <FormField v-slot="{ componentField }" name="price">
          <FormItem>
            <FormLabel>价格</FormLabel>
            <FormControl>
              <Input
                type="number"
                :placeholder="form.values.targetCity !== sourceCityName ? '售出价格' : '买入价格'"
                v-bind="componentField"
              />
            </FormControl>
            <FormDescription></FormDescription>
            <FormMessage />
          </FormItem>
        </FormField>

        <FormField v-slot="{ componentField }" name="percent">
          <FormItem>
            <FormLabel>价位</FormLabel>
            <FormControl>
              <div class="flex items-center space-x-2">
                <span class="i-icon-park-outline-reduce-one text-base cursor-pointer" @click="changePricePercent('reduce')"></span>
                <Slider
                  v-bind="componentField"
                  :default-value="[100]"
                  :max="130"
                  :min="70"
                  :step="1"
                />
                <span class="i-icon-park-outline-add-one text-base cursor-pointer" @click="changePricePercent('add')"></span>
              </div>
              <FormDescription class="flex justify-between">
                <span>
                  {{ form.values.targetCity !== sourceCityName ? '售出价位' : '买入价位' }}
                  {{ form.values.percent?.[0] ?? 100 }}%
                </span>
              </FormDescription>
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>

        <FormField v-slot="{ componentField }" type="radio" name="trend">
          <FormItem class="space-y-3">
            <FormLabel>涨跌趋势</FormLabel>

            <FormControl>
              <RadioGroup class="flex space-x-4" v-bind="componentField">
                <FormItem class="flex items-center space-y-0">
                  <FormControl>
                    <RadioGroupItem value="up" />
                    <FormLabel class="flex items-center font-normal text-xl text-green pl-2 cursor-pointer">
                      <span class="i-material-symbols-trending-up text-green"></span>
                    </FormLabel>
                  </FormControl>
                </FormItem>
                <FormItem class="flex items-center space-y-0">
                  <FormControl>
                    <RadioGroupItem value="down" />
                    <FormLabel class="flex items-center font-normal text-xl text-red pl-2 cursor-pointer">
                      <span class="i-material-symbols-trending-down text-red"></span>
                    </FormLabel>
                  </FormControl>
                </FormItem>
              </RadioGroup>
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>

        <DialogFooter>
          <Button type="submit">上报</Button>
        </DialogFooter>
      </form>
    </DialogContent>
  </Dialog>
</template>
