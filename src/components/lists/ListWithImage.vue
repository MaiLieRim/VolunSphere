<template>
  <div v-if="title" class="mx-2 mt-2 mb-3">
    <h5 class="fw-bold mb-0 text-dark">{{ title }}</h5>
  </div>

  <div class="list-group list-group-flush">
    <div v-for="(item, index) in items" :key="index" class="list-group-item d-flex justify-content-between align-items-center p-3 border-bottom">
      
      <div class="bg-primary bg-opacity-50 text-primary rounded-4 d-flex justify-content-center align-items-center me-3 shadow-sm border border-primary-subtle" 
           style="width: 60px; height: 60px; min-width: 60px;">
        <i class="bi bi-patch-check-fill fs-2"></i>
      </div>

      <div class="flex-grow-1 align-self-center overflow-hidden">
        <h4 class="fw-bold text-dark mb-1 text-truncate">{{ item.title }}</h4>
        <div class="text-muted small text-truncate">{{ item.description }}</div>
      </div>
      
      <div class="d-flex  align-items-center ms-2 opacity-50">
        <i class="bi bi-qr-code fs-4"></i>
        <i class="bi bi-chevron-right" style="font-size: 0.8rem;"></i>
      </div>
      
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

<style scoped>
.list-group-item:last-child {
  border-bottom: none !important;
}
</style>