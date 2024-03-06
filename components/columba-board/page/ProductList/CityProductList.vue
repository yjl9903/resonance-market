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


// 返回根据getLatestLog中的percent对比排序后的城市列表
const sortCitesByPercent = (cities, sourceCityName, productName) => {
  const sortedCities = cities.sort((a, b) => {
    const aLog = store.getLatestLog(sourceCityName, productName, a.name)
    const bLog = store.getLatestLog(sourceCityName, productName, b.name)
    if(sourceCityName == "修格里城") {
      console.log(aLog, bLog)
    }
    return (bLog?.percent || 0) - (aLog?.percent || 0)
  })
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
            <TableHead :col-span="cities.length - 1">城市售卖报价</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow v-for="product in city.products.filter((p) => p.valuable)" :key="product.name">
            <!-- 商品名称 -->
            <TableCell>
              <NuxtLink :to="`/columba-board/product/${city.name}/${product.name}`">
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