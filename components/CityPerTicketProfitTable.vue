<script setup lang="ts">
const logStore = useLatestLogs();

const settingStore = useSettingStore();

const props = defineProps<{ isComeAndGo: boolean }>();

type TransactionRoute = {
  originatingCity: string;
  destinationCity: string;
};

// 跑商路线
const transactionRoute = computed(() => {
  const oneWayRoute: TransactionRoute[] = [];
  cities.forEach(originatingCity => {
    cities.forEach(destinationCity => {
      if (originatingCity.name !== destinationCity.name) {
        // 存在往返路线
        const isExistComeAndGoRoute = oneWayRoute.some(route => {
          return route.originatingCity === destinationCity.name && route.destinationCity === originatingCity.name;
        });
        if (props.isComeAndGo && isExistComeAndGoRoute) return;

        oneWayRoute.push({
          originatingCity: originatingCity.name,
          destinationCity: destinationCity.name
        });
      }
    });
  });

  return oneWayRoute;
});

const sortedTransactionRoute = computed(() => {
  // 计算每条路线的单票利润
  const transactionRouteWithProfit = transactionRoute.value.map(route => {
    return {
      ...route,
      profit: getCityProfit(route.originatingCity, route.destinationCity)
      + (props.isComeAndGo ? getCityProfit(route.destinationCity, route.originatingCity) : 0)
    };
  });
  // 按利润排序
  return transactionRouteWithProfit.toSorted((a, b) => b.profit - a.profit);
});

const rankBarWidthPercent = (profit: number) => {
  const maxProfit = sortedTransactionRoute.value[0].profit;
  const minProfit = sortedTransactionRoute.value[sortedTransactionRoute.value.length - 1].profit;
  return ((profit - minProfit) / (maxProfit - minProfit)) * 90;
};

const getCityProfit = (originatingCity: string, destinationCity: string) => {
  const allProduct = cities.find(city => city.name === originatingCity)?.products;
  const cityAllProductPerTicketProfit = allProduct?.reduce((result, currentProduct) => {
    // 仅计算展示的商品
    if (!currentProduct.valuable) return result;
    const sourceCityPrice = logStore.getLatestLog(originatingCity, currentProduct.name, originatingCity)?.price || 0;
    const targetCityPrice = logStore.getLatestLog(originatingCity, currentProduct.name, destinationCity)?.price || 0;
    const profit = settingStore.getProfitWithRule(sourceCityPrice, targetCityPrice);
    const perTicketProfit = profit * (currentProduct.baseVolume || 0);

    return result + perTicketProfit;
  }, 0);

  return cityAllProductPerTicketProfit || 0;
};
</script>

<template>
  <Card class="w-full">
    <CardContent class="pt-2">
      <Table class="table-fixed">
        <TableHeader>
          <TableRow>
            <TableHead class="border-r min-w-[160px] max-w-[240px]">跑商路线</TableHead>
            <TableHead class="min-w-[100px] w-1/2">单票利润</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow
            v-for="route in sortedTransactionRoute"
            :key="`${route.originatingCity}->${route.destinationCity}`"
          >
            <TableCell class="border-r">
              <div class="flex flex-col sm:items-center sm:flex-row">
                <span>{{ route.originatingCity }}</span>
                <span v-if="props.isComeAndGo" class="i-icon-park-outline-transfer-data m-1 rotate-90 sm:rotate-0"></span>
                <span v-else class="i-icon-park-outline-arrow-right m-1 rotate-90 sm:rotate-0"></span>
                <span>{{ route.destinationCity }}</span>
              </div>
            </TableCell>
            <TableCell>
              <div class="w-full">
                {{ route.profit }}
                <div :style="{ width: `${rankBarWidthPercent(route.profit)}%` }" class="h-2 bg-primary"></div>
              </div>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </CardContent>
  </Card>
</template>
