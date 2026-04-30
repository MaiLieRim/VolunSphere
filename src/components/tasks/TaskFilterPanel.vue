<template>
    <div class="container bg-primary-subtle p-3 rounded-bottom-4 shadow-sm ">
        <div class="d-flex justify-content-between align-items-center ">
            <div class="d-flex bg-light rounded-pill p-1 border">
                <button class="btn flex-fill rounded-pill btn-sm transition-all"
                    :class="{ 'bg-white shadow-sm fw-bold text-primary': timeframe === 'Woche', 'text-muted border-0': timeframe !== 'Woche' }"
                    @click="applyTimeframeShortcut('Woche')">Diese Woche</button>
                <button class="btn flex-fill rounded-pill btn-sm transition-all"
                    :class="{ 'bg-white shadow-sm fw-bold text-primary': timeframe === 'Monat', 'text-muted border-0': timeframe !== 'Monat' }"
                    @click="applyTimeframeShortcut('Monat')">Dieser Monat</button>
                <button class="btn flex-fill rounded-pill btn-sm transition-all"
                    :class="{ 'bg-white shadow-sm fw-bold text-primary': timeframe === 'Jahr', 'text-muted border-0': timeframe !== 'Jahr' }"
                    @click="applyTimeframeShortcut('Jahr')">Dieses Jahr</button>
            </div>
            <button class="btn  rounded-circle  transition-all"
                :class="isFilterOpen ? 'btn-primary text-white shadow-sm' : 'btn-light text-primary'"
                @click="isFilterOpen = !isFilterOpen" style="width: 35px; height: 35px; padding: 0;">
                <i class="bi bi-funnel-fill"></i>
            </button>
        </div>
        <transition name="filter-accordion">
            <div v-show="isFilterOpen" class="pt-3">

                <label class="text-dark fw-bold small mb-2">Zeitraum</label>
                <div class="row g-2 mb-3">
                    <div class="col-6 form-floating">
                        <input type="date" class="form-control bg-light border-0 rounded-3 text-dark px-3" id="dateFrom"
                            v-model="filters.dateFrom" @change="handleManualDateChange">
                        <label for="dateFrom" class="text-muted ms-2">Von</label>
                    </div>
                    <div class="col-6 form-floating">
                        <input type="date" class="form-control bg-light border-0 rounded-3 text-dark px-3" id="dateTo"
                            v-model="filters.dateTo" @change="handleManualDateChange">
                        <label for="dateTo" class="text-muted ms-2">Bis</label>
                    </div>
                </div>

                <label class="text-dark fw-bold small mb-2">Kategorien</label>
                <div class="row g-2 mb-4">
                    <div class="col-12">
                        <select class="form-select bg-light border-0 rounded-pill text-dark px-3 py-2"
                            v-model="filters.organization">
                            <option>Alle Organisationen</option>
                            <option>Rotes Kreuz</option>
                            <option>Freiwillige Feuerwehr</option>
                        </select>
                    </div>
                    <div class="col-6">
                        <select class="form-select bg-light border-0 rounded-pill text-dark px-3 py-2"
                            v-model="filters.metric">
                            <option>Stunden</option>
                            <option>Einsätze</option>
                        </select>
                    </div>
                    <div class="col-6">
                        <select class="form-select bg-light border-0 rounded-pill text-dark px-3 py-2"
                            v-model="filters.type">
                            <option>Typen</option>
                            <option>Kompetenzen</option>
                        </select>
                    </div>
                </div>

                <button
                    class="btn btn-outline-primary w-100 rounded-pill py-2 d-flex align-items-center justify-content-center fw-medium"
                    @click="exportPDF">
                    <i class="bi bi-file-earmark-pdf me-2 fs-5"></i> PDF herunterladen
                </button>
            </div>
        </transition>

    </div>

    <div class="content-container">

        <div class="card border-0 shadow-sm rounded-4 mb-4">
            <div class="card border-0 shadow-sm rounded-4 mb-4">
                <div class="card-body p-4">

                    <div class="d-flex justify-content-between align-items-center mb-1">
                        <h4 class="fw-bold mb-0 text-dark">Aktivitäten</h4>
                        <div>
                            <i class="bi bi-zoom-in text-muted me-2 fs-4" style="cursor: pointer;"></i>
                            <i class="bi bi-zoom-out text-muted fs-4" style="cursor: pointer;"></i>
                        </div>
                    </div>

                    <p class="text-muted small mb-4">h / {{ timeframe }} (Gesamt: {{ currentTotalHours }})</p>

                    <div class="chart-placeholder d-flex align-items-end justify-content-between gap-2 mb-3"
                        style="height: 180px;">
                        <div v-for="(barHeight, index) in currentBars" :key="index"
                            class="w-100 rounded-top transition-all" :class="getBarClass(index)"
                            :style="{ height: barHeight + '%' }">
                        </div>
                    </div>

                    <div class="d-flex justify-content-between align-items-center text-muted"
                        style="font-size: 0.8rem;">
                        <button class="btn btn-sm btn-light rounded-circle"><i class="bi bi-chevron-left"></i></button>
                        <span class="fw-medium">{{ currentDateRange }}</span>
                        <button class="btn btn-sm btn-light rounded-circle"><i class="bi bi-chevron-right"></i></button>
                    </div>

                </div>
            </div>
        </div>

        <h5 class="fw-bold mb-3 ms-1 text-dark">Aufschlüsselung</h5>
        <div class="card border-0 shadow-sm rounded-4 mb-5">
            <div class="card-body p-3">
                <div class="list-group list-group-flush">

                    <div
                        class="list-group-item d-flex justify-content-between align-items-center border-0 px-2 py-3 mb-1 bg-light rounded-3">
                        <div class="d-flex align-items-center">
                            <div class="rounded-circle bg-info me-3" style="width: 12px; height: 12px;"></div>
                            <div>
                                <h5 class="mb-0 fw-bold text-dark">Veranstaltung</h5>
                                <small class="text-muted">Eventmanagement, Aufbauteam</small>
                            </div>
                        </div>
                        <span class="fw-bold fs-5 text-primary">20,25 h</span>
                    </div>

                    <div
                        class="list-group-item d-flex justify-content-between align-items-center border-0 px-2 py-3 bg-light rounded-3">
                        <div class="d-flex align-items-center">
                            <div class="rounded-circle bg-primary me-3" style="width: 12px; height: 12px;"></div>
                            <div>
                                <h5 class="mb-0 fw-bold text-dark">Bewerb</h5>
                                <small class="text-muted">Teilnahme & Vorbereitung</small>
                            </div>
                        </div>
                        <span class="fw-bold fs-5 text-primary">22,00 h</span>
                    </div>

                </div>
            </div>
        </div>

    </div>
</template>
<script setup>
import { ref, computed, onMounted } from 'vue';
import Navbar from '@/components/navbars/Navbar.vue';
import Footer from '@/components/common/Footer.vue';
// --- UI State ---
const isFilterOpen = ref(false);
const timeframe = ref('Monat'); // Standardmäßig ist "Monat" ausgewählt

// --- Filter State ---
const filters = ref({
    organization: 'Alle Organisationen',
    metric: 'Stunden',
    type: 'Typen',
    dateFrom: '',
    dateTo: ''
});

// --- Fake-Daten für das Balkendiagramm ---
const chartData = ref({
    Woche: {
        totalHours: '42,50',
        bars: [10, 30, 20, 60, 40, 80, 50] // Balkenhöhen in %
    },
    Monat: {
        totalHours: '185,00',
        bars: [40, 70, 50, 90, 60, 30, 45]
    },
    Jahr: {
        totalHours: '472,39',
        bars: [60, 40, 80, 50, 70, 90, 30]
    },
    Custom: {
        totalHours: '...',
        bars: [50, 50, 50, 50, 50, 50, 50]
    }
});

// --- Reaktive Variablen für das Template ---
// Diese aktualisieren das Diagramm automatisch, wenn sich timeframe ändert!
const currentBars = computed(() => chartData.value[timeframe.value].bars);
const currentTotalHours = computed(() => chartData.value[timeframe.value].totalHours);

const getBarClass = (index) => {
    const classes = [
        'bg-primary opacity-50', 'bg-info', 'bg-primary opacity-75',
        'bg-info opacity-75', 'bg-primary', 'bg-info opacity-50', 'bg-primary opacity-50'
    ];
    return classes[index % classes.length];
};

// --- Automatische Datumsberechnung ---
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

// Bereitet den Datums-String für die Anzeige unter dem Diagramm vor
const currentDateRange = computed(() => {
    if (filters.value.dateFrom && filters.value.dateTo) {
        const from = new Date(filters.value.dateFrom).toLocaleDateString('de-AT');
        const to = new Date(filters.value.dateTo).toLocaleDateString('de-AT');
        return `${from} - ${to}`;
    }
    return 'Bitte Zeitraum wählen';
});

// Initiale Ausführung beim Laden der Seite
onMounted(() => {
    applyTimeframeShortcut('Monat');
});

const exportPDF = () => {
    alert('PDF-Export wird vorbereitet...');
};
</script>

<style scoped>
.transition-all {
    transition: all 0.2s ease-in-out;
}

.form-select {
    box-shadow: none !important;
}

.chart-placeholder div {
    transition: height 0.5s ease-in-out;
}

.chart-placeholder div:hover {
    filter: brightness(0.9);
    cursor: pointer;
}

/* Accordion Animation Classes */
.filter-accordion-enter-active,
.filter-accordion-leave-active {
    transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
    max-height: 300px;
    /* Adjust if your content grows taller */
    opacity: 1;
    overflow: hidden;
}

.filter-accordion-enter-from,
.filter-accordion-leave-to {
    max-height: 0;
    opacity: 0;
    padding-top: 0 !important;
    margin-top: 0 !important;
}
</style>
