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

import { type CityInfo, cities } from '~/lib/city';

import Price from './Price.vue';
import CreateLog from './CreateLog.vue';

const props = defineProps<{ city: CityInfo }>();

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
          <TableRow
            ><TableHead class="w-[120px]">商品</TableHead
            ><TableHead v-for="city in cities" :key="city.name">{{ city.name }}</TableHead
            ><TableHead class="w-[100px]">操作</TableHead></TableRow
          >
        </TableHeader>
        <TableBody>
          <TableRow v-for="product in city.products" :key="product.name">
            <TableCell>{{ product.name }}</TableCell>
            <TableCell v-for="target in cities" :key="target.name"
              ><Price :log="store.getLatestLog(city.name, product.name, target.name)"></Price
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
