<template>
    <div class="d-flex">
        <div class="card border-0 shadow-sm mx-2">
            <div class="card-header fw-bold">{{ props.message.header }}</div>
            <div class="card-body d-flex justify-content-between align-items-center">
                <p class="mb-0">{{ message.text }}</p>
                <button v-if="userRole === 'admin'" 
                    class="btn btn-success btn-accept" 
                    v-on:click="sendConfirmMessage" 
                    :disabled="isButtonDisabled"  >
                    <i class="fs-1 bi bi-check2-circle"></i>
                    <small>Annehmen</small>
                </button>
            </div>
        </div>
    </div>
    <div  class="d-flex justify-content-end message-time d-flex">
        <small class="text-muted">{{ message.time }}</small>
    </div>
</template>

<script setup>
import { computed, ref } from 'vue'
const userRole = ref(localStorage.getItem('userRole')); // Get role

const props = defineProps({
  message: {
    type: Object,
    required: true
  },

});

const emit = defineEmits(["confirm-message"]); // New event emitter
const user = ref(localStorage.getItem('username')); // Get role


const isButtonDisabled = ref(false);

const sendConfirmMessage = () => {
    // Button nach dem Klick deaktivieren
    isButtonDisabled.value = true;

    const confirmMessage = {
        type: "confirm", // Mark as a confirmation message
        text: "Nachweis erfolgreich bestätigt.",
        sender: user.value,
        avatar: "/assets/images/" + user.value.split(" ")[0] + ".png",
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        date: new Date()
    };

    emit("confirm-message", confirmMessage); // Send message to parent
};
</script>

<style>
.btn-accept {
    line-height: 110% !important;
    padding: 0.75rem;
}
</style>
