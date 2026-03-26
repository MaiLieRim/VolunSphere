<script setup>
// --- Vue & Router Imports ---
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from "vue-router"

// --- Component Imports ---
import Footer from '@/components/Footer.vue'
import Navbar from '@/components/navbars/Navbar.vue'
import TaskList from '@/components/TaskList.vue'
import FilterModal from '@/components/popup/Filter.vue'
import MapView from '@/components/TaskSearch/MapView.vue'
import CalendarView from '@/components/TaskSearch/CalendarView.vue'

// --- Composables ---
import { useTasks } from '@/composables/useTasks'

// --- Setup ---
const route = useRoute()
const router = useRouter()
const { allTasks } = useTasks()

// --- State ---
const currentView = ref('ListView')
const filterModalRef = ref(null)
const today = new Date().toISOString().split('T')[0]

// Filter State
const filters = ref({
    area: '',
    organization: '',
    distance: '',
    duration: '',
    from: today,
    to: ''
})

// --- Lifecycle ---
onMounted(() => {
    const validViews = ['MapView', 'ListView', 'CalendarView']
    if (validViews.includes(route.query.tab)) {
        currentView.value = route.query.tab
    }
})

// --- Methods ---

// View Management
const setView = (view) => {
    currentView.value = view
    router.replace({ query: { ...route.query, tab: view } })
}

const buttonClass = (view) => 
    currentView.value === view ? 'text-light fw-bold' : 'text-white-50'

// Filter Management
const openFilter = () => filterModalRef.value.open()

const updateFilters = (newFilters) => {
    filters.value = { ...newFilters }
}

const removeFilter = (key) => {
    if (key === 'date') {
        filters.value.from = today
        filters.value.to = ''
    } else {
        filters.value[key] = ''
    }
}


// --- Computed ---
const activeFilters = computed(() => {
    const result = []
    
    // Simple key-value mapping for standard filters
    const keysToCheck = ['area', 'organization', 'distance', 'duration']
    keysToCheck.forEach(key => {
        if (filters.value[key]) {
            result.push({ key, label: filters.value[key] })
        }
    })

    // Special logic for dates
    if (filters.value.from !== today || filters.value.to !== '') {
        result.push({ 
            key: 'date', 
            label: `${filters.value.from || '-'} - ${filters.value.to || '-'}` 
        })
    }
    
    return result
})
</script>

<template>
    <Navbar title="Aufgaben Suche" />

    <nav class="navbar bg-primary position-relative z-3 shadow">
        <div class="container py-1">
            <form class="d-flex w-100" role="search">
                <input class="form-control" type="search" placeholder="Aufgabe suchen ..." aria-label="Search" />
                <button type="submit" class="btn"><i class="bi bi-search text-light"></i></button>
            </form>
        </div>
    </nav>

    <nav class="navbar bg-primary border-bottom">
        <div class="container d-flex justify-content-between align-items-center">
            <!-- Filter button -->
            <button class="btn btn-link text-light d-flex align-items-center p-0" @click="openFilter">
                <i class="bi bi-funnel me-2"></i>
                <span>Filter</span>
            </button>

            <!-- Filter modal -->
            <FilterModal ref="filterModalRef" :initialFilters="filters" @applyFilters="updateFilters" />

            <!-- View switch -->
            <div class="d-flex align-items-center gap-2">
                <button class="btn btn-link p-1" @click="setView('ListView')" :class="buttonClass('ListView')">
                    <i class="bi bi-list-ul"></i>
                </button>
                <button class="btn btn-link p-1" @click="setView('CalendarView')" :class="buttonClass('CalendarView')">
                    <i class="bi bi-calendar4-week"></i>
                </button>
                <button class="btn btn-link p-1" @click="setView('MapView')" :class="buttonClass('MapView')">
                    <i class="bi bi-map"></i>
                </button>
            </div>
        </div>
    </nav>


    <div class="content-container" v-if="currentView === 'ListView'">
        <div class="d-flex justify-content-between align-items-center">
            <h2>Suchergebnisse</h2>
            <ul class="mb-3 tags gap-2 d-flex flex-wrap">
                <li v-for="filter in activeFilters" :key="filter.key"
                    class="btn badge bg-light text-dark shadow-sm border" @click="removeFilter(filter.key)">
                    {{ filter.label }} &times;
                </li>
            </ul>
        </div>

        <TaskList title="" :tasks="allTasks" />
    </div>

    <div v-else-if="currentView === 'CalendarView'" class="content-container">
        <div class="d-flex justify-content-end  ">
            <ul class=" tags gap-2 d-flex flex-wrap">
                <li v-for="filter in activeFilters" :key="filter.key"
                    class="btn badge bg-light text-dark shadow-sm border" @click="removeFilter(filter.key)">
                    {{ filter.label }} &times;
                </li>
            </ul>
        </div>

        <CalendarView :tasks="allTasks"/>
    </div>

    <div v-else class="position-relative w-100 h-100">
        <div class="position-absolute top-0 end-0 p-3" style="z-index: 1000; pointer-events: none;">
            <ul class="mb-0 me-4 mt-2 tags gap-2 d-flex justify-content-end flex-wrap">
                <li v-for="filter in activeFilters" :key="filter.key"
                    class="btn badge bg-light text-dark shadow-sm border" style="pointer-events: auto;"
                    @click="removeFilter(filter.key)">
                    {{ filter.label }} &times;
                </li>
            </ul>
        </div>

        <MapView />
    </div>


    <Footer />
</template>

<style>
.tags {
    padding-left: 0;
    display: flex;
    flex-flow: wrap;
}
</style>