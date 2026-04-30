<template>
    <Navbar title="Aufgaben"></Navbar>

    <div class="bg-light border-bottom">
        <TabNavigation :tabs="[
            { name: 'mytasks', label: 'Meine Aufgaben' },
            { name: 'recommendations', label: 'Empfehlungen' },
            { name: 'applications', label: 'Bewerbungen' },
            { name: 'completed', label: 'Abgeschlossen' }
        ]" :currentTab="currentTab" @update:tab="currentTab = $event" background-class="bg-light"
            :activity-search="true" />
    </div>

    <StatisticNavbar :badgesCount="user.badges?.length || 0" :orgCount="myOrganizations?.length || 0"
        :taskCount="allTasks?.length || 0" />

    <div class="content-container">

        <div v-if="currentTab === 'mytasks'" class="fade-in">

            <div class="d-flex justify-content-between align-items-center mb-3">
                <h2 class="mb-0 text-dark">Meine Aufgaben</h2>

                <div class="btn-group btn-group-sm shadow-sm" role="group">
                    <button class="btn px-3"
                        :class="viewMode === 'list' ? 'btn-primary text-white' : 'btn-outline-secondary bg-white'"
                        @click="viewMode = 'list'">
                        <i class="bi bi-list"></i>
                    </button>
                    <button class="btn px-3"
                        :class="viewMode === 'calendar' ? 'btn-primary text-white' : 'btn-outline-secondary bg-white'"
                        @click="viewMode = 'calendar'">
                        <i class="bi bi-calendar-month"></i>
                    </button>
                    <button class="btn px-3"
                        :class="viewMode === 'map' ? 'btn-primary text-white' : 'btn-outline-secondary bg-white'"
                        @click="viewMode = 'map'">
                        <i class="bi bi-geo-alt"></i>
                    </button>
                </div>
            </div>

            <div v-if="viewMode === 'list'">
                <TaskList  :items="myTasks"></TaskList>
                <TaskList title="Zukünftige Einsätze" :items="myTasks"></TaskList>
            </div>

            <div v-if="viewMode === 'calendar'" class="fade-in">
                <CalendarView :tasks="myTasks" />
            </div>

            <div v-if="viewMode === 'map'" class="fade-in position-relative"
                style="height: 400px; border-radius: 12px; overflow: hidden;">
                <MapView />
            </div>
        </div>

        <div v-if="currentTab === 'recommendations'" class="fade-in">
            <div class="mb-4">
                <h4 class="fw-bold mb-1 text-dark">Für dich empfohlen</h4>
                <p class="text-muted small">Basierend auf deinen Interessen und Kompetenzen.</p>
            </div>
            <TaskCarousel :items="recommendedTasks" title="Passende Engagements"></TaskCarousel>
        </div>

        <div v-if="currentTab === 'applications'" class="fade-in">
            <div class="mb-4">
                <h4 class="fw-bold mb-1 text-dark">Offene Bewerbungen</h4>
                <p class="text-muted small">Einsätze, für die du dich gemeldet hast.</p>
            </div>
            <List :items="applications" :title="''"></List>
        </div>

        <div v-if="currentTab === 'completed'" class="fade-in">
            <div class="mb-4">
                <h4 class="fw-bold mb-1 text-dark">Geleistete Einsätze</h4>
                <p class="text-muted small">Wische nach links, um für vergangene Tätigkeiten einen Nachweis anzufragen.
                </p>
            </div>

            <TaskSwipeList :items="completedTasks" emptyMessage="Du hast noch keine abgeschlossenen Aufgaben."
                @requestVerification="requestVerification" @showDetails="openTaskDetails" />
        </div>

    </div>

    <Footer></Footer>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import Navbar from '@/components/navbars/Navbar.vue';
import StatisticNavbar from '@/components/navbars/StatisticNavbar.vue';
import TaskList from '@/components/tasks/TaskList.vue';
import List from '@/components/tasks/TaskList.vue';
import TaskCarousel from '@/components/tasks/TaskCarousel.vue';
import Footer from '@/components/common/Footer.vue';
import TabNavigation from '@/components/navbars/TabNavigation.vue';
import TaskSwipeList from '@/components/tasks/TaskSwipeList.vue';
import { useTasks } from '@/composables/useTasks';
import CalendarView from '@/components/TaskSearch/CalendarView.vue';
import MapView from '@/components/TaskSearch/MapView.vue';
// --- DATEN IMPORTE ---
import rawUser from "@/assets/data/volunteer";
import organizations from "@/assets/data/organisations.json";
import verifications from '@/assets/data/verifications.json';
import applicationsData from '@/assets/data/applications.json';

const user = ref(JSON.parse(JSON.stringify(rawUser)));
const verificationsList = ref(verifications.itemListElement);
const applicationsList = ref(applicationsData.itemListElement);

const { allTasks } = useTasks();

// --- TAB & ROUTER LOGIK ---
const route = useRoute();
const router = useRouter();
const currentTab = ref(route.query.tab || 'mytasks');

// --- VIEW-SWITCHER (Liste, Kalender, Map) ---
const viewMode = ref('list');

watch(currentTab, (newTab) => {
    router.replace({ query: { ...route.query, tab: newTab } });
});

// --- STATISTIK & ÜBERSICHTS LOGIK ---
const myOrganizations = computed(() => {
    return organizations.filter(org =>
        org.member?.some(m => m.name === user.value.name)
    );
});

// Mock-Aufteilung der Aufgaben
const myTasks = computed(() => allTasks.value.slice(0, 3));
const recommendedTasks = computed(() => allTasks.value.slice(3, 7));

const applications = computed(() => {
    return applicationsList.value.filter(app => app.volunteerName === user.value.name).map(app => {
        const task = allTasks.value.find(t => t.identifier?.value === app.taskId || t.id === app.taskId);
        return task ? { ...task, status: app.status } : null;
    }).filter(Boolean);
});

// --- ECHTER KALENDER-RASTER FÜR APRIL 2026 ---
const daysInMonth = computed(() => {
    const days = [];
    const firstDayOffset = 2; // Der 1. April 2026 war ein Mittwoch (Start bei Index 2)

    // Leere Tage vor dem ersten des Monats
    for (let i = 0; i < firstDayOffset; i++) {
        days.push({ dayNumber: null, tasks: [] });
    }

    // Tage 1-30 für April 2026
    for (let i = 1; i <= 30; i++) {
        const dayTasks = myTasks.value.filter(t => t.day === i || t.date?.includes(`2026-04-${i < 10 ? '0' : ''}${i}`));

        // Prüfen, ob der heutige Tag markiert werden muss
        const isToday = i === new Date().getDate() && new Date().getMonth() === 3; // April = 3

        days.push({
            dayNumber: i,
            isToday,
            tasks: dayTasks
        });
    }
    return days;
});

// --- NACHWEIS & ABGESCHLOSSENE AUFGABEN LOGIK ---
const verificationsByUser = computed(() => {
    return verificationsList.value.filter(item =>
        item.requester?.name?.toLowerCase() === user.value?.name?.toLowerCase()
    );
});

const completedTasks = computed(() => {
    const finished = allTasks.value.filter(task => task.status === 'completed');
    const baseTasks = finished.length > 0 ? finished : allTasks.value.slice(-3);

    return baseTasks.map(task => {
        const existingVerification = verificationsByUser.value.find(v =>
            v.name === task.title || v.identifier?.value === task.id
        );

        let vStatus = null;
        if (existingVerification) {
            if (existingVerification.status === 'Pending') vStatus = 'pending';
            if (existingVerification.status === 'Approved' || existingVerification.status === 'Certified') vStatus = 'verified';
        }

        return {
            ...task,
            club: task.club || task.organization?.name || 'Organisation',
            hours: task.hours || 4,
            verifiedStatus: vStatus
        };
    });
});

const requestVerification = (task) => {
    verificationsList.value.push({
        name: task.title,
        status: 'Pending',
        hours: task.hours,
        requester: { name: user.value.name },
        organization: { name: task.club },
        identifier: { value: task.id || Date.now() }
    });
};

const openTaskDetails = (task) => {
    console.log("Öffne Details für:", task.title);
};
</script>

<style scoped>
.fade-in {
    animation: fadeIn 0.3s ease-in-out;
}

.calendar-day {
    min-height: 85px;
}

@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(5px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}
</style>