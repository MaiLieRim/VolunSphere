<template>
    <Navbar v-if="!isSelectionMode" title="Freiwilligenpass"></Navbar>

    <div class="container py-3">

        <div v-if="!hasGeneratedQR && !isSelectionMode" class="fade-in text-center py-5 mt-4">
            <div class="mb-4 text-primary opacity-75">
                <i class="bi bi-qr-code-scan" style="font-size: 6rem;"></i>
            </div>
            <h2 class="fw-bold text-dark mb-3">Dein Freiwilligenpass</h2>
            <p class="text-muted mb-5 px-3">
                Du hast noch keinen QR-Code generiert. Bündle jetzt deine persönlichen Daten und Nachweise, um dich im Krisenfall in Sekundenschnelle sicher auszuweisen.
            </p>
            <button class="btn btn-primary rounded-pill fw-bold w-100 py-3 shadow-sm" @click="isSelectionMode = true">
                <i class="bi bi-magic me-2"></i> Jetzt Pass erstellen
            </button>
        </div>

        <div v-else-if="hasGeneratedQR && !isSelectionMode" class="fade-in">
            <div class="text-center mt-2">
                <Logo />
                <h2 class="mt-3 fw-bold">Dein Code in der Krise</h2>
                <p class="text-muted small">Zeige diesen Sammel-Code bei der Einsatzleitung vor, um dich schnell und
                    sicher auszuweisen.</p>
            </div>

            <div class="card border-0 shadow-sm rounded-4 p-4 text-center mb-4 bg-white">
                <div class="d-inline-block p-3 pt-0 mb-3">
                    <img src="/assets/images/chart.png" class="img-fluid"
                        style="width: 180px; height: 180px; object-fit: cover;" alt="Sammel QR Code">
                </div>

                <div class="d-flex justify-content-evenly align-items-center mb-4 pb-3 border-bottom">
                    <div>
                        <div class="text-muted mb-1" style="font-size: 0.65rem; text-transform: uppercase; letter-spacing: 0.5px;">Erstellt am</div>
                        <div class="fw-bold text-dark small">{{ creationDate }}</div>
                    </div>
                    <div style="width: 1px; height: 24px; background-color: #dee2e6;"></div>
                    <div>
                        <div class="text-muted mb-1" style="font-size: 0.65rem; text-transform: uppercase; letter-spacing: 0.5px;">Gültig bis</div>
                        <div class="fw-bold text-success small">{{ validUntilDate }}</div>
                    </div>
                </div>

                <div class="d-flex flex-wrap justify-content-center gap-2 mb-4">
                    <span v-for="skill in selectedSkills" :key="skill.id"
                        class="badge bg-primary-subtle text-primary border border-primary-subtle py-2 px-3 rounded-pill">
                        <i class="bi bi-check-circle-fill me-1"></i> {{ skill.name }}
                    </span>
                    <span v-if="selectedSkills.length === 0" class="text-danger small">Keine Nachweise
                        ausgewählt!</span>
                </div>

                <button class="btn btn-outline-primary rounded-pill fw-bold w-100 py-2" @click="isSelectionMode = true">
                    <i class="bi bi-arrow-clockwise me-2"></i> Aktualisieren
                </button>
            </div>

            <div class="d-grid gap-3 mt-4">
                <button class="btn btn-primary fw-bold py-2 d-flex align-items-center justify-content-center shadow-sm" type="button">
                    <i class="bi bi-apple fs-5 me-2"></i> Zu Apple Wallet
                </button>
                <button class="btn btn-primary fw-bold py-2 d-flex align-items-center justify-content-center shadow-sm" type="button">
                    <i class="bi bi-google fs-5 me-2"></i> Zu Google Wallet
                </button>
            </div>
        </div>

        <div v-else class="fade-in pb-5">
            <div class="d-flex justify-content-between mb-3 mt-2">
                <div>
                    <h3 class="fw-bold mb-0">Nachweise bündeln</h3>
                    <p class="text-muted small mb-0">Wähle, was im QR-Code geteilt wird.</p>
                </div>
                
                <button type="button" class="btn-close" @click="cancelSelection" aria-label="Close"></button>
            </div>

            <div class="card border-0 shadow-sm rounded-4 overflow-hidden mb-5">
                <div class="p-3 border-bottom bg-light bg-opacity-50 d-flex justify-content-between align-items-center">
                    <span class="fw-bold text-dark">Alle auswählen</span>
                    <div class="form-check form-switch fs-4 mb-0">
                        <input class="form-check-input shadow-sm" type="checkbox" role="switch" v-model="allSelected">
                    </div>
                </div>
                
                <div class="card bg-light border-0 mb-3 p-3 small text-muted rounded-0 border-bottom">
                    <strong class="text-dark">Persönliche Daten (Immer enthalten):</strong><br>
                    {{ personalData.name }}; {{ personalData.dob }}; {{ personalData.email }}; {{ personalData.phone }}
                </div>
                
                <ul class="list-group list-group-flush">
                    <li v-for="skill in verifiedSkills" :key="skill.id"
                        class="list-group-item p-3 d-flex justify-content-between align-items-center transition-all"
                        :class="{ 'bg-primary-subtle bg-opacity-25': skill.selected }"
                        @click="skill.selected = !skill.selected">

                        <div class="pe-3">
                            <h6 class="mb-1 fw-bold text-dark">{{ skill.name }}</h6>
                            <small class="text-muted">{{ skill.desc }}</small>
                        </div>

                        <div class="form-check fs-4 mb-0 pointer-event-none">
                            <input class="form-check-input rounded-circle border-secondary" type="checkbox" :checked="skill.selected">
                        </div>
                    </li>
                </ul>
            </div>

            <div class="position-fixed bottom-0 start-0 end-0 p-3 bg-white border-top shadow-lg z-3" style="margin-bottom: 60px;"> 
                <button
                    class="btn btn-primary w-100 rounded-pill py-3 fw-bold d-flex align-items-center justify-content-center shadow-sm"
                    :disabled="selectedSkills.length === 0" @click="generateNewQR">
                    <i class="bi bi-qr-code-scan fs-5 me-2"></i>
                    Sammel-Code generieren ({{ selectedSkills.length }})
                </button>
            </div>
        </div>

    </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import Navbar from '@/components/navbars/Navbar.vue';
import Logo from '@/components/common/Logo.vue';
import rawVolunteer from "@/assets/data/volunteer.json";

// --- STATE ---
const isSelectionMode = ref(false);
const hasGeneratedQR = ref(false); // NEU: Startet bei false, da noch nie generiert
const volunteer = ref(rawVolunteer);

const verifiedSkills = ref([
    { id: 1, name: 'Führerschein Klasse B', desc: 'Erworben 2018', selected: true },
    { id: 2, name: 'Erste Hilfe Kurs (16h)', desc: 'Gültig bis 2026', selected: true },
    { id: 3, name: 'Sprengmeisterin', desc: 'Zertifikat #1234', selected: false },
    { id: 4, name: 'Strafregisterauszug', desc: 'Ohne Einträge, 2024', selected: true }
]);

// --- COMPUTED PROPERTIES ---
const personalData = computed(() => {
    return {
        name: volunteer.value.name || "Liselotte Pulver",
        dob: volunteer.value.birthDate || "Unbekannt",
        email: volunteer.value.email || "Keine Email",
        phone: volunteer.value.telephone || "Keine Nummer",
        id: volunteer.value.identifier || "1234"
    };
});

const selectedSkills = computed(() => {
    return verifiedSkills.value.filter(skill => skill.selected);
});

const allSelected = computed({
    get: () => verifiedSkills.value.length > 0 && verifiedSkills.value.every(skill => skill.selected),
    set: (value) => {
        verifiedSkills.value.forEach(skill => skill.selected = value);
    }
});

const creationDate = computed(() => {
    const today = new Date();
    return `${today.getDate().toString().padStart(2, '0')}.${(today.getMonth() + 1).toString().padStart(2, '0')}.${today.getFullYear()}`;
});

const validUntilDate = computed(() => {
    const validUntil = new Date();
    validUntil.setMonth(validUntil.getMonth() + 2);
    return `${validUntil.getDate().toString().padStart(2, '0')}.${(validUntil.getMonth() + 1).toString().padStart(2, '0')}.${validUntil.getFullYear()}`;
});

// --- METHODS ---
const generateNewQR = () => {
    hasGeneratedQR.value = true; // Setzt den Status auf "generiert"
    isSelectionMode.value = false; // Schließt das Menü und zeigt den QR Code
};

const cancelSelection = () => {
    // Wenn man abbricht und noch keinen Code hat, bleibt man im Empty State
    // Wenn man schon einen hat, geht man zurück zur QR-Ansicht
    isSelectionMode.value = false;
};
</script>

<style scoped>
.fade-in {
    animation: fadeIn 0.3s ease-in-out;
}

@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(-5px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.transition-all {
    transition: background-color 0.2s ease;
}

.pointer-event-none {
    pointer-events: none;
}
</style>