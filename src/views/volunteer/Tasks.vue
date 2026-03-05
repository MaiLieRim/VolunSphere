<script setup>
import Navbar from '@/components/navbars/Navbar.vue';
import StatisticNavbar from '@/components/navbars/StatisticNavbar.vue';
import List from '@/components/List.vue';
import CardCarousell from '@/components/CardCarousell.vue';
import Footer from '@/components/Footer.vue';
import { useTasks } from '@/composables/useTasks';
</script>

<template>
    <Navbar title="Aufgaben"></Navbar>
    <div class="tab-navigation">
        <div class="nav nav-underline d-inline-flex">
            <div class="nav-item">
                <RouterLink class="nav-link" to="/search">
                    <i class="bi bi-search"></i>
                </RouterLink>
            </div>
            <div class="nav-item">
                <a class="nav-link text-primary  active" aria-current="page" href="#">Meine Aufgaben</a>
            </div>
            <div class="nav-item">
                <a class="nav-link" href="#">Empfehlungen</a>
            </div>
            <div class="nav-item">
                <a class="nav-link" href="#">Abgeschlossen</a>
            </div>
        </div>
    </div>
    <StatisticNavbar></StatisticNavbar>
    <div class="content-container">
        <List title="Deine nächsten Aufgaben"></List>
        <CardCarousell :items="items" title="Offene Aufgaben"></CardCarousell>
    </div>
    <Footer></Footer>
</template>
<script>
import { computed } from 'vue';
import { useTasks } from '@/composables/useTasks';

const { allTasks } = useTasks();

const items = computed(() => {
    return allTasks.value;
});
</script>
