<template>
  <CardBox>
    <div class="message-item">
      <div class="flex items-center">
        <div class="ml-4">
          <div class="text-lg font-bold">列车长：{{ data.username || "无名的列车长" }}</div>
          <div class="text-gray-500">{{ parseTime(data.ctime) }}</div>
        </div>
      </div>
      <div class="mt-3 ml-4">
        <p>{{ data.content }}</p>
      </div>
    </div>
  </CardBox>
</template>
  
<script setup lang='ts'>
import dayjs from 'dayjs'

type MessageData = {
  username: string
  content: string
  ctime: number
}

const { data } = defineProps<{
  data: MessageData
}>()

const parseTime = (time: number) => {
  return dayjs(time).format('YYYY-MM-DD HH:mm:ss')
}
</script>
  
<style>
  
</style>