<template>
    <div v-if="isOpen">
        <div class="modal-backdrop fade show"></div>

        <div class="modal fade show d-block" tabindex="-1" role="dialog" style="background: rgba(0,0,0,0.5);">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content">
                    <div class="modal-header border-0 pb-0">
                        <h5 class="modal-title fw-bold">Neues Ziel definieren</h5>
                        <button type="button" class="btn-close" @click="closeModal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <div class="mb-3">
                            <label class="form-label fw-bold">Ziel-Titel</label>
                            <input type="text" class="form-control" v-model="goal.title" placeholder="z.B. Sanitäter Weiterbildung">
                        </div>
                        <div class="mb-3">
                            <label class="form-label fw-bold">Zeitraum</label>
                            <input type="text" class="form-control" v-model="goal.timeframe" placeholder="z.B. Bis Ende 2026">
                        </div>
                        <div class="mb-3">
                            <label class="form-label fw-bold">Benötigte Stunden</label>
                            <input type="number" class="form-control" v-model="goal.target" min="1">
                        </div>
                    </div>
                    <div class="modal-footer border-0 pt-0">
                        <button type="button" class="btn btn-light" @click="closeModal">Abbrechen</button>
                        <button type="button" class="btn btn-primary px-4" :disabled="!goal.title || goal.target < 1" @click="save">
                            Ziel speichern
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';

// Define the event we will send back to the parent component
const emit = defineEmits(['save']);

const isOpen = ref(false);
const goal = ref({
    title: '',
    timeframe: '',
    target: 10
});

// Methods to control the modal from the parent
const openModal = () => {
    isOpen.value = true;
};

const closeModal = () => {
    isOpen.value = false;
    // Reset the form after closing
    goal.value = { title: '', timeframe: '', target: 10 };
};

const save = () => {
    if (!goal.value.title || goal.value.target < 1) return;
    
    // Emit the clean data to the parent component
    emit('save', { ...goal.value });
    closeModal();
};

// Expose these methods so the parent component can trigger them
defineExpose({ openModal, closeModal });
</script>

<style scoped>
.modal {
    z-index: 1055;
}
.modal-backdrop {
    z-index: 1050;
}
</style>
