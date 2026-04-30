<template>
    <div class="px-2 pb-4">
        <div class="card bg-primary text-light shadow-sm mb-4 border-0">
            <div class="card-body text-center py-4">
                <i class="bi bi-star-fill text-warning fs-1 mb-2 d-block"></i>
                <h4 class="fw-bold mb-0">{{ totalPoints }} Punkte</h4>
                <small class="text-light opacity-75">Sammle mehr Punkte durch Einsätze!</small>
            </div>
        </div>

        <div class="d-flex justify-content-between align-items-center mb-3">
            <h4 class="mb-0">Meine Ziele</h4>
            <button class="btn btn-sm btn-outline-primary rounded-pill" @click="defineNewGoal">
                <i class="bi bi-plus"></i> Ziel definieren
            </button>
        </div>

        <div class="card shadow-sm mb-4 border-0">
            <div class="card-body">
                <div v-for="goal in goals" :key="goal.id" class="mb-4 last-child-mb-0">
                    <div class="d-flex justify-content-between align-items-end mb-1">
                        <div>
                            <h5 class="mb-0 fw-bold">{{ goal.title }}</h5>
                            <small class="text-muted">{{ goal.timeframe }}</small>
                        </div>
                        <span class="badge text-bg-light border text-dark">
                            {{ goal.current }} / {{ goal.target }} Std.
                        </span>
                    </div>
                    <div class="progress" style="height: 10px;">
                        <div class="progress-bar bg-success" 
                             role="progressbar" 
                             :style="{ width: calculateProgress(goal.current, goal.target) + '%' }" 
                             :aria-valuenow="calculateProgress(goal.current, goal.target)" 
                             aria-valuemin="0" aria-valuemax="100">
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <h4 class="mb-3">Meine Badges</h4>
        <div class="row g-2">
            <div v-for="badge in badges" :key="badge.id" class="col-4 text-center">
                <div class="card h-100 border-0 shadow-sm" :class="{ 'opacity-50 grayscale': !badge.earned }">
                    <div class="card-body p-2">
                        <i :class="['bi fs-1', badge.icon, badge.earned ? badge.color : 'text-secondary']"></i>
                        <div class="fw-bold mt-2" style="font-size: 0.8rem;">{{ badge.title }}</div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';

// Dummy Data for Points
const totalPoints = ref(450);

// Dummy Data for Goals (Zielsystem)
const goals = ref([
    { id: 1, title: 'Rettungssanitäter Weiterbildung', timeframe: 'Bis Dez 2026', current: 20, target: 40 },
    { id: 2, title: 'Nachtschichten', timeframe: 'Diesen Monat', current: 2, target: 4 },
    { id: 3, title: 'Mentoring neuer Helfer', timeframe: 'Quartal 3', current: 5, target: 10 },
]);

// Dummy Data for Badges (Badge-System)
const badges = ref([
    { id: 1, title: 'Lebensretter', icon: 'bi-heart-pulse-fill', color: 'text-danger', earned: true },
    { id: 2, title: 'Nachteule', icon: 'bi-moon-stars-fill', color: 'text-info', earned: true },
    { id: 3, title: 'Mentor', icon: 'bi-people-fill', color: 'text-primary', earned: false },
    { id: 4, title: 'Vielfahrer', icon: 'bi-car-front-fill', color: 'text-success', earned: true },
    { id: 5, title: 'Jubiläum (1 Jahr)', icon: 'bi-award-fill', color: 'text-warning', earned: false },
    { id: 6, title: 'Immer Bereit', icon: 'bi-lightning-charge-fill', color: 'text-warning', earned: false },
]);

// Fortschritt berechnen (Calculate Progress)
const calculateProgress = (current, target) => {
    if (target === 0) return 0;
    const percentage = (current / target) * 100;
    return Math.min(percentage, 100); // Cap at 100%
};

// 1. Ziel definieren (Define Goal)
const defineNewGoal = () => {
    alert("Hier würde sich später ein Modal öffnen, um ein neues Ziel und den Zeitraum festzulegen.");
};
</script>

<style scoped>
.grayscale {
    filter: grayscale(100%);
}
.last-child-mb-0:last-child {
    margin-bottom: 0 !important;
}
</style>
