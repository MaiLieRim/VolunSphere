<style scoped>
.list-group-flush>.list-group-item {
  border-width: var(--bs-list-group-border-width) 0 0;
}

.list-group-item {
  padding-left: 0;
  padding: 0.15rem !important;
}

.hover-link {
  cursor: pointer;
  transition: background-color 0.15s ease-in-out;
}

.hover-link:hover {
  background-color: rgba(0,0,0,0.075);
}
</style>

<template>
  <div class="list-group list-group-flush ">

    <h2 v-if="title">{{ title }}</h2>

    <RouterLink :to="{ name: 'verification', params: { itemId: item.id } }" v-for="(item, index) in displayedItems" :key="item.id"
      class="list-group-item list-group-item-action align-content-stretch d-flex " aria-current="true">
      
      <div class="date-box col-3"> 
        <small>{{ item.club }}</small>
        <h1>{{ item.hours }}</h1>
        <small>Stunden</small>
      </div>

      <div class="container col-9 content d-flex flex-column my-2">
        <div>
          <small class="opacity-50">{{ item.club }} <span v-if="item.industry">, {{ item.industry }}</span></small>
          <h4>{{ item.title }}</h4>
        </div>

        <div class="mt-auto d-flex align-items-center text-muted gap-6">
          <small class="col-3">
            <img src="/src/assets/images/profile-pictures/liselotte.png" alt="twbs" width="20" height="20"
              class="rounded-circle flex-shrink-0">
            {{ item.jobs }}
          </small>
          <small class="col-6"><i class="bi bi-chat me-1"></i>messages</small>
        </div>
      </div>
    </RouterLink>

    <div v-if="loadedItemsCount < allItems.length || loadedItemsCount > loadItemsCount" class="list-group-item d-flex">
      <div v-if="loadedItemsCount < allItems.length" class="flex-fill hover-link" @click.prevent="toggleLoadMore">
        <div class="text-center nav-item text-secondary m-2">
          mehr anzeigen
        </div>
      </div>
      <div v-if="loadedItemsCount > loadItemsCount" class="flex-fill hover-link" @click.prevent="showLess">
        <div class="text-center nav-item text-secondary m-2">
          weniger
        </div>
      </div>
    </div>
    
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
// Removed useTasks import as it was unused in this file

const props = defineProps({
    title: {
        type: String,
        required: false // Changed to false so you don't get warnings if you omit it
    },
    items: {
        type: Array,
        default: () => [] // Always provide a default empty array for safety
    },
    loadItemsCount: {
        type: Number,
        default: 3
    }
});

const STATUS = {
    PENDING: 'Pending'
};

const displayedItems = ref([]);
const loadedItemsCount = ref(0);

const allItems = computed(() => {
    return props.items.map(job => ({
            id: job.identifier?.value || job.id || '',
            title: job.name || job.title || '',
            club: job.organization?.name || job.club || '',
            hours: job.hours || 0,
            requester: job.requester?.name || '',
            status: job.status || STATUS.PENDING, // Fallback safely to pending
            swiped: false,
        }));
});

const toggleLoadMore = () => {
    const nextItems = allItems.value.slice(loadedItemsCount.value, loadedItemsCount.value + props.loadItemsCount);
    displayedItems.value.push(...nextItems);
    loadedItemsCount.value += nextItems.length;
};

const showLess = () => {
    displayedItems.value = allItems.value.slice(0, props.loadItemsCount);
    loadedItemsCount.value = props.loadItemsCount;
};

// Watch for changes in allItems and reset pagination
watch(allItems, () => {
    displayedItems.value = [];
    loadedItemsCount.value = 0;
    toggleLoadMore();
}, { immediate: true });

</script>
