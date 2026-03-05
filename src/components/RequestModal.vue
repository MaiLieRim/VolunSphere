<template>
    <Teleport to="body">
        <div v-if="showModal" class="modal fade show d-block " tabindex="-1">
            <div class="modal-dialog modal-dialog-centered ">
                <div class="modal-content bg-primary rounded-5 p-2">
                    <div class="modal-body " v-if="userRole === 'volunteer'">
                        <h1 class="mb-3">
                            Dein Nachweis wurde beim FC Mentora (Herbert Mayer) angefordert.
                        </h1>
                        <p>Bei einer positiven Bestätigung, erfolgt bei Freigabe ein Eintrag in den Freiwilligenpass. </p>
                    </div>
                    <div class="modal-body" v-if="userRole === 'admin'">
                        <h1 class="mb-3">
                            Liselotte Pulvers Nachweis wurde automatisch generiert und kann versendet werden.
                        </h1>
                        <p>Da ihre Organisation zertifiziert ist, erfolgt bei Freigabe ein Eintrag in den Freiwilligenpass.
                        </p>
                    </div>
                    <div class="modal-footer border-0">
                        <button type="button" class="btn btn-priamry text-light" @click="closeModal">Abbrechen</button>
                        <button type="button" class="btn btn-outline-light px-3" @click="confirmAction">OK</button>
                    </div>
                </div>
            </div>
        </div>
        <div v-if="showModal" class="modal-backdrop fade show"></div> <!-- Dark overlay -->
    </Teleport>
</template>

<script setup>
import { ref, defineExpose, defineEmits } from "vue";
const userRole = ref(localStorage.getItem('userRole')); // Get role
const emit = defineEmits(['confirm']);

// Emit an event when the "OK" button is clicked
const confirmAction = () => {
    emit('confirm', 'item-id');  // Pass the item's ID or index
    closeModal();
};
const showModal = ref(false);

const openModal = () => {
    showModal.value = true;
};

const closeModal = () => {
    showModal.value = false;
};



// Allow parent component to call openModal()
defineExpose({ openModal });
</script>

<style scoped>
.modal {
    display: block;
    background: rgba(0, 0, 0, 0.5);
}
</style>