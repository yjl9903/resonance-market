<script setup lang="ts">
import { Slider } from '@/components/ui/slider';
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

import type { CityInfo, ProductInfo } from '@/utils/types';

const props = defineProps<{ city: CityInfo; product: ProductInfo }>();

const { form, onSubmit } = useReportForm({
  sourceCity: props.city.name,
  name: props.product.name,
  targetCity: props.city.name
});

const changePricePercent = (type: 'add' | 'reduce') => {
  const percent = form.values.percent?.[0] ?? 100;
  if (type === 'add') {
    form.setFieldValue('percent', [percent + 1]);
  } else {
    form.setFieldValue('percent', [percent - 1]);
  }
};
</script>

<template>
  <form class="grid gap-4 py-4" @submit="onSubmit">
    <div class="space-x-2 text-lg">
      <span class="font-bold">买入 {{ product.name }}</span>
    </div>

    <FormField v-slot="{ componentField }" name="price">
      <FormItem>
        <FormLabel>价格</FormLabel>
        <FormControl>
          <Input
            type="number"
            :placeholder="form.values.targetCity !== city.name ? '售出价格' : '买入价格'"
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
            <span
              class="i-icon-park-outline-reduce-one text-xl cursor-pointer"
              @click="changePricePercent('reduce')"
            ></span>
            <Slider v-bind="componentField" :default-value="[100]" :max="130" :min="70" :step="1" />
            <span
              class="i-icon-park-outline-add-one text-xl cursor-pointer"
              @click="changePricePercent('add')"
            ></span>
          </div>
          <FormDescription class="flex justify-between">
            <span
              >{{ form.values.targetCity !== city.name ? '售出价位' : '买入价位' }}
              {{ form.values.percent?.[0] ?? 100 }}%</span
            >
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
                <FormLabel
                  class="flex items-center font-normal text-xl text-green pl-2 cursor-pointer"
                >
                  <span class="i-material-symbols-trending-up text-green"></span>
                </FormLabel>
              </FormControl>
            </FormItem>
            <FormItem class="flex items-center space-y-0">
              <FormControl>
                <RadioGroupItem value="down" />
                <FormLabel
                  class="flex items-center font-normal text-xl text-red pl-2 cursor-pointer"
                >
                  <span class="i-material-symbols-trending-down text-red"></span>
                </FormLabel>
              </FormControl>
            </FormItem>
          </RadioGroup>
        </FormControl>
        <FormMessage />
      </FormItem>
    </FormField>

    <Button type="submit">上报</Button>
  </form>
</template>
