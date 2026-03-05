<template>
    <div class="progress-container position-relative mt-2">
        <div class="progress" style="height: 6px;">
            <div class="progress-bar bg-success" role="progressbar" :style="{ width: match + '%' }"></div>
        </div>

        <div v-for="(pos, index) in pointPositions" :key="index" class="progress-point position-absolute"
            :style="{ left: pos + '%' }">
        </div>
    </div>

    <p><small class="text-muted">Empfohlen aufgrund Ihres Profils.</small></p>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
    match: {
        type: Number,
        required: true
    }
});

const points = 7;

// Berechnet die Position jedes Punktes gleichmäßig entlang der Leiste
const pointPositions = computed(() => {
    return Array.from({ length: points }, (_, i) => ((i + 1) / (points + 1)) * 100);
});
</script>
<style>
.progress-container {
    width: 100%;
    position: relative;
}

.progress {
    background-color: #e0e0e0;
    /* Hintergrundfarbe der Leiste */
}

.progress-point {
    width: 0.2rem;
    height: 0.2rem;
    background-color: white;
    border-radius: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
}
</style>