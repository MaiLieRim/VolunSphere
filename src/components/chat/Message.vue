<template>
    <div class="d-flex" :class="messageClass">
        <div class="my-auto">
            <img :src="message.avatar" alt="Avatar" class="chat-avatar">
        </div>
        <div class="message-container">
            <div class="message shadow-sm p-2 rounded" :class="messageBubbleClass">
                <strong v-if="message.name">{{ message.name }}</strong>
                <p class="mb-1">{{ message.text }}</p>
            </div>
        </div>
    </div>
    <div :class="messageClass" class="d-flex">
        <small class="text-muted">{{ message.time }}</small>
    </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  message: {
    type: Object,
    required: true
  },
  sender: {
    type: String,
    required: true
  }
});

const messageClass = computed(() => {
  return props.message.sender !== props.sender ? 'flex-row-reverse' : 'justify-content-start';
});

// Dynamic class handling for confirmation messages
const messageBubbleClass = computed(() => {
  if (props.message.type === 'confirm') {
    return 'confirm-message text-success ms-2'; // Special styling for confirmations
  }
  return props.message.sender !== props.sender ? 'bg-primary text-white ms-2' : 'bg-light me-2';
});
</script>

<style>
.chat-container {
    height: calc(100vh - 230px);
    display: flex;
    flex-direction: column;
}

.chat-scroll {
    flex-grow: 1;
    overflow-y: auto;
    padding: 0.2rem;
    height: 100%;
}

.message {
    position: relative;
    padding: 10px 15px;
    border-radius: 10px;
    margin: 0 1rem;
}

/* Confirmation message styling */
.confirm-message {
    font-weight: bold;
    background-color:var(--bs-gray-200) !important;
    color:  var(--bs-gray-600)!important;
}

.message::after {
    content: '';
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    width: 0;
    height: 0;
    border-style: solid;
}

.message.bg-primary::after {
    right: -10px;
    border-width: 10px 0 10px 10px;
    border-color: transparent transparent transparent var(--bs-primary);
    filter: drop-shadow(0.125rem 0.125rem 0.1rem rgba(0, 0, 0, 0.1)); /* Schatten nach rechts unten */

}
.message.confirm-message::after {
    right: -10px;
    border-width: 10px 0 10px 10px;
    border-color: transparent transparent transparent var(--bs-gray-200);
    filter: drop-shadow(0.125rem 0.125rem 0.1rem rgba(0, 0, 0, 0.1)); /* Schatten nach rechts unten */

}
.message.bg-light::after {
    left: -10px;
    border-width: 10px 10px 10px 0;
    border-color: transparent var(--bs-light) transparent transparent;
    filter: drop-shadow(-0.125rem 0.125rem 0.1rem rgba(0, 0, 0, 0.1)); /* Schatten nur links/unten */
}

.chat-avatar {
    width: 40px;
    height: 40px;
    border-radius: 50%;
}

.message-box {
    display: flex;
    align-items: center;
    padding: 10px;
    background-color: #f8f9fa;
    border-top: 1px solid #ddd;
    position: fixed;
    bottom: 0;
    padding-bottom: 6rem;
    left: 0;
    right: 0;
    width: 100%;
}

.message-box input {
    flex-grow: 1;
    margin-right: 10px;
}
</style>
