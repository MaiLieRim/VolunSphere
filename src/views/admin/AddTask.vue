<template>
    <div class="bg-primary-subtle p-4" style="min-height: 100vh; display: flex; flex-direction: column;">
        <div class="position-relative mb-4">
            <button class="btn-close position-absolute top-0 end-0" @click="closeForm"></button>
            <div class="d-flex align-items-center gap-3 mb-4">
                <div class="bg-success rounded-circle p-2" style="width: 50px; height: 50px; display: flex; align-items: center; justify-content: center;">
                    <i class="bi bi-people text-white fs-5"></i>
                </div>
                <div>
                    <h3 class="mb-0">Neue Aufgabe</h3>
                    <small class="text-muted">Soccer Club Linz United</small>
                </div>
            </div>
        </div>

        <div class="row g-4" style="flex: 1; min-height: 400px;">
            <!-- Step 1: Basisinfo Section -->
            <div v-if="currentStep === 1" class="col-md-12">
                <h3 class="text-muted mb-3">Basisinfo</h3>
                <div class="mb-3">
                    <label class="form-label small fw-bold">Titel der Aufgabe</label>
                    <input type="text" class="form-control form-control-sm" v-model="form.title" 
                        placeholder="Trainerein für unsere Nachwuchsteams">
                </div>
                <div class="mb-3">
                    <label class="form-label small fw-bold">Kategorie</label>
                    <select class="form-select form-select-sm" v-model="form.category">
                        <option>Bildung und Soziales</option>
                        <option>Sport</option>
                        <option>Umwelt</option>
                    </select>
                </div>
                <div class="mb-3">
                    <label class="form-label small fw-bold">Beschreibung</label>
                    <textarea class="form-control form-control-sm bg-white" rows="6" v-model="form.description"
                        placeholder="Unterstütze die Soccer Club Linz United als Nachwuchstrainer/in und fördere die fußballerische Entwicklung von Kindern und Jugendlichen."></textarea>
                </div>
            </div>

            <!-- Step 2: Voraussetzungen Section -->
            <div v-if="currentStep === 2" class="col-md-12">
                <h3 class="text-muted mb-3">Voraussetzungen</h3>
                <div class="mb-3">
                    <label class="form-label small fw-bold">Skills</label>
                    <input type="text" class="form-control form-control-sm" v-model="form.skills"
                        placeholder="Motivation, Geduld und Freude an der Arbeit mit Kindern und Jugendlichen.">
                </div>
                <div class="mb-3">
                    <label class="form-label small fw-bold">Voraussetzungen</label>
                    <input type="text" class="form-control form-control-sm" v-model="form.requirements"
                        placeholder="Führerschein B">
                </div>
            </div>

            <!-- Step 3: Zeitraum & Ort Section -->
            <div v-if="currentStep === 3" class="col-md-12">
                <h3 class="text-muted mb-3">Zeitraum & Ort</h3>
                <div class="mb-3">
                    <label class="form-label small fw-bold">Startdatum</label>
                    <input type="date" class="form-control form-control-sm" v-model="form.startDate">
                </div>
                <div class="mb-3">
                    <label class="form-label small fw-bold">Startzeit</label>
                    <input type="time" class="form-control form-control-sm" v-model="form.startTime">
                </div>
                <div class="form-check mb-3">
                    <input class="form-check-input" type="checkbox" v-model="form.recurring" id="recurringCheck">
                    <label class="form-check-label small" for="recurringCheck">ganztägig</label>
                </div>
                <div class="mb-3">
                    <label class="form-label small fw-bold">Adresse</label>
                    <input type="text" class="form-control form-control-sm" v-model="form.address"
                        placeholder="Sportplatzstraße 10">
                </div>
                <div class="row g-2">
                    <div class="col-md-6">
                        <label class="form-label small fw-bold">PLZ</label>
                        <input type="text" class="form-control form-control-sm" v-model="form.postalCode"
                            placeholder="4020">
                    </div>
                    <div class="col-md-6">
                        <label class="form-label small fw-bold">Ort</label>
                        <input type="text" class="form-control form-control-sm" v-model="form.city"
                            placeholder="Linz">
                    </div>
                </div>
            </div>
        </div>

        <!-- Navigation -->
        <div class="mt-5 d-flex justify-content-between align-items-center">
            <ul class="pagination mb-0">
                <li class="page-item" :class="{ active: currentStep === 1 }">
                    <button class="page-link" @click="currentStep = 1">1</button>
                </li>
                <li class="page-item" :class="{ active: currentStep === 2 }">
                    <button class="page-link" @click="currentStep = 2">2</button>
                </li>
                <li class="page-item" :class="{ active: currentStep === 3 }">
                    <button class="page-link" @click="currentStep = 3">3</button>
                </li>
            </ul>
            <button class="btn btn-primary" @click="nextStep" :disabled="currentStep === 3 && !isFormComplete">
                {{ currentStep === 3 ? 'Erstellen' : 'Weiter' }}
            </button>
        </div>
    </div>
</template>
<script setup>
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import { useTaskApi } from "@/assets/js/taskApi";

const router = useRouter();
const { createTask } = useTaskApi();

const currentStep = ref(1);

const form = ref({
    title: "",
    category: "Bildung und Soziales",
    description: "",
    skills: "",
    requirements: "",
    startDate: "",
    startTime: "",
    recurring: false,
    address: "",
    postalCode: "",
    city: ""
});

const isFormComplete = computed(() => {
    return (
        form.value.title.trim() !== "" &&
        form.value.category.trim() !== "" &&
        form.value.description.trim() !== "" &&
        form.value.skills.trim() !== "" &&
        form.value.requirements.trim() !== "" &&
        form.value.startDate !== "" &&
        form.value.address.trim() !== "" &&
        form.value.postalCode.trim() !== "" &&
        form.value.city.trim() !== ""
    );
});

const closeForm = () => {
    router.push('/organisation?tab=Aufgaben');
};

const nextStep = () => {
    if (currentStep.value < 3) {
        currentStep.value++;
    } else {
        submitForm();
    }
};

const submitForm = async () => {
    const result = await createTask(form.value);
    if (result.success) {
        console.log("Task saved:", result.task);
    } else {
        console.error("Failed to save task:", result.message);
    }
    router.push('/organisation?tab=Aufgaben');
};
</script>
