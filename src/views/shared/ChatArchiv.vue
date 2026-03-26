<script setup>
import { formatDate } from '@/assets/js/formatDate.js';
import Footer from '@/components/Footer.vue';
import Navbar from '@/components/navbars/Navbar.vue';

import { ref, computed } from 'vue';
import conversationsData from '@/assets/data/conversations.json';
import TabNavigation from '@/components/navbars/TabNavigation.vue';

// Simulated logged-in user (Replace with actual auth logic)
const loggedInUser = ref(localStorage.getItem('username')).value; // Get role
// Filter conversations where the logged-in user is a participant
const chats = computed(() => {
    return conversationsData.conversations
        .filter(conversation =>
            conversation.messages.some(msg => msg.sender.toLowerCase() === loggedInUser)
        )

        .map(conversation => {
            const lastMessage = conversation.messages[conversation.messages.length - 1];
            const otherParticipant = conversation.messages.find(msg => msg.sender.toLowerCase() !== loggedInUser);

            return {
                name: otherParticipant.sender,
                message: lastMessage.text,
                time: lastMessage.date,
                img: 'assets/images/profile-pictures/' + otherParticipant.sender.split(" ")[0].toLowerCase() + '.png' || 'assets/images/profile-pictures/default.png',
                unread: 1 // Modify based on unread logic
            };
        });
});

const currentTab = ref('Übersicht');
</script>

<template>
    <Navbar title="Chat"></Navbar>
    <TabNavigation :tabs="[
        { name: 'Übersicht', label: 'Übersicht' },
        { name: 'Archiv', label: 'Archiv' }
        ]" :currentTab="currentTab" @update:tab="currentTab = $event" :background-class="'bg-body-secondary'" :show-search="false"/>
    
    <div class="content-container">
        <div v-if="currentTab === 'Übersicht'">
            
        <div class="chat-scroll">
            <ul class="list-unstyled  mb-0">
                <li v-for="chat in chats" :key="chat.name" class=" p-2 border-bottom"
                    :class="{ 'bg-body-tertiary': chat.unread > 0 }">
                    <RouterLink :to="`/chat/${encodeURIComponent(chat.name)}`"
                        class=" text-decoration-none d-flex justify-content-between">
                        <div class="col-9 d-flex flex-row">
                            <img :src="chat.img" alt="avatar"
                                class="rounded-circle d-flex align-self-center me-2 shadow-1-strong" width="60"
                                height="60" @error="$event.target.src = '/assets/images/profile-pictures/default.png'">
                            <div class="col-8 pt-1">
                                <p class="text-truncate fw-bold mb-0">{{ chat.name }}</p>
                                <p class="text-truncate  small text-muted">{{ chat.message }}</p>
                            </div>
                        </div>
                        <div class="col-3  pt-1">
                            <p class="small text-end text-muted mb-1">{{ formatDate(chat.time) }}</p>
                            <span v-if="chat.unread > 0" class="badge bg-primary  float-end">{{ chat.unread }}</span>
                        </div>
                    </RouterLink>
                </li>
            </ul>
        </div>
        </div>
    </div>

    <Footer></Footer>
</template>

<style scoped>
.content-container {
    height: calc(100vh - 170px);
    --bs-gutter-x: 1.5rem;
    --bs-gutter-y: 0;
    width: 100%;
    padding-right: calc(var(--bs-gutter-x) * 0.5);
    padding-left: calc(var(--bs-gutter-x) * 0.5);
    margin-right: auto;
    margin-left: auto;
    padding-bottom: unset !important;
    padding-top: unset !important;
}


</style>
