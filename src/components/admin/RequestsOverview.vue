<script setup>
import { computed } from 'vue';

import PaginatedSwipeList from '../lists/PaginatedSwipeList.vue';
const props = defineProps({
    items: { type: Array, required: true }
});

const currentList = computed(() => {
    return props.items.filter(item => item.status === 'Pending' || !item.status);
});

const handleRequestCertificate = (item) => {
    item.status = 'Requested'; // Ändert den Status und schiebt es in den anderen Tab
    // Hier später API Call: await api.requestCertificate(item.id)
};

const handleDelete = (item) => {
    item.status = 'Deleted'; // Versteckt das Item oder löscht es
};
</script>
<template>
    <PaginatedSwipeList :items="currentList" :emptyMessage=" 'Keine ausstehenden Anfragen' " @swipeLeft="handleRequestCertificate" @swipeRight="handleDelete"></PaginatedSwipeList>
</template>