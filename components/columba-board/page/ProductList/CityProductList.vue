<script setup lang="ts">
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'

const props = defineProps<{ city: CityInfo }>()

const currentCity = props.city

const timestamp = useTimestamp({ interval: 10 * 1000 })

const mode = ref<'simple' | 'full' | 'edit'>('simple')

const store = useLatestLogs()


// 返回对各城市利润排序后的城市列表
const sortCitesByPercent = (filteredCities: CityInfo[], sourceCityName: string, productName: string) => {
  const sourceCityPrice = store.getLatestLog(sourceCityName, productName, sourceCityName)?.price || 0

  // 计算各城市货物利润
  let citiesProfitMap: {[key: string]: number} = {}
  filteredCities.map(city => {
    const latestLog = store.getLatestLog(sourceCityName, productName, city.name)
    const profit = !Boolean(isLogValid(latestLog)) && latestLog && sourceCityPrice ? latestLog.price - sourceCityPrice : -9999
    return { cityName: city.name, profit }
  }).forEach(cityProfit => citiesProfitMap[cityProfit.cityName] = cityProfit.profit)

  const sortedCities = filteredCities.sort((a, b) => citiesProfitMap[b.name] - citiesProfitMap[a.name])
  return sortedCities
}
</script>

<template>
  <CardBox>
    <CardHeader>
      <CardTitle>{{ city.name }}</CardTitle>
    </CardHeader>
    <CardContent>
      <Table>
        <TableHeader>
          <TableRow class="boder-t">
            <TableHead><div class="w-30">商品</div></TableHead>
            <TableHead class="border-r"><div class="w-30">原产地采购价</div></TableHead>
            <TableHead :col-span="cities.length - 1">城市售卖报价(按利润高低从左到右降序排序)</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow v-for="product in city.products.filter((p) => p.valuable)" :key="product.name">
            <!-- 商品名称 -->
            <TableCell>
              <NuxtLink :to="`/columba-board/product/${product.name}`">
                {{ product.name}}
              </NuxtLink>
            </TableCell>
            <!-- 采购价 -->
            <TableCell class="border-r">
              <PriceCell
                :city="city.name"
                :product="getProductInfo(city.name, product.name)!"
                :log="store.getLatestLog(city.name, product.name, currentCity.name)"
                :timestamp="timestamp"
              ></PriceCell>
            </TableCell>
            <!-- 城市报价 -->
            <TableCell
              v-for="target in sortCitesByPercent(cities.filter((c) => c.name !== currentCity.name), city.name, product.name)"
              :key="target.name"
              class="w-40"
            >
              <PriceCell
                :city="target.name"
                :timestamp="timestamp"
                :product="getProductInfo(city.name, product.name)!"
                :log="store.getLatestLog(city.name, product.name, target.name)"
              ></PriceCell>
            </TableCell>
            <TableCell>
              <CreateLog :city="city" :product="product"></CreateLog>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </CardContent>
  </CardBox>
</template>

<sty