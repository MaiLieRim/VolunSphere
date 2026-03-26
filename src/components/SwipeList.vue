<template>
    <div class="space list-group list-group-flush">
        <h2>{{ title }}</h2>

        <div v-for="(item, index) in visibleItems" :key="item.id || index" class="list-group-item text-decoration-none">
            
            <div class="list-group-item-container">
                <div class="action-background action-delete" v-if="item.swipeDirection === 'right'">
                    <button class="btn text-white fs-1" @click="deleteItem(index)">
                        <i class="bi bi-trash"></i>
                    </button>
                </div>
                
                <div class="action-background action-verify" v-if="item.swipeDirection === 'left'">
                    <button class="btn text-white fs-1" @click="openModal(index)">
                        <i class="bi bi-check2-circle"></i>
                    </button>
                </div>

                <div class="list-group-item list-group-item-action align-content-stretch d-flex swipe-item"
                    :class="{ 
                        'swiped-left': item.swipeDirection === 'left', 
                        'swiped-right': item.swipeDirection === 'right' 
                    }" 
                    @touchstart="startTouch($event)"
                    @touchmove="moveTouch($event, index)" 
                    @touchend="endTouch(index)">

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

                        <div class="action d-flex align-items-center pt-2 pb-2 text-muted gap-6">
                            <small class="col-8 d-flex align-items-center">
                                <img src="/src/assets/images/profile-pictures/liselotte.png" alt="Profile" width="20" height="20" class="rounded-circle flex-shrink-0 me-2">
                                {{ item.requester }}
                            </small>
                        </div>
                    </RouterLink>

                    <RouterLink :to="{ name: 'chat', params: { name: item.requester } }" class="col-1 message-col">
                        <i class="bi bi-chat me-1"></i>
                    </RouterLink>
                </div>
            </div>
        </div>

        <div v-if="visibleItems.length === 0">
            <div class="list-group-item list-group-item-action">
                <div class="text-center nav-item text-secondary m-2">
                    Keine Nachweise gefunden.
                </div>
            </div>
        </div>

        <a v-if="loadedItemsCount < props.items.length" class="list-group-item list-group-item-action cursor-pointer" @click.prevent="toggleLoadMore">
            <div class="text-center nav-item text-secondary m-2">
                mehr anzeigen
            </div>
        </a>
        <a v-if="loadedItemsCount > 3" class="list-group-item list-group-item-action cursor-pointer" @click.prevent="showLess">
            <div class="text-center nav-item text-secondary m-2">
                weniger
            </div>
        </a>

        <RequestModal ref="modalRef" />
    </div>
</template>

<script setup>
import { ref, watch } from 'vue';
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

// Pagination state
const loadedItemsCount = ref(3);
const visibleItems = ref([...props.items].slice(0, loadedItemsCount.value));

// Keep visible items synced if props.items changes externally
watch(() => props.items, (newItems) => {
    visibleItems.value = [...newItems].slice(0, loadedItemsCount.value);
}, { deep: true });

// Touch state
const startX = ref(0);

const openModal = (index) => {
    modalRef.value.openModal();
    visibleItems.value[index].swipeDirection = null; // reset swipe after action
};

const deleteItem = (index) => {
    // Note: Since you are paginating, to truly delete it you should remove it from props.items in the parent component.
    // But for this local demo, we slice it out of visibleItems.
    visibleItems.value.splice(index, 1);
};

// Pagination Logic
const toggleLoadMore = () => {
    const nextItems = props.items.slice(loadedItemsCount.value, loadedItemsCount.value + 3);
    visibleItems.value.push(...nextItems);
    loadedItemsCount.value += nextItems.length;
};

const showLess = () => {
    visibleItems.value = props.items.slice(0, 3);
    loadedItemsCount.value = 3;
};

// --- Touch / Swipe Logic ---
const startTouch = (event) => {
    startX.value = event.touches[0].clientX;
};

const moveTouch = (event, index) => {
    let touchMoveX = event.touches[0].clientX;
    let difference = touchMoveX - startX.value;

    // Swipe Right (Diff is positive) -> Red / Delete
    if (difference > 50) {
        visibleItems.value[index].swipeDirection = 'right';
    } 
    // Swipe Left (Diff is negative) -> Green / Verify
    else if (difference < -50) {
        visibleItems.value[index].swipeDirection = 'left';
    }
};

const endTouch = (index) => {
    // Auto-hide buttons after 3 seconds
    setTimeout(() => {
        if (visibleItems.value[index]) {
            visibleItems.value[index].swipeDirection = null;
        }
    }, 3000); 
};
</script>

<style scoped>
.list-group-flush > .list-group-item {
    border-width: var(--bs-list-group-border-width) 0 0;
}

.list-group-item {
    padding-left: 0;
    padding: 0.15rem !important;
    border-width: 0;
}

/* --- Swipe Functionality Styles --- */
.list-group-item-container {
    position: relative;
    overflow: hidden;
    background-color: #f8f9fa; /* Prevents seeing through to page background */
}

/* Background layers for the buttons */
.action-background {
    position: absolute;
    top: 0;
    bottom: 0;
    width: 100%;
    display: flex;
    align-items: center;
    z-index: 1; /* Sits BEHIND the swipe item */
}

.action-delete {
    background-color: var(--bs-danger); /* Red */
    justify-content: flex-start; /* Button on the left */
    padding-left: 1.5rem;
}

.action-verify {
    background-color: var(--bs-success); /* Green */
    justify-content: flex-end; /* Button on the right */
    padding-right: 1.5rem;
}

/* The card that actually moves */
.swipe-item {
    position: relative;
    background-color: white;
    z-index: 2; /* Sits IN FRONT of the buttons */
    transition: transform 0.3s ease-in-out;
}

/* Transform classes applied via Vue */
.swiped-left {
    transform: translateX(-80px); /* Moves left, reveals right (Green) */
}

.swiped-right {
    transform: translateX(80px); /* Moves right, reveals left (Red) */
}

/* Utilities */
.cursor-pointer {
    cursor: pointer;
}

.message-col {
    line-height: 110%;
    align-content: center;
    text-align: center !important;
    padding: 0.2rem 0;
    font-size: 26px;
    color: var(--bs-dark);
}
</style>