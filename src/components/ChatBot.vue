<template>
    <div class="chatbot-container">
        
        <transition name="fade-slide">
            <div v-if="isOpen" class="chat-window card border-0 shadow-lg rounded-4 overflow-hidden">
                
                <div class="bg-primary text-white p-3 d-flex justify-content-between align-items-center shadow-sm">
                    <div class="d-flex align-items-center">
                        <div class="bg-white text-primary rounded-circle d-flex justify-content-center align-items-center me-2" style="width: 35px; height: 35px;">
                            <i class="bi bi-robot fs-5"></i>
                        </div>
                        <div>
                            <h6 class="mb-0 fw-bold lh-1">Onboarding Assistant</h6>
                            <small class="opacity-75" style="font-size: 0.75rem;">Automatisierter Chat</small>
                        </div>
                    </div>
                    <button class="btn-close btn-close-white" @click="toggleChat" aria-label="Close"></button>
                </div>

                <div class="chat-body p-3 bg-light overflow-auto" ref="chatBody">
                    <div class="d-flex flex-column gap-2">
                        <div v-for="(msg, index) in messages" :key="index"
                             class="message-bubble p-2 px-3 rounded-4 shadow-sm"
                             :class="msg.sender === 'user' ? 'bg-primary text-white align-self-end user-bubble' : 'bg-white border align-self-start text-dark bot-bubble'">
                            {{ msg.text }}
                        </div>
                        
                        <div v-if="isTyping" class="bg-white border align-self-start text-dark p-2 px-3 rounded-4 shadow-sm bot-bubble text-muted small">
                            <i class="bi bi-three-dots typing-animation"></i>
                        </div>
                    </div>
                </div>

                <div class="p-2 bg-white border-top">
                    <form @submit.prevent="sendMessage" class="input-group">
                        <input type="text" class="form-control rounded-pill border-secondary-subtle px-3 shadow-none bg-light"
                               v-model="newMessage" placeholder="Antworten..." :disabled="onboardingComplete" required>
                        <button type="submit" class="btn btn-primary rounded-circle ms-2 d-flex justify-content-center align-items-center shadow-sm" 
                                style="width: 42px; height: 42px; min-width: 42px;" :disabled="onboardingComplete">
                            <i class="bi bi-send-fill ms-1"></i>
                        </button>
                    </form>
                </div>

            </div>
        </transition>

        <button class="btn btn-primary rounded-circle shadow-lg chat-fab d-flex justify-content-center align-items-center"
                @click="toggleChat" :class="{ 'bg-dark border-dark': isOpen }">
            <i class="bi transition-icon" :class="isOpen ? 'bi-x-lg' : 'bi-chat-dots-fill'"></i>
        </button>

    </div>
</template>

<script setup>
import { ref, nextTick } from 'vue';

// --- UI State ---
const isOpen = ref(false);
const newMessage = ref('');
const chatBody = ref(null);
const isTyping = ref(false);

// --- Conversation Logic ---
const currentStep = ref(0);
const onboardingComplete = ref(false);

// We will store the user's answers here
const collectedData = ref({
    interests: '',
    qualifications: '',
    skills: '',
    availability: ''
});

// Initial greeting message focusing on the first step
const messages = ref([
    { sender: 'bot', text: 'Hallo! Lass uns dein Profil gemeinsam einrichten. In welchen Bereichen möchtest du dich engagieren? (z.B. Flüchtlingshilfe, Sport, Umwelt)' }
]);

const toggleChat = () => {
    isOpen.value = !isOpen.value;
    if (isOpen.value) {
        scrollToBottom();
    }
};

const sendMessage = async () => {
    if (!newMessage.value.trim() || onboardingComplete.value) return;

    const userText = newMessage.value.trim();
    
    // 1. Add user's message
    messages.value.push({ sender: 'user', text: userText });
    newMessage.value = '';
    await scrollToBottom();

    // 2. Simulate bot "typing"
    isTyping.value = true;
    await scrollToBottom();

    // 3. Process answer and give next prompt
    setTimeout(async () => {
        isTyping.value = false;
        let botReply = '';

        // Step Machine for the onboarding flow
        switch(currentStep.value) {
            case 0:
                collectedData.value.interests = userText;
                botReply = 'Klasse! Hast du bereits formale Qualifikationen oder Ausbildungen? (z.B. Erste Hilfe, Führerschein, Pflege)';
                currentStep.value++;
                break;
            case 1:
                collectedData.value.qualifications = userText;
                botReply = 'Sehr gut. Welche Soft-Skills zeichnen dich aus? (z.B. Teamfähigkeit, Organisation, Zuverlässigkeit)';
                currentStep.value++;
                break;
            case 2:
                collectedData.value.skills = userText;
                botReply = 'Fast fertig! An welchen Tagen und zu welchen Zeiten bist du meistens verfügbar? (z.B. Wochenends, abends)';
                currentStep.value++;
                break;
            case 3:
                collectedData.value.availability = userText;
                botReply = 'Perfekt, vielen Dank! Dein Profil ist nun komplett erfasst. Ich übernehme die Daten in dein Formular.';
                currentStep.value++;
                onboardingComplete.value = true;
                
                // You can emit the data here if you want to sync it to your main form!
                console.log("Collected Onboarding Data:", collectedData.value);
                break;
        }

        messages.value.push({ sender: 'bot', text: botReply });
        await scrollToBottom();
    }, 1200);
};

const scrollToBottom = async () => {
    await nextTick();
    if (chatBody.value) {
        chatBody.value.scrollTop = chatBody.value.scrollHeight;
    }
};
</script>

<style scoped>
.chatbot-container { position: fixed; bottom: 50px; right: 25px; z-index: 1050; }
.chat-fab { width: 65px; height: 65px; transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1); }
.chat-fab i { font-size: 1.8rem; transition: transform 0.3s ease; }
.chat-fab:hover { transform: translateY(-3px); box-shadow: 0 10px 20px rgba(0,0,0,0.15) !important; }
.chat-fab:active { transform: scale(0.9); }
.chat-window { position: absolute; bottom: 85px; right: 0; width: 360px; max-width: calc(100vw - 50px); height: 500px; max-height: calc(100vh - 120px); display: flex; flex-direction: column; transform-origin: bottom right; }
.chat-body { flex: 1; scroll-behavior: smooth; }
.message-bubble { max-width: 85%; word-wrap: break-word; font-size: 0.95rem; line-height: 1.4; }
.user-bubble { border-bottom-right-radius: 4px !important; }
.bot-bubble { border-bottom-left-radius: 4px !important; }
.typing-animation { display: inline-block; animation: typing 1.5s infinite; }
@keyframes typing { 0% { opacity: 0.3; } 50% { opacity: 1; } 100% { opacity: 0.3; } }
.fade-slide-enter-active, .fade-slide-leave-active { transition: opacity 0.3s ease, transform 0.3s cubic-bezier(0.2, 0.8, 0.2, 1); }
.fade-slide-enter-from, .fade-slide-leave-to { opacity: 0; transform: translateY(30px) scale(0.9); }
</style>