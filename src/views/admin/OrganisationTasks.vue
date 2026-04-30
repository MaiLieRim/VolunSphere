<template>
    <div>
        <Navbar title="Aufgabenverwaltung" />

        <div class="container bg-primary-subtle p-3 rounded-bottom-4 shadow-sm">
            <div class="d-flex justify-content-between align-items-center gap-2">

                <div class="d-flex bg-light rounded-pill p-1 border overflow-auto" style="flex-grow: 1;">
                    <button type="button" class="btn flex-fill rounded-pill btn-sm transition-all text-nowrap"
                        :class="{ 'bg-white shadow-sm fw-bold text-primary': timeframe === 'Woche', 'text-muted border-0': timeframe !== 'Woche' }"
                        @click="applyTimeframeShortcut('Woche')">Diese Woche</button>
                    <button type="button" class="btn flex-fill rounded-pill btn-sm transition-all text-nowrap"
                        :class="{ 'bg-white shadow-sm fw-bold text-primary': timeframe === 'Monat', 'text-muted border-0': timeframe !== 'Monat' }"
                        @click="applyTimeframeShortcut('Monat')">Dieser Monat</button>
                    <button type="button" class="btn flex-fill rounded-pill btn-sm transition-all text-nowrap"
                        :class="{ 'bg-white shadow-sm fw-bold text-primary': timeframe === 'Jahr', 'text-muted border-0': timeframe !== 'Jahr' }"
                        @click="applyTimeframeShortcut('Jahr')">Dieses Jahr</button>
                </div>

                <div class="d-flex align-items-center gap-2 flex-shrink-0">
                    <button class="btn btn-light text-secondary rounded-circle shadow-sm border"
                        style="width: 35px; height: 35px; padding: 0;" @click="resetFilters"
                        title="Filter zurücksetzen">
                        <i class="bi bi-arrow-counterclockwise"></i>
                    </button>

                    <button class="btn rounded-circle"
                        :class="isFilterOpen ? 'btn-primary text-white shadow-sm' : 'btn-light text-primary shadow-sm border'"
                        style="width: 35px; height: 35px; padding: 0;" @click="isFilterOpen = !isFilterOpen">
                        <i class="bi bi-funnel-fill"></i>
                    </button>
                </div>
            </div>

            <transition name="filter-accordion">
                <div v-show="isFilterOpen" class="pt-3">
                    <label class="text-dark fw-bold small mb-2">Zeitraum</label>
                    <div class="row g-2 mb-3">
                        <div class="col-6 form-floating">
                            <input type="date" class="form-control bg-light border-0 rounded-3 text-dark px-3"
                                id="dateFrom" v-model="filters.dateFrom" @change="handleManualDateChange">
                            <label for="dateFrom" class="text-muted ms-2">Von</label>
                        </div>
                        <div class="col-6 form-floating">
                            <input type="date" class="form-control bg-light border-0 rounded-3 text-dark px-3"
                                id="dateTo" v-model="filters.dateTo" @change="handleManualDateChange">
                            <label for="dateTo" class="text-muted ms-2">Bis</label>
                        </div>
                    </div>

                    <label class="text-dark fw-bold small mb-2">Filter</label>
                    <div class="row g-2 mb-4">
                        <div class="col-md-6">
                            <select class="form-select bg-light border-0 rounded-pill text-dark px-3 py-2"
                                v-model="filters.category">
                                <option value="Alle Kategorien">Alle Kategorien</option>
                                <option v-for="category in categoryOptions" :key="category">{{ category }}</option>
                            </select>
                        </div>
                        <div class="col-md-6">
                            <input type="text" class="form-control bg-light border-0 rounded-pill text-dark px-3 py-2"
                                placeholder="Titel, Ort oder Organisation" v-model="filters.search" />
                        </div>
                    </div>

                    <button
                        class="btn btn-outline-primary w-100 rounded-pill py-2 d-flex align-items-center justify-content-center fw-medium"
                        @click="isFilterOpen = false"> <i class="bi bi-funnel-fill me-2 fs-5"></i> Filter anwenden
                    </button>
                </div>
            </transition>
        </div>

        <main class="content-container pt-4">
            <div class="d-flex  justify-content-between align-items-start gap-3 mb-4">
                <h2 class="text-center d-flex align-self-bottom ">Alle Aufgaben</h2>

                <div class="d-flex  gap-2 flex-wrap">
                    <button class="btn btn-primary shadow-sm" @click="openCreateTask">
                        <i class="bi bi-plus-lg me-1"></i> Neue Aufgabe
                    </button>
                </div>

            </div>

            <div v-if="filteredTasks.length === 0" class="card shadow-sm rounded-4 p-4 text-center border-0 bg-light">
                <p class="mb-0 text-muted">Keine Aufgaben gefunden. Erstellen Sie eine neue Aufgabe oder passen Sie die
                    Filter an.</p>
            </div>

            <div v-else class="list-group shadow-sm rounded-4 mb-4 border-0">
                <div v-for="task in filteredTasks" :key="task.id"
                    class="list-group-item list-group-item-action border-0 border-bottom p-3 position-relative bg-white">

                    <div class="d-flex justify-content-between align-items-start">

                        <div class="pe-3 w-100">
                            <div class="d-flex align-items-center mb-1 gap-2">
                                <span v-if="task.occupationalCategory" class="badge bg-light text-dark border fw-normal"
                                    style="font-size: 0.7rem;">
                                    {{ task.occupationalCategory }}
                                </span>
                            </div>

                            <h5 class="fw-bold text-dark mb-2 lh-sm text-break pr-4">
                                {{ task.title }}
                            </h5>

                            <div class="d-flex flex-wrap gap-3 text-muted" style="font-size: 0.85rem;">
                                <span v-if="task.jobStartDate || task.datePosted" class="d-flex align-items-center">
                                    <i class="bi bi-calendar3 me-1 text-primary"></i>
                                    {{ formatDate(task.jobStartDate || task.datePosted) }}
                                </span>
                                <span v-if="task.location" class="d-flex align-items-center text-truncate"
                                    style="max-width: 150px;">
                                    <i class="bi bi-geo-alt me-1 text-primary"></i>
                                    {{ task.location }}
                                </span>
                            </div>
                        </div>

                        <div class="dropdown flex-shrink-0">
                            <button class="btn btn-link text-muted p-0 text-decoration-none action-menu-btn hide-caret"
                                type="button" data-bs-toggle="dropdown" aria-expanded="false">
                                <i class="bi bi-three-dots-vertical fs-5"></i>
                            </button>

                            <ul class="dropdown-menu dropdown-menu-end shadow border-0 rounded-3 mt-1">
                                <li>
                                    <button class="dropdown-item py-2 d-flex align-items-center" type="button"
                                        @click="editTask(task)">
                                        <i class="bi bi-pencil text-muted me-3"></i>Bearbeiten
                                    </button>
                                </li>
                                <li>
                                    <button class="dropdown-item py-2 d-flex align-items-center text-danger"
                                        type="button" @click="confirmDelete(task)">
                                        <i class="bi bi-trash text-danger me-3"></i>Löschen
                                    </button>
                                </li>
                            </ul>
                        </div>
                    </div>

                </div>
            </div>

            <div class="d-flex justify-content-between align-items-center mb-5">
                <small class="text-muted fw-medium">Gesamt: {{ filteredTasks.length }} Aufgaben</small>
            </div>
        </main>

        <Footer />
    </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import Navbar from '@/components/navbars/Navbar.vue';
import Footer from '@/components/common/Footer.vue';
import { useTaskApi } from '@/assets/js/taskApi';
import { useTasks } from '@/composables/useTasks';
import tasks from '@/assets/data/tasks.json';
import admin from '@/assets/data/admin.json';

const router = useRouter();
const { getTasks, getDeletedTaskIds, updateTask, deleteTask } = useTaskApi();
const { refreshTasks } = useTasks();

const tasksArray = Array.isArray(tasks) ? tasks : tasks.itemListElement || [];
const userRole = localStorage.getItem('userRole') || 'volunteer';
const organisationName = userRole === 'admin' ? admin.worksFor?.name || 'Freiwillige Feuerwehr Fakehausen' : '';

// --- Form Variable Fallback (sofern sie in der Komponente noch irgendwo benötigt wird) ---
const form = ref({ title: '', club: '', description: '', jobStartDate: '' });

const filters = ref({
    search: '',
    category: 'Alle Kategorien',
    dateFrom: '',
    dateTo: ''
});
const isFilterOpen = ref(false);
const timeframe = ref('Monat');

const taskList = ref([]);

const categoryOptions = computed(() => {
    const categories = new Set(taskList.value.map(task => task.occupationalCategory).filter(Boolean));
    return Array.from(categories).sort();
});

const filteredTasks = computed(() => {
    return taskList.value.filter(task => {
        const search = filters.value.search.toLowerCase().trim();
        const matchesSearch = !search || [task.title, task.club, task.location, task.occupationalCategory]
            .some(value => String(value || '').toLowerCase().includes(search));

        const matchesCategory = filters.value.category === 'Alle Kategorien' || task.occupationalCategory === filters.value.category;

        const matchesFrom = !filters.value.dateFrom || new Date(task.jobStartDate || task.datePosted) >= new Date(filters.value.dateFrom);
        const matchesTo = !filters.value.dateTo || new Date(task.jobStartDate || task.datePosted) <= new Date(filters.value.dateTo);

        return matchesSearch && matchesCategory && matchesFrom && matchesTo;
    });
});

const applyTimeframeShortcut = (type) => {
    timeframe.value = type;
    const today = new Date();
    if (type === 'Woche') {
        const day = today.getDay() || 7;
        const monday = new Date(today);
        monday.setDate(today.getDate() - day + 1);
        const sunday = new Date(monday);
        sunday.setDate(monday.getDate() + 6);
        filters.value.dateFrom = monday.toISOString().split('T')[0];
        filters.value.dateTo = sunday.toISOString().split('T')[0];
    } else if (type === 'Monat') {
        const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
        const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);
        filters.value.dateFrom = firstDay.toISOString().split('T')[0];
        filters.value.dateTo = lastDay.toISOString().split('T')[0];
    } else if (type === 'Jahr') {
        const firstDay = new Date(today.getFullYear(), 0, 1);
        const lastDay = new Date(today.getFullYear(), 11, 31);
        filters.value.dateFrom = firstDay.toISOString().split('T')[0];
        filters.value.dateTo = lastDay.toISOString().split('T')[0];
    }
};

const handleManualDateChange = () => {
    timeframe.value = 'Custom';
};

const formatDate = (value) => {
    if (!value) return '';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;
    return date.toLocaleDateString('de-AT', { day: '2-digit', month: '2-digit', year: 'numeric' });
};

const mapTask = (job) => ({
    id: job.identifier?.value || job.id || String(Date.now()),
    title: job.title || job.name || '',
    description: job.description || '',
    occupationalCategory: job.occupationalCategory || job.category || '',
    industry: job.industry || '',
    location: job.jobLocation?.address?.addressLocality || job.location || '',
    club: job.hiringOrganization?.name || job.club || '',
    datePosted: job.datePosted || '',
    validThrough: job.validThrough || '',
    address: job.jobLocation?.address || job.address || {},
    jobStartDate: job.jobStartDate || job.startDate || '',
    startTime: job.startTime || '',
    isFullDay: job.isFullDay || false,
    skills: Array.isArray(job.skills) ? job.skills.join(', ') : job.skills || '',
    requirements: Array.isArray(job.requirements) ? job.requirements.join(', ') : job.requirements || ''
});

const buildTaskList = () => {
    const deletedIds = getDeletedTaskIds();
    const customTasks = getTasks().map(mapTask);
    const staticTasks = tasksArray.map(mapTask);

    const customById = new Map(customTasks.map(task => [task.id, task]));
    const staticById = new Map(staticTasks.map(task => [task.id, task]));

    const merged = [];

    staticTasks.forEach(task => {
        if (deletedIds.includes(task.id)) {
            return;
        }
        merged.push(customById.get(task.id) || task);
    });

    customTasks.forEach(task => {
        if (!staticById.has(task.id)) {
            merged.push(task);
        }
    });

    taskList.value = organisationName
        ? merged.filter(task => task.club === organisationName)
        : merged;
};

const resetFilters = () => {
    filters.value = {
        search: '',
        category: 'Alle Kategorien',
        dateFrom: '',
        dateTo: ''
    };
    timeframe.value = 'Monat'; // Fallback oder aktueller View nach Reset
    applyTimeframeShortcut('Monat'); // Optional, um direkt wieder den Monat zu laden
};

const openCreateTask = () => {
    router.push({ name: 'addtask', query: { returnTo: '/organisation-tasks' } });
};

const editTask = (task) => {
    router.push({ name: 'addtask', query: { taskId: task.id, returnTo: '/organisation-tasks' } });
};

const confirmDelete = async (task) => {
    if (!window.confirm(`Aufgabe "${task.title}" wirklich löschen?`)) {
        return;
    }
    const result = await deleteTask(task.id);
    if (result.success) {
        buildTaskList();
        refreshTasks();
    }
};

const isFormValid = computed(() => {
    return form.value.title.trim() !== '' && form.value.club.trim() !== '' && form.value.description.trim() !== '' && form.value.jobStartDate !== '';
});

buildTaskList();
</script>

<style scoped>
.modal-backdrop {
    z-index: 1040;
}

.modal-dialog {
    z-index: 1050;
}

/* Animations für den Filter Dropdown */
.filter-accordion-enter-active,
.filter-accordion-leave-active {
    transition: all 0.3s ease;
    overflow: hidden;
}

.filter-accordion-enter-from,
.filter-accordion-leave-to {
    opacity: 0;
    transform: translateY(-10px);
    max-height: 0;
}

.filter-accordion-enter-to,
.filter-accordion-leave-from {
    opacity: 1;
    transform: translateY(0);
    max-height: 400px;
}

/* Versteckt den hässlichen kleinen Bootstrap-Pfeil beim Dropdown */
.hide-caret::after {
    display: none !important;
}

/* Macht aus dem Link einen sauberen, runden Icon-Button ohne störende Outlines */
.action-menu-btn {
    width: 35px;
    height: 35px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    transition: all 0.2s ease-in-out;
}

.action-menu-btn:hover,
.action-menu-btn:focus {
    background-color: #f8f9fa;
    color: #212529 !important;
    outline: none;
    box-shadow: none;
}

/* Entfernt den untersten Rand der Liste, damit es in der runden Card gut aussieht */
.list-group-item:last-child {
    border-bottom: none !important;
}
</style>