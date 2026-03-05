<style scoped>
.list-group-flush>.list-group-item {
    border-width: var(--bs-list-group-border-width) 0 0;
}

.list-group-item {
    padding-left: 0;
    padding: 0.15rem !important;
    border-width: 0;
}
</style>
<template>
    <div class="space list-group list-group-flush ">

        <h3>{{ title }}</h3>

        <div v-for="(item, index) in props.items" :key="item.id" class="list-group-item text-decoration-none"
            aria-current="true">
            <div class="list-group-item list-group-item-action align-content-stretch d-flex swipe-item"
                :class="{ swiped: item.swiped }" @touchstart="startTouch($event, index)"
                @touchmove="moveTouch($event, index)" @touchend="endTouch(index)">

                <div class="date-box col-3">
                    <small>{{ item.club }}</small>
                    <h1>{{ item.hours }}</h1>
                    <small>Stunden</small>
                </div>

                <RouterLink :to="{ name: 'task', params: { itemId: item.id } }"
                    class="text-decoration-none container col-8 h-100">
                    <div>
                        <small class="opacity-50">{{ item.club }}</small>
                        <h4>{{ item.title }}</h4>
                    </div>

                    <div bottom class="action d-flex align-items-center pt-2 pb-2 text-muted gap-6">
                        <small class="col-8">
                            <img src="/src/assets/images/liselotte.png" alt="twbs" width="20" height="20"
                                class="rounded-circle flex-shrink-0">
                            {{ item.requester }}
                        </small>
                    </div>

                </RouterLink>
                <RouterLink :to="{ name: 'chat', params: { name: item.requester } }"  class="col-1 message-col">
                        <i class="bi bi-chat me-1"></i>
                </RouterLink>
            </div>
            <div class="swipe-actions  " v-if="item.swiped">
                <button class="fs-1 btn btn-danger" @click="deleteItem(index)"><i class="bi bi-trash"></i></button>
                <button class="fs-1 btn btn-success" @click="openModal(index)"><i class="bi bi-check2-circle"></i>
                </button>
            </div>
        </div>
        <div v-if="props.items.length == 0">
            <div class="list-group-item list-group-item-action">
                <div class="text-center nav-item text-secondary m-2 ">
                    Keine Nachweise gefunden.
                </div>
            </div>
        </div>
        <a v-if="loadedItemsCount < items.length" class="list-group-item list-group-item-action"
            @click.prevent="toggleLoadMore">
            <div class="text-center nav-item text-secondary m-2 ">
                mehr anzeigen
            </div>
        </a>
        <a v-if="loadedItemsCount > 3" class="list-group-item list-group-item-action" @click.prevent="showLess">
            <div class="text-center nav-item text-secondary m-2">
                weniger
            </div>
        </a>
        <RequestModal ref="modalRef" />
    </div>

</template>
<script setup>
import { ref } from 'vue';

import RequestModal from './RequestModal.vue';
const props = defineProps({
    title: {
        type: String,
        required: true
    },
    items: {
        type: Array,
        required: true
    }
});

const modalRef = ref(null);

// Ref to keep track of visible items
const visibleItems = ref(props.items.slice(0, 3));  // Initially show 3 items
const loadedItemsCount = ref(3);
const startX = ref(0);

const openModal = () => {
    modalRef.value.openModal();
};

// Load more items
const toggleLoadMore = () => {
    const nextItems = props.items.slice(loadedItemsCount.value, loadedItemsCount.value + 3);
    visibleItems.value.push(...nextItems);
    loadedItemsCount.value += nextItems.length;
};

// Show less items
const showLess = () => {
    visibleItems.value = props.items.slice(0, 3);  // Reset to first 3 items
    loadedItemsCount.value = 3;
};

const startTouch = (event, index) => {
    startX.value = event.touches[0].clientX;
};

const moveTouch = (event, index) => {
    let touchMoveX = event.touches[0].clientX;
    if (startX.value - touchMoveX > 50) {
        props.items[index].swiped = true;
    }
};

const endTouch = (index) => {
    setTimeout(() => {
        props.items[index].swiped = false;
    }, 3000); // Auto-hide buttons after 3 seconds
};

const deleteItem = (index) => {
    props.items.splice(index, 1);
};

</script>

<style scoped>
.list-group-item-container {
    position: relative;
    overflow: hidden;
}

.swipe-item {
    transition: transform 0.3s ease-in-out;
}

.swiped {
    transform: translateX(-100px);
}

.swipe-actions {
    position: absolute;
    right: 0;
    top: 0;
    height: 100%;
    display: flex;
    background-color: white;
    z-index: 1;
    gap: 0.5rem;
    padding: 2rem 0.5rem;
    padding-left: 1.6rem;
}

.swipe-actions button {
    padding: 3px 10px;
    border: none;
    cursor: pointer;
}

.message-col {
    line-height: 110%;
    align-content: center;
    text-align: center !important;
    padding: 0.2rem 0;
    font-size: 26px;
}
</style>