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

    <div class="content-container ">

        <div v-if="currentTab === 'mytasks'" class="fade-in">
            <TaskList title="Laufende Aufgaben"></TaskList>
            <TaskList title="Zukünftige Einsätze"></TaskList>
        </div>

        <div v-if="currentTab === 'recommendations'" class="fade-in">
            <div class="mb-4">
                <h4 class="fw-bold mb-1 text-dark">Für dich empfohlen</h4>
                <p class="text-muted small">Basierend auf deinen Interessen und Kompetenzen.</p>
            </div>
            <CardCarousell :items="recommendedTasks" title="Passende Engagements"></CardCarousell>
        </div>

        <div v-if="currentTab === 'applications'" class="fade-in">
            <div class="mb-4">
                <h4 class="fw-bold mb-1 text-dark">Offene Bewerbungen</h4>
                <p class="text-muted small">Einsätze, für die du dich gemeldet hast.</p>
            </div>

            <div class="list-group list-group-flush gap-2">
                <List :items="applications"></List>
            </div>
        </div>

        <div v-if="currentTab === 'completed'" class="fade-in">
            <div class="mb-4">
                <h4 class="fw-bold mb-1 text-dark">Geleistete Einsätze</h4>
                <p class="text-muted small">Wische nach links, um für vergangene Tätigkeiten einen Nachweis anzufragen.
                </p>
            </div>

            <TaskSwipeList :items="completedTasks" emptyMessage="Du hast noch keine abgeschlossenen Aufgaben."
                @requestVerification="requestVerification" @showDetails="openTaskDetails"
               />
        </div>

    </div>

    <Footer></Footer>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import Navbar from '@/components/navbars/Navbar.vue';
import StatisticNavbar from '@/components/navbars/StatisticNavbar.vue';
import TaskList from '@/components/TaskList.vue';
import List from '@/components/List.vue';
import CardCarousell from '@/components/CardCarousell.vue';
import Footer from '@/components/Footer.vue';
import TabNavigation from '@/components/navbars/TabNavigation.vue';
import TaskSwipeList from '@/components/TaskSwipeList.vue';
import { useTasks } from '@/composables/useTasks';

// --- DATEN IMPORTE ---
import rawUser from "@/assets/data/volunteer";
import organizations from "@/assets/data/organisations.json";
import verifications from '@/assets/data/verifications.json';
import applicationsData from '@/assets/data/applications.json';

// User reaktiv machen (Deep Copy, um Fehler zu vermeiden)
const user = ref(JSON.parse(JSON.stringify(rawUser)));

// Nachweise reaktiv machen
const verificationsList = ref(verifications.itemListElement);

// Bewerbungen reaktiv machen
const applicationsList = ref(applicationsData.itemListElement);

// Alle Aufgaben aus dem Composable holen
const { allTasks } = useTasks();

// --- TAB & ROUTER LOGIK ---
const route = useRoute();
const router = useRouter();
const currentTab = ref(route.query.tab || 'mytasks');

watch(currentTab, (newTab) => {
    router.replace({ query: { ...route.query, tab: newTab } });
});

// --- STATISTIK & ÜBERSICHTS LOGIK ---
const myOrganizations = computed(() => {
    return organizations.filter(org =>
        org.member?.some(m => m.name === user.value.name)
    )
});

// Mock-Aufteilung der Aufgaben für die ersten beiden Tabs
const myTasks = computed(() => allTasks.value.slice(0, 3));
const recommendedTasks = computed(() => allTasks.value.slice(3, 7));

const applications = computed(() => {
    return applicationsList.value.filter(app => app.volunteerName === user.value.name).map(app => {
        // Finde die entsprechende Aufgabe
        const task = allTasks.value.find(t => t.identifier?.value === app.taskId || t.id === app.taskId);
        return task ? { ...task, status: app.status } : null;
    }).filter(Boolean);
});
// --- NACHWEIS & ABGESCHLOSSENE AUFGABEN LOGIK ---

// 1. Alle Nachweise, die dem aktuellen User gehören
const verificationsByUser = computed(() => {
    return verificationsList.value.filter(item =>
        item.requester?.name?.toLowerCase() === user.value?.name?.toLowerCase()
    );
});

// 2. Abgeschlossene Aufgaben dynamisch mit Nachweisen verknüpfen
const completedTasks = computed(() => {
    // Hole Aufgaben, die als "completed" markiert sind (Oder nimm zum Testen die letzten 3)
    const finished = allTasks.value.filter(task => task.status === 'completed');
    const baseTasks = finished.length > 0 ? finished : allTasks.value.slice(-3);

    return baseTasks.map(task => {
        // Prüfen, ob für diese Aufgabe schon ein Nachweis in verificationsList steht
        const existingVerification = verificationsByUser.value.find(v =>
            v.name === task.title ||  v.identifier?.value === task.id
        );

        let vStatus = null;
        if (existingVerification) {
            if (existingVerification.status === 'Pending') vStatus = 'pending';
            if (existingVerification.status === 'Approved' || existingVerification.status === 'Certified') vStatus = 'verified';
        }

        return {
            ...task,
            club: task.club || task.organization?.name || 'Organisation',
            hours: task.hours || 4, // Platzhalter für Stunden
            verifiedStatus: vStatus // <- Hierdurch weiß das UI, welches Badge gezeigt wird
        };
    });
});

// 3. Funktion: Nachweis durch Swipe Left anfragen
const requestVerification = (task) => {
    verificationsList.value.push({
        name: task.title,
        status: 'Pending',
        hours: task.hours,
        requester: { name: user.value.name },
        organization: { name: task.club },
        identifier: { value: task.id || Date.now() } // Generiere ID falls keine existiert
    });
};

// 4. Funktion: Klick auf eine Aufgabe (für Modal oder Detailseite)
const openTaskDetails = (task) => {
    console.log("Öffne Details für:", task.title);
};

</script>

<style scoped>
.fade-in {
    animation: fadeIn 0.3s ease-in-out;
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