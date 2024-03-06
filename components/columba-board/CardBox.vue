<template>
  <div class="card-box rounded-lg p-2 mb-3 bg-white">
    <slot></slot>
  </div>
</template>

<style lang="scss" scoped>
.card-box:last-child{
  margin-bottom: 0;
}
</style>