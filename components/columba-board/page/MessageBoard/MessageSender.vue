<template>
  <NButton type="primary" class="mt-4 bg-green-600" @click="onToSend">发送电报</NButton>

  <NModal
    v-model:show="showModal"
    preset="card"
    title="发送电报"
  >
    <NInput v-model:value="message" type="textarea" placeholder="在这里输入留言内容" />
    <template #footer>
      <NButton class="w-full" @click="onSend">发送电报</NButton>
    </template>
  </NModal>
</template>
  
<script setup lang='ts'>
import { ref } from 'vue'
import { NInput, NButton, NModal } from 'naive-ui'

const emit = defineEmits(['send'])

const message = ref('')
const showModal = ref(false)

const onToSend = () => {
  showModal.value = true
}

const onSend = () => {
  emit('send', message.value)
  message.value = ''
  showModal.value = false
}
</script>
  
<style>
  
</style>