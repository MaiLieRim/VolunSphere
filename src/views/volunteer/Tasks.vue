<template>
    <Navbar title="Aufgaben"></Navbar>
    <div class="bg-light">
        <TabNavigation :tabs="[
        { name: 'Meine Aufgaben', label: 'Meine Aufgaben' },
        { name: 'Empfehlungen', label: 'Empfehlungen' },
        { name: 'Abgeschlossen', label: 'Abgeschlossen' },
    ]" :currentTab="currentTab" @update:tab="currentTab = $event" :background-class="bg-light" :activity-search="true" />
    </div>
    <StatisticNavbar></StatisticNavbar>
    <div class="content-container">
        <TaskList title="Deine nächsten Aufgaben"></TaskList>
        <CardCarousell :items="items" title="Offene Aufgaben"></CardCarousell>
    </div>
    <Footer></Footer>
</template>
<script setup>
import Navbar from '@/components/navbars/Navbar.vue';
import StatisticNavbar from '@/components/navbars/StatisticNavbar.vue';
import TaskList from '@/components/TaskList.vue';
import CardCarousell from '@/components/CardCarousell.vue';
import Footer from '@/components/Footer.vue';
import TabNavigation from '@/components/navbars/TabNavigation.vue';
import { useTasks } from '@/composables/useTasks';
import { computed, ref } from 'vue';


const { allTasks } = useTasks();
const items = computed(() => {
    return allTasks.value;
});

const currentTab = ref('Meine Aufgaben');
</script>
