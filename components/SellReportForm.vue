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

const props = defineProps<{ target: CityInfo; product: ProductInfo }>();

const { form, onSubmit } = useReportForm({
  sourceCity: props.product.city,
  name: props.product.name,
  targetCity: props.target.name
});
</script>

<template>
  <form class="grid gap-4 py-4" @submit="onSubmit">
    <div class="space-x-2 text-lg">
      <span class="font-bold">{{ product.name }}</span>
    </div>
    <div class="space-x-2 text-base">
      <span class=""
        >从 <span class="underline underline-offset-4">{{ product.city }}</span> 售出到
        <span class="underline underline-offset-4">{{ target.name }}</span></span
      >
    </div>

    <FormField v-slot="{ componentField }" name="price">
      <FormItem>
        <FormLabel>价格</FormLabel>
        <FormControl>
          <Input type="number" :placeholder="'售出价格'" v-bind="componentField" />
        </FormControl>
        <FormDescription></FormDescription>
        <FormMessage />
      </FormItem>
    </FormField>

    <!-- <FormField v-slot="{ componentField }" name="percent">
          <FormItem>
            <FormLabel>价位</FormLabel>
            <FormControl>
              <Input
                type="number"
                :placeholder="form.values.targetCity !== city.name ? '售出价位' : '买入价位'"
                v-bind="componentField"
              />
            </FormControl>
            <FormDescription></FormDescription>
            <FormMessage />
          </FormItem>
        </FormField> -->
    <FormField v-slot="{ componentField }" name="percent">
      <FormItem>
        <FormLabel>价位</FormLabel>
        <FormControl>
          <Slider v-bind="componentField" :default-value="[100]" :max="199" :min="1" :step="1" />
          <FormDescription class="flex justify-between">
            <span>{{ '售出价位' }} {{ form.values.percent?.[0] ?? 100 }}%</span>
          </FormDescription>
        </FormControl>
        <FormMessage />
      </FormItem>
    </FormField>

    <FormField v-slot="{ componentField }" type="radio" name="trend">
      <FormItem class="space-y-3">
        <FormLabel>趋势</FormLabel>

        <FormControl>
          <RadioGroup class="flex flex-col space-y-0" v-bind="componentField">
            <FormItem class="flex items-center space-y-0 gap-x-3">
              <FormControl>
                <RadioGroupItem value="up" />
              </FormControl>
              <FormLabel class="font-normal text-green">↑</FormLabel>
            </FormItem>
            <FormItem class="flex items-center space-y-0 gap-x-3">
              <FormControl>
                <RadioGroupItem value="same" />
              </FormControl>
              <FormLabel class="font-normal">-</FormLabel>
            </FormItem>
            <FormItem class="flex items-center space-y-0 gap-x-3">
              <FormControl>
                <RadioGroupItem value="down" />
              </FormControl>
              <FormLabel class="font-normal text-red">↓</FormLabel>
            </FormItem>
          </RadioGroup>
        </FormControl>
        <FormMessage />
      </FormItem>
    </FormField>

    <Button type="submit">上报</Button>
  </form>
</template>
