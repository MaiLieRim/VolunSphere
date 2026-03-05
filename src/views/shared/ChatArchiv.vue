<script setup>
import { formatDate } from '@/assets/js/formatDate.js'; 
import Footer from '@/components/Footer.vue';
import Navbar from '@/components/navbars/Navbar.vue';

import { ref, computed } from 'vue';
import conversationsData from '@/assets/data/conversations.json';

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
                img: 'assets/images/'+otherParticipant.sender.split(" ")[0].toLowerCase()+'.png',
                unread: 1 // Modify based on unread logic
            };
        });
});
</script>

<template>
    <Navbar title="Chat"></Navbar>
    <div class="tab-navigation" >
        <div class="nav nav-underline d-inline-flex">
            <div class="d-flex align-items-center ">
                <div class="position-relative ">
                    <input type="text" class="form-control rounded-pill search-bar pe-5" placeholder="Search..."
                        aria-label="Search">
                    <button class="text-primary btn position-absolute top-50 end-0 translate-middle-y" type="button">
                        <i class="bi bi-search"></i>
                    </button>
                </div>
            </div>
            <div class="nav-item">
                <a class="nav-link text-primary active" aria-current="page" href="#">Übersicht</a>
            </div>
            <div class="nav-item">
                <a class="nav-link" href="#">Archiv</a>
            </div>
        </div>
    </div>
    <div class="chat-container">
        <div class="chat-scroll">
            <ul class="list-unstyled  mb-0">
                <li v-for="chat in chats" :key="chat.name" class=" p-2 border-bottom"
                    :class="{ 'bg-body-tertiary': chat.unread > 0 }">
                    <RouterLink :to="`/chat/${encodeURIComponent(chat.name)}`"
                        class=" text-decoration-none d-flex justify-content-between">
                        <div class="col-9 d-flex flex-row">
                            <img :src="chat.img" alt="avatar"
                                class="rounded-circle d-flex align-self-center me-2 shadow-1-strong" width="60" height="60">
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

    <Footer></Footer>
</template>

<style scoped>

.chat-container {
    height: calc(100vh - 170px);
}

.search-bar {
    transition: width 0.3s ease-in-out;
    width: 0px;
    background-color: transparent;
    z-index: 100 !important;
    position: relative;
    border: 0;
}

.search-bar:focus {
    width: 250px !important;
}

</style>
