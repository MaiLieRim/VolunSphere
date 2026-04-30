<template>
    <div class="progress-container position-relative mt-2">
        <div class="progress" style="height: 6px;" role="progressbar" :aria-valuenow="match" aria-valuemin="0" aria-valuemax="100">
            <div class="progress-bar bg-success" :style="{ width: match + '%' }"></div>
        </div>

        <div v-for="(pos, index) in pointPositions" :key="index" class="progress-point position-absolute"
            :style="{ left: pos + '%' }">
        </div>
    </div>

    <div class="d-flex align-items-center gap-2 mt-2">
        <p class="mb-0">
            <small class="text-muted">Empfohlen aufgrund Ihres Profils.</small>
        </p>
        
        <i class="bi bi-info-circle text-muted" 
           ref="popoverTrigger"
           type="button"
           data-bs-toggle="popover" 
           data-bs-placement="bottom" 
           :data-bs-title="popoverTitle" 
           :data-bs-content="popoverContent" 
           data-bs-html="true"
           style="cursor: pointer; font-size: 0.9rem;">
        </i>
    </div>
</template>

<script setup>
import { computed, ref, onMounted } from "vue";
import { Popover } from 'bootstrap';

const props = defineProps({
    match: {
        type: Number,
        required: true
    }
});

const points = 7;
const popoverTrigger = ref(null);

// Berechnet die Position jedes Punktes gleichmäßig entlang der Leiste
const pointPositions = computed(() => {
    return Array.from({ length: points }, (_, i) => ((i + 1) / (points + 1)) * 100);
});

// Dynamischer Inhalt für das Popover
const popoverTitle = computed(() => `Übereinstimmung: ${props.match}%`);
const popoverContent = computed(() => {
    // Dynamische Prozentwerte abgeleitet vom Gesamt-Match Score
    const skillScore = Math.min(100, Math.round(props.match * 1.05));
    const interestScore = props.match;
    const availabilityScore = Math.min(100, Math.round(props.match * 0.95));

    return `
        <div class="text-start" style="min-width: 220px;">
            <p class="mb-1 small fw-bold text-primary">Warum dieser Score?</p>
            <ul class="list-unstyled small mb-0">
                <li class="mb-2 d-flex justify-content-between align-items-center">
                    <span><i class="bi bi-check-circle-fill text-success me-1"></i> Kompetenzen</span>
                    <span class="badge bg-success text-white">${skillScore}%</span>
                </li>
                <li class="mb-2 d-flex justify-content-between align-items-center">
                    <span><i class="bi bi-check-circle-fill text-success me-1"></i> Interessen</span>
                    <span class="badge bg-success text-white">${interestScore}%</span>
                </li>
                <li class="mb-2 d-flex justify-content-between align-items-center">
                    <span><i class="bi bi-check-circle-fill text-success me-1"></i> Verfügbarkeit</span>
                    <span class="badge bg-success text-white">${availabilityScore}%</span>
                </li>
            </ul>
            <hr class="my-2">
            <a href="/profile" class="btn btn-sm btn-outline-secondary text-primary w-100 py-1"><i class="bi bi-bar-chart-fill me-1 text-dark"></i> Details</a>
        </div>
    `;
});

// Bootstrap Popover Initialisierung
onMounted(() => {
    const popoverList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'));
    popoverList.map(function (popoverEl) {
        return new Popover(popoverEl, {
            trigger: 'hover focus'
        });
    });
});
</script>

<style scoped>
.progress-container {
    width: 100%;
}

.progress {
    background-color: #e9ecef;
    border-radius: 0.375rem;
    overflow: visible;
}

.progress-point {
    width: 0.35rem;
    height: 0.35rem;
    background-color: white;
    border-radius: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
}
</style>
