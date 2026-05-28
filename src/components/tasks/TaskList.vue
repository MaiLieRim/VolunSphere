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

    <h2>{{ title }}</h2>

    <RouterLink :to="{ name: 'task', params: { itemId: item.id } }" v-for="(item, index) in items" :key="item.id"
      class="list-group-item list-group-item-action align-content-stretch d-flex " aria-current="true">
      
      <div class="date-box col-3"> 
        <small>{{ item.club }}</small>
        <h1>{{ item.day }}</h1>
        <small>{{ item.month }}</small>
      </div>

      <div class="container col-9 content d-flex flex-column my-2">
        <div>
          <small class="opacity-50">{{ item.location }}, {{ item.industry }}</small>
          <h4>{{ item.title }}</h4>
        </div>

        <div  class="mt-auto d-flex align-items-center text-muted gap-6">
          <small class="col-3">
            <img src="/assets/images/profile-pictures/liselotte.png" alt="twbs" width="20" height="20"
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
import { useTasks } from '@/composables/useTasks';

const props = defineProps({
    title: {
        type: String,
        required: true
    },
    items: {
        type: Array
    },
    loadItemsCount: {
        type: Number,
        default: 3
    }

});

const { allTasks } = useTasks();
const items = ref([]);
const loadedItemsCount = ref(0);

const allItems = computed(() => {
    return allTasks.value.map(job => ({
        club: job.club,
        day: job.day,
        month: job.month,
        location: job.location,
        title: job.title,
        jobs: '0/' + job.jobs,
        industry: job.industry,
        id: job.id
    }));
});

const toggleLoadMore = () => {
    const nextItems = allItems.value.slice(loadedItemsCount.value, loadedItemsCount.value + props.loadItemsCount);
    items.value.push(...nextItems);
    loadedItemsCount.value += nextItems.length;
};

const showLess = () => {
    items.value = allItems.value.slice(0, props.loadItemsCount);
    loadedItemsCount.value = props.loadItemsCount;
};

// Watch for changes in allItems and reset pagination
watch(allItems, (newAllItems) => {
    items.value = [];
    loadedItemsCount.value = 0;
    toggleLoadMore();
}, { immediate: true });

</script>