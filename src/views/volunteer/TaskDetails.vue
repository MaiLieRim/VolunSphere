<script setup>
import { ref, computed } from 'vue';
import { useRoute } from 'vue-router';
import Navbar from '@/components/navbars/Navbar.vue';
import { useTasks } from '@/composables/useTasks';
import ChatHistory from '@/components/chat/ChatHistory.vue';
import TaskRecommendationBar from '@/components/tasks/TaskRecommendationBar.vue';

// --- DATEN REAKTIV MACHEN ---
import verificationsData from '@/assets/data/verifications.json';
import applicationsData from '@/assets/data/applications.json';
import rawUser from "@/assets/data/volunteer";

const verificationsList = ref(verificationsData.itemListElement);
const applicationsList = ref(applicationsData.itemListElement);
const user = ref(rawUser);

const props = defineProps({
  itemId: String
});

const route = useRoute();
const { getTaskById } = useTasks();
const jobPosting = computed(() => getTaskById(route.params.itemId));
const backRoute = computed(() => route.query.backRoute);

const isChatOpen = ref(false);

// --- COMPUTED STATUS ---

// Prüfen, ob Aufgabe bereits verifiziert/abgeschlossen ist
const isTaskCompleted = computed(() => {
  if (!jobPosting.value) return false;
  return verificationsList.value.some(v => v.identifier?.value === jobPosting.value.id);
});

// Prüfen, ob bereits eine Bewerbung (Application) existiert
const isTaskRequested = computed(() => {
  if (!jobPosting.value) return false;
  return applicationsList.value.some(a => 
    a.taskId === jobPosting.value.id && a.volunteerName === user.value.name
  );
});

const toggleChat = () => {
  isChatOpen.value = !isChatOpen.value;
};

// --- LOGIK: AUFGABE ÜBERNEHMEN ---
const requestTask = () => {
  if (!jobPosting.value || isTaskCompleted.value || isTaskRequested.value) return;

  // Neues Bewerbungs-Objekt erstellen
  const newApplication = {
    "@type": "Application",
    "volunteerName": user.value.name,
    "taskId": jobPosting.value.id,
    "status": "PENDING",
    "appliedDate": new Date().toISOString().split('T')[0],
    "notes": "Automatisch über App übernommen"
  };

  // In die reaktive Liste pushen
  applicationsList.value.push(newApplication);
  
  // Optional: Feedback für den User
  console.log('Task application submitted for:', jobPosting.value.id);
};
</script>
<template>
  <div class="d-flex flex-column min-vh-100">
    <Navbar title="Details" :backRoute="backRoute"></Navbar>
    
    <div class="content-container flex-grow-1">
      <div v-if="jobPosting">
        
        <div class="img-with-date">
          <img :src="`/assets/images/tasks/${jobPosting.image}`" class="card-img-top img-fluid w-100 object-fit-cover" height="215" alt="Task Image">
          
          <div class="date date-box col-3">
            <small>{{ jobPosting.club }}</small>
            <h1>{{ jobPosting.day }}</h1>
            <small>{{ jobPosting.month }}</small>
          </div>
          
          <button class="request-btn btn shadow-sm" 
            :class="{
              'btn-success': isTaskCompleted,
              'btn-primary': isTaskRequested && !isTaskCompleted,
              'btn-outline-primary bg-white': !isTaskCompleted && !isTaskRequested
            }"
            :disabled="isTaskCompleted"
            @click="requestTask">
            {{ isTaskCompleted ? 'Aufgabe abgeschlossen' : (isTaskRequested ? 'Aufgabe angefragt' : 'Aufgabe übernehmen') }}
          </button>
        </div>

        <div class="position-relative pb-5">
          <div class="px-3 pt-5 mt-2">
            
            <div class="d-flex align-items-center mb-2">
              <img :src="`/assets/images/logo/${jobPosting.logo}`" class="rounded-circle me-2" alt="Club Logo" width="40" height="40">
              <small class="text-muted">{{ jobPosting.hiringOrganization?.name }}</small>
            </div>

            <h4 class="fw-bold mb-3">{{ jobPosting.title }}</h4>

            <p class="text-muted fs-6 mb-3">
              {{ jobPosting.description }}
            </p>

            <div class="mb-3 text-muted">
              <small class="d-block mb-1"><i class="bi bi-geo-alt-fill"></i> {{ jobPosting.location }}</small>
              <small class="d-block"><i class="bi bi-tools"></i> {{ jobPosting.qualifications }} B</small>
            </div>

            <div class="d-flex align-items-center text-muted small mt-4 border-bottom pb-3">
              <div class="d-flex align-items-center me-3">
                <img src="https://placehold.co/24" class="rounded-circle me-1" alt="User">
                <span>4/8+</span>
              </div>
              <div class="d-flex align-items-center">
                <i class="bi bi-chat me-1"></i>
                <span>messages 100+</span>
              </div>
            </div>
            
            <TaskRecommendationBar :match="90"></TaskRecommendationBar>
          </div>

          <button class="fab-chat btn btn-primary rounded-circle shadow" @click="toggleChat">
            <i class="bi bi-plus fs-1"></i>
          </button>
        </div>

        <transition name="slide-up">
          <div v-if="isChatOpen" class="chat-sliding-panel shadow-lg d-flex flex-column">
            
            <div class="d-flex justify-content-between align-items-center p-3 bg-white border-bottom">
              <h5 class="mb-0 fw-bold">Chat</h5>
              <button class="btn-close" @click="toggleChat"></button>
            </div>

            <div class="flex-grow-1 overflow-auto bg-light">
               <ChatHistory :name="jobPosting.applicationContact?.name" />
            </div>
            
          </div>
        </transition>
      </div>

      <div v-else class="p-4">
        <div class="alert alert-danger" role="alert">
          Diese Aufgabe gibt es nicht!
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped>
.img-with-date {
  position: relative;
}

.date {
  position: absolute;
  bottom: 0;
}

.request-btn {
  position: absolute;
  bottom: 10px;
  right: 10px;
}

.fab-chat {
  position: absolute;
  right: 10px;
  bottom: 0px;
  width: 56px;
  height: 56px;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Slide-Up Panel Overlay */
.chat-sliding-panel {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 80vh;
  /* Takes up 80% of the screen */
  background-color: white;
  z-index: 1050;
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;
  overflow: hidden;
}

/* Slide-up transition animations */
.slide-up-enter-active,
.slide-up-leave-active {
  transition: transform 0.3s ease-out;
}

.slide-up-enter-from,
.slide-up-leave-to {
  transform: translateY(100%);
}
</style>
