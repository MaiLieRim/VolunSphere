<template>
  <transition name="slide-in">
    <div v-if="isOpen" class="fullscreen-overlay bg-light d-flex flex-column">
      
      <header class="bg-white px-3 py-3 d-flex align-items-center justify-content-between shadow-sm sticky-top">
        <div class="d-flex align-items-center">
          <button class="btn btn-link text-dark p-0 text-decoration-none me-3" @click="closeForm">
            <i class="bi bi-chevron-down fs-5"></i>
          </button>
          <h5 class="mb-0 fw-bold">Zertifizierung anfragen</h5>
        </div>
      </header>

      <main class="flex-grow-1 overflow-auto p-3">
        
        <div class="bg-white p-1 rounded-pill shadow-sm mb-4 d-flex border">
          <button class="btn flex-fill rounded-pill py-2 fw-medium text-nowrap" style="font-size: 0.85rem;"
                  :class="requestType === 'passeintrag' ? 'btn-primary shadow-sm' : 'btn-light text-muted'"
                  @click="requestType = 'passeintrag'">
            Freiwilligenpasseintrag
          </button>
          <button class="btn flex-fill rounded-pill py-2 fw-medium text-nowrap" style="font-size: 0.85rem;"
                  :class="requestType === 'nachweis' ? 'btn-primary shadow-sm' : 'btn-light text-muted'"
                  @click="requestType = 'nachweis'">
            Detaillierter Nachweis
          </button>
        </div>

        <div class="mb-4 bg-white p-3 rounded-4 shadow-sm border border-light">
          <h5 class="fw-bold text-dark mb-3">1. Einsatzdaten & Funktion</h5>
          
          <div class="form-floating mb-4">
            <input type="text" class="form-control bg-light border-0" id="funktion" placeholder="z.B. Gruppenleiterin" v-model="funktion">
            <label for="funktion" class="text-muted">Deine Funktion / Rolle (Pflichtfeld)</label>
          </div>

          <div class="d-flex bg-light rounded-3 p-1 mb-3 border">
            <button class="btn flex-fill rounded-3 py-2 fw-bold" style="font-size: 0.75rem;"
                    :class="selectionMode === 'tasks' ? 'bg-white shadow-sm text-primary' : 'text-muted border-0'"
                    @click="selectionMode = 'tasks'">
              <i class="bi bi-list-check me-1"></i> Aus App wählen
            </button>
            <button class="btn flex-fill rounded-3 py-2 fw-bold" style="font-size: 0.75rem;"
                    :class="selectionMode === 'manual' ? 'bg-white shadow-sm text-primary' : 'text-muted border-0'"
                    @click="selectionMode = 'manual'">
              <i class="bi bi-pencil-square me-1"></i> Manuell eingeben
            </button>
          </div>

          <div v-if="selectionMode === 'tasks'" class="fade-in">
            <div class="list-group rounded-3 border overflow-hidden">
              <label v-for="task in completedTasks" :key="task.id" 
                     class="list-group-item list-group-item-action d-flex align-items-center gap-3 py-2 border-0 border-bottom px-2">
                <input class="form-check-input flex-shrink-0 mt-0 shadow-sm" type="checkbox" :value="task.id" v-model="selectedTaskIds">
                <div class="w-100 overflow-hidden">
                  <div class="text-truncate fw-medium small">{{ task.title }}</div>
                  <small class="text-muted" style="font-size: 0.7rem;">{{ formatDate(task.jobStartDate || task.date) }} • {{ task.hours || 4 }}h</small>
                </div>
              </label>
            </div>
            <div v-if="completedTasks.length === 0" class="text-center py-3 text-muted small">
              Keine Einsätze zum Auswählen vorhanden.
            </div>
          </div>

          <div v-if="selectionMode === 'manual'" class="bg-light p-3 rounded-3 border fade-in">
            <div class="form-floating mb-2">
              <input type="text" class="form-control bg-white" placeholder="Organisation" v-model="manualOrganisation">
              <label class="text-muted">Name der Organisation</label>
            </div>
            <div class="row g-2 mb-2">
              <div class="col-6 form-floating">
                <input type="date" class="form-control bg-white" v-model="manualStartDate">
                <label class="text-muted ms-2">Startdatum</label>
              </div>
              <div class="col-6 form-floating">
                <input type="date" class="form-control bg-white" v-model="manualEndDate">
                <label class="text-muted ms-2">Enddatum</label>
              </div>
            </div>
            <div class="form-floating">
              <input type="number" class="form-control bg-white" placeholder="Stunden" v-model="manualHours" min="1">
              <label class="text-muted">Gesamtstunden</label>
            </div>
          </div>

          <div class="bg-primary-subtle rounded-3 p-2 mt-3 d-flex justify-content-between align-items-center" 
               v-if="calculatedTotalHours > 0">
            <div>
              <small class="d-block text-primary fw-bold" style="font-size: 0.7rem;">BERECHNETER ZEITRAUM</small>
              <span class="small text-dark fw-medium">{{ calculatedDateRange }}</span>
            </div>
            <div class="text-end border-start border-primary border-opacity-25 ps-3">
              <small class="d-block text-primary fw-bold" style="font-size: 0.7rem;">GESAMT</small>
              <span class="fs-5 fw-bold text-dark">{{ calculatedTotalHours }}h</span>
            </div>
          </div>
        </div>

        <div v-if="requestType === 'nachweis'" class="fade-in">
          
          <div class="mb-4 bg-white p-3 rounded-4 shadow-sm border border-light">
            <h5 class="fw-bold text-dark mb-2"><i class="bi bi-list-check text-primary me-2"></i>Geleistete Tätigkeiten</h5>
            <p class="text-muted small mb-3">Wähle Tätigkeiten aus oder füge eigene hinzu.</p>
            
            <div class="input-group mb-3">
              <input type="text" class="form-control bg-light border-0" placeholder="Eigene Tätigkeit..." v-model="customActivity" @keydown.enter.prevent="addCustomActivity">
              <button class="btn btn-primary px-3" type="button" @click="addCustomActivity" :disabled="!customActivity.trim()"><i class="bi bi-plus-lg"></i></button>
            </div>

            <div class="d-flex flex-wrap gap-2">
              <button v-for="activity in allActivities" :key="activity" 
                      class="btn rounded-pill btn-sm fw-medium transition-all"
                      :class="selectedActivities.includes(activity) ? 'btn-primary shadow-sm' : 'btn-outline-secondary border-light-subtle text-dark bg-light'"
                      @click="toggleActivity(activity)">
                <i class="bi" :class="selectedActivities.includes(activity) ? 'bi-check2 me-1' : 'bi-plus me-1'"></i>
                {{ activity }}
              </button>
            </div>
          </div>

          <div class="mb-4 bg-white p-3 rounded-4 shadow-sm border border-light">
            <h5 class="fw-bold text-dark mb-2"><i class="bi bi-person-gear text-primary me-2"></i>Erworbene Kompetenzen</h5>
            <p class="text-muted small mb-3">Wähle Soft-Skills aus oder füge eigene hinzu.</p>
            
            <div class="input-group mb-3">
              <input type="text" class="form-control bg-light border-0" placeholder="Eigene Kompetenz..." v-model="customCompetence" @keydown.enter.prevent="addCustomCompetence">
              <button class="btn btn-primary px-3" type="button" @click="addCustomCompetence" :disabled="!customCompetence.trim()"><i class="bi bi-plus-lg"></i></button>
            </div>

            <div class="d-flex flex-wrap gap-2">
              <button v-for="competence in allCompetencies" :key="competence" 
                      class="btn rounded-pill btn-sm fw-medium transition-all"
                      :class="selectedCompetencies.includes(competence) ? 'btn-primary shadow-sm' : 'btn-outline-secondary border-light-subtle text-dark bg-light'"
                      @click="toggleCompetence(competence)">
                <i class="bi" :class="selectedCompetencies.includes(competence) ? 'bi-check2 me-1' : 'bi-plus me-1'"></i>
                {{ competence }}
              </button>
            </div>
          </div>
        </div>

        <div class="mb-4 bg-white p-3 rounded-4 shadow-sm border border-light">
          <label class="form-label fw-bold text-dark small mb-2"><i class="bi bi-chat-text text-primary me-2"></i>Nachricht (Optional)</label>
          <textarea class="form-control bg-light border-0" rows="2" placeholder="Nachricht an den Koordinator..." v-model="comment"></textarea>
        </div>
        
        <div style="height: 80px;"></div>
      </main>

      <footer class="bg-white p-3 border-top sticky-bottom shadow-lg">
        <button class="btn btn-primary w-100 rounded-pill py-3 fw-bold shadow-sm" 
                :disabled="!isFormValid" @click="submitRequest">
          <i class="bi bi-send-fill me-2"></i> {{ requestType === 'passeintrag' ? 'Passeintrag anfragen' : 'Nachweis anfragen' }}
        </button>
      </footer>

    </div>
  </transition>
</template>

<script setup>
import { ref, computed } from 'vue';

const props = defineProps({
  completedTasks: { type: Array, default: () => [] }
});

const emit = defineEmits(['close', 'submit-verification']);

const isOpen = ref(false);
const requestType = ref('passeintrag');
const selectionMode = ref('tasks'); // 'tasks' oder 'manual'
const funktion = ref('');
const comment = ref('');

// Task-Selection
const selectedTaskIds = ref([]);

// Manual Entry Fields
const manualOrganisation = ref('');
const manualStartDate = ref('');
const manualEndDate = ref('');
const manualHours = ref('');

// --- TÄTIGKEITEN & KOMPETENZEN LOGIK ---
const customActivity = ref('');
const selectedActivities = ref([]);
const defaultActivities = ['Menschen betreuen', 'Events organisieren', 'Verwaltungstätigkeit', 'Logistik & Transport', 'Spenden sammeln'];
const userAddedActivities = ref([]);
const allActivities = computed(() => [...defaultActivities, ...userAddedActivities.value]);

const customCompetence = ref('');
const selectedCompetencies = ref([]);
const defaultCompetencies = ['Ausdauer', 'Einsatzbereitschaft', 'Entscheidungsfähigkeit', 'Organisationsstärke', 'Teamfähigkeit'];
const userAddedCompetencies = ref([]);
const allCompetencies = computed(() => [...defaultCompetencies, ...userAddedCompetencies.value]);

const toggleActivity = (a) => {
  const i = selectedActivities.value.indexOf(a);
  if (i > -1) selectedActivities.value.splice(i, 1);
  else selectedActivities.value.push(a);
};

const addCustomActivity = () => {
  if (customActivity.value.trim()) {
    if (!allActivities.value.includes(customActivity.value.trim())) userAddedActivities.value.push(customActivity.value.trim());
    if (!selectedActivities.value.includes(customActivity.value.trim())) selectedActivities.value.push(customActivity.value.trim());
  }
  customActivity.value = '';
};

const toggleCompetence = (c) => {
  const i = selectedCompetencies.value.indexOf(c);
  if (i > -1) selectedCompetencies.value.splice(i, 1);
  else selectedCompetencies.value.push(c);
};

const addCustomCompetence = () => {
  if (customCompetence.value.trim()) {
    if (!allCompetencies.value.includes(customCompetence.value.trim())) userAddedCompetencies.value.push(customCompetence.value.trim());
    if (!selectedCompetencies.value.includes(customCompetence.value.trim())) selectedCompetencies.value.push(customCompetence.value.trim());
  }
  customCompetence.value = '';
};

// --- BERECHNUNGEN ---
const calculatedTotalHours = computed(() => {
  if (selectionMode.value === 'tasks') {
    return selectedTaskIds.value.reduce((total, id) => {
      const task = props.completedTasks.find(t => t.id === id);
      return total + (task?.hours ? Number(task.hours) : 4);
    }, 0);
  }
  return manualHours.value ? parseInt(manualHours.value) : 0;
});

const calculatedDateRange = computed(() => {
  if (selectionMode.value === 'tasks' && selectedTaskIds.value.length > 0) {
    const dates = selectedTaskIds.value.map(id => {
      const task = props.completedTasks.find(t => t.id === id);
      return new Date(task?.jobStartDate || task?.date);
    }).filter(d => !isNaN(d.getTime()));
    if (dates.length === 0) return '-';
    const minDate = new Date(Math.min(...dates));
    const maxDate = new Date(Math.max(...dates));
    return minDate.toDateString() === maxDate.toDateString() ? formatDate(minDate) : `${formatDate(minDate, true)} - ${formatDate(maxDate, true)}`;
  } else if (selectionMode.value === 'manual' && manualStartDate.value && manualEndDate.value) {
    return `${formatDate(manualStartDate.value, true)} - ${formatDate(manualEndDate.value, true)}`;
  }
  return '-';
});

// --- VALIDIERUNG ---
const isFormValid = computed(() => {
  if (funktion.value.trim() === '') return false;
  
  if (selectionMode.value === 'tasks') {
    if (selectedTaskIds.value.length === 0) return false;
  } else {
    if (!manualOrganisation.value.trim() || !manualStartDate.value || !manualEndDate.value || !manualHours.value) return false;
  }

  if (requestType.value === 'nachweis') {
    if (selectedActivities.value.length === 0 && selectedCompetencies.value.length === 0) return false;
  }
  return true;
});

// --- ACTIONS ---
const openForm = () => {
  funktion.value = '';
  selectedTaskIds.value = [];
  manualOrganisation.value = '';
  manualStartDate.value = '';
  manualEndDate.value = '';
  manualHours.value = '';
  selectedActivities.value = [];
  selectedCompetencies.value = [];
  isOpen.value = true;
};

const closeForm = () => { isOpen.value = false; emit('close'); };

const submitRequest = () => {
  const data = {
    type: requestType.value === 'passeintrag' ? 'Freiwilligenpasseintrag' : 'Freiwilligennachweis',
    funktion: funktion.value,
    source: selectionMode.value,
    evidenceIds: selectionMode.value === 'tasks' ? selectedTaskIds.value : null,
    manualData: selectionMode.value === 'manual' ? {
      organisation: manualOrganisation.value,
      start: manualStartDate.value,
      end: manualEndDate.value,
      hours: manualHours.value
    } : null,
    totalHours: calculatedTotalHours.value,
    dateRange: calculatedDateRange.value,
    activities: selectedActivities.value,
    competencies: selectedCompetencies.value,
    status: 'Pending'
  };
  emit('submit-verification', data);
  closeForm();
};

const formatDate = (d, s = false) => {
  if (!d) return '';
  const date = new Date(d);
  return isNaN(date.getTime()) ? d : date.toLocaleDateString('de-AT', { day: '2-digit', month: '2-digit', year: s ? '2-digit' : 'numeric' });
};

defineExpose({ openForm });
</script>

<style scoped>
.fullscreen-overlay {
  position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
  z-index: 1060; overflow: hidden; background: #f8f9fa;
}
.slide-in-enter-active, .slide-in-leave-active { transition: transform 0.3s cubic-bezier(0.2, 0.8, 0.2, 1), opacity 0.3s ease; }
.slide-in-enter-from, .slide-in-leave-to { transform: translateY(100%); opacity: 0; }
.fade-in { animation: fadeIn 0.3s ease-in-out; }
@keyframes fadeIn { from { opacity: 0; transform: translateY(-5px); } to { opacity: 1; transform: translateY(0); } }
</style>