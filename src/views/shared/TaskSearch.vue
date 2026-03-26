<script setup>
import { ref, computed, onMounted } from 'vue'
import Footer from '@/components/Footer.vue'
import Navbar from '@/components/navbars/Navbar.vue'
import TaskList from '@/components/TaskList.vue'
import FilterModal from '@/components/popup/Filter.vue'
import { useTasks } from '@/composables/useTasks'
import MapView from '@/components/TaskSearch/MapView.vue'
import CalendarView from '@/components/TaskSearch/CalendarView.vue'
import { useRoute } from "vue-router";
const route = useRoute()
const { allTasks } = useTasks()
const items = allTasks

const currentView = ref('list')
const filterModalRef = ref(null)
const today = new Date().toISOString().split('T')[0]

// Parent filters (displayed on badges)
const filters = ref({
    area: '',
    organization: '',
    distance: '',
    duration: '',
    from: today,
    to: ''
})
onMounted(() => {
    const tab = route.query.tab
    if (tab === 'MapView' || tab === 'ListView' || tab === 'CalendarView') {
        currentView.value = tab
    }
})
// Open modal
const openFilter = () => filterModalRef.value.open()

// View switch
const setView = (view) => (currentView.value = view)
const buttonClass = (view) =>
    currentView.value === view ? 'text-light fw-bold' : 'text-white-50'

// Only show active filters (ignore defaults)
const activeFilters = computed(() => {
    const result = []
    if (filters.value.area) result.push({ key: 'area', label: filters.value.area })
    if (filters.value.organization) result.push({ key: 'organization', label: filters.value.organization })
    if (filters.value.distance) result.push({ key: 'distance', label: filters.value.distance })
    if (filters.value.duration) result.push({ key: 'duration', label: filters.value.duration })

    // Only show date filter if it differs from default
    const isDateActive = filters.value.from !== today || filters.value.to !== ''
    if (isDateActive) {
        result.push({ key: 'date', label: `${filters.value.from || '-'} - ${filters.value.to || '-'}` })
    }
    return result
})

// Remove filter
const removeFilter = (key) => {
    switch (key) {
        case 'area':
        case 'organization':
        case 'distance':
        case 'duration':
            filters.value[key] = ''
            break
        case 'date':
            filters.value.from = today
            filters.value.to = ''
            break
    }
}

// Apply new filters from modal
const updateFilters = (newFilters) => {
    filters.value = { ...newFilters }
}
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
                <li v-for="filter in activeFilters" :key="filter.key" class="btn badge bg-light text-dark shadow-sm border"
                    @click="removeFilter(filter.key)">
                    {{ filter.label }} &times;
                </li>
            </ul>
        </div>

        <TaskList title="" :tasks="items" />
    </div>

    <div v-else-if="currentView === 'CalendarView'" class="content-container">
        <div class="d-flex justify-content-end  ">
            <ul class=" tags gap-2 d-flex flex-wrap">
                <li v-for="filter in activeFilters" :key="filter.key" class="btn badge bg-light text-dark shadow-sm border"
                    @click="removeFilter(filter.key)">
                    {{ filter.label }} &times;
                </li>
            </ul>
        </div>
        
        <CalendarView :tasks="items" @taskClicked="handleTaskClick" />
    </div>

   <div v-else class="position-relative w-100 h-100">
        <div class="position-absolute top-0 end-0 p-3" style="z-index: 1000; pointer-events: none;">
            <ul class="mb-0 me-4 mt-2 tags gap-2 d-flex justify-content-end flex-wrap">
                <li v-for="filter in activeFilters" :key="filter.key" 
                    class="btn badge bg-light text-dark shadow-sm border"
                    style="pointer-events: auto;"
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

.content-container {
    padding-left: 0 !important;
    padding-right: 0 !important;
}
</style>