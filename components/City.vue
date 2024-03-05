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

const store = useLatestLogs();
</script>

<template>
  <Card class="w-full">
    <CardHeader>
      <CardTitle>{{ city.name }}</CardTitle>
    </CardHeader>
    <CardContent>
      <Table>
        <TableHeader>
          <TableRow class="boder-t"
            ><TableHead class="w-[120px]">商品</TableHead
            ><TableHead class="border-r">{{ currentCity.name }}</TableHead
            ><TableHead
              v-for="city in cities.filter((c) => c.name !== currentCity.name)"
              :key="city.name"
              >{{ city.name }}</TableHead
            ><TableHead class="w-[100px]">操作</TableHead></TableRow
          >
        </TableHeader>
        <TableBody>
          <TableRow v-for="product in city.products.filter((p) => p.valuable)" :key="product.name">
            <TableCell>{{ product.name }}</TableCell>
            <TableCell class="border-r"
              ><Price
                :timestamp="timestamp"
                :log="store.getLatestLog(city.name, product.name, currentCity.name)"
              ></Price
            ></TableCell>
            <TableCell
              v-for="target in cities.filter((c) => c.name !== currentCity.name)"
              :key="target.name"
              ><Price
                :timestamp="timestamp"
                :log="store.getLatestLog(city.name, product.name, target.name)"
              ></Price
            ></TableCell>
            <TableCell><CreateLog :city="city" :product="product"></CreateLog></TableCell>
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
