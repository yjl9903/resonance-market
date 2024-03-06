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

import type { CityInfo, ProductInfo } from '@/utils/types';

const props = defineProps<{ city: CityInfo; product: ProductInfo }>();

const store = useLatestLogs();

const open = ref(false);

const formSchema = toTypedSchema(
  z.object({
    targetCity: z.string(),
    price: z.number().gt(0),
    percent: z.array(z.number().gt(0).lt(200)),
    trend: z.enum(['up', 'same', 'down'])
  })
);

const form = useForm({
  initialValues: {
    percent: [100],
    trend: 'same'
  },
  validationSchema: formSchema
});

watch(open, (open) => {
  if (open) {
    form.resetForm();
  }
});

watch(
  () => form.values.targetCity,
  (target, prev) => {
    if (target === prev || !target) return;

    if (form.isFieldDirty('price') || form.isFieldDirty('percent')) return;

    const latest = store.getLatestLog(props.city.name, props.product.name, target);
    if (latest) {
      form.resetField('price', { value: latest.price });
      form.resetField('percent', { value: [latest.percent] });
      form.resetField('trend', { value: latest.trend });
    }
  }
);

watch(
  () => [form.values.targetCity, form.values.price] as const,
  ([target, price], prev) => {
    if (target === prev[0] && price === prev[1]) return;

    // @ts-ignore
    if (price === '') {
      form.setFieldValue('price', undefined);
      return;
    }

    if (price === undefined) return;
    if (form.isFieldDirty('percent')) return;
    if (!form.values.targetCity) return;
    const transaction = props.product.transactions.find(
      (tr) => tr.targetCity === form.values.targetCity
    );
    if (transaction && transaction.basePrice > 0) {
      const percent = +((100 * price) / transaction.basePrice).toFixed(0);
      if (percent > 0 && percent < 200) {
        form.resetField('percent', { value: [percent] });
      }
    }
  }
);

watch(
  () => [form.values.targetCity, form.values.percent] as const,
  ([target, percent], prev) => {
    if (target === prev[0] && percent?.[0] === prev[1]?.[0]) return;

    if (percent === undefined) return;
    if (form.isFieldDirty('price')) return;
    if (!form.values.targetCity) return;
    const transaction = props.product.transactions.find(
      (tr) => tr.targetCity === form.values.targetCity
    );
    if (transaction && transaction.basePrice > 0) {
      const price = +((percent[0] / 100.0) * transaction.basePrice).toFixed(0);
      if (price > 0) {
        form.resetField('price', { value: price });
      }
    }
  }
);

const onSubmit = form.handleSubmit(async (values) => {
  try {
    await $fetch(`/api/log`, {
      method: 'POST',
      body: {
        name: props.product.name,
        sourceCity: props.city.name,
        targetCity: values.targetCity,
        type: props.city.name !== values.targetCity ? 'sell' : 'buy',
        trend: values.trend,
        price: values.price,
        percent: values.percent[0],
        uploadedAt: new Date().getTime()
      }
    });
    toast.success(`上报成功`);
    open.value = false;
    store.fetch();
  } catch (error) {
    console.error(error);
    toast.error(`上报失败`);
  }
});
</script>

<template>
  <Dialog v-model:open="open">
    <DialogTrigger as-child>
      <Button variant="outline" size="sm">上报</Button>
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
          <span class="">{{ city.name }} - {{ product.name }}</span>
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
                  <SelectItem v-for="city in cities" :key="city.name" :value="city.name">{{
                    city.name
                  }}</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
            <FormDescription>{{
              form.values.targetCity !== city.name ? '售出商品到该城市' : '从该城市买入商品'
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
                :placeholder="form.values.targetCity !== city.name ? '售出价格' : '买入价格'"
                v-bind="componentField"
              />
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
                :placeholder="
                  form.values.targetCity !== city.name ? '售出价位百分比' : '买入价位百分比'
                "
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
              <Slider
                v-bind="componentField"
                :default-value="[100]"
                :max="199"
                :min="1"
                :step="1"
              />
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

        <DialogFooter>
          <Button type="submit">上报</Button>
        </DialogFooter>
      </form>
    </DialogContent>
  </Dialog>
</template>
