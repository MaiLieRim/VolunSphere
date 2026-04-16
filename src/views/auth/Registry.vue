<template>
    <div class="container d-flex flex-column min-vh-100 bg-white px-3 py-4" style="max-width: 600px; margin: 0 auto;">
        
        <div class="mb-4 mt-2 text-center">
            <h2 class="fw-bolder text-dark" style="letter-spacing: -0.5px;">Registrierung</h2>
            <p class="text-muted small">Erstellen Sie Ihren persönlichen Freiwilligenpass.</p>
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

        <form class="flex-grow-1 needs-validation" @submit.prevent="submitForm">
            
            <div v-show="currentIndex === 0" class="fade-in">
                <h4 class="fw-bold mb-3"><i class="bi bi-envelope-at text-primary me-2"></i>Account anlegen</h4>
                <p class="small text-muted mb-4">Bitte geben Sie Ihre E-Mail-Adresse ein und legen Sie ein sicheres Passwort fest.</p>
                
                <div class="form-floating mb-3">
                    <input type="email" class="form-control bg-light border-0 rounded-3" id="inputEmail" placeholder="E-Mail" v-model="formData.email" required>
                    <label for="inputEmail" class="text-muted">E-Mail Adresse *</label>
                </div>
                
                <div class="form-floating mb-4">
                    <input type="email" class="form-control bg-light border-0 rounded-3" id="inputEmailsec" placeholder="E-Mail Bestätigung" v-model="formData.emailConfirm" required>
                    <label for="inputEmailsec" class="text-muted">E-Mail wiederholen *</label>
                </div>

                <div class="row g-2">
                    <div class="col-6 form-floating mb-3">
                        <input type="password" class="form-control bg-light border-0 rounded-3" id="inputPassword" placeholder="Passwort" v-model="formData.password" required>
                        <label for="inputPassword" class="text-muted ms-2">Passwort *</label>
                    </div>
                    <div class="col-6 form-floating mb-3">
                        <input type="password" class="form-control bg-light border-0 rounded-3" id="inputPasswordConfirm" placeholder="Passwort bestätigen" v-model="formData.passwordConfirm" required>
                        <label for="inputPasswordConfirm" class="text-muted ms-2">Passwort bestätigen *</label>
                    </div>
                </div>
            </div>

            <div v-show="currentIndex === 1" class="fade-in">
                <h4 class="fw-bold mb-3"><i class="bi bi-person text-primary me-2"></i>Persönliche Daten</h4>
                
                <div class="row g-2 mb-3">
                    <div class="col-6 form-floating">
                        <input type="text" class="form-control bg-light border-0 rounded-3" id="inputTitel" placeholder="Titel" v-model="formData.title">
                        <label for="inputTitel" class="text-muted ms-2">Titel</label>
                    </div>
                    <div class="col-6 form-floating">
                        <input type="text" class="form-control bg-light border-0 rounded-3" id="inputTitelSuffix" placeholder="Titel Suffix" v-model="formData.titleSuffix">
                        <label for="inputTitelSuffix" class="text-muted ms-2">Titel Suffix</label>
                    </div>
                </div>

                <div class="row g-2 mb-3">
                    <div class="col-6 form-floating">
                        <input type="text" class="form-control bg-light border-0 rounded-3" id="inputVorname" placeholder="Vorname" v-model="formData.firstName" required>
                        <label for="inputVorname" class="text-muted ms-2">Vorname *</label>
                    </div>
                    <div class="col-6 form-floating">
                        <input type="text" class="form-control bg-light border-0 rounded-3" id="inputNachname" placeholder="Nachname" v-model="formData.lastName" required>
                        <label for="inputNachname" class="text-muted ms-2">Nachname *</label>
                    </div>
                </div>

                <div class="row g-2 mb-3">
                    <div class="col-6 form-floating">
                        <input type="date" class="form-control bg-light border-0 rounded-3" id="inputDate" v-model="formData.dob" required>
                        <label for="inputDate" class="text-muted ms-2">Geburtsdatum *</label>
                    </div>
                    <div class="col-6 form-floating">
                        <select id="inputGeschlecht" class="form-select bg-light border-0 rounded-3" v-model="formData.gender" required>
                            <option value="" disabled>Bitte wählen...</option>
                            <option value="m">Männlich</option>
                            <option value="w">Weiblich</option>
                            <option value="div">Divers</option>
                        </select>
                        <label for="inputGeschlecht" class="text-muted ms-2">Geschlecht *</label>
                    </div>
                </div>

                <div class="form-floating mb-3">
                    <input type="text" class="form-control bg-light border-0 rounded-3" id="inputsvnr" placeholder="SVNR" v-model="formData.svnr" required>
                    <label for="inputsvnr" class="text-muted">Sozialversicherungsnummer (10-stellig) *</label>
                </div>
            </div>

            <div v-show="currentIndex === 2" class="fade-in">
                <h4 class="fw-bold mb-3"><i class="bi bi-geo-alt text-primary me-2"></i>Adresse & Zustimmung</h4>
                
                <div class="form-floating mb-3">
                    <input type="text" class="form-control bg-light border-0 rounded-3" id="inputAdress" placeholder="Straße" v-model="formData.street" required>
                    <label for="inputAdress" class="text-muted">Straße & Hausnummer *</label>
                </div>

                <div class="row g-2 mb-3">
                    <div class="col-4 form-floating">
                        <input type="text" class="form-control bg-light border-0 rounded-3" id="inputPLZ" placeholder="PLZ" v-model="formData.zip" required>
                        <label for="inputPLZ" class="text-muted ms-2">PLZ *</label>
                    </div>
                    <div class="col-8 form-floating">
                        <input type="text" class="form-control bg-light border-0 rounded-3" id="inputOrt" placeholder="Ort" v-model="formData.city" required>
                        <label for="inputOrt" class="text-muted ms-2">Ort *</label>
                    </div>
                </div>

                <div class="form-floating mb-4">
                    <input type="text" class="form-control bg-light border-0 rounded-3" id="inputLand" placeholder="Land" v-model="formData.country" required>
                    <label for="inputLand" class="text-muted">Land *</label>
                </div>

                <div class="d-flex flex-column gap-3 bg-light p-3 rounded-4">
                    <div class="form-check">
                        <input class="form-check-input" type="checkbox" id="checkPush" v-model="formData.allowPush">
                        <label class="form-check-label small text-muted" for="checkPush">
                            Die App darf mir bei Bedarf von Hilfeleistungen eine Push-Benachrichtigung schicken.
                        </label>
                    </div>
                    <div class="form-check">
                        <input class="form-check-input" type="checkbox" id="checkLocation" v-model="formData.allowLocation">
                        <label class="form-check-label small text-muted" for="checkLocation">
                            Ich stimme zu, im Krisenfall meinen Standort freizugeben.
                        </label>
                    </div>
                    <div class="form-check">
                        <input class="form-check-input" type="checkbox" id="checkTerms" v-model="formData.acceptTerms" required>
                        <label class="form-check-label small text-muted" for="checkTerms">
                            Mit der Registrierung stimme ich der Erhebung und Verarbeitung meiner Daten zum Zwecke der Ausstellung des digitalen österreichischen Nachweises zu. Nähere Informationen finden Sie in unserer Datenschutzerklärung. *
                        </label>
                    </div>
                </div>
            </div>

            <div v-show="currentIndex === 3" class="fade-in text-center pt-4">
                <div class="bg-primary-subtle text-primary rounded-circle d-flex justify-content-center align-items-center mx-auto mb-4" style="width: 80px; height: 80px;">
                    <i class="bi bi-envelope-check" style="font-size: 3rem;"></i>
                </div>
                <h3 class="fw-bold text-dark mb-2">E-Mail bestätigen</h3>
                <p class="text-muted">Wir haben einen Aktivierungslink an <strong>{{ formData.email || 'Ihre E-Mail' }}</strong> gesendet.</p>
                <p class="small text-muted mt-3 mb-5">Bitte klicken Sie auf den Link in der E-Mail, um Ihren Account zu aktivieren und mit dem Profil-Setup fortzufahren.</p>
                
                <router-link to="/onboarding" class="btn btn-primary text-light rounded-pill px-5 py-3 fw-bold w-100">
                    Weiter zum Onboarding (Demo)
                </router-link>
            </div>

        </form>

        <div v-if="currentIndex < 3" class="d-flex justify-content-between align-items-center mt-5 pt-3 border-top">
            
            <div class="d-flex align-items-center gap-2">
                <button v-if="currentIndex > 0" class="btn btn-light rounded-pill px-4 fw-medium text-muted" @click="goBack">
                    <i class="bi bi-arrow-left me-1"></i> Zurück
                </button>
                <router-link to="/" class="btn btn-link text-muted text-decoration-none fw-medium px-2">
                    Abbrechen
                </router-link>
            </div>

            <div>
                <button v-if="currentIndex < 2" class="btn btn-primary text-light rounded-pill px-5 fw-bold" @click="goNext">
                    Weiter
                </button>
                <button v-if="currentIndex === 2" class="btn btn-success text-light rounded-pill px-5 fw-bold" @click="goNext" :disabled="!formData.acceptTerms">
                    Registrieren
                </button>
            </div>
            
        </div>

    </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const currentIndex = ref(0);

const steps = [
    { icon: 'bi-envelope-at' },
    { icon: 'bi-person' },
    { icon: 'bi-geo-alt' },
    { icon: 'bi-check2' }
];

const progressPercentage = computed(() => {
    return (currentIndex.value / (steps.length - 1)) * 100;
});

const formData = ref({
    email: '',
    emailConfirm: '',
    password: '',
    passwordConfirm: '',
    title: '',
    titleSuffix: '',
    firstName: '',
    lastName: '',
    dob: '',
    gender: '',
    svnr: '',
    street: '',
    zip: '',
    city: '',
    country: '',
    allowPush: false,
    allowLocation: false,
    acceptTerms: false
});

const goNext = () => {
    if (currentIndex.value < steps.length - 1) {
        currentIndex.value++;
    }
};

const goBack = () => {
    if (currentIndex.value > 0) {
        currentIndex.value--;
    }
};

const submitForm = () => {
    // Prevent default form submission if needed
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
</style>