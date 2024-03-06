<script setup lang='ts'>
import { onMounted, ref } from 'vue'

definePageMeta({
  layout: 'columba-board'
})

type MessageData = {
  username: string
  content: string
  ctime: number
}

const messageList = ref<MessageData[]>([])

onMounted(() => {
  const data = [
    {
      username: '张三',
      ctime: 1627680000000,
      content: '这是一条留言'
    },
    {
      username: '李四',
      ctime: 1627680000000,
      content: '这是另一条留言'
    },
    {
      username: '王五',
      ctime: 1627680000000,
      content: '这是第三条留言'
    },
    {
      username: '赵六',
      ctime: 1627680000000,
      content: '这是第四条留言'
    }
  ]

  messageList.value = data
})

const onMessageSended = (message: string) => {
  messageList.value.push({
    username: '无名的列车长',
    ctime: Date.now(),
    content: message
  })
}
</script>

<template>
  <div class="h-full flex flex-col">
    <div class="p-4">
      <h2 class="text-2xl font-bold">留言板</h2>
      <p class="text-gray-500">欢迎留言</p>
    </div>
    
    <h2 class="pl-4 pr-4 text-2xl font-bold">留言列表</h2>
    <div class="m-4 flex-grow flex-shrink overflow-y-auto">
      <MessageItem
        v-for="messageItem in messageList"
        :key="messageItem.ctime"
        :data="messageItem"
      />
    </div>

    <MessageSender @send="onMessageSended"/>
  </div>
</template>