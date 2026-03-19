<script setup>
import { ref, onMounted } from 'vue'
import L from 'leaflet'
import data from '@/assets/data/tasklist.json'
const map = ref(null)
const selectedTask = ref(null) // <-- controls bottom card

const cityCoordinates = {
    Linz: [48.3069, 14.2858],
    Wien: [48.2082, 16.3738],
    Graz: [47.0707, 15.4395],
    Lasberg: [48.4706, 14.5397]
}
onMounted(() => {
    map.value = L.map('map').setView([48.3069, 14.2858], 7)

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png')
        .addTo(map.value)

    data.itemListElement.forEach((job) => {
        const city = job.jobLocation.address.addressLocality
        const coords = cityCoordinates[city]

        if (!coords) return

        L.marker(coords)
            .addTo(map.value)
            .on('click', () => {
                selectedTask.value = job
            })
    })
})

</script>
<template>

    <div id="map" style="height: 80vh; width: 100%;"></div>

    <!-- Bottom card -->
    <transition name="slide-up">
        <div v-if="selectedTask"
            class="d-flex container justify-content-between align-items-center bottom-card rounded">
            <RouterLink :to="{
                name: 'task', params: { itemId: selectedTask.identifier.value },
                query: { backRoute: '/task-search?tab=MapView' }
            }" class="list-group-item list-group-item-action align-content-stretch d-flex" aria-current="true">

                <div class=" date-box col-3">
                    <small>{{ selectedTask.club }}</small>
                    <h1>{{ selectedTask.day }}</h1>
                    <small>{{ selectedTask.month }}</small>
                </div>

                <div class="container col-9 content d-flex flex-column my-2">
                    <div>
                        <small class="opacity-50">{{ selectedTask.location }}, {{ selectedTask.industry }}</small>
                        <h4>{{ selectedTask.title }}</h4>
                    </div>

                    <div class="mt-auto d-flex align-items-center text-muted gap-6">
                        <small class="col-3">
                            <img src="/src/assets/images/profile-pictures/liselotte.png" alt="twbs" width="20"
                                height="20" class="rounded-circle flex-shrink-0">
                            {{ selectedTask.jobs }}
                        </small>
                        <small class="col-6"><i class="bi bi-chat me-1"></i>messages</small>
                    </div>
                </div>
            </RouterLink>
        </div>
    </transition>

</template>
<style>
.map-container {
    position: relative;
}

#map {
    height: 80vh;
    width: 100%;
}

/* Bottom overlay card */
.bottom-card {
    position: absolute;
    bottom: 100px;
    left: 0px;
    right: 0px;
    width: 100%;
    background: white;
    margin-left: auto;
    margin-right: auto;
    cursor: pointer;
    box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.2);
    padding: 10px;
    z-index: 1000;
}

/* Animation */
.slide-up-enter-active,
.slide-up-leave-active {
    transition: all 0.3s ease;
}

.slide-up-enter-from,
.slide-up-leave-to {
    transform: translateY(100%);
    opacity: 0;
}
</style>