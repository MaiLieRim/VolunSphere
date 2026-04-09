<template>
    <Navbar title="Details"></Navbar>

    <div class="content-container pb-5" v-if="task">
        
        <div class="d-flex justify-content-between align-items-start mb-4">
            <div>
                <h3 class="fw-bold mb-1">{{ task.name }}</h3>
                <p class="text-muted mb-0">{{ task.organization.name }}</p>
            </div>
            
            <span class="badge rounded-pill px-3 py-2" :class="statusBadge.class">
                <i :class="statusBadge.icon" class="me-1"></i> 
                {{ statusBadge.text }}
            </span>
        </div>

        <div class="card border shadow-sm rounded-4 mb-4">
            <div class="card-body p-4">
                <div class="d-flex flex-column gap-4">
                    
                    <div class="d-flex align-items-start">
                        <div class="bg-primary-subtle text-primary rounded-circle d-flex justify-content-center align-items-center me-3" style="width: 40px; height: 40px; min-width: 40px;">
                            <i class="bi bi-calendar-event fs-5"></i>
                        </div>
                        <div>
                            <span class="d-block small text-muted fw-bold mb-1">Datum</span>
                            <span class="d-block text-dark">{{ formatDate(task.startDate) }}</span>
                        </div>
                    </div>

                    <div class="d-flex align-items-start">
                        <div class="bg-primary-subtle text-primary rounded-circle d-flex justify-content-center align-items-center me-3" style="width: 40px; height: 40px; min-width: 40px;">
                            <i class="bi bi-geo-alt fs-5"></i>
                        </div>
                        <div>
                            <span class="d-block small text-muted fw-bold mb-1">Einsatzort</span>
                            <span class="d-block text-dark">{{ task.location?.name || 'Kein Ort angegeben' }}</span>
                        </div>
                    </div>

                    <div class="d-flex align-items-start">
                        <div class="bg-primary-subtle text-primary rounded-circle d-flex justify-content-center align-items-center me-3" style="width: 40px; height: 40px; min-width: 40px;">
                            <i class="bi bi-clock-history fs-5"></i>
                        </div>
                        <div>
                            <span class="d-block small text-muted fw-bold mb-1">Dauer</span>
                            <span class="d-block text-dark fw-bold">{{ task.hours }} Stunden</span>
                        </div>
                    </div>

                    <div class="d-flex justify-content-between align-items-center">
                        <div class="d-flex align-items-center">
                            <div class="bg-primary-subtle text-primary rounded-circle d-flex justify-content-center align-items-center me-3" style="width: 40px; height: 40px; min-width: 40px;">
                                <i class="bi bi-person-badge fs-5"></i>
                            </div>
                            <div>
                                <span class="d-block small text-muted fw-bold mb-0">Zuständig</span>
                                <span class="d-block text-dark fw-medium">{{ task.organization.admin || 'Einsatzleitung' }}</span>
                            </div>
                        </div>
                        <router-link  :to="{ name: 'chat', params: { name: task.organization.admin } }" class="btn btn-outline-primary rounded-circle shadow-sm d-flex justify-content-center align-items-center" style="width: 40px; height: 40px;">
                            <i class="bi bi-chat-dots-fill"></i>
                        </router-link>
                    </div>

                </div>
            </div>
        </div>

        <div v-if="task.description" class="mb-5">
            <h5 class="fw-bold mb-2">Beschreibung</h5>
            <p class="text-muted">{{ task.description }}</p>
        </div>

        <div class="d-grid gap-2">
            <button v-if="isPending" class="btn btn-outline-danger py-2 rounded-pill">
                <i class="bi bi-x-circle me-1"></i> Anfrage zurückziehen
            </button>
            
            <button v-if="isConfirmed" class="btn btn-primary py-2 rounded-pill">
                <i class="bi bi-file-earmark-pdf me-1"></i> Zertifikat herunterladen
            </button>
        </div>

    </div>

    <div v-else class="content-container text-center pt-5">
        <i class="bi bi-exclamation-circle text-muted" style="font-size: 3rem;"></i>
        <h4 class="mt-3">Nachweis nicht gefunden</h4>
        <p class="text-muted">Die angeforderte Seite existiert leider nicht.</p>
        <button class="btn btn-primary mt-3" @click="$router.back()">Zurück</button>
    </div>

</template>

<script setup>
import { computed, onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import Navbar from '@/components/navbars/Navbar.vue';
import verificationsData from '@/assets/data/verifications.json';

const route = useRoute();
const task = ref(null);

// Retrieve the item based on the ID passed in the URL
onMounted(() => {
    const itemId = route.params.itemId;
    
    // Look for the item in your JSON file. 
    // Adjust 'job.identifier?.value' if your JSON stores the ID differently!
    const foundItem = verificationsData.itemListElement.find(
        job => job.identifier?.value === itemId || job.id === itemId
    );
    
    task.value = foundItem || null;
});

// --- Computed Helpers ---

const isPending = computed(() => {
    if (!task.value) return false;
    return task.value.status === 'Pending' || task.value.status === 'Requested';
});

const isConfirmed = computed(() => {
    if (!task.value) return false;
    return !isPending.value && task.value.status !== 'Deleted';
});

// Dynamic styles for the badge based on status
const statusBadge = computed(() => {
    if (isPending.value) {
        return {
            text: 'Ausstehend',
            class: 'bg-warning text-dark',
            icon: 'bi-hourglass-split'
        };
    } else if (isConfirmed.value) {
        return {
            text: 'Bestätigt',
            class: 'bg-success text-white',
            icon: 'bi-check-circle-fill'
        };
    } else {
        return {
            text: 'Gelöscht / Abgelehnt',
            class: 'bg-danger text-white',
            icon: 'bi-x-circle-fill'
        };
    }
});

// Simple date formatter (adjust based on how dates are stored in your JSON)
const formatDate = (dateString) => {
    if (!dateString) return 'Kein Datum angegeben';
    const date = new Date(dateString);
    // If invalid date string, just return the string itself
    if (isNaN(date)) return dateString; 
    
    return new Intl.DateTimeFormat('de-AT', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    }).format(date);
};
</script>