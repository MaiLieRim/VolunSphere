<template>
  <Navbar :title="org.name"
    :backRoute="cameFromSearch ? { name: 'OrganisationSearch' } : { name: 'profile', query: { tab: 'org' } }" />
  <LoginModal ref="loginModalRef" />

  <div class="content-container pb-5 bg-light min-vh-100">

    <div class=" bg-dark bg-gradient text-white p-3 px-6 shadow-sm">
      <div class="d-flex align-items-center gap-3">

        <div class="flex-shrink-0 text-center">
          <img v-if="org.logo" :src="`/assets/images/logo/${org.logo}`"
            class="rounded-circle border border-2 border-white bg-white shadow-sm" :alt="org.name + ' Logo'" width="90"
            height="90" style="object-fit: cover;" />
        </div>

        <div class="flex-grow-1">


          <div class="d-flex gap-2 flex-wrap">
            <button class="btn btn-primary btn-sm fw-bold text-light rounded-pill px-3 shadow-sm" type="button"
              @click="joinOrganisation">
              Jetzt Beitreten
            </button>
            <button class="btn btn-outline-light btn-sm rounded-pill px-3" type="button">
              Empfehlen
            </button>
          </div>
        </div>

      </div>
    </div>

    <ul class="nav nav-pills nav-fill bg-dark-subtle rounded-bottom text-light shadow-sm p-2 sticky-top"
      style="top: 0; z-index: 10;">
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
          <span v-if="orgTasks.length" class="badge bg-light text-primary ms-1 rounded-pill">{{ orgTasks.length
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

    <div class="p-3">

      <div v-if="activeTab === 'info'" class="fade-in">

        <div class="card border-0 shadow-sm mb-4 rounded-4">
          <div class="card-body p-4">
            <h5 class="fw-bold mb-3">Über Uns</h5>
            <p class="text-muted mb-4">{{ org.description }}</p>
            <div class="d-flex flex-wrap gap-2">
              <span class="badge bg-primary-subtle text-primary rounded-pill">#Feuerwehr</span>
              <span class="badge bg-primary-subtle text-primary rounded-pill">#Tierrettung</span>
              <span class="badge bg-primary-subtle text-primary rounded-pill">#Organisationstalent</span>
            </div>
          </div>
        </div>

        <div class="card border-0 shadow-sm rounded-4">
          <div class="card-body p-4">
            <h5 class="fw-bold mb-3">Allgemeine Angaben</h5>
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
      </div>

      <div v-if="activeTab === 'tasks'" class="fade-in">
        <div v-if="orgTasks.length > 0">
        
          <TaskCarousel class="mt-0" title="Empfehlungen" :items="orgTasks" />
        </div>
        <div v-else class="text-center text-muted p-5 bg-white rounded-4 shadow-sm mt-2">
          <i class="bi bi-clipboard-x fs-1 d-block mb-2 text-light"></i>
          Derzeit gibt es keine offenen Aufgaben.
        </div>
      </div>

      <div v-if="activeTab === 'members'" class="fade-in">
        <div class="bg-white p-3 rounded-4 shadow-sm mt-2">
          <h5 class="fw-bold mb-3">Team & Mitglieder</h5>
          <div v-if="org.member && org.member.length > 0">
            <TableSearch :items="org.member" />
          </div>
          <div v-else class="text-center text-muted py-4">
            Keine öffentlichen Mitglieder verfügbar.
          </div>
        </div>
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