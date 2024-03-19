<script setup lang="ts">
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardDescription,
  CardTitle
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';

import Price from './Price.vue';
import CreateLog from './CreateLog.vue';

const props = defineProps<{ city: CityInfo }>();

const currentCity = props.city;

const timestamp = useTimestamp({ interval: 10 * 1000 });

const mode = ref<'simple' | 'full' | 'edit'>('simple');

const store = useLatestLogs();

const settingStore = useSettingStore()

// 售出城市列表
const sellCities = computed(() => {
  return cities.filter((c) => c.name !== currentCity.name)
})

// 按设置排序后的城市列表
const sortCitesWithSetting = (filteredCities: CityInfo[], sourceCityName: string, productName: string) => {
  if (settingStore.listSortMode === 'byCity') {
    return filteredCities
  } else if (settingStore.listSortMode === 'byProfit') {
    return sortCitesByProfit(filteredCities, sourceCityName, productName)
  } else {
    return filteredCities
  }
}

// 按单位利润排序城市
const sortCitesByProfit = (filteredCities: CityInfo[], sourceCityName: string, productName: string) => {
  const sourceCityPrice = store.getLatestLog(sourceCityName, productName, sourceCityName)?.price || 0

  // 计算各城市货物利润
  let citiesProfitMap: {[key: string]: number} = {}
  filteredCities.map(city => {
    const latestLog = store.getLatestLog(sourceCityName, productName, city.name)
    
    /**
     * 如果满足以下条件之一，排名最后
     * 1. 最新交易记录不存在
     * 2. 最新交易记录距离现在超过 1 天
     * 3. 原产地价格不存在
     */
    if (
      !latestLog ||
      (Date.now() - new Date(latestLog.uploadedAt).valueOf()) > (1 * 24 * 60 * 60 * 1000) ||
      !sourceCityPrice
    ) return { cityName: city.name, profit: -9999 }
    // 如果最新交易记录无效，排名在有效记录之后，且按顺序排列
    else if(Boolean(isLogValid(latestLog))) return { cityName: city.name, profit: Math.round(latestLog.price * 1.2 * 0.98 - sourceCityPrice * 0.8 * 1.08) - 9000 }
    // 如果最新交易记录有效，按利润高低排名
    else return { cityName: city.name, profit: Math.round(latestLog.price * 1.2 * 0.98 - sourceCityPrice * 0.8 * 1.08) }
  }).forEach(cityProfit => citiesProfitMap[cityProfit.cityName] = cityProfit.profit)

  console.log(productName, citiesProfitMap)
  const sortedCities = filteredCities.toSorted((a, b) => citiesProfitMap[b.name] - citiesProfitMap[a.name])
  return sortedCities
}
</script>

<template>
  <Card class="w-full">
    <CardHeader>
      <CardTitle>{{ city.name }}</CardTitle>
    </CardHeader>
    <CardContent>
      <Table>
        <TableHeader>
          <TableRow class="boder-t">
            <TableHead class="w-[120px]">商品</TableHead>
            <!-- 按城市维度排序 -->
            <template v-if="settingStore.listSortMode === 'byCity'">
              <TableHead class="border-r">{{ currentCity.name }}</TableHead>
              <TableHead
                v-for="city in sellCities"
                :key="city.name"
              >{{ city.name }}</TableHead>
            </template>
            <!-- 按利润排序 -->
            <template v-else>
              <TableHead class="border-r"><div class="w-30">原产地采购价</div></TableHead>
              <TableHead :colspan="sellCities.length">
                城市售卖报价(按利润高低从左到右降序排序)
              </TableHead>
            </template>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow v-for="product in city.products.filter((p) => p.valuable)" :key="product.name">
            <TableCell>
              <NuxtLink :to="`/product/${city.name}/${product.name}`">{{ product.name }}</NuxtLink>
            </TableCell>
            <TableCell class="border-r">
              <Price
                :timestamp="timestamp"
                :product="getProductInfo(city.name, product.name)!"
                :transaction="undefined"
                :log="store.getLatestLog(city.name, product.name, city.name)"
              />
            </TableCell>
            <!-- 被排序过的售出城市列表 -->
            <TableCell
              v-for="targetCity in sortCitesWithSetting(sellCities, city.name, product.name)"
              :key="`${product.name}-${targetCity.name}`"
            >
              <Price
                :timestamp="timestamp"
                :product="getProductInfo(city.name, product.name)!"
                :transaction="getTransactionInfo(city.name, product.name, targetCity.name)"
                :log="store.getLatestLog(city.name, product.name, targetCity.name)"
              />
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </CardContent>
  </Card>
</template>
