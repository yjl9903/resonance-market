<script setup lang="ts">
import { toast } from 'vue-sonner';
import { format } from '@formkit/tempo';
import { Trash } from 'lucide-vue-next';

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';

const route = useRoute();

const sourceCityName = route.params.source;
const productName = route.params.name;
const targetCityName = route.params.target;

useHead({
  title: `贸易 ${sourceCityName} 一 ${productName} → ${targetCityName} | 雷索纳斯市场`
});

const { data, refresh } = await useFetch(
  `/api/log/${sourceCityName}/${productName}/${targetCityName}/`
);

useIntervalFn(async () => {
  await refresh();
}, 10 * 1000);

const onDeleteLog = async (id: number) => {
  try {
    await $fetch(`/api/log/${sourceCityName}/${productName}/${targetCityName}/${id}`, {
      method: 'DELETE'
    });
    toast.success('删除成功');
    await refresh();
  } catch (error) {
    console.error(error);
    toast.error('删除失败');
  }
};
</script>

<template>
  <div class="main pb-12">
    <h1 class="font-bold text-lg mb-4">
      贸易
      <NuxtLink :to="`/product/${sourceCityName}/${productName}`" class="text-link-active">
        {{ sourceCityName }} 一 {{ productName }}
      </NuxtLink>
      → {{ targetCityName }}
    </h1>
    <div v-if="data">
      <Table>
        <TableCaption>展示最新 {{ data.latest.length }} 条上报日志</TableCaption>
        <TableHeader>
          <TableRow class="boder-t">
            <!-- <TableHead class="">#</TableHead> -->
            <TableHead class=""> 上报时间 </TableHead>
            <TableHead class=""> 价格 </TableHead>
            <TableHead class=""> 价位 </TableHead>
            <TableHead class=""> 趋势 </TableHead>
            <TableHead class="w-[100px]"> 操作 </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow v-for="log in data.latest" :key="log.id">
            <!-- <TableCell>{{ log.id }}</TableCell> -->
            <TableCell>{{ format(log.uploadedAt, { date: 'long', time: 'medium' }) }}</TableCell>
            <TableCell
              class="font-bold"
              :class="[
                {
                  'text-red': log.percent < 100,
                  'text-green': log.percent > 100
                }
              ]"
            >
              {{ log.price }}
            </TableCell>
            <TableCell
              class="font-bold"
              :class="[
                {
                  'text-red': log.percent < 100,
                  'text-green': log.percent > 100
                }
              ]"
            >
              {{ log.percent }}%
            </TableCell>
            <TableCell>
              <span
                v-if="log.trend === 'up'"
                class="i-material-symbols-trending-up text-green text-xl"
              />
              <span
                v-else-if="log.trend === 'down'"
                class="i-material-symbols-trending-down text-red text-xl"
              />
              <span v-else class="i-material-symbols-trending-flat text-xl" />
            </TableCell>
            <TableCell>
              <Button variant="destructive" size="icon" @click="onDeleteLog(log.id)">
                <Trash class="w-4 h-4" />
              </Button>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
    <!--
      <ClientOnly>
      <div class="pt-8">
      <Giscus
      id="comments"
      repo="yjl9903/resonance-market"
      repoId="R_kgDOLbiZ1A"
      mapping="number"
      term="7"
      reactionsEnabled="0"
      emitMetadata="0"
      inputPosition="bottom"
      theme="preferred_color_scheme"
      lang="zh-CN"
      />
      </div>
      </ClientOnly>
    -->
  </div>
</template>
