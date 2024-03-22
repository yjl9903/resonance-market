<script setup lang="ts">
import { Slider } from '@/components/ui/slider'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'

import type { ProductInfo } from '@/utils/types'

const props = defineProps<{
  sourceCityName: string // 原产地城市
  targetCityName?: string // 目标城市
  product: ProductInfo // 货物信息
}>()

const open = defineModel('open', {
  type: Boolean,
  default: false,
})

const { form, onSubmit } = useReportForm({
  sourceCity: props.sourceCityName,
  name: props.product.name,
  onSubmitSuccess() {
    open.value = false
  },
})

watch(open, open => {
  if (open) {
    form.resetForm()
    if (props.targetCityName)
      form.setFieldValue('targetCity', props.targetCityName)
  }
})

const changePricePercent = (type: 'add' | 'reduce') => {
  const percent = form.values.percent?.[0] ?? 100
  if (type === 'add')
    form.setFieldValue('percent', [percent + 1])
  else
    form.setFieldValue('percent', [percent - 1])
}
</script>

<template>
  <Dialog v-model:open="open">
    <DialogTrigger as-child>
      <slot><div /></slot>
    </DialogTrigger>
    <DialogContent class="sm:max-w-[625px]">
      <DialogHeader>
        <DialogTitle>上报价格变动</DialogTitle>
      </DialogHeader>
      <form
        class="grid gap-4 py-4"
        @submit="onSubmit"
      >
        <div class="space-x-2 text-sm">
          <span class="text-right font-bold">商品</span>
          <span class="text-base">
            从
            <span class="text-gray-400">{{ sourceCityName }}</span>
            购买的
            <span class="text-gray-400">{{ product.name }}</span>
          </span>
        </div>

        <FormField
          v-slot="{ componentField }"
          name="targetCity"
        >
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
                  <SelectItem
                    v-for="city in cities"
                    :key="city.name"
                    :value="city.name"
                  >
                    {{ city.name }}
                  </SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
            <FormDescription>
              {{
                form.values.targetCity !== sourceCityName
                  ? `出售 ${product.name} 到 ${form.values.targetCity ?? '--'}`
                  : `从 ${form.values.targetCity} 购买 ${product.name}`
              }}
            </FormDescription>
            <FormMessage />
          </FormItem>
        </FormField>

        <FormField
          v-slot="{ componentField }"
          name="price"
        >
          <FormItem>
            <FormLabel>价格</FormLabel>
            <FormControl>
              <Input
                type="number"
                :placeholder="form.values.targetCity !== sourceCityName ? '售出价格' : '买入价格'"
                v-bind="componentField"
              />
            </FormControl>
            <FormDescription />
            <FormMessage />
          </FormItem>
        </FormField>

        <FormField
          v-slot="{ componentField }"
          name="percent"
        >
          <FormItem>
            <FormLabel>价位百分比</FormLabel>
            <FormControl>
              <div class="flex items-center space-x-2">
                <span
                  class="i-icon-park-outline-reduce-one text-xl cursor-pointer"
                  @click="changePricePercent('reduce')"
                />
                <Slider
                  v-bind="componentField"
                  :default-value="[100]"
                  :max="160"
                  :min="30"
                  :step="1"
                />
                <span
                  class="i-icon-park-outline-add-one text-xl cursor-pointer"
                  @click="changePricePercent('add')"
                />
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

        <FormField
          v-slot="{ componentField }"
          type="radio"
          name="trend"
        >
          <FormItem class="space-y-3">
            <FormLabel>涨跌趋势</FormLabel>

            <FormControl>
              <RadioGroup
                class="flex space-x-4"
                v-bind="componentField"
              >
                <FormItem class="flex items-center space-y-0">
                  <FormControl>
                    <RadioGroupItem value="up" />
                    <FormLabel class="flex items-center font-normal text-xl text-green pl-2 cursor-pointer">
                      <span class="i-material-symbols-trending-up text-green" />
                    </FormLabel>
                  </FormControl>
                </FormItem>
                <FormItem class="flex items-center space-y-0">
                  <FormControl>
                    <RadioGroupItem value="down" />
                    <FormLabel class="flex items-center font-normal text-xl text-red pl-2 cursor-pointer">
                      <span class="i-material-symbols-trending-down text-red" />
                    </FormLabel>
                  </FormControl>
                </FormItem>
              </RadioGroup>
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>

        <DialogFooter>
          <Button type="submit">
            上报
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  </Dialog>
</template>
