<script setup lang="ts">
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList
} from '@/components/ui/command';

const route = useRoute();

const cityName = route.params.city as string;
const city = cities.filter((c) => c.name === cityName)[0];

if (!city) {
  navigateTo('/');
}

useHead({
  title: `上报 ${cityName} 商品出售价格 | 雷索纳斯市场`
});

const selected = ref<ProductInfo[]>([]);

const onSelectProduct = (product: ProductInfo) => {
  if (selected.value.find((p) => p.name === product.name && p.city === product.city)) {
    return;
  }
  selected.value.unshift(product);
};
</script>

<template>
  <div class="main pb-12">
    <h1 class="font-bold text-2xl mb-4">向 {{ cityName }} 出售商品</h1>
    <div class="mb-8">
      <Command class="rounded-lg border shadow-md max-w-full">
        <CommandInput placeholder="搜索商品以开始上报..." />
        <CommandList class="h-[500px]">
          <CommandEmpty>
            <div class="h-full flex items-center justify-center">
              <div>没有找到商品</div>
            </div>
          </CommandEmpty>
          <CommandGroup
            v-for="otherCity in cities.filter((c) => c.name !== cityName)"
            :key="otherCity.name"
            :heading="otherCity.name"
          >
            <CommandItem
              v-for="p in otherCity.products.filter((p) => p.valuable)"
              :key="p.name"
              :value="`${otherCity.name} - ${p.name}`"
              @select="onSelectProduct(p)"
            >{{ p.name }}</CommandItem>
          </CommandGroup>
          <!-- <CommandGroup heading="Suggestions"> </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading="Settings"> </CommandGroup> -->
        </CommandList>
      </Command>
    </div>
    <div v-if="selected.length === 0">请选择商品</div>
    <div v-else class="grid sm:grid-cols-2 gap-6">
      <div v-for="p in selected" :key="`${p.city} - ${p.name}`" class="rounded border px-4">
        <SellReportForm :product="p" :target="city" />
      </div>
    </div>
  </div>
</template>
