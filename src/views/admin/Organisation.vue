<template>
    <Navbar title="Organisation"></Navbar>
    <TabNavigation :tabs="[
        { name: 'Übersicht', label: 'Übersicht' },
        { name: 'Aufgaben', label: 'Aufgaben' },
        { name: 'Nachweise', label: 'Nachweise' },
        { name: 'Mitglieder', label: 'Mitglieder' }
    ]" :currentTab="currentTab" @update:tab="currentTab = $event" :background-class="'bg-white'" />

    <div v-if="currentTab === 'Übersicht'" class="content-container">
        <div class="cover bg-primary">
            <div class="row">
                <div class="col-4 ">
                    <img src="/assets/images/tasks/firedepartment/fireflyVolunteer.png" alt="profile picture"
                        width="118" height="121" class="profile-img rounded-circle border border-2 border-white">
                </div>
                <div class="col-8 ps-0 text-light">
                    <div class="p-2 text-center">
                        <h3>{{ org.name }}</h3>
                    </div>
                    <div class="row pb-3 text-center">
                        <div class="col">
                            <i class="fs-2 bi bi-qr-code-scan"></i><br>
                            <small>QR-Code</small>
                        </div>
                        <div class="col">
                            <a class="text-white text-decoration-none" :href="'mailto:' + org.contactPoint.email">
                                <i class="fs-2 bi bi-envelope-at-fill"></i><br> <small>Email</small>
                            </a>
                        </div>
                        <div class="col">
                            <a class="text-white text-decoration-none" :href="'tel:' + org.contactPoint.telephone">
                                <i class="fs-2 bi bi-telephone-fill"></i><br>
                                <small>Phone</small>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="card cover-subtext bg-primary-subtle shadow-sm">
            <div class="card-body ">
                <div class="d-flex justify-content-between align-items-center ">
                    <h3>Über Uns</h3>
                    <button class="btn text-primary" @click="toggleEdit">
                        <template v-if="isEditable">
                            <i class="bi bi-check-circle-fill fs-2"></i>
                        </template>
                        <template v-else>
                            <i class="bi bi-pencil-square fs-3"></i>
                        </template>
                    </button>
                </div>
                <template v-if="isEditable">
                    <textarea v-model="org.description" class="mb-5 form-control" id="exampleFormControlTextarea1"
                        rows="6"></textarea>
                </template>
                <template v-else>
                    <p class="mb-5">{{ org.description }}</p>
                </template>
                <div class="d-flex gap-2 justify-content-end ">
                    <button class="btn btn-outline-primary" type="submit">Empfehlen</button>
                </div>
                <small class="text-muted">
                    #Feuerwehr #Tierrettung #Organisationstalent
                </small>
            </div>
        </div>

        <div class="accordion p-2" id="accordionExample">
            <div class="accordion-item border-0 shadow-sm mb-3 rounded overflow-hidden">
                <h2 class="accordion-header" id="headingOne">
                    <button class="accordion-button bg-light text-dark fw-bold" type="button" data-bs-toggle="collapse"
                        data-bs-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
                        Allgemeine Angaben
                    </button>
                </h2>
                <div id="collapseOne" class="accordion-collapse collapse show" data-bs-parent="#accordionExample">
                    <div class="accordion-body bg-white p-0">
                        <ul class="list-group list-group-flush text-muted small">
                            
                            <li class="list-group-item px-3 py-3 d-flex align-items-start border-bottom">
                                <i class="bi bi-geo-alt-fill text-primary fs-5 me-3 mt-1"></i>
                                <div>
                                    <strong class="d-block text-dark mb-1">Adresse</strong>
                                    {{ org.address.streetAddress }}<br>
                                    {{ org.address.postalCode }} {{ org.address.addressLocality }}<br>
                                    {{ org.address.addressCountry }}
                                </div>
                            </li>
                            
                            <li class="list-group-item px-3 py-3 d-flex align-items-center border-bottom">
                                <i class="bi bi-telephone-fill text-primary fs-5 me-3"></i>
                                <div>
                                    <strong class="d-block text-dark mb-1">Mobile</strong>
                                    <a :href="'tel:' + org.contactPoint.telephone" class="text-decoration-none text-muted">
                                        {{ org.contactPoint.telephone }}
                                    </a>
                                </div>
                            </li>
                            
                            <li class="list-group-item px-3 py-3 border-bottom-0 bg-light bg-opacity-50">
                                <div class="d-flex justify-content-between align-items-center">
                                    <div>
                                        <strong class="d-block text-dark mb-1">UID Nr.</strong>
                                        {{ org.identifier }}
                                    </div>
                                    <div class="text-end">
                                        <strong class="d-block text-dark mb-1">Gegründet</strong>
                                        {{ org.foundingDate }}
                                    </div>
                                </div>
                            </li>

                        </ul>
                    </div>
                </div>
            </div>
            <div class="accordion-item border-0 shadow-sm mb-3 rounded overflow-hidden">
                <h2 class="accordion-header" id="headingThree">
                    <button class="accordion-button bg-light text-dark fw-bold collapsed" type="button"
                        data-bs-toggle="collapse" data-bs-target="#collapseThree" aria-expanded="false"
                        aria-controls="collapseThree">
                        Zusatzinfo
                    </button>
                </h2>
                <div id="collapseThree" class="accordion-collapse collapse" data-bs-parent="#accordionExample">
                    <div class="accordion-body bg-white p-0">
                        <ul class="list-group list-group-flush small text-muted">

                            <li class="list-group-item px-3 py-3 border-bottom">
                                <strong class="d-block text-dark mb-1">
                                    <i class="bi bi-bank2 text-primary me-2"></i>Spendenkonto
                                </strong>
                                IBAN: ATXX XXXX XXXX XXXX XXXX<br>
                                BIC: SPKDATS1XXX<br>
                            </li>

                            <li class="list-group-item px-3 py-3 border-bottom">
                                <strong class="d-block text-dark mb-2">
                                    <i class="bi bi-share-fill text-primary me-2"></i>Social Media
                                </strong>
                                <div class="d-flex gap-3 fs-5">
                                    <a href="#" class="text-muted"><i class="bi bi-instagram"></i></a>
                                    <a href="#" class="text-muted"><i class="bi bi-facebook"></i></a>
                                    <a href="#" class="text-muted"><i class="bi bi-linkedin"></i></a>
                                </div>
                            </li>

                            <li class="list-group-item px-3 py-3 border-bottom">
                                <strong class="d-block text-dark mb-2">
                                    <i class="bi bi-person-badge-fill text-primary me-2"></i>Ansprechpartner
                                </strong>
                                <div class="d-flex align-items-center gap-2 mt-2">
                                    <div class="bg-primary bg-opacity-10 text-primary rounded-circle d-flex justify-content-center align-items-center fw-bold"
                                        style="width: 38px; height: 38px;">
                                        M
                                    </div>
                                    <div>
                                        <span class="d-block fw-bold text-dark">Max Mustermann</span>
                                        <span class="text-muted"
                                            style="font-size: 0.75rem;">Freiwilligenkoordinator</span>
                                    </div>
                                </div>
                            </li>

                            <li class="list-group-item px-3 py-3 border-bottom-0">
                                <strong class="d-block text-dark mb-2">
                                    <i class="bi bi-cloud-arrow-down-fill text-primary me-2"></i>Downloads
                                </strong>
                                <div class="d-flex flex-column gap-2 mt-2">
                                    <a href="#" class="text-decoration-none text-muted d-flex align-items-center">
                                        <i class="bi bi-filetype-pdf text-danger me-2 fs-5"></i> Vereinsstatuten.pdf
                                    </a>
                                    <a href="#" class="text-decoration-none text-muted d-flex align-items-center">
                                        <i class="bi bi-filetype-pdf text-danger me-2 fs-5"></i> Jahresbericht_2025.pdf
                                    </a>
                                </div>
                            </li>

                        </ul>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <div v-if="currentTab === 'Aufgaben'" class="content-container px-3 min-vh-100">

        <div class="d-flex justify-content-between align-items-center mb-4">
            <h2 class="fw-bold mb-0">Aufgaben</h2>
            <RouterLink to="/organisation-tasks"
                class="btn btn-primary btn-sm rounded-pill fw-bold shadow-sm px-3 d-flex align-items-center">
                Verwalten <i class="bi bi-arrow-right-short fs-5 ms-1"></i>
            </RouterLink>
        </div>

        <div class="d-flex flex-column gap-3 mb-5">
            <VerificationRequestsCard :message="`9 Personen melden sich um 4 Aufgaben zu erledigen. Bitte bestätigen.`"
                class="shadow-sm rounded-4 border-start border-4 border-warning" />
        </div>

        <div class="d-flex justify-content-between align-items-center mb-3">
            <h2 class="mb-0 text-dark">Laufende Aufgaben</h2>

            <div class="btn-group btn-group-sm shadow-sm" role="group">
                <button class="btn px-3"
                    :class="viewMode === 'list' ? 'btn-primary text-white' : 'btn-outline-secondary bg-white'"
                    @click="viewMode = 'list'">
                    <i class="bi bi-list"></i>
                </button>
                <button class="btn px-3"
                    :class="viewMode === 'calendar' ? 'btn-primary text-white' : 'btn-outline-secondary bg-white'"
                    @click="viewMode = 'calendar'">
                    <i class="bi bi-calendar-month"></i>
                </button>
                <button class="btn px-3"
                    :class="viewMode === 'map' ? 'btn-primary text-white' : 'btn-outline-secondary bg-white'"
                    @click="viewMode = 'map'">
                    <i class="bi bi-geo-alt"></i>
                </button>
            </div>
        </div>

        <div v-if="viewMode === 'list'">
            <TaskList :items="items"></TaskList>

        </div>

        <div v-if="viewMode === 'calendar'" class="fade-in">
            <CalendarView :tasks="items" />
        </div>

        <div v-if="viewMode === 'map'" class="fade-in position-relative"
            style="height: 400px; border-radius: 12px; overflow: hidden;">
            <MapView />
        </div>

        <h4 class="fw-bold mb-3 mt-5">Vergangene Aufgaben (Dashboard)</h4>
        <div class="row g-3">
            <div class="col-6">
                <div class="card bg-primary bg-opacity-10 border-0 rounded-4 p-3 text-center h-100 shadow-sm">
                    <h2 class="fw-bold text-primary mb-0">124</h2>
                    <small class="text-dark fw-medium mt-1">Erledigte Aufgaben</small>
                </div>
            </div>
            <div class="col-6">
                <div class="card bg-success bg-opacity-10 border-0 rounded-4 p-3 text-center h-100 shadow-sm">
                    <h2 class="fw-bold text-success mb-0">850</h2>
                    <small class="text-dark fw-medium mt-1">Geleistete Stunden</small>
                </div>
            </div>
            <div class="col-12">
                <div
                    class="card bg-white border-0 rounded-4 p-3 d-flex flex-row align-items-center justify-content-between shadow-sm">
                    <div>
                        <h4 class="fw-bold text-dark mb-0">34</h4>
                        <small class="text-muted">Aktive Helfer im letzten Monat</small>
                    </div>
                    <i class="bi bi-people-fill text-primary opacity-50" style="font-size: 2.5rem;"></i>
                </div>
            </div>
        </div>
    </div>

    <div v-if="currentTab === 'Nachweise'" class="content-container px-3 ">
        <h2 class="fw-bold mb-4">Nachweise</h2>
        <VerificationRequestsCard
            :message="`Sie haben ${items.length} neue Nachweisanfragen, bitte geben Sie diese frei.`"
            class="shadow-sm rounded-4 border-start border-4 border-primary mb-4" />
        <TaskList :items="items" :title="'Offene Nachweise'" />
    </div>

    <div v-if="currentTab === 'Mitglieder'" class="content-container px-3 ">
     
        <TableSearch :items="org.member" />
    </div>
</template>

<script setup>
import Navbar from "@/components/navbars/Navbar.vue";
import organisations from "@/assets/data/organisations.json";
import TableSearch from "@/components/TableSearch.vue";
import VerificationRequestsCard from "@/components/verification/VerificationRequestsCard.vue";
import TaskList from "@/components/tasks/TaskList.vue";
import CalendarView from "@/components/TaskSearch/CalendarView.vue";
import MapView from "@/components/TaskSearch/MapView.vue";
import { ref, computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useTasks } from "@/composables/useTasks";
import user from "@/assets/data/admin.json";
import TabNavigation from "@/components/navbars/TabNavigation.vue";

const route = useRoute();
const { allTasks } = useTasks();

const isEditable = ref(false);
const currentTab = ref('Übersicht');

// KORREKTUR 1: Von "taskView" auf "viewMode" umbenannt, damit es zum Template passt
const viewMode = ref('list');

onMounted(() => {
    const tabParam = route.query.tab;
    if (tabParam) {
        currentTab.value = tabParam;
    }
});

const selectTab = (tab) => { currentTab.value = tab; };

const toggleEdit = () => {
    isEditable.value = !isEditable.value;
};

const items = computed(() => {
    return allTasks.value;
});

// KORREKTUR 2: myTasks hinzugefügt (nimmt fürs Erste einfach alle Aufgaben oder du filterst sie hier)
const myTasks = computed(() => {
    return allTasks.value; // Hier kannst du später auf nur "zukünftige" Aufgaben filtern
});

const org = computed(() => {
    return organisations.find(o =>
        o.member?.some(m => m.name === user.name)
    )
})
</script>

<style scoped>
.content-container {
    padding: unset;
}

.min-vh-100 {
    min-height: 100vh;
}
</style>