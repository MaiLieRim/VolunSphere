<template>
  <h3 class="mx-2 mt-2 mb-0">{{ title }}</h3>
  <div v-for="(items, index) in items" :key="index" class="d-flex justify-content-between align-items-center">
    <img class="m-2 bg-light" src="/assets/images/qrCode.png" alt="QRCode" width="72">

    <div class="flex-grow-1 align-self-center ">
      <h3 class="mb-1">{{ items.title }}</h3>
      <div class="text-muted">{{ items.description }}</div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  title: {
    type: String,
    default: ""
  },
  items: {
    type: Array,
    required: true
  }
})
</script>