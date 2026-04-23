<script setup>
import { ref, computed, watch } from 'vue';

const props = defineProps({
    items: { type: Array, required: true },
    emptyMessage: { type: String, default: 'Keine Einträge gefunden.' },
    allowSwipe: { type: Boolean, default: true }
});

// NEU: 'showDetails' hinzugefügt, 'deleteTask' entfernt
const emit = defineEmits(['requestVerification', 'showDetails']);

const loadedItemsCount = ref(3);

watch(() => props.items, () => {
    loadedItemsCount.value = 3;
});

const visibleItems = computed(() => props.items.slice(0, loadedItemsCount.value));

const toggleLoadMore = () => loadedItemsCount.value += 3;
const showLess = () => loadedItemsCount.value = 3;

// --- Status Badge Helper ---
const getStatusBadge = (status) => {
    if (status === 'verified') {
        return { class: 'bg-success text-white', text: 'Bestätigt', icon: 'bi-check-circle' };
    } else if (status === 'pending') {
        return { class: 'bg-warning text-dark', text: 'Angefragt', icon: 'bi-hourglass-split' };
    }
    return { class: 'd-none', text: '', icon: '' }; 
};

// --- Swipe Logic ---
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
    const item = visibleItems.value[index];

    if (Math.abs(diffY) > Math.abs(diffX) && Math.abs(currentOffset.value) < 20) {
        isScrolling.value = true;
    }
    
    if (!isScrolling.value) {
        // NEU: Wischen nach RECHTS blockieren (max 15px bounce)
        if (diffX > 0) {
            currentOffset.value = Math.min(diffX, 15);
        }
        // Wischen nach LINKS blockieren, wenn bereits angefragt/bestätigt (max -15px bounce)
        else if (diffX < 0 && item.verifiedStatus) {
            currentOffset.value = Math.max(diffX, -15);
        } 
        // Normales Wischen nach links erlauben
        else {
            currentOffset.value = diffX;
        }
    }
};

const endTouch = (index, item) => {
    if (!isSwiping.value || activeSwipeIndex.value !== index) return;
    isSwiping.value = false;

    // Nur noch Swipe Left (Nachweis anfragen) überprüfen
    if (currentOffset.value < -SWIPE_THRESHOLD) {
        currentOffset.value = -window.innerWidth;
        setTimeout(() => { emit('requestVerification', item); resetSwipe(); }, 300);
    } else {
        currentOffset.value = 0;
        setTimeout(resetSwipe, 300);
    }
};

const resetSwipe = () => {
    activeSwipeIndex.value = null;
    currentOffset.value = 0;
};

const getSwipeStyle = (index) => activeSwipeIndex.value === index ? { transform: `translateX(${currentOffset.value}px)` } : { transform: 'translateX(0px)' };
const getDirection = (index) => activeSwipeIndex.value === index ? (currentOffset.value > 0 ? 'right' : currentOffset.value < 0 ? 'left' : null) : null;

// Background Color Logic (Nur noch gelb für Swipe Left)
const getBackgroundClass = (index) => getDirection(index) === 'left' ? 'bg-warning' : 'bg-light';
</script>

<template>
    <div class="list-group list-group-flush" style="overflow-x: hidden;">
        <RouterLink :to="{ name: 'verification', params: { itemId: item.id } }"  v-for="(item, index) in visibleItems" :key="item.id || index" class="list-group-item text-decoration-none">
            
            <div class="list-group-item-container" :class="getBackgroundClass(index)">
                
                <div class="action-background action-verify" :style="{ opacity: getDirection(index) === 'left' ? 1 : 0 }">
                    <span class="text-dark fw-bold fs-6">Nachweis anfragen</span>
                </div>

                <div class="list-group-item list-group-item-action align-content-stretch d-flex swipe-item cursor-pointer"
                    :class="{ 'is-animating': !isSwiping || activeSwipeIndex !== index }"
                    :style="getSwipeStyle(index)" 
                    @touchstart="startTouch($event, index)"
                    @touchmove="moveTouch($event, index)" 
                    @touchend="endTouch(index, item)"
                    @click="emit('showDetails', item)"> <div class="date-box col-3">
                        <small class="text-truncate px-1 d-block w-100 text-center">{{ item.club }}</small>
                        <h1>{{ item.hours }}</h1>
                        <small>Stunden</small>
                    </div>

                    <div class="container col-9 h-100 py-1">
                        <div>
                            <div class="d-flex justify-content-between align-items-center mb-1">
                                <small class="opacity-50 text-truncate pe-2">{{ item.club }}</small>
                                
                                <span class="badge rounded-pill" :class="getStatusBadge(item.verifiedStatus).class" style="font-size: 0.7rem;">
                                    <i v-if="getStatusBadge(item.verifiedStatus).icon" :class="getStatusBadge(item.verifiedStatus).icon" class="me-1"></i>
                                    {{ getStatusBadge(item.verifiedStatus).text }}
                                </span>
                            </div>
                            <h5 class="fw-bold mb-1 text-dark">{{ item.title }}</h5>
                        </div>
                        
                        <div class="action d-flex align-items-center pt-2 pb-2 text-muted gap-6">
                            <small class="col-12 d-flex align-items-center">
                                <i class="bi bi-calendar-event me-2"></i>
                                {{ item.date }}
                            </small>
                        </div>
                    </div>
                </div>
            </div>
        </RouterLink>

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

/* Die Klasse action-delete wurde entfernt */
.action-verify { justify-content: flex-end; padding-right: 1.5rem; }

.swipe-item { position: relative; background-color: white; z-index: 2; width: 100%; will-change: transform; }
.is-animating { transition: transform 0.3s cubic-bezier(0.2, 0.8, 0.2, 1); }
.cursor-pointer { cursor: pointer; }
.date-box { display: flex; flex-direction: column; justify-content: center; align-items: center; border-right: 1px solid var(--bs-border-color); }
.date-box h1 { margin-bottom: 0; line-height: 1; }
</style>