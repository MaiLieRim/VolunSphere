<style scoped>
.content-container {
  padding: unset;
}
</style>
<template>

  <!-- Back Button -->
  <Navbar :title="org.name"
    :backRoute="cameFromSearch ? { name: 'OrganisationSearch' } : { name: 'profile', query: { tab: 'org' } }" />
  <LoginModal ref="loginModalRef" />

  <div class="content-container">
    <!-- Organisation Header -->
    <div class="bg-secondary text-white p-3">
      <div class="row align-items-center">

        <div class="col-4 text-center">
          <img v-if="org.logo" :src="`/assets/images/logo/${org.logo}`" class="rounded-circle" :alt="org.name + ' Logo'"
            width="100" />
        </div>

        <div class=" col-8">
          <h3 class="text-center">{{ org.name }}</h3>
          <div class="row text-center mt-3">

            <div class="col">
              <button class="btn btn-outline-dark" type="button">Empfehlen</button>
            </div>

            <div class="col">
              <button class="btn btn-dark text-light" type="button" @click="joinOrganisation">Jetzt Beitreten</button>

            </div>
          </div>
        </div>
      </div>

    </div>


    <div class="card cover-subtext bg-secondary-subtle shadow-sm">
      <div class="card-body ">
        <div class="d-flex justify-content-between  align-items-center ">
          <h3>Über Uns</h3>
        </div>
        <p class="mb-5">{{ org.description }}</p>

        <small>
          #Feuerwehr #Tierrettung #Organisationstalent
        </small>
      </div>
    </div>
    <!-- Open Tasks of this Organisation -->
    <div v-if="orgTasks.length > 0" class="my-4">
      <TaskCarousel title="Offene Aufgaben" :items="orgTasks" />
    </div>
    <div class="accordion m-3">
      <div class="accordion-item border-0 shadow-sm mb-3 rounded overflow-hidden">
        <h2 class="accordion-header" id="headingOne">
          <button class="accordion-button bg-light text-dark fw-bold" type="button" data-bs-toggle="collapse"
            data-bs-target="#info" aria-expanded="true" aria-controls="info">
            Allgemeine Angaben
          </button>
        </h2>

        <div id="info" class="accordion-collapse collapse show">
          <div class="accordion-body">
            <table class="table table-borderless">
              <tbody>
                <tr>
                  <td>Adresse</td>
                  <td>
                    {{ org.address?.streetAddress }} <br>
                    {{ org.address?.postalCode }}
                    {{ org.address?.addressLocality }} <br>
                    {{ org.address?.addressCountry }}
                  </td>
                </tr>
                <tr>
                  <td>Telefon</td>
                  <td>{{ org.contactPoint?.telephone }}</td>
                </tr>
                <tr>
                  <td>Email</td>
                  <td>{{ org.contactPoint?.email }}</td>
                </tr>
                <tr>
                  <td>UID</td>
                  <td>{{ org.identifier }}</td>
                </tr>
                <tr>
                  <td>Gegründet</td>
                  <td>{{ org.foundingDate }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div class="accordion-item border-0 shadow-sm mb-3 rounded overflow-hidden">
        <h2 class="accordion-header" id="headingOne">
          <button class="accordion-button bg-light text-dark fw-bold collapsed" type="button" data-bs-toggle="collapse"
            data-bs-target="#members" aria-expanded="true" aria-controls="members">
            Mitglieder
          </button>
        </h2>

        <div id="members" class="accordion-collapse collapse">
          <div class="accordion-body">
            <TableSearch :items="org.member" />
          </div>
        </div>
      </div>
      <div class="accordion-item border-0 shadow-sm mb-3 rounded overflow-hidden">
        <h2 class="accordion-header" id="headingOne">
          <button class="accordion-button bg-light text-dark fw-bold collapsed" type="button" data-bs-toggle="collapse"
            data-bs-target="#tasks" aria-expanded="true" aria-controls="tasks">
            Aufgaben
          </button>
        </h2>

        <div id="tasks" class="accordion-collapse collapse">
          <div class="accordion-body">

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
const isAuthenticated = computed(() => !!localStorage.getItem('authToken'));
const cameFromSearch = computed(() => {
  return route.query.search === 'true';
});
const { getTasksByOrganization } = useTasks()

const joinOrganisation = () => {
  if (!isAuthenticated.value) {
    loginModalRef.value.open();
    return;
  }
  // Handle join logic for authenticated users
  console.log('User joined organization:', org.value.name);
}

const org = computed(() => {
  return organisations.find(
    o => o.identifier === props.organisationId
  )
})

const orgTasks = computed(() => {
  if (!org.value) return []
  return getTasksByOrganization(org.value.name)
})
</script>