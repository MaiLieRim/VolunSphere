<template>
    <Navbar title="Organisationssuche"  :backRoute="{ name: 'profile', query: { tab: 'org' } }" />

    <nav class="navbar bg-primary position-relative z-3 shadow">
        <div class="container py-1">
            <form class="d-flex w-100" role="search" @submit.prevent>
                <input class="form-control" type="search" placeholder="Organisation suchen ..." aria-label="Search" v-model="searchQuery" />
                <button type="submit" class="btn"><i class="bi bi-search text-light"></i></button>
            </form>
        </div>
    </nav>

    <nav class="navbar bg-primary border-bottom">
        <div class="container d-flex justify-content-between align-items-center">
            <button class="btn btn-link text-light d-flex align-items-center p-0" @click="openFilter">
                <i class="bi bi-funnel me-2"></i>
                <span>Filter</span>
            </button>

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
            <h3 >Suchergebnisse</h3>
            <ul class="mb-0 tags gap-2 d-flex flex-wrap m-0 p-0" style="list-style: none;">
                <li v-for="filter in activeFilters" :key="filter.key"
                    class="btn badge bg-light text-dark shadow-sm border" @click="removeFilter(filter.key)">
                    {{ filter.label }} &times;
                </li>
            </ul>
        </div>

        <OrganisationList :search="true" :items="filteredOrgs" class="mt-2" />
        
    </div>

    <div v-else-if="currentView === 'CalendarView'" class="content-container">
        <div class="text-center text-muted mt-5 py-5 border rounded-4 border-dashed bg-light">
            <i class="bi bi-calendar-x fs-1 opacity-50 mb-2 d-block"></i>
            Kalenderansicht für Organisationen in Arbeit.
        </div>
    </div>
    
    <div v-else-if="currentView === 'MapView'" class="content-container">
        <div class="text-center text-muted mt-5 py-5 border rounded-4 border-dashed bg-light">
            <i class="bi bi-map fs-1 opacity-50 mb-2 d-block"></i>
            Kartenansicht für Organisationen in Arbeit.
        </div>
    </div>

    <Footer />
</template>

<script setup>
import { ref, computed } from 'vue';
import Navbar from '@/components/navbars/Navbar.vue';
import Footer from '@/components/Footer.vue';

// NEU: Importiere die OrganisationList Komponente
import OrganisationList from '@/components/OrganisationList.vue';

import organizations from "@/assets/data/organisations.json";

// --- State ---
const currentView = ref('ListView');
const searchQuery = ref('');

const filters = ref({
    category: ''
});

// --- Methods ---
const setView = (view) => {
    currentView.value = view;
};

const buttonClass = (view) => 
    currentView.value === view ? 'text-light fw-bold' : 'text-white-50';

const openFilter = () => {
    alert('Filter-Modal öffnen');
};

const removeFilter = (key) => {
    filters.value[key] = '';
};

// --- Computed ---
const activeFilters = computed(() => {
    const result = [];
    if (filters.value.category) {
        result.push({ key: 'category', label: filters.value.category });
    }
    return result;
});

// --- Such-Logik ---
const enrichedOrgs = organizations.map(org => ({
    ...org,
    category: org.category || ['Umwelt', 'Bildung', 'Einsatzorganisationen', 'Soziales'][Math.floor(Math.random() * 4)],
    memberCount: org.member?.length || Math.floor(Math.random() * 100) + 10
}));

const filteredOrgs = computed(() => {
    let query = searchQuery.value.toLowerCase().trim();
    if (!query && !filters.value.category) return enrichedOrgs;
    
    return enrichedOrgs.filter(org => {
        const name = (org.name || '').toLowerCase();
        const category = (org.category || '').toLowerCase();
        const city = (org.address?.city || '').toLowerCase();
        
        const matchesQuery = !query || name.includes(query) || category.includes(query) || city.includes(query);
        const matchesFilter = !filters.value.category || category === filters.value.category.toLowerCase();
        
        return matchesQuery && matchesFilter;
    });
});
</script>

<style scoped>
.border-dashed {
    border-style: dashed !important;
}
.form-control:focus {
    box-shadow: none;
    border-color: rgba(255,255,255,0.5);
}
.form-control::placeholder {
    color: rgba(255,255,255,0.7);
}
</style>