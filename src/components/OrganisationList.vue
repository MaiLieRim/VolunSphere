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
    background-color: rgba(0, 0, 0, 0.075);
}
</style>
<template>
    <div class="list-group list-group-flush ">

        <h2>{{ title }}</h2>

        <RouterLink :to="{ name: 'orgDetail', params: { organisationId: item.id } }"
            v-for="(item, index) in displayItems" :key="item.id"
            class="list-group-item list-group-item-action align-content-stretch d-flex " aria-current="true">

            <div class="date-box col-3">
                <img v-if="item.logo" :src="`/assets/images/logo/${item.logo}`" class="img-fluid w-100"
                    alt="logo" />
            </div>
            <div class="container col-9 content d-flex flex-column my-1">
                <div>
                    <small class="opacity-50">{{ item.type }}</small>
                    <h4 class="mb-0">{{ item.title }}</h4>
                </div>

                <small class="mt-auto">
                    <i class="bi bi-person-circle"></i> {{ item.members }}
                </small>
            </div>
        </RouterLink>

        <div v-if="loadedItemsCount < allItems.length || loadedItemsCount > 3" class="list-group-item d-flex">
            <div v-if="loadedItemsCount < allItems.length" class="flex-fill hover-link" @click.prevent="toggleLoadMore">
                <div class="text-center nav-item text-secondary m-2">
                    mehr anzeigen
                </div>
            </div>
            <div v-if="loadedItemsCount > 3" class="flex-fill hover-link" @click.prevent="showLess">
                <div class="text-center nav-item text-secondary m-2">
                    weniger
                </div>
            </div>
        </div>

    </div>

</template>

<script setup>
import { ref, computed, watch } from 'vue';

const props = defineProps({
    title: {
        type: String,
        required: true
    },
    items: {
        type: Array,
        default: () => []
    }
});

const loadedItemsCount = ref(0);
const displayItems = ref([]);

// map organisations
const allItems = computed(() => {
    return props.items.map(org => ({
        type: org.memberOf?.name,
        title: org.name,
        members: org.member?.length || 0,
        id: org.identifier,
        logo: org.logo
    }));
});

const toggleLoadMore = () => {
    const next = allItems.value.slice(
        loadedItemsCount.value,
        loadedItemsCount.value + 3
    );

    displayItems.value.push(...next);
    loadedItemsCount.value += next.length;
};

const showLess = () => {
    displayItems.value = allItems.value.slice(0, 3);
    loadedItemsCount.value = 3;
};

// reset when new data arrives
watch(allItems, () => {
    loadedItemsCount.value = 0;
    displayItems.value = [];
    toggleLoadMore();
}, { immediate: true });

</script>