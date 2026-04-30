<template>
    <Navbar title="Nachweis prüfen"></Navbar>

    <div class="content-container pb-5" v-if="task">
        
        <div class="d-flex justify-content-between align-items-start mb-4">
            <div>
                <h3 class="fw-bold mb-1">{{ task.name }}</h3>
                <p class="text-muted mb-0">Eingereicht am {{ formatDate(task.datePosted || new Date()) }}</p>
            </div>
            
            <span class="badge rounded-pill px-3 py-2" :class="statusBadge.class">
                <i :class="statusBadge.icon" class="me-1"></i> {{ statusBadge.text }}
            </span>
        </div>

        <h5 class="fw-bold mb-3">Antragsteller</h5>
        <div class="card border-0 shadow-sm rounded-4 mb-4">
            <div class="card-body p-3">
                <div class="d-flex justify-content-between align-items-center">
                    <div class="d-flex align-items-center">
                        <div class="bg-secondary text-white rounded-circle d-flex justify-content-center align-items-center me-3" style="width: 50px; height: 50px;">
                            <i class="bi bi-person-fill fs-4"></i>
                        </div>
                        <div>
                            <h5 class="fw-bold mb-0">{{ task.requester?.name || 'Freiwilliger' }}</h5>
                            <small class="text-muted">ID: {{ task.requester?.id || 'Unbekannt' }}</small>
                        </div>
                    </div>
                    
                    <router-link :to="{ name: 'chat', params: { name: task.requester?.name || 'Freiwilliger' } }" class="btn btn-outline-primary rounded-circle shadow-sm d-flex justify-content-center align-items-center" style="width: 45px; height: 45px;" title="Nachricht senden">
                        <i class="bi bi-chat-dots-fill fs-5"></i>
                    </router-link>
                </div>
            </div>
        </div>

        <h5 class="fw-bold mb-3">Einsatzdetails</h5>
        <div class="card border-0 shadow-sm rounded-4 mb-4">
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
                        <div class="bg-success-subtle text-success rounded-circle d-flex justify-content-center align-items-center me-3" style="width: 40px; height: 40px; min-width: 40px;">
                            <i class="bi bi-clock-history fs-5"></i>
                        </div>
                        <div>
                            <span class="d-block small text-muted fw-bold mb-1">Beantragte Dauer</span>
                            <span class="d-block text-dark fw-bold fs-5">{{ task.hours }} Stunden</span>
                        </div>
                    </div>

                </div>
            </div>
        </div>

        <div v-if="task.description" class="mb-5">
            <h5 class="fw-bold mb-2">Tätigkeitsbeschreibung</h5>
            <div class="bg-light p-3 rounded-3 text-muted border">
                {{ task.description }}
            </div>
        </div>

        <div class="d-grid gap-3 mt-4" v-if="isPending">
            <button class="btn btn-success py-3 rounded-pill fw-bold" @click="acceptVerification">
                <i class="bi bi-check-circle-fill me-2"></i> Nachweis bestätigen
            </button>
            
            <button class="btn btn-outline-warning py-2 rounded-pill fw-bold text-dark" @click="requestMoreInfo">
                <i class="bi bi-question-circle me-2"></i> Rückfrage stellen
            </button>
            
            <button class="btn btn-outline-danger py-2 rounded-pill fw-bold" @click="declineVerification">
                <i class="bi bi-x-circle me-2"></i> Ablehnen
            </button>
        </div>
        
        <div class="d-grid gap-3 mt-4" v-else>
            <button class="btn btn-outline-secondary py-2 rounded-pill fw-bold" @click="$router.back()">
                Zurück zum Archiv
            </button>
        </div>

    </div>

    <div v-else class="content-container text-center pt-5">
        <i class="bi bi-exclamation-circle text-muted" style="font-size: 3rem;"></i>
        <h4 class="mt-3">Antrag nicht gefunden</h4>
        <button class="btn btn-primary mt-3" @click="$router.back()">Zurück</button>
    </div>

</template>

<script setup>
import { onMounted, ref, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import Navbar from '@/components/navbars/Navbar.vue';
import verificationsData from '@/assets/data/verifications.json';

const route = useRoute();
const router = useRouter();
const task = ref(null);

onMounted(() => {
    const itemId = route.params.itemId;
    const foundItem = verificationsData.itemListElement.find(
        job => job.identifier?.value === itemId || job.id === itemId
    );
    task.value = foundItem || null;
});

// --- Computed Status Helpers ---

const isPending = computed(() => {
    if (!task.value) return false;
    return task.value.status === 'Pending' || task.value.status === 'Requested';
});

const isConfirmed = computed(() => {
    if (!task.value) return false;
    return task.value.status === 'Certified' || task.value.status === 'Confirmed';
});

// Generate the correct badge colors and text based on the item's status
const statusBadge = computed(() => {
    // 1. Check if it's confirmed
    if (isConfirmed.value) {
        return { text: 'Bestätigt', class: 'bg-success text-white', icon: 'bi-check-circle-fill' };
    } 
    // 2. Check if it's pending
    else if (isPending.value) {
        return { text: 'Ausstehend', class: 'bg-warning text-dark', icon: 'bi-hourglass-split' };
    }
    // 3. If it's neither confirmed nor pending, it must be rejected/declined!
    else {
        return { text: 'Abgelehnt', class: 'bg-danger text-white', icon: 'bi-x-circle-fill' };
    }
});

// --- Action Handlers ---

const acceptVerification = () => {
    if(confirm(`Möchten Sie die ${task.value.hours} Stunden für ${task.value.requester.name} wirklich bestätigen?`)) {
        console.log("Accepted:", task.value.id);
        alert("Nachweis wurde erfolgreich bestätigt!");
        router.back();
    }
};

const requestMoreInfo = () => {
    console.log("Needs more info, opening chat for:", task.value.requester.name);
    router.push({ name: 'messages' }); 
};

const declineVerification = () => {
    const reason = prompt("Bitte geben Sie einen Grund für die Ablehnung an (optional):");
    if (reason !== null) { 
        console.log("Declined:", task.value.id, "Reason:", reason);
        alert("Der Nachweis wurde abgelehnt.");
        router.back();
    }
};

// Date formatter
const formatDate = (dateString) => {
    if (!dateString) return 'Unbekannt';
    const date = new Date(dateString);
    if (isNaN(date)) return dateString; 
    return new Intl.DateTimeFormat('de-AT', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(date);
};
</script>