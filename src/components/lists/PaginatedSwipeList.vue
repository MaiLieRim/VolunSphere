<script setup>
import { ref, computed, watch } from 'vue';

const props = defineProps({
    items: { type: Array, required: true },
    emptyMessage: { type: String, default: 'Keine Einträge gefunden.' },
    allowSwipe: { type: Boolean, default: true }
});

const emit = defineEmits(['swipeLeft', 'swipeRight']);

const loadedItemsCount = ref(3);

// Reset pagination when items change
watch(() => props.items, () => {
    loadedItemsCount.value = 3;
});

const visibleItems = computed(() => props.items.slice(0, loadedItemsCount.value));

const toggleLoadMore = () => loadedItemsCount.value += 3;
const showLess = () => loadedItemsCount.value = 3;

// --- Status Badge Helper ---
const getStatusBadge = (status) => {
    if (status === 'Certified' || status === 'Confirmed') {
        return { class: 'bg-success text-white', text: 'Bestätigt' };
    } else if (status === 'Declined') {
        return { class: 'bg-danger text-white', text: 'Abgelehnt' };
    }
    return { class: 'hidden', text: '' };
};

// --- Gmail-style Swipe Logic ---
const activeSwipeIndex = ref(null);
const currentOffset = ref(0);
const startX = ref(0);
const startY = ref(0);
const isSwiping = ref(false);
const isScrolling = ref(false);
const SWIPE_THRESHOLD = 120;

const startTouch = (event, index) => {
    if (!props.allowSwipe) return;
    startX.value = event.touches[0].clientX;
    startY.value = event.touches[0].clientY;
    activeSwipeIndex.value = index;
    currentOffset.value = 0;
    isSwiping.value = true;
    isScrolling.value = false;
};

const moveTouch = (event, index) => {
    if (!isSwiping.value || activeSwipeIndex.value !== index || !props.allowSwipe) return;

    const diffX = event.touches[0].clientX - startX.value;
    const diffY = event.touches[0].clientY - startY.value;

    if (Math.abs(diffY) > Math.abs(diffX) && Math.abs(currentOffset.value) < 20) {
        isScrolling.value = true;
    }
    if (!isScrolling.value) {
        currentOffset.value = diffX;
    }
};

const endTouch = (index, item) => {
    if (!isSwiping.value || activeSwipeIndex.value !== index) return;
    isSwiping.value = false;

    if (currentOffset.value > SWIPE_THRESHOLD) {
        currentOffset.value = window.innerWidth;
        setTimeout(() => { emit('swipeRight', item); resetSwipe(); }, 300);
    } else if (currentOffset.value < -SWIPE_THRESHOLD) {
        currentOffset.value = -window.innerWidth;
        setTimeout(() => { emit('swipeLeft', item); resetSwipe(); }, 300);
    } else {
        currentOffset.value = 0;
        setTimeout(resetSwipe, 300);
    }
};
// Check if the item is still open/pending
const isPending = (status) => {
    return !status || status === 'Pending' || status === 'Requested';
};
const resetSwipe = () => {
    activeSwipeIndex.value = null;
    currentOffset.value = 0;
};

const getSwipeStyle = (index) => activeSwipeIndex.value === index ? { transform: `translateX(${currentOffset.value}px)` } : { transform: 'translateX(0px)' };
const getDirection = (index) => activeSwipeIndex.value === index ? (currentOffset.value > 0 ? 'right' : currentOffset.value < 0 ? 'left' : null) : null;
const getBackgroundClass = (index) => getDirection(index) === 'right' ? 'bg-danger' : getDirection(index) === 'left' ? 'bg-success' : 'bg-light';
</script>

<template>
    <div class="list-group list-group-flush" style="overflow-x: hidden;">
        <div v-for="(item, index) in visibleItems" :key="item.id || index" class="list-group-item text-decoration-none">
            <div class="list-group-item-container" :class="getBackgroundClass(index)">
                
                <div class="action-background action-delete" :style="{ opacity: getDirection(index) === 'right' ? 1 : 0 }">
                    <i class="bi bi-trash text-white fs-1"></i>
                </div>
                <div class="action-background action-verify" :style="{ opacity: getDirection(index) === 'left' ? 1 : 0 }">
                    <i class="bi bi-check2-circle text-white fs-1"></i>
                </div>

                <div class="list-group-item list-group-item-action align-content-stretch d-flex swipe-item"
                    :class="{ 'is-animating': !isSwiping || activeSwipeIndex !== index }"
                    :style="getSwipeStyle(index)" @touchstart="startTouch($event, index)"
                    @touchmove="moveTouch($event, index)" @touchend="endTouch(index, item)">

                    <div class="date-box col-3">
                        <small>{{ item.club }}</small>
                        <h1>{{ item.hours }}</h1>
                        <small>Stunden</small>
                    </div>

                    <RouterLink :to="{ name: 'reviewverification', params: { itemId: item.id } }" class="text-decoration-none container col-8 h-100 py-1">
                        <div >
                            <div class="d-flex justify-content-between align-items-center mb-1">
                                <small class="opacity-50 text-truncate pe-2">{{ item.club }}</small>
                                <span class="badge rounded-pill" :class="getStatusBadge(item.status).class" style="font-size: 0.7rem;">
                                    {{ getStatusBadge(item.status).text }}
                                </span>
                            </div>
                            <h5 class="fw-bold mb-1 text-dark">{{ item.title }}</h5>
                        </div>
                        <div class="action d-flex align-items-center pt-2 pb-2 text-muted gap-6">
                            <small class="col-8 d-flex align-items-center">
                                <img src="/assets/images/profile-pictures/liselotte.png" alt="Profile" width="20" height="20" class="rounded-circle flex-shrink-0 me-2">
                                {{ item.requester }}
                            </small>
                        </div>
                    </RouterLink>
             
                  
                    <RouterLink v-if="isPending(item.status)" :to="{ name: 'chat', params: { name: item.requester } }" class="col-1 message-col">
                        <i class="bi bi-chat me-1"></i>
                    </RouterLink>
                </div>
            </div>
        </div>

        <div v-if="visibleItems.length === 0">
            <div class="list-group-item list-group-item-action border-0">
                <div class="text-center nav-item text-secondary m-4">{{ emptyMessage }}</div>
            </div>
        </div>

        <a v-if="loadedItemsCount < items.length" class="list-group-item list-group-item-action cursor-pointer border-0" @click.prevent="toggleLoadMore">
            <div class="text-center nav-item text-secondary m-2">mehr anzeigen</div>
        </a>
        <a v-if="loadedItemsCount > 3" class="list-group-item list-group-item-action cursor-pointer border-0" @click.prevent="showLess">
            <div class="text-center nav-item text-secondary m-2">weniger</div>
        </a>
    </div>
</template>

<style scoped>
.list-group-flush>.list-group-item { border-width: var(--bs-list-group-border-width) 0 0; }
.list-group-item { padding-left: 0; padding: 0.15rem !important; border-width: 0; }
.list-group-item-container { position: relative; overflow: hidden; transition: background-color 0.2s ease; }
.action-background { position: absolute; top: 0; bottom: 0; width: 100%; display: flex; align-items: center; z-index: 1; transition: opacity 0.2s ease; }
.action-delete { justify-content: flex-start; padding-left: 1.5rem; }
.action-verify { justify-content: flex-end; padding-right: 1.5rem; }
.swipe-item { position: relative; background-color: white; z-index: 2; width: 100%; will-change: transform; }
.is-animating { transition: transform 0.3s cubic-bezier(0.2, 0.8, 0.2, 1); }
.cursor-pointer { cursor: pointer; }
.message-col { line-height: 110%; align-content: center; text-align: center !important; padding: 0.2rem 0; font-size: 26px; color: var(--bs-dark); }
</style>
