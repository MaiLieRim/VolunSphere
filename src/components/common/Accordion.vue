<template>
    <div class="accordion mt-3" id="accordionInfo">

        <div class="accordion-item border-0 shadow-sm mb-3 rounded overflow-hidden">
            <h2 class="accordion-header" id="headingOne">
                <button class="accordion-button bg-light text-dark fw-bold" type="button" data-bs-toggle="collapse"
                    data-bs-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
                    Persönliche Daten
                </button>
            </h2>
            <div id="collapseOne" class="accordion-collapse collapse show" data-bs-parent="#accordionInfo">
                <div class="accordion-body pt-4">
                    <div class="d-flex flex-column gap-4">

                        <div class="d-flex align-items-start">
                            <div class="bg-primary-subtle text-primary rounded-circle d-flex justify-content-center align-items-center me-3"
                                style="width: 40px; height: 40px; min-width: 40px;">
                                <i class="bi bi-geo-alt fs-5"></i>
                            </div>
                            <div>
                                <span class="d-block small text-muted fw-bold mb-1">Adresse</span>
                                <span class="d-block text-dark lh-sm">
                                    {{ volunteer.address.streetAddress }}<br>
                                    {{ volunteer.address.postalCode }} {{ volunteer.address.addressRegion }}<br>
                                    {{ volunteer.address.addressCountry }}
                                </span>
                            </div>
                        </div>

                        <div class="d-flex align-items-center">
                            <div class="bg-primary-subtle text-primary rounded-circle d-flex justify-content-center align-items-center me-3"
                                style="width: 40px; height: 40px; min-width: 40px;">
                                <i class="bi bi-telephone fs-5"></i>
                            </div>
                            <div>
                                <span class="d-block small text-muted fw-bold mb-1">Mobile</span>
                                <span class="d-block text-dark">{{ volunteer.telephone }}</span>
                            </div>
                        </div>


                        <div class="d-flex align-items-center">
                            <div class="bg-primary-subtle text-primary rounded-circle d-flex justify-content-center align-items-center me-3"
                                style="width: 40px; height: 40px; min-width: 40px;">
                                <i class="bi bi-calendar-event fs-5"></i>
                            </div>
                            <div>
                                <span class="d-block small text-muted fw-bold mb-1">Geburtsdatum</span>
                                <span class="d-block text-dark">{{ volunteer.birthDate }}</span>
                            </div>
                        </div>

                        <div class="d-flex align-items-center">
                            <div class="bg-primary-subtle text-primary rounded-circle d-flex justify-content-center align-items-center me-3"
                                style="width: 40px; height: 40px; min-width: 40px;">
                                <i class="bi bi-chat-quote fs-5"></i>
                            </div>
                            <div>
                                <span class="d-block small text-muted fw-bold mb-1">Pronomen</span>
                                <span class="d-block text-dark">{{ volunteer.pronouns || 'Keine Angabe' }}</span>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>

        <div class="accordion-item border-0 shadow-sm mb-3 rounded overflow-hidden">
            <h2 class="accordion-header" id="headingTwo">
                <button class="accordion-button collapsed bg-light text-dark fw-bold" type="button"
                    data-bs-toggle="collapse" data-bs-target="#collapseTwo" aria-expanded="false"
                    aria-controls="collapseTwo">
                    Kompetenzen
                </button>
            </h2>
            <div id="collapseTwo" class="accordion-collapse collapse" data-bs-parent="#accordionInfo">
                <div class="accordion-body">
                    <div class="mb-3">
                        <div v-for="comp in volunteer.skills" :key="comp.name" class="d-flex align-items-center mb-2">
                            <div class="w-50 text-truncate pe-2 small">
                                {{ comp.name }}
                            </div>
                            <div class="w-50 d-flex border border-secondary bg-light" style="height: 12px;">
                                <div class="flex-fill border-end border-secondary"
                                    :class="{ 'bg-primary': comp.score >= 1 }"></div>
                                <div class="flex-fill border-end border-secondary"
                                    :class="{ 'bg-primary': comp.score >= 2 }"></div>
                                <div class="flex-fill" :class="{ 'bg-primary': comp.score >= 3 }"></div>
                            </div>
                        </div>
                    </div>
                    <div class="text-center mt-3">
                        <button class="btn btn-outline-secondary btn-sm fw-medium text-primary border-secondary-subtle">
                            <i class="bi bi-bar-chart-fill me-1 text-dark"></i> Details
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <div class="accordion-item border-0 shadow-sm mb-3 rounded overflow-hidden">
            <h2 class="accordion-header" id="headingThree">
                <button class="accordion-button collapsed bg-light text-dark fw-bold" type="button"
                    data-bs-toggle="collapse" data-bs-target="#collapseThree" aria-expanded="false"
                    aria-controls="collapseThree">
                    Verfügbarkeit
                </button>
            </h2>
            <div id="collapseThree" class="accordion-collapse collapse" data-bs-parent="#accordionInfo">
                <div class="accordion-body">
                    <div v-for="av in volunteer.availability" :key="av.day" class="d-flex justify-content-between mb-2">
                        <div class="text-truncate fw-medium text-dark">
                            {{ av.day }}
                        </div>
                        <div class="text-muted">
                            {{ av.time }}
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="accordion-item border-0 shadow-sm mb-3 rounded overflow-hidden">
            <h2 class="accordion-header" id="headingFour">
                <button class="accordion-button collapsed bg-light text-dark fw-bold" type="button"
                    data-bs-toggle="collapse" data-bs-target="#collapseFour" aria-expanded="false"
                    aria-controls="collapseFour">
                    Qualifikationen
                </button>
            </h2>
            <div id="collapseFour" class="accordion-collapse collapse" data-bs-parent="#accordionInfo">
                <div class="accordion-body">
                    <QualificationList :items="qualifications.qualifications" />
                </div>
            </div>
        </div>

    </div>
</template>

<script setup>
import { ref } from "vue";
import rawVolunteer from "@/assets/data/volunteer.json";
import QualificationList from "@/components/lists/ListWithImage.vue";
import qualifications from "@/assets/data/qualifications.json";
// According to best practices (agent.md), imported data should be wrapped in a ref for reactivity
const volunteer = ref(rawVolunteer);

</script>

<style scoped>
/* Removes default bootstrap accordion borders for a cleaner card-like look */
.accordion-item {
    border: none !important;
}
</style>