<template>
  <Navbar :title="org.name"
    :backRoute="cameFromSearch ? { name: 'OrganisationSearch' } : { name: 'profile', query: { tab: 'org' } }" />
  <LoginModal ref="loginModalRef" />

  <div class="content-container pb-5 min-vh-100">

    <div class="bg-dark bg-gradient text-white p-3 px-4 shadow-sm">
      <div class="d-flex align-items-center gap-3">

        <div class="flex-shrink-0 text-center">
          <img v-if="org.logo" :src="`/assets/images/logo/${org.logo}`"
            class="rounded-circle border border-2 border-white bg-white shadow-sm" :alt="org.name + ' Logo'" width="90"
            height="90" style="object-fit: cover;" />
        </div>

        <div class="flex-grow-1">
          <div class="d-flex align-items-center gap-2">
            <button class="btn btn-primary btn-md fw-bold text-light rounded-pill px-4 shadow-sm flex-grow-1"
              @click="joinOrganisation">
              Jetzt Beitreten
            </button>

            <button class="btn btn-outline-light rounded-circle d-flex align-items-center justify-content-center"
              style="width: 40px; height: 40px;" title="Empfehlen">
              <i class="bi bi-share"></i>
            </button>

            <a v-if="org.url" :href="org.url" target="_blank"
              class="btn btn-outline-light rounded-circle d-flex align-items-center justify-content-center"
              style="width: 40px; height: 40px;" title="Webseite">
              <i class="bi bi-box-arrow-up-right"></i>
            </a>
          </div>
        </div>

      </div>
    </div>

    <ul class="nav nav-pills nav-fill bg-light text-light p-2 sticky-top"
      :class="activeTab === 'info' ? '' : 'rounded-bottom shadow-sm'" style="top: 0; z-index: 10;">
      <li class="nav-item">
        <button class="nav-link fw-bold rounded-pill" :class="{ 'active': activeTab === 'info' }"
          @click="activeTab = 'info'">
          Info
        </button>
      </li>
      <li class="nav-item">
        <button class="nav-link fw-bold rounded-pill" :class="{ 'active': activeTab === 'tasks' }"
          @click="activeTab = 'tasks'">
          Aufgaben
          <span v-if="orgTasks.length" class="badge bg-white text-primary ms-1 border rounded-pill">{{ orgTasks.length
          }}</span>
        </button>
      </li>
      <li class="nav-item">
        <button class="nav-link fw-bold rounded-pill" :class="{ 'active': activeTab === 'members' }"
          @click="activeTab = 'members'">
          Mitglieder
        </button>
      </li>
    </ul>



    <div v-if="activeTab === 'info'">

      <div class="bg-light shadow-sm rounded-bottom-4 px-3 pb-4 pt-3">
        <h4 class="fw-bold">Über Uns</h4>
        <p class="mb-4">{{ org.description }}</p>

        <small class="text-secondary fw-medium">
          #Feuerwehr #Tierrettung #Organisationstalent
        </small>
      </div>

      <div class="p-3">
        <h4 class="fw-bold mb-3">Kontakt</h4>
        <ul class="list-group list-group-flush text-muted small">
          <li class="list-group-item px-0 d-flex align-items-start border-bottom-0">
            <i class="bi bi-geo-alt-fill text-primary fs-5 me-3"></i>
            <div>
              <strong class="d-block text-dark">Adresse</strong>
              {{ org.address?.streetAddress }} <br>
              {{ org.address?.postalCode }} {{ org.address?.addressLocality }} <br>
              {{ org.address?.addressCountry }}
            </div>
          </li>
          <li class="list-group-item px-0 d-flex align-items-center border-bottom-0">
            <i class="bi bi-telephone-fill text-primary fs-5 me-3"></i>
            <div>
              <strong class="d-block text-dark">Telefon</strong>
              <a :href="'tel:' + org.contactPoint?.telephone" class="text-decoration-none text-muted">{{
                org.contactPoint?.telephone }}</a>
            </div>
          </li>
          <li class="list-group-item px-0 d-flex align-items-center border-bottom-0">
            <i class="bi bi-envelope-fill text-primary fs-5 me-3"></i>
            <div>
              <strong class="d-block text-dark">E-Mail</strong>
              <a :href="'mailto:' + org.contactPoint?.email" class="text-decoration-none text-muted">{{
                org.contactPoint?.email }}</a>
            </div>
          </li>
          <li class="list-group-item px-0 d-flex justify-content-between align-items-center border-bottom-0 mt-2">
            <span class="text-dark"><strong>UID:</strong> {{ org.identifier }}</span>
            <span class="text-dark"><strong>Gegründet:</strong> {{ org.foundingDate }}</span>
          </li>
        </ul>
      </div>

    </div>

    <div v-if="activeTab === 'tasks'" class="p-2 fade-in">

      <div v-if="orgTasks.length > 0">
        <div class="d-flex justify-content-between align-items-end px-2 mt-2 mb-2">
          <h4 class="fw-bold mb-0">Empfehlungen</h4>
          <router-link :to="{ path: '/task-search', query: { org: org.name } }"
            class="text-primary text-decoration-none small fw-bold">
            Alle ansehen
          </router-link>
        </div>

        <TaskCarousel class="mt-0" :items="orgTasks" />

        <div class="px-2 mt-4 mb-2">
          <router-link :to="{ path: '/task-search', query: { org: org.name } }"
            class="btn btn-outline-dark w-100 rounded-pill fw-medium d-flex justify-content-center align-items-center">
            <span>Alle {{ orgTasks.length }} Aufgaben der Organisation anzeigen</span>
            <i class="bi bi-arrow-right-short fs-5 ms-1"></i>
          </router-link>
        </div>
      </div>

      <div v-else class="text-center text-muted">
        <i class="bi bi-clipboard-x fs-1 d-block mb-2 "></i>
        Derzeit gibt es keine offenen Aufgaben.
      </div>

    </div>

    <div v-if="activeTab === 'members'" class="p-2">

      <h4 class="fw-bold my-2">Team & Mitglieder</h4>
      <div v-if="org.member && org.member.length > 0">
        <TableSearch :items="org.member" />
      </div>
      <div v-else class="text-center text-muted py-4">
        Keine öffentlichen Mitglieder verfügbar.
      </div>
    </div>

  </div>
</template>

<script setup>
import organisations from "@/assets/data/organisations.json"
import Navbar from "@/components/navbars/Navbar.vue"
import LoginModal from "@/components/auth/LoginModal.vue"
import TableSearch from "@/components/TableSearch.vue"
import { useTasks } from "@/composables/useTasks"
import TaskCarousel from "@/components/tasks/TaskCarousel.vue"
import { computed, ref } from "vue"
import { useRoute } from "vue-router"

const props = defineProps({
  organisationId: {
    type: String,
    required: true
  }
})

const route = useRoute();
const loginModalRef = ref(null);

// Tab-System ('info', 'tasks', 'members')
const activeTab = ref('info');

const isAuthenticated = computed(() => !!localStorage.getItem('authToken'));
const cameFromSearch = computed(() => route.query.search === 'true');
const { getTasksByOrganization } = useTasks();

const joinOrganisation = () => {
  if (!isAuthenticated.value) {
    loginModalRef.value.open();
    return;
  }
  console.log('User joined organization:', org.value.name);
}

const org = computed(() => {
  return organisations.find(o => o.identifier === props.organisationId);
})

const orgTasks = computed(() => {
  if (!org.value) return [];
  return getTasksByOrganization(org.value.name);
})
</script>

<style scoped>
.content-container {
  padding: unset;
}
</style>