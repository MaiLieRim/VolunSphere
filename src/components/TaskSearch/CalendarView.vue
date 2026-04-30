<script setup>
import { computed, ref } from 'vue'
import FullCalendar from '@fullcalendar/vue3'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import { useRouter } from 'vue-router' // RouterLink wird nicht mehr gebraucht

const router = useRouter()

const props = defineProps({
    tasks: {
        type: Array,
        required: true,
        default: () => []
    }
})

const emit = defineEmits(['taskClicked'])

const calendarRef = ref(null) 

// --- Custom Header State ---
const calendarTitle = ref('') 
const currentViewType = ref('dayGridMonth') 

// --- Farbpalette für die Einträge ---
const colorPalette = [
    '#0d6efd', '#198754', '#6f42c1', '#fd7e14', '#dc3545', '#20c997', '#d63384'
]

const calendarEvents = computed(() => {
    return props.tasks.map((task, index) => {
        const eventColor = colorPalette[index % colorPalette.length]

        return {
            id: task.identifier?.value || task.id,
            title: task.title || task.name,
            start: task.jobStartDate || task.date || `2026-04-${String(task.day).padStart(2, '0')}`,
            backgroundColor: eventColor,
            borderColor: eventColor,
            textColor: '#ffffff',
            extendedProps: { ...task }
        }
    })
})

// --- Calendar API Controls ---
const prev = () => calendarRef.value.getApi().prev()
const next = () => calendarRef.value.getApi().next()
const today = () => calendarRef.value.getApi().today()

const changeView = (viewName) => {
    calendarRef.value.getApi().changeView(viewName)
    currentViewType.value = viewName
}

const handleDatesSet = (info) => {
    calendarTitle.value = info.view.title
}

const handleDateClick = (info) => {
    changeView('timeGridDay')
    calendarRef.value.getApi().gotoDate(info.dateStr)
}

// --- DIREKTE WEITERLEITUNG BEIM KLICK ---
const handleEventClick = (clickInfo) => {
    const taskData = clickInfo.event.extendedProps
    emit('taskClicked', taskData) 
    
    // Leitet sofort zur Detailseite weiter, ohne Popup
    router.push({
        name: 'task', 
        params: { itemId: taskData.id },
        query: { backRoute: '/task-search?tab=CalendarView' }
    })
}

const calendarOptions = computed(() => ({
    plugins: [ dayGridPlugin, timeGridPlugin, interactionPlugin ],
    initialView: 'dayGridMonth',
    headerToolbar: false, 
    events: calendarEvents.value,
    dateClick: handleDateClick,    
    eventClick: handleEventClick,  
    datesSet: handleDatesSet, 
    height: 'auto',
    locale: 'de',
    firstDay: 1 
}))
</script>

<template>
    <div class="calendar-wrapper bg-white rounded-4 shadow-sm position-relative" style="min-height: 80vh;">
        
        <div class="d-flex justify-content-between align-items-center mb-3">
            
            <div class="d-flex align-items-center gap-2">
                <div class="btn-group btn-group-sm shadow-sm">
                    <button class="btn btn-outline-secondary border-0 bg-light" @click="prev"><i class="bi bi-chevron-left"></i></button>
                    <button class="btn btn-outline-secondary border-0 bg-light" @click="today">Heute</button>
                    <button class="btn btn-outline-secondary border-0 bg-light" @click="next"><i class="bi bi-chevron-right"></i></button>
                </div>
                <h5 class="fw-bold mb-0 ms-2 text-dark" style="min-width: 130px;">{{ calendarTitle }}</h5>
            </div>

            <div class="btn-group btn-group-sm shadow-sm" role="group">
                <button class="btn px-2 border-0" 
                    :class="currentViewType === 'dayGridMonth' ? 'btn-primary text-white' : 'btn-light text-secondary'" 
                    @click="changeView('dayGridMonth')">
                    M
                </button>
                <button class="btn px-2 border-0" 
                    :class="currentViewType === 'timeGridWeek' ? 'btn-primary text-white' : 'btn-light text-secondary'" 
                    @click="changeView('timeGridWeek')">
                    W
                </button>
                <button class="btn px-2 border-0" 
                    :class="currentViewType === 'timeGridDay' ? 'btn-primary text-white' : 'btn-light text-secondary'" 
                    @click="changeView('timeGridDay')">
                    T
                </button>
            </div>
        </div>
        
        <FullCalendar ref="calendarRef" :options="calendarOptions" />

        </div>
</template>

<style scoped>
/* Sanftere, modernere Gitterlinien */
:deep(.fc-theme-standard td), 
:deep(.fc-theme-standard th), 
:deep(.fc-theme-standard .fc-scrollgrid) {
    border-color: #f1f3f5 !important; 
}

/* Wochentage aufhübschen */
:deep(.fc-col-header-cell) {
    background-color: transparent !important;
    padding: 10px 0 !important;
    color: #6c757d;
    font-weight: 600;
    font-size: 0.85rem;
    border-bottom: 2px solid #e9ecef !important;
}

/* Den Tag "heute" dezent hervorheben */
:deep(.fc-day-today) {
    background-color: #f8f9fa !important; 
}
:deep(.fc-daygrid-day-top a) {
    text-decoration: none !important;
}
:deep(.fc-scrollgrid-sync-inner a) {
    text-decoration: none !important;
}


/* Entfernt den äußeren Rahmen komplett */
:deep(.fc-scrollgrid) {
    border: none !important;
}

/* Events abrunden und Unterstreichungen entfernen */
:deep(.fc-event) {
    border-radius: 4px;
    padding: 2px 4px;
    font-size: 0.8rem;
    border: none !important; 
    box-shadow: 0 1px 2px rgba(0,0,0,0.1);
    cursor: pointer;
    transition: transform 0.1s ease;
    text-decoration: none !important; /* FIX: Verhindert die Unterstreichung */
    color: white !important; /* FIX: Verhindert, dass die Schriftfarbe zum typischen Link-Blau wird */
}

:deep(.fc-event:hover) {
    transform: scale(1.02);
    filter: brightness(0.95);
    text-decoration: none !important;
    color: white !important;
}

.calendar-wrapper {
    position: relative;
    overflow: hidden; 
}
</style>