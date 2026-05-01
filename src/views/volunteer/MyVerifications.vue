<script setup>
import { ref, computed } from 'vue';
import Navbar from '@/components/navbars/Navbar.vue';
import Footer from '@/components/common/Footer.vue';
import verifications from '@/assets/data/verifications.json';
import applicationsData from '@/assets/data/applications.json';
import VerificationList from '@/components/verification/VerificationList.vue';

// --- NEU: Wichtige Importe ---
// Achte darauf, dass der Dateiname hier mit deiner echten Datei übereinstimmt!
import SkillVerificationModal from '@/components/verification/SkillVerificationModal.vue';
import { useTasks } from '@/composables/useTasks';

// --- 1. Constants & Configuration ---
const STATUS = {
  PENDING: 'Pending',
  REQUESTED: 'Requested',
  DELETED: 'Deleted',
  CONFIRMED: 'Confirmed',
  CERTIFIED: 'Certified'
};

const user = ref(localStorage.getItem('username') || "Liselotte Pulver");

const verificationsList = ref(Array.isArray(verifications.itemListElement) ? verifications.itemListElement : []);
const applicationsList = ref(Array.isArray(applicationsData.itemListElement) ? applicationsData.itemListElement : []);

const verificationsByUser = computed(() => {
  return verificationsList.value.filter(item =>
    item.requester?.name?.toLowerCase() === user.value.toLowerCase()
  );
});

// --- 2. Computed Properties für die Listen ---
const pendingRequests = computed(() => {
  return verificationsByUser.value.filter(item =>
    item.status === STATUS.PENDING ||
    item.status === STATUS.REQUESTED
  );
});

const verifiedItems = computed(() => {
  return verificationsByUser.value.filter(item =>
    item.status === STATUS.CONFIRMED ||
    item.status == STATUS.CERTIFIED
  );
});

// --- 3. NEU: Abgeschlossene Aufgaben für den Nachweis holen ---
const { allTasks } = useTasks();
const completedTasks = computed(() => {
  const approvedTaskIds = new Set(
    applicationsList.value
      .filter(app =>
        app.volunteerName?.toLowerCase() === user.value.toLowerCase() &&
        ['APPROVED', 'COMPLETED', 'VERIFIED'].includes(app.status?.toUpperCase())
      )
      .map(app => app.taskId)
  );

  const tasks = Array.isArray(allTasks.value) ? allTasks.value : [];

  return tasks.filter(task => {
    const taskId = task.identifier?.value || task.id || '';
    return task.status?.toLowerCase() === 'completed' || approvedTaskIds.has(taskId);
  });
});

// --- 4. Event Handler für neuen Nachweis ---
const handleNewSkillVerification = (verificationData) => {
  console.log("Neuer Kompetenz-Nachweis beantragt:", verificationData);
  
  // Da skills in der neuen Version ein Array ist, machen wir daraus einen schönen String (z.B. "Erste Hilfe, Logistik")
  const skillString = verificationData.skills ? verificationData.skills.join(', ') : 'Kompetenz';

  verificationsList.value.push({
      type: verificationData.type,
      name: `Zertifikat: ${skillString}`,
      status: verificationData.status,
      // FIX: user.value ist bereits der Text "Liselotte Pulver". user.value.name war undefined!
      requester: { name: user.value }, 
      evidenceIds: verificationData.evidenceTaskIds, 
      identifier: { value: `skill-verif-${Date.now()}` }
  });
};
</script>

<template>
  <Navbar title="Nachweise"></Navbar>
  
  <div class="content-container">

    <div class="d-flex justify-content-between align-items-center mb-3">
      <h3 class="fw-bold mb-0 flex-shrink-1 text-truncate" style="min-width: 0;">Offene Anfragen</h3>
      <button class="btn btn-primary rounded-pill shadow-sm flex-shrink-0" @click="$refs.skillModal.openForm()">
        <i class="bi bi-plus-lg me-1 me-lg-2"></i>
        <span class="d-none d-lg-inline">Kompetenz-Nachweis beantragen</span>
        <span class="d-lg-none">Nachweis</span>
      </button>
    </div>

    <SkillVerificationModal 
      ref="skillModal" 
      :completedTasks="completedTasks" 
      @submit-skill-verification="handleNewSkillVerification" 
    />

    <VerificationList :items="pendingRequests" />

    <h3 class="fw-bold mt-4 mb-3">Nachweise</h3>
    <VerificationList :items="verifiedItems" />
    
  </div>

  <Footer></Footer>
</template>

<style scoped>
/* Hier eventuell noch dein Padding für den Footer rein */
</style>