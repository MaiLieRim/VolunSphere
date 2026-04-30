<template>
  <Navbar title="Home" />

  <StatisticNavbar />

  <div class="content-container">

    <template v-if="userRole === 'admin'">
      <VerificationRequestsCard :message="`Sie haben ${requested.length} neue Nachweisanfragen, bitte geben Sie diese frei.`" />
      <h2 class="mt-4">Anfragen Nachweise</h2>
      <RequestsOverview :items="requested" />
    </template>

    <template v-if="userRole === 'volunteer'">
      <TaskCompletionCard />
      <div class="space">
        <h1>Du warst diese Woche top engagiert!</h1>
        <router-link :to="{ path: '/profile', query: { tab: 'explorer' } }">
          <img src="/src/assets/images/statistics.png" alt="explorer" class="mx-auto d-block img-fluid">
        </router-link>

      </div>
      <TaskList title="Deine aktuellen Aufgaben" />
      <TaskCarousel title="Deine aktuellen Aufgaben" :items="items" />
    </template>
  </div>

  <Footer />
</template>

<script setup>
import { ref, onMounted } from 'vue';
import Navbar from '@/components/navbars/Navbar.vue';
import StatisticNavbar from '@/components/navbars/StatisticNavbar.vue';
import VerificationRequestsCard from '@/components/verification/VerificationRequestsCard.vue';
import TaskCompletionCard from '@/components/tasks/TaskCompletionCard.vue';
import TaskCarousel from '@/components/tasks/TaskCarousel.vue';
import TaskList from '@/components/tasks/TaskList.vue';
import PaginatedSwipeList from '@/components/lists/PaginatedSwipeList.vue';
import Footer from '@/components/common/Footer.vue';
import verifications from '@/assets/data/verifications.json';
import { useTasks } from '@/composables/useTasks';
import RequestsOverview from '@/components/admin/RequestsOverview.vue';
import router from '@/router';
const userRole = ref(localStorage.getItem('userRole')); // Get role
const certified = ref([]);
const requested = ref([]);
const confirmed = ref([]);
const { allTasks } = useTasks();
const items = allTasks;
onMounted(() => {
  verifications.itemListElement.forEach(job => {
    const item = {
      club: job.organization.name,
      hours: job.hours,
      requester: job.requester.name,
      title: job.name,
      id: job.identifier.value,
      swiped: false, // Track swipe state
    };

    // Categorizing the items based on their status
    if (job.status === 'Pending') {
      requested.value.push(item);
    } else if (job.status === 'Approved') {
      confirmed.value.push(item);
    } else {
      certified.value.push(item);
    }
  });
});
</script>