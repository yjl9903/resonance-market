<script setup lang="ts">
import * as z from 'zod';
import { toast } from 'vue-sonner';
import { useForm } from 'vee-validate';
import { toTypedSchema } from '@vee-validate/zod';

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
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';

import { cities, type CityInfo, type ProductInfo } from '~/lib/city';

const props = defineProps<{ city: CityInfo; product: ProductInfo }>();

const open = ref(false);

const formSchema = toTypedSchema(
  z.object({
    targetCity: z.string(),
    price: z.number().gt(0),
    percent: z.number().gt(0).lt(200).default(100)
  })
);

const form = useForm({
  validationSchema: formSchema
});

const store = useLatestLogs();

const onSubmit = form.handleSubmit(async (values) => {
  try {
    await $fetch(`/api/log`, {
      method: 'POST',
      body: {
        city: props.city.name,
        name: props.product.name,
        type: props.city.name !== values.targetCity ? 'sell' : 'buy',
        targetCity: values.targetCity,
        price: values.price,
        percent: values.percent,
        uploadedAt: new Date().getTime()
      }
    });
    toast.success(`上传成功`);
    open.value = false;
    store.fetch();
  } catch {
    toast.error(`上传失败`);
  }
});
</script>

<template>
  <Dialog v-model:open="open">
    <DialogTrigger as-child>
      <Button variant="outline" size="sm">上传</Button>
    </DialogTrigger>
    <DialogContent class="sm:max-w-[625px]">
      <DialogHeader>
        <DialogTitle>上传价格变动</DialogTitle>
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

        <FormField v-slot="{ componentField }" name="percent">
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
        </FormField>

        <DialogFooter>
          <Button type="submit">上传</Button>
        </DialogFooter>
      </form>
    </DialogContent>
  </Dialog>
</template>
