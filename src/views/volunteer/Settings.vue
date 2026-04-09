<template>
    <Navbar title="Profil bearbeiten"></Navbar>

    <TabNavigation
        :tabs="[{ name: 'personal', label: 'Persönliche Daten' }, { name: 'privacy', label: 'Datenschutz' }, { name: 'app', label: 'App-Einstellungen' }]"
        :currentTab="activeTab" @update:tab="activeTab = $event" :activity-search="false" />

    <div v-if="activeTab === 'personal'" class="pt-0 content-container ">
        <div class="card-body ">
            <form @submit.prevent="saveSettings">
                <div class="row g-3 mb-4">
                    <div class="col-md-2">
                        <label class="form-label text-muted small mb-1">Präfix</label>
                        <input type="text" class="form-control" v-model="editUser.honorificPrefix"
                            placeholder="z.B. Mag.">
                    </div>
                    <div class="col-md-4">
                        <label class="form-label text-muted small mb-1">Vorname</label>
                        <input type="text" class="form-control" v-model="editUser.givenName" required>
                    </div>
                    <div class="col-md-4">
                        <label class="form-label text-muted small mb-1">Nachname</label>
                        <input type="text" class="form-control" v-model="editUser.familyName" required>
                    </div>
                    <div class="col-md-2">
                        <label class="form-label text-muted small mb-1">Suffix</label>
                        <input type="text" class="form-control" v-model="editUser.honorificSuffix"
                            placeholder="z.B. PhD">
                    </div>

                    <div class="col-md-4">
                        <label class="form-label text-muted small mb-1">Geburtsdatum</label>
                        <input type="text" class="form-control" v-model="editUser.birthDate" placeholder="TT.MM.JJJJ">
                    </div>
                    <div class="col-md-4">
                        <label class="form-label text-muted small mb-1">Geschlecht</label>
                        <select class="form-select" v-model="editUser.gender">
                            <option value="weiblich">Weiblich</option>
                            <option value="männlich">Männlich</option>
                            <option value="divers">Divers</option>
                            <option value="keine Angabe">Keine Angabe</option>
                        </select>
                    </div>
                    <div class="col-md-4">
                        <label class="form-label text-muted small mb-1">SV-Nummer</label>
                        <input type="text" class="form-control" v-model="editUser.insuranceNumber">
                    </div>
                </div>

                <h4 class="fw-bold mb-3 border-bottom pb-2 text-primary">Kontaktdaten</h4>

                <div class="row g-3 mb-4">
                    <div class="col-md-6">
                        <label class="form-label text-muted small mb-1">E-Mail Adresse</label>
                        <input type="email" class="form-control" v-model="editUser.email" required>
                    </div>
                    <div class="col-md-6">
                        <label class="form-label text-muted small mb-1">Telefonnummer</label>
                        <input type="tel" class="form-control" v-model="editUser.telephone">
                    </div>
                </div>

                <h4 class="fw-bold mb-3 border-bottom pb-2 text-primary">Adresse</h4>

                <div class="row g-3 mb-5">
                    <div class="col-12">
                        <label class="form-label text-muted small mb-1">Straße & Hausnummer</label>
                        <input type="text" class="form-control" v-model="editUser.address.streetAddress">
                    </div>
                    <div class="col-md-4">
                        <label class="form-label text-muted small mb-1">PLZ</label>
                        <input type="text" class="form-control" v-model="editUser.address.postalCode">
                    </div>
                    <div class="col-md-4">
                        <label class="form-label text-muted small mb-1">Ort / Region</label>
                        <input type="text" class="form-control" v-model="editUser.address.addressRegion">
                    </div>
                    <div class="col-md-4">
                        <label class="form-label text-muted small mb-1">Land</label>
                        <input type="text" class="form-control" v-model="editUser.address.addressCountry" readonly>
                    </div>
                </div>

                <div class="d-flex justify-content-end gap-2 border-top pt-3">
                    <button type="button" class="btn btn-light px-4" @click="cancel">Abbrechen</button>
                    <button type="submit" class="btn btn-primary px-4">Speichern</button>
                </div>

            </form>
        </div>
    </div>
    <div v-if="activeTab === 'privacy'" class="pt-0 content-container">
        <div class="card-body">


            <div class="mb-4">

                <h4 class="fw-bold mb-3 text-primary border-bottom">Profil-Sichtbarkeit</h4>
                <p class="small text-muted mb-2">Wer darf dein Profil in der Community sehen?</p>
                <select class="form-select mb-3" v-model="editUser.privacy.profileVisibility">
                    <option value="public">Alle Community-Mitglieder</option>
                    <option value="organization">Nur meine Organisationen</option>
                    <option value="private">Niemand (Privat)</option>
                </select>
            </div>

            <div class="mb-4">
                <h4 class="fw-bold mb-3 text-primary border-bottom">Datenfreigabe</h4>

                <div class="form-check form-switch mb-3 d-flex align-items-center justify-content-between p-0">
                    <div>
                        <label class="form-check-label text-dark" for="toggleContact">Kontaktdaten anzeigen</label>
                        <div class="small text-muted">Andere Freiwillige können meine E-Mail und Telefonnummer sehen.
                        </div>
                    </div>
                    <input class="form-check-input fs-4 ms-3" type="checkbox" role="switch" id="toggleContact"
                        v-model="editUser.privacy.showContactInfo">
                </div>

                <div class="form-check form-switch mb-3 d-flex align-items-center justify-content-between p-0">
                    <div>
                        <label class="form-check-label text-dark" for="toggleSearch">Suchbarkeit</label>
                        <div class="small text-muted">Organisationen dürfen mich bei akutem Bedarf finden und anfragen.
                        </div>
                    </div>
                    <input class="form-check-input fs-4 ms-3" type="checkbox" role="switch" id="toggleSearch"
                        v-model="editUser.privacy.allowSearch">
                </div>
            </div>

            <div class="d-flex justify-content-end gap-2 border-top pt-3 mt-4">
                <button type="button" class="btn btn-light px-4" @click="cancel">Abbrechen</button>
                <button type="button" class="btn btn-primary px-4" @click="saveSettings">Speichern</button>
            </div>
        </div>
    </div>
    <div v-if="activeTab === 'app'" class="pt-0 content-container ">
        <div class="mb-4">
            <h4 class="fw-bold mb-3 border-bottom pb-2 text-primary">Darstellung</h4>
            <label class="form-label fw-bold mb-1">Thema</label>
            <ChangeTheme></ChangeTheme>
        </div>
        <div class="mb-4">
            <label class="form-label fw-bold mb-1">Schriftgröße</label>
            <p class="small text-muted mb-2">Passe die Textgröße der App an deine Bedürfnisse an.</p>
            <select class="form-select" v-model="editUser.appSettings.fontSize">
                <option value="small">Klein</option>
                <option value="medium">Normal (Standard)</option>
                <option value="large">Groß</option>
                <option value="xlarge">Sehr groß</option>
            </select>
        </div>

        <h4 class="fw-bold mb-3 border-bottom pb-2 text-primary">Sprache</h4>
        <div class="mb-4">

            <p class="small text-muted mb-2">Wähle die Anzeigesprache für die Benutzeroberfläche aus.</p>
            <select class="form-select" v-model="editUser.appSettings.language">
                <option value="de">Deutsch</option>
                <option value="en">English</option>
            </select>
        </div>

        <div class="d-flex justify-content-end gap-2 border-top pt-3 mt-4">
            <button type="button" class="btn btn-light px-4" @click="cancel">Abbrechen</button>
            <button type="button" class="btn btn-primary px-4" @click="saveSettings">Speichern</button>
        </div>

    </div>

</template>
<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import Navbar from '@/components/navbars/Navbar.vue';
import TabNavigation from '@/components/navbars/TabNavigation.vue';
import ChangeTheme from '@/components/ChangeTheme.vue';

// Import raw data
import rawUser from "@/assets/data/volunteer.json";

const router = useRouter();

const activeTab = ref('personal');

// Deep clone the user data
const editUser = ref(JSON.parse(JSON.stringify(rawUser)));

// Ensure the privacy object exists so our v-models don't throw undefined errors
if (!editUser.value.privacy) {
    editUser.value.privacy = {
        profileVisibility: 'organization',
        showContactInfo: false,
        allowSearch: true
    };
}

// Simulate saving to a database/store
const saveSettings = () => {
    // Re-construct the full display name
    const prefix = editUser.value.honorificPrefix ? `${editUser.value.honorificPrefix} ` : '';
    const suffix = editUser.value.honorificSuffix ? `, ${editUser.value.honorificSuffix}` : '';
    editUser.value.name = `${prefix}${editUser.value.givenName} ${editUser.value.familyName}${suffix}`;

    console.log("Saving user data:", editUser.value);

    // Here you would normally: await api.updateUser(editUser.value)
    alert("Einstellungen erfolgreich aktualisiert!");

    // Navigate back to the profile

};

const cancel = () => {
    router.back();
};
// Deep clone the user data


// Ensure the appSettings object exists for our new fields
if (!editUser.value.appSettings) {
    editUser.value.appSettings = {
        language: 'de',     // Default language
        fontSize: 'medium'  // Default font size
    };
}
</script>