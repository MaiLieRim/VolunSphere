<template>
  <Navbar title="VolunSphere" />

  <template v-if="isAuthenticated">
    <StatisticNavbar />

    <div class="content-container">

      <template v-if="userRole === 'admin'">
        <VerificationRequestsCard
          :message="`Sie haben ${requested.length} neue Nachweisanfragen, bitte geben Sie diese frei.`" />
        <h2 class="mt-4">Anfragen Nachweise</h2>
        <RequestsOverview :items="requested" />
      </template>

      <template v-if="userRole === 'volunteer'">
        <TaskCompletionCard />
        <div class="space">
          <h1>Du warst diese Woche top engagiert!</h1>
          <router-link :to="{ path: '/profile', query: { tab: 'explorer' } }">
            <img src="/assets/images/statistics.png" alt="explorer" class="mx-auto d-block img-fluid">
          </router-link>

        </div>
        <TaskList title="Deine aktuellen Aufgaben" />
        <TaskCarousel title="Empfohlene Aufgaben" :items="items" />
      </template>
    </div>
    <Footer />
  </template>

  <template v-else>
    <!-- Public Landing Page -->
    <div class="content-container">
      <div class="text-center">
        <h1 class="display-5 fw-bold mb-3">Mach einen Unterschied</h1>
        <p class="text-muted mb-4">Finde ehrenamtliche Aufgaben in deiner Nähe und werde Teil der Community</p>

        <div class="d-grid gap-2 d-sm-flex justify-content-sm-center">
          <router-link to="/task-search" class="btn btn-primary btn-lg px-4 gap-3">
            <i class="bi bi-search"></i> Aufgaben durchsuchen
          </router-link>
          <router-link to="/organisation-search" class="btn btn-outline-secondary btn-lg px-4">
            <i class="bi bi-building"></i> Organisationen entdecken
          </router-link>
        </div>
      </div>

      <!-- Featured Tasks Preview -->
      <div class="mb-5">
        <TaskCarousel title="Aktuelle Aufgaben" :items="featuredTasks.slice(0, 6)" />
      </div>

      <!-- CTA to Register -->

      <!-- Featured Organizations -->
      <h2>Beliebte Organisationen</h2>
      <OrganisationList class="mt-0" :items="featuredOrganizations.slice(0, 5)" />
      <div class="bg-primary text-white p-5 rounded mb-5">
        <h3 class="mb-3">Bereit, Ehrenamt zu beginnen?</h3>
        <p class="mb-4">Melden Sie sich an, um sich für Aufgaben zu bewerben und Ihre Fähigkeiten zu überprüfen.</p>
        <div class="d-flex gap-2">
          <router-link to="/registry" class="btn btn-light">
            Registrieren
          </router-link>
          <router-link to="/login" class="btn btn-outline-light">
            Anmelden
          </router-link>
        </div>
      </div>

    </div>

  </template>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import Navbar from '@/components/navbars/Navbar.vue';
import StatisticNavbar from '@/components/navbars/StatisticNavbar.vue';
import VerificationRequestsCard from '@/components/verification/VerificationRequestsCard.vue';
import TaskCompletionCard from '@/components/tasks/TaskCompletionCard.vue';
import TaskCarousel from '@/components/tasks/TaskCarousel.vue';
import TaskList from '@/components/tasks/TaskList.vue';
import PaginatedSwipeList from '@/components/lists/PaginatedSwipeList.vue';
import Footer from '@/components/common/Footer.vue';
import OrganisationList from '@/components/organizations/OrganisationList.vue';
import verifications from '@/assets/data/verifications.json';
import organizations from "@/assets/data/organisations.json";
import { useTasks } from '@/composables/useTasks';
import RequestsOverview from '@/components/admin/RequestsOverview.vue';
import router from '@/router';

const isAuthenticated = computed(() => !!localStorage.getItem('authToken'));
const userRole = ref(localStorage.getItem('userRole')); // Get role
const certified = ref([]);
const requested = ref([]);
const confirmed = ref([]);
const { allTasks } = useTasks();
const items = allTasks;

const featuredTasks = computed(() => allTasks.value.slice(0, 10));
const featuredOrganizations = computed(() => {
  return Array.isArray(organizations) ? organizations : organizations.itemListElement || [];
});

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