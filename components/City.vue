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

// 售出城市列表
const sellCities = computed(() => {
  return cities.filter((c) => c.name !== currentCity.name)
})

const settingStore = useSettingStore()

// 返回对各城市利润排序后的城市列表
const sortCitesByPercent = (filteredCities: CityInfo[], sourceCityName: string, productName: string) => {
  const sourceCityPrice = store.getLatestLog(sourceCityName, productName, sourceCityName)?.price || 0

  // 计算各城市货物利润
  let citiesProfitMap: {[key: string]: number} = {}
  filteredCities.map(city => {
    const latestLog = store.getLatestLog(sourceCityName, productName, city.name)
    // 如果最新交易记录无效，且有最新交易记录和原产地价格，则计算利润
    const profit = !Boolean(isLogValid(latestLog)) && latestLog && sourceCityPrice ? latestLog.price - sourceCityPrice : -9999
    return { cityName: city.name, profit }
  }).forEach(cityProfit => citiesProfitMap[cityProfit.cityName] = cityProfit.profit)

  const sortedCities = filteredCities.sort((a, b) => citiesProfitMap[b.name] - citiesProfitMap[a.name])
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
            <!-- 按城市纬度排序 -->
            <template v-if="settingStore.listSortMode === 'byCity'">
              <TableHead class="border-r">{{ currentCity.name }}</TableHead>
              <TableHead
                v-for="city in sellCities"
                :key="city.name"
              >{{ city.name }}</TableHead>
            </template>
            <!-- 按利润排序 -->
            <template v-else-if="settingStore.listSortMode === 'byProfit'">
              <TableHead class="border-r"><div class="w-30">原产地采购价</div></TableHead>
              <TableHead :colspan="sellCities.length">城市售卖报价(按利润高低从左到右降序排序)</TableHead>
            </template>
            <!-- 操作列 -->
            <TableHead class="w-[100px]">操作</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow v-for="product in city.products.filter((p) => p.valuable)" :key="product.name">
            <TableCell>
              <NuxtLink :to="`/product/${city.name}/${product.name}`">{{ product.name }}</NuxtLink>
            </TableCell>
            <TableCell class="border-r">
              <Price
                :sort-mode="settingStore.listSortMode"
                :timestamp="timestamp"
                :product="getProductInfo(city.name, product.name)!"
                :transaction="undefined"
                :log="store.getLatestLog(city.name, product.name, city.name)"
              />
            </TableCell>
            <!-- 按城市纬度排序 -->
            <template v-if="settingStore.listSortMode === 'byCity'">
              <TableCell
                v-for="target in sellCities"
                :key="target.name"
              >
                <Price
                  :sort-mode="settingStore.listSortMode"
                  :timestamp="timestamp"
                  :product="getProductInfo(city.name, product.name)!"
                  :transaction="getTransactionInfo(city.name, product.name, target.name)"
                  :log="store.getLatestLog(city.name, product.name, target.name)"
                />
              </TableCell>
            </template>
            <!-- 按利润排序 -->
            <template v-if="settingStore.listSortMode === 'byProfit'">
              <TableCell
                v-for="target in sortCitesByPercent(sellCities, city.name, product.name)"
                :key="target.name"
                class="w-40"
              >
                <Price
                  :sort-mode="settingStore.listSortMode"
                  :timestamp="timestamp"
                  :product="getProductInfo(city.name, product.name)!"
                  :transaction="getTransactionInfo(city.name, product.name, target.name)"
                  :log="store.getLatestLog(city.name, product.name, target.name)"
                />
              </TableCell>
            </template>
            <!-- 操作单元格 -->
            <TableCell>
              <CreateLog :city="city" :product="product"></CreateLog>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </CardContent>
    <!-- <CardFooter class="flex justify-between px-6 pb-6">
      <Button variant="outline"> Cancel </Button>
      <Button>Deploy</Button>
    </CardFooter> -->
  </Card>
</template>
