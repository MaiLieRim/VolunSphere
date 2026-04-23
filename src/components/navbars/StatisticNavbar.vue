<template>
    <nav class="shadow-sm navbar bg-primary text-white ">
        <div class="container d-flex justify-content-evenly text-center">

            <div class="stat-item">
                <h1 class="fw-bold mb-0 mt-1">{{ displayBadges }}</h1>
                <small class="text-uppercase opacity-75" style="letter-spacing: 1px;">Badges</small>
            </div>

            <div class="stat-item border-start border-end border-light border-opacity-25 px-4">

                <h1 class="fw-bold mb-0 mt-1">{{ displayOrgs }}</h1>
                <small class="text-uppercase fw-medium opacity-75" style="letter-spacing: 1px;">
                    {{ role === 'admin' ? 'Funktionen' : 'Organisationen' }}
                </small>
            </div>

            <div class="stat-item">

                <h1 class="fw-bold mb-0 mt-1">{{ displayTasks }}</h1>
                <small class="text-uppercase fw-medium opacity-75" style="letter-spacing: 1px;">Aufgaben</small>
            </div>

        </div>
    </nav>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';

// 1. Define Props so the parent component can feed real data
const props = defineProps({
    badgesCount: { type: Number, default: 221 },
    orgCount: { type: Number, default: 6 },
    taskCount: { type: Number, default: 21 },
    userRole: { type: String, default: null } // Optional: can be passed from parent
});

// Determine role: use prop if provided, otherwise fallback to localStorage
const role = ref(props.userRole || localStorage.getItem('userRole') || 'volunteer');

// 2. State for the animating numbers
const displayBadges = ref(0);
const displayOrgs = ref(0);
const displayTasks = ref(0);

// 3. Counter Animation Logic
const animateValue = (targetRef, start, end, duration) => {
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        // Easing function (easeOutQuart) for a smooth slow-down at the end
        const easeProgress = 1 - Math.pow(1 - progress, 4);

        targetRef.value = Math.floor(easeProgress * (end - start) + start);

        if (progress < 1) {
            window.requestAnimationFrame(step);
        } else {
            targetRef.value = end; // Ensure it ends exactly on the target
        }
    };
    window.requestAnimationFrame(step);
};

// Start the animation when the component loads
onMounted(() => {
    animateValue(displayBadges, 0, props.badgesCount, 1500);
    animateValue(displayOrgs, 0, props.orgCount, 1500);
    animateValue(displayTasks, 0, props.taskCount, 1500);
});

// If the parent updates the props, re-animate!
watch(() => props.badgesCount, (newVal, oldVal) => animateValue(displayBadges, oldVal, newVal, 1000));
watch(() => props.orgCount, (newVal, oldVal) => animateValue(displayOrgs, oldVal, newVal, 1000));
watch(() => props.taskCount, (newVal, oldVal) => animateValue(displayTasks, oldVal, newVal, 1000));
</script>

<style scoped>
.stat-item {
    flex: 1;
    display: flex;
    flex-direction: column;
    cursor: pointer;
}
</style>