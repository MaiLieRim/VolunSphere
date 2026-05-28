<template>
    <div class="profile-community-page">



        <div class="container bg-primary-subtle p-3 rounded-bottom-4 shadow-sm mb-4">
            <div class="d-flex justify-content-between align-items-center">

                <span class="fw-bold text-primary"><i class="bi bi-people-fill me-2"></i>Netzwerk filtern</span>

                <div class="d-flex align-items-center gap-2">
                    <button class="btn btn-sm text-decoration-underline text-primary border-0 bg-transparent p-0 me-2"
                        @click="resetFilters" v-if="isFilterOpen">
                        Zurücksetzen
                    </button>
                    <button class="btn rounded-circle transition-all"
                        :class="isFilterOpen ? 'btn-primary text-white shadow-sm' : 'btn-light text-primary'"
                        @click="isFilterOpen = !isFilterOpen" style="width: 35px; height: 35px; padding: 0;">
                        <i class="bi bi-funnel-fill"></i>
                    </button>
                </div>
            </div>

            <transition name="filter-accordion">
                <div v-show="isFilterOpen" class="pt-3">
                    <div class="row g-3">
                        <div class="col-12">
                            <label class="text-dark fw-bold small mb-2">Beziehungstyp</label>
                            <select class="form-select bg-white border-0 rounded-pill text-dark px-3 py-2 shadow-sm"
                                v-model="filters.beziehungstyp">
                                <option value="alle">Alle Typen</option>
                                <option value="freunde">Freunde</option>
                                <option value="kollegen">Kolleg*innen</option>
                                <option value="verwandte">Verwandte</option>
                            </select>
                        </div>
                        <div class="col-12">
                            <label class="text-dark fw-bold small mb-2">Community</label>
                            <select class="form-select bg-white border-0 rounded-pill text-dark px-3 py-2 shadow-sm"
                                v-model="filters.community">
                                <option value="alle">Alle Communities</option>
                                <option value="naturschutz">Naturschutz</option>
                                <option value="rotes_kreuz">Rotes Kreuz</option>
                            </select>
                        </div>
                    </div>
                </div>
            </transition>
        </div>

        <div class="container-fluid">

            <div class="d-flex justify-content-between align-items-center mb-3 px-2">
                <h4 class="fw-bold mb-0">{{ isDiagramView ? 'Diagrammansicht' : 'Listenansicht' }}</h4>
                <button class="btn btn-light rounded-circle shadow-sm" style="width: 40px; height: 40px;"
                    @click="toggleView">
                    <i class="bi" :class="isDiagramView ? 'bi-list-ul' : 'bi-diagram-3'"></i>
                </button>
            </div>

            <div class="accordion pb-5" id="networkAccordion">

                <div class="accordion-item border-0 border-bottom rounded-0">
                    <h2 class="accordion-header" id="headingOne">
                        <button class="accordion-button bg-white text-dark fw-bold px-2 shadow-none" type="button"
                            data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="true"
                            aria-controls="collapseOne">
                            Mein Netzwerk
                        </button>
                    </h2>
                    <div id="collapseOne" class="accordion-collapse collapse show" aria-labelledby="headingOne"
                        data-bs-parent="#networkAccordion">
                        <div class="accordion-body px-2 py-4 text-center">

                            <div v-if="isDiagramView" class="network-diagram e mx-auto">
                                <img src="/assets/images/community/network.png" alt="Netzwerkdiagramm" class="img-fluid"
                                    style="max-width: 320px;">
                            </div>

                            <div v-else class="text-start">
                                <ul class="list-group list-group-flush">
                                    <li class="list-group-item d-flex align-items-center px-0">
                                        <img src="https://i.pravatar.cc/50?img=12" class="rounded-circle me-3"
                                            width="40" height="40">
                                        <div>
                                            <h4 class="mb-0">Max Mustermann</h4>
                                            <small class="text-muted">Freunde</small>
                                        </div>
                                    </li>
                                    <li class="list-group-item d-flex align-items-center px-0">
                                        <img src="https://i.pravatar.cc/50?img=20" class="rounded-circle me-3"
                                            width="40" height="40">
                                        <div>
                                            <h4 class="mb-0">Anna Schmidt</h4>
                                            <small class="text-muted">Kolleg*innen</small>
                                        </div>
                                    </li>
                                </ul>
                            </div>

                            <div class="alert alert-info d-flex align-items-start mt-4 p-3 rounded-3 text-start">
                                <div>
                                    <p class="mb-0 small text-dark">Meine verbundenen Personen, eingeteilt nach
                                        Beziehungstypen.</p>
                                </div>
                                <i class="bi bi-info-circle-fill ms-auto text-muted fs-5"></i>
                            </div>

                        </div>
                    </div>
                </div>

                <div class="accordion-item border-0 border-bottom rounded-0">
                    <h2 class="accordion-header" id="headingTwo">
                        <button class="accordion-button collapsed bg-white text-dark fw-bold px-2 shadow-none"
                            type="button" data-bs-toggle="collapse" data-bs-target="#collapseTwo" aria-expanded="false"
                            aria-controls="collapseTwo">
                            Mein Community-Netzwerk
                        </button>
                    </h2>
                    <div id="collapseTwo" class="accordion-collapse collapse" aria-labelledby="headingTwo"
                        data-bs-parent="#networkAccordion">
                        <div class="accordion-body px-2 py-4 text-center">

                            <img src="/assets/images/community/community-network.png" alt="Venn Diagramm"
                                class="img-fluid mx-auto my-4">

                            <div class="alert alert-info d-flex align-items-start mt-4 p-3 rounded-3 text-start">
                                <div>
                                    <p class="mb-0 small text-dark">Zeigt die Anzahl der gemeinsamen Aktivitäten
                                        zwischen deinen Membership-Communities.</p>
                                </div>
                                <i class="bi bi-info-circle-fill ms-auto text-muted fs-5"></i>
                            </div>

                        </div>
                    </div>
                </div>

                <div class="accordion-item border-0 border-bottom rounded-0">
                    <h2 class="accordion-header" id="headingThree">
                        <button class="accordion-button collapsed bg-white text-dark fw-bold px-2 shadow-none"
                            type="button" data-bs-toggle="collapse" data-bs-target="#collapseThree"
                            aria-expanded="false" aria-controls="collapseThree">
                            Gemeinsame Aktivitätsstunden
                        </button>
                    </h2>
                    <div id="collapseThree" class="accordion-collapse collapse" aria-labelledby="headingThree"
                        data-bs-parent="#networkAccordion">
                        <div class="accordion-body px-2 text-muted small">
                            <img src="/assets/images/community/activity-hours.png" alt="Gemeinsame Aktivitätsstunden"
                                class="img-fluid mx-auto my-4">
                            <div class="alert alert-info d-flex align-items-start mt-4 p-3 rounded-3 text-start">
                                <div>
                                    <p class="mb-0 small text-dark">Zeigt die Anzahl der gemeinsamen Aktivitätsstunden,
                                        die du mit deinen
                                        Verbindungen verbracht hast. Je mehr Stunden, desto stärker ist eure Verbindung!
                                    </p>
                                </div>
                                <i class="bi bi-info-circle-fill ms-auto text-muted fs-5"></i>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="accordion-item border-0 border-bottom rounded-0">
                    <h2 class="accordion-header" id="headingFour">
                        <button class="accordion-button collapsed bg-white text-dark fw-bold px-2 shadow-none"
                            type="button" data-bs-toggle="collapse" data-bs-target="#collapseFour" aria-expanded="false"
                            aria-controls="collapseFour">
                            Gesendete Nachrichten
                        </button>
                    </h2>
                    <div id="collapseFour" class="accordion-collapse collapse" aria-labelledby="headingFour"
                        data-bs-parent="#networkAccordion">
                        <div class="accordion-body px-2 text-muted small">
                            <img src="/assets/images/community/sent-messages.png" alt="Gesendete Nachrichten"
                                class="img-fluid mx-auto mb-4 px-4">
                            <div class="alert alert-info d-flex align-items-start mt-4 p-3 rounded-3 text-start">
                                <div>
                                    <p class="mb-0 small text-dark">Zeigt die Anzahl der gesendeten Nachrichten,
                                        die du mit deinen
                                        Verbindungen verbracht hast. Je mehr Stunden, desto stärker ist eure Verbindung!
                                    </p>
                                </div>
                                <i class="bi bi-info-circle-fill ms-auto text-muted fs-5"></i>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import * as bootstrap from 'bootstrap'; // WICHTIG: Bootstrap importieren

// --- State ---
const activeTab = ref('verbindungen');
const isFilterOpen = ref(false);
const isDiagramView = ref(true);

const filters = ref({
    beziehungstyp: 'alle',
    community: 'alle'
});

// --- Methods ---
const resetFilters = () => {
    filters.value = { beziehungstyp: 'alle', community: 'alle' };
};

const toggleView = () => {
    isDiagramView.value = !isDiagramView.value;
};

// --- Lifecycle: Popovers aktivieren ---
onMounted(() => {
    // Sucht alle Elemente mit data-bs-toggle="popover" und aktiviert sie
    const popoverTriggerList = document.querySelectorAll('[data-bs-toggle="popover"]');
    const popoverList = [...popoverTriggerList].map(popoverTriggerEl => new bootstrap.Popover(popoverTriggerEl));
});
</script>

<style scoped>
.transition-all {
    transition: all 0.2s ease-in-out;
}

.form-select {
    box-shadow: none !important;
}

/* Accordion Animation Classes */
.filter-accordion-enter-active,
.filter-accordion-leave-active {
    transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
    max-height: 250px;
    opacity: 1;
    overflow: hidden;
}

.filter-accordion-enter-from,
.filter-accordion-leave-to {
    max-height: 0;
    opacity: 0;
    padding-top: 0 !important;
    margin-top: 0 !important;
}
</style>