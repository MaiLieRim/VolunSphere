<script setup>
import { computed, ref } from 'vue'
import FullCalendar from '@fullcalendar/vue3'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import { RouterLink, useRouter } from 'vue-router'

const router = useRouter()

const props = defineProps({
    tasks: {
        type: Array,
        required: true,
        default: () => []
    }
})

const emit = defineEmits(['taskClicked'])

const calendarRef = ref(null) // Reference to the FullCalendar component
const selectedTask = ref(null) // Controls the bottom card

// 1. Map your app's task data structure to FullCalendar's expected format
const calendarEvents = computed(() => {
    return props.tasks.map(task => ({
        id: task.identifier?.value || task.id,
        title: task.title || task.name,
        start: task.jobStartDate,
        backgroundColor: 'var(--bs-primary)',
        borderColor: 'var(--bs-primary)',
        extendedProps: { ...task } // Keeps the original task data handy
    }))
})

// 2. Handle switching to Day View when a date is clicked
const handleDateClick = (info) => {
    // Get the underlying FullCalendar API instance
    const calendarApi = calendarRef.value.getApi()
    // Change view to day view and jump to the clicked date
    calendarApi.changeView('timeGridDay', info.dateStr)
}

// 3. Handle clicking an event (task) to show the bottom card
const handleEventClick = (clickInfo) => {
    const taskData = clickInfo.event.extendedProps
    emit('taskClicked', taskData) 
    
    // Programmatic navigation to the task route
    router.push({
        name: 'task', 
        params: { itemId: taskData.id },
        query: { backRoute: '/task-search?tab=CalendarView' }
    })
}

// FullCalendar configuration
const calendarOptions = computed(() => ({
    plugins: [ dayGridPlugin, timeGridPlugin, interactionPlugin ],
    initialView: 'dayGridMonth',
    headerToolbar: {
        left: 'today',
        center: 'title',
        right: 'dayGridMonth,timeGridWeek,timeGridDay'
    },
    footerToolbar: {
        left: 'prev',
        center:  '',
        right: 'next'
    },
    events: calendarEvents.value,
    dateClick: handleDateClick,     // Added date click handler
    eventClick: handleEventClick,   // Added event click handler
    height: 'auto',
    buttonText: {
        today: 'Heute',
        month: 'M',
        week: 'W',
        day: 'T'
    },
    locale: 'de'
}))
</script>

<template>
    <div class="calendar-wrapper bg-white rounded shadow-sm position-relative" style="min-height: 80vh;">
        
        <FullCalendar ref="calendarRef" :options="calendarOptions" />

        <transition name="slide-up">
            <div v-if="selectedTask"
                class="d-flex container justify-content-between align-items-center bottom-card rounded">
                <RouterLink :to="{
                    name: 'task', params: { itemId: selectedTask.id },
                    query: { backRoute: '/task-search?tab=calendar' }
                }" class="list-group-item list-group-item-action align-content-stretch d-flex" aria-current="true">

                    <div class=" date-box col-3">
                        <small>{{ selectedTask.club }}</small>
                        <h1>{{ selectedTask.day }}</h1>
                        <small>{{ selectedTask.month }}</small>
                    </div>

                    <div class="container col-9 content d-flex flex-column my-2">
                        <div>
                            <small class="opacity-50">{{ selectedTask.location }}, {{ selectedTask.industry }}</small>
                            <h4>{{ selectedTask.title }}</h4>
                        </div>

                        <div class="mt-auto d-flex align-items-center text-muted gap-6">
                            <small class="col-3">
                                <img src="/src/assets/images/profile-pictures/liselotte.png" alt="twbs" width="20"
                                    height="20" class="rounded-circle flex-shrink-0">
                                {{ selectedTask.jobs }}
                            </small>
                            <small class="col-6"><i class="bi bi-chat me-1"></i>messages</small>
                        </div>
                    </div>
                </RouterLink>
            </div>
        </transition>

    </div>
</template>

<style scoped>
:deep(.fc-button-primary) {
    background-color: var(--bs-primary) !important;
    border-color: var(--bs-primary) !important;
}
:deep(.fc-button-primary:hover) {
    background-color: var(--bs-primary) !important;
}
:deep(.fc-theme-standard th) {
    background-color: #f8f9fa;
    padding: 8px 0;
}

/* Ensure the calendar container can handle the absolute bottom card */
.calendar-wrapper {
    position: relative;
    overflow: hidden; /* Keeps the sliding card inside the wrapper boundaries */
}

/* Bottom overlay card */
.bottom-card {
    position: absolute;
    bottom: 20px; /* Adjusted to sit nicely at the bottom of the calendar */
    left: 0px;
    right: 0px;
    width: 95%; /* slightly less than 100% for padding aesthetics */
    background: white;
    margin-left: auto;
    margin-right: auto;
    cursor: pointer;
    box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.2);
    padding: 10px;
    z-index: 1000;
}

/* Animation */
.slide-up-enter-active,
.slide-up-leave-active {
    transition: all 0.3s ease;
}

.slide-up-enter-from,
.slide-up-leave-to {
    transform: translateY(150%);
    opacity: 0;
}
</style>