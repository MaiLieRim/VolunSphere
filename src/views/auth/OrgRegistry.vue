<template>
    <div class="container d-flex flex-column min-vh-100 bg-white px-3 py-4" style="max-width: 600px; margin: 0 auto;">
        
        <div class="mb-4 mt-2 text-center">
            <h2 class="fw-bolder text-dark" style="letter-spacing: -0.5px;">Organisation registrieren</h2>
            <p class="text-muted small">Erstellen Sie ein Konto für Ihre Freiwilligenorganisation.</p>
        </div>

        <div class="d-flex justify-content-between position-relative mb-5 px-3">
            <div class="progress position-absolute top-50 start-0 w-100 translate-middle-y" style="height: 4px; z-index: 1;">
                <div class="progress-bar bg-primary" :style="{ width: progressPercentage + '%' }"></div>
            </div>
            <div v-for="(step, index) in steps" :key="index" 
                 class="rounded-circle d-flex justify-content-center align-items-center position-relative fw-bold shadow-sm"
                 :class="currentIndex >= index ? 'bg-primary text-white' : 'bg-light text-muted border'"
                 style="width: 40px; height: 40px; z-index: 2; transition: all 0.3s ease;">
                <i :class="step.icon" v-if="currentIndex < index || index === 3"></i>
                <span v-else>{{ index + 1 }}</span>
            </div>
        </div>

        <div class="flex-grow-1">
            
            <div v-show="currentIndex === 0" class="fade-in">
                <h4 class="fw-bold mb-3"><i class="bi bi-building text-primary me-2"></i>Organisationsdaten</h4>
                
                <div class="form-floating mb-3">
                    <input type="text" class="form-control bg-light border-0 rounded-3" id="orgName" placeholder="Name der Organisation" v-model="orgData.name">
                    <label for="orgName" class="text-muted">Name der Organisation *</label>
                </div>
                
                <div class="form-floating mb-3">
                    <input type="text" class="form-control bg-light border-0 rounded-3" id="zvr" placeholder="ZVR-Zahl" v-model="orgData.zvr">
                    <label for="zvr" class="text-muted">ZVR-Zahl (Vereinsregister) *</label>
                </div>

                <div class="row g-2 mb-3">
                    <div class="col-8 form-floating">
                        <input type="text" class="form-control bg-light border-0 rounded-3" id="street" placeholder="Straße" v-model="orgData.address.street">
                        <label for="street" class="text-muted ms-2">Straße & Hausnr.</label>
                    </div>
                    <div class="col-4 form-floating">
                        <input type="text" class="form-control bg-light border-0 rounded-3" id="zip" placeholder="PLZ" v-model="orgData.address.zip">
                        <label for="zip" class="text-muted ms-2">PLZ</label>
                    </div>
                </div>
                
                <div class="form-floating mb-3">
                    <input type="text" class="form-control bg-light border-0 rounded-3" id="city" placeholder="Ort" v-model="orgData.address.city">
                    <label for="city" class="text-muted">Ort</label>
                </div>
            </div>

            <div v-show="currentIndex === 1" class="fade-in">
                <h4 class="fw-bold mb-3"><i class="bi bi-person-badge text-primary me-2"></i>Kontaktperson</h4>
                <p class="small text-muted mb-4">Wer ist der primäre Ansprechpartner für diese Plattform?</p>
                
                <div class="row g-2 mb-3">
                    <div class="col-6 form-floating">
                        <input type="text" class="form-control bg-light border-0 rounded-3" id="firstName" placeholder="Vorname" v-model="orgData.contact.firstName">
                        <label for="firstName" class="text-muted ms-2">Vorname *</label>
                    </div>
                    <div class="col-6 form-floating">
                        <input type="text" class="form-control bg-light border-0 rounded-3" id="lastName" placeholder="Nachname" v-model="orgData.contact.lastName">
                        <label for="lastName" class="text-muted ms-2">Nachname *</label>
                    </div>
                </div>

                <div class="form-floating mb-3">
                    <input type="text" class="form-control bg-light border-0 rounded-3" id="role" placeholder="Position / Rolle" v-model="orgData.contact.role">
                    <label for="role" class="text-muted">Position / Rolle (z.B. Obmann)</label>
                </div>

                <div class="form-floating mb-3">
                    <input type="email" class="form-control bg-light border-0 rounded-3" id="email" placeholder="E-Mail" v-model="orgData.contact.email">
                    <label for="email" class="text-muted">Dienstliche E-Mail *</label>
                </div>

                <div class="form-floating mb-3">
                    <input type="tel" class="form-control bg-light border-0 rounded-3" id="phone" placeholder="Telefon" v-model="orgData.contact.phone">
                    <label for="phone" class="text-muted">Telefonnummer</label>
                </div>
            </div>

            <div v-show="currentIndex === 2" class="fade-in">
                <h4 class="fw-bold mb-3"><i class="bi bi-shield-check text-primary me-2"></i>Verifizierung</h4>
                <p class="small text-muted mb-4">Um die Authentizität zu prüfen, laden Sie bitte einen aktuellen Vereinsregisterauszug oder eine Bestätigung hoch.</p>
                
                <div class="p-4 border border-2 border-dashed rounded-4 text-center bg-light" style="cursor: pointer;">
                    <i class="bi bi-cloud-arrow-up text-primary fs-1 mb-2"></i>
                    <h6 class="fw-bold">Dokument hochladen</h6>
                    <p class="small text-muted mb-0">PDF, JPG oder PNG (max. 5MB)</p>
                    <input class="form-control mt-3" type="file" id="formFile">
                </div>

                <div class="mt-4">
                    <div class="form-check">
                        <input class="form-check-input" type="checkbox" value="" id="termsCheck" v-model="orgData.acceptedTerms">
                        <label class="form-check-label small text-muted" for="termsCheck">
                            Ich bestätige die Richtigkeit der Angaben und akzeptiere die Nutzungsbedingungen für Organisationen.
                        </label>
                    </div>
                </div>
            </div>

            <div v-show="currentIndex === 3" class="fade-in text-center pt-4">
                <div class="bg-success-subtle text-success rounded-circle d-flex justify-content-center align-items-center mx-auto mb-4" style="width: 80px; height: 80px;">
                    <i class="bi bi-check-lg" style="font-size: 3rem;"></i>
                </div>
                <h3 class="fw-bold text-dark mb-2">Fast geschafft!</h3>
                <p class="text-muted">Ihre Daten wurden erfolgreich übermittelt. Unser Team prüft Ihre Dokumente in Kürze.</p>
                
                <div class="bg-light rounded-4 p-3 mt-4 text-start">
                    <h6 class="fw-bold mb-1">{{ orgData.name || 'Ihre Organisation' }}</h6>
                    <div class="small text-muted">
                        <i class="bi bi-envelope me-1"></i> Bestätigungslink wurde an <strong>{{ orgData.contact.email || 'Ihre E-Mail' }}</strong> gesendet.
                    </div>
                </div>
                <p class="small text-muted mt-3">Bitte klicken Sie auf den Link in der E-Mail, um Ihren Account final freizuschalten.</p>
            </div>

        </div>

        <div class="d-flex justify-content-between align-items-center mt-5 pt-3 border-top">
            
            <div class="d-flex align-items-center gap-2">
                <button v-if="currentIndex > 0 && currentIndex < 3" class="btn btn-light rounded-pill px-4 fw-medium text-muted" @click="goBack">
                    <i class="bi bi-arrow-left me-1"></i> Zurück
                </button>
                
                <router-link v-if="currentIndex < 3" to="/" class="btn btn-link text-muted text-decoration-none fw-medium px-2">
                    Abbrechen
                </router-link>
            </div>

            <div>
                <button v-if="currentIndex < 2" class="btn btn-primary text-light rounded-pill px-5 fw-bold" @click="goNext">
                    Weiter
                </button>
                <button v-else-if="currentIndex === 2" class="btn btn-success text-light rounded-pill px-5 fw-bold" @click="goNext" :disabled="!orgData.acceptedTerms">
                    Registrieren
                </button>
                <router-link v-if="currentIndex === 3" to="/" class="btn btn-primary text-light rounded-pill px-5 fw-bold">
                    Zurück zum Login
                </router-link>
            </div>
            
        </div>

    </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const currentIndex = ref(0);

const steps = [
    { icon: 'bi-building' },
    { icon: 'bi-person-badge' },
    { icon: 'bi-shield-check' },
    { icon: 'bi-check2' }
];

// Calculate progress bar width
const progressPercentage = computed(() => {
    return (currentIndex.value / (steps.length - 1)) * 100;
});

// Data Model to store all inputs
const orgData = ref({
    name: '',
    zvr: '',
    address: { street: '', zip: '', city: '' },
    contact: { firstName: '', lastName: '', role: '', email: '', phone: '' },
    acceptedTerms: false
});

const goNext = () => {
    if (currentIndex.value < steps.length - 1) {
        // Optional: Hier könnte man noch Formular-Validierung einbauen
        currentIndex.value++;
    }
};

const goBack = () => {
    if (currentIndex.value > 0) {
        currentIndex.value--;
    }
};
</script>

<style scoped>
.fade-in {
    animation: fadeIn 0.4s ease-in-out;
}
@keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
}
.border-dashed {
    border-style: dashed !important;
}
</style>