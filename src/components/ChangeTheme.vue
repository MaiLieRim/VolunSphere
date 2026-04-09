<template>
        <div class="d-flex justify-content-between border rounded-3 p-2">
            <div v-for="theme in themes" :key="theme.name">
                <div class="card theme-card" :class="{ 'active': selectedTheme === theme.name }"
                    @click="setTheme(theme.name)">
                    <h5 class="card-title">{{ theme.label }}</h5>
                    <div class="d-flex">
                        <span v-for="color in theme.colors" :key="color" class="rounded-circle mx-1"
                            :style="{ backgroundColor: color, width: '20px', height: '20px' }"></span>
                    </div>
                </div>
            </div>
        </div>
    
</template>

<script setup>

import { ref, watch, onMounted } from 'vue';

const selectedTheme = ref(localStorage.getItem("theme") || "light");

const themes = [
    { name: "dark", label: "Dark", colors: ["#0783cb", "#212529", "#495057"] },
    { name: "light", label: "Light", colors: ["#ffffff", "#EEF9FF", "#0783cb"] },
    { name: "green", label: "Grün", colors: ["#e1f1ed", "#78c2ad", "#36584f"] },
];

const setTheme = (theme) => {
    selectedTheme.value = theme;
};

watch(selectedTheme, (newTheme) => {
    document.documentElement.setAttribute("data-bs-theme", newTheme);
    localStorage.setItem("theme", newTheme);
});

onMounted(() => {
    document.documentElement.setAttribute("data-bs-theme", selectedTheme.value);
});
</script>

<style scoped>
.theme-card {
    cursor: pointer;
    border: 2px solid transparent;
    transition: all 0.3s ease-in-out;
    text-align: center;
    padding-bottom: 0.2rem;
    margin: 0.1rem
}

.theme-card.active {
    border: 2px solid var(--bs-primary);
}
</style>