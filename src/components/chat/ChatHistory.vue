<template>
    <div class="chat-container">
        <div class="chat-scroll">
            <div v-if="messages.length === 0" class="text-muted text-center">
                <p>Noch keine Nachrichten vorhanden.</p>
            </div>

            <div v-for="(message, index) in messages" :key="index" class="mb-3">
                <div v-if="isFirstMessageOfDay(message, index)" class="message-date text-center text-muted">
                    {{ formatDate(message.date) }}
                </div>
                <div v-if="message.type === 'action'">
                    <MessageWithAction :message="message" @confirm-message="handleConfirmMessage" />
                </div>
                <div v-else>
                    <Message :message="message" :sender="props.name" />
                </div>
            </div>
        </div>
    </div>

    <div class="message-box">
        <div class="d-flex container justify-content-between">
            <input v-model="newMessage" type="text" class="form-control" placeholder="Nachricht eingeben..."
                @keyup.enter="sendMessage">
            <button class="btn btn-primary" @click="sendMessage">Senden</button>
        </div>
    </div>

</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue';
import MessageWithAction from "./MessageWithAction.vue"
const user = ref(localStorage.getItem('username')); // Get role
import conversationsData from '@/assets/data/conversations.json'; // Update with the correct path
import Message from './Message.vue';
import { formatDate } from '@/assets/js/formatDate.js';

const props = defineProps({
    name: {
        type: String,
        required: true
    }
});
const messages = ref([]);

const newMessage = ref("");
const handleConfirmMessage = (message) => {
    messages.value.push(message); // Add confirmation message inside the same array
    scrollToBottom();
};

const sendMessage = () => {
    if (newMessage.value.trim() !== "") {
        messages.value.push({
            text: newMessage.value,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            date: new Date(),
            avatar: "/assets/images/liselotte.png",
            sender: user.value,
        });
        newMessage.value = "";
        scrollToBottom();
    }
};

// Check if the message is the first one of the day
const isFirstMessageOfDay = (message, index) => {
    if (index === 0) return true; // Always show the date for the first message
    const currentDate = new Date(message.date);
    const previousMessage = messages.value[index - 1];
    const previousDate = new Date(previousMessage.date);

    return currentDate.getDate() !== previousDate.getDate(); // Show date if the day is different from the previous message
};

const scrollToBottom = () => {
    nextTick(() => {
        const chat = document.querySelector('.chat-scroll');
        if (chat) chat.scrollTop = chat.scrollHeight;
    });
};

onMounted(() => {
    messages.value = conversationsData.conversations.filter(conv =>
        conv.messages.some(msg => msg.sender === props.name)).flatMap(conv => conv.messages);
    scrollToBottom();
});
</script>
