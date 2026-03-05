
<template>
    <Navbar title="Organisation"></Navbar>

        <div class="tab-navigation">
            <div class="nav nav-underline d-inline-flex">
                <div class="nav-item">
                    <RouterLink class="nav-link" to="/search">
                        <i class="bi bi-search"></i>
                    </RouterLink>
                </div>
                <div class="nav-item">
                    <a class="nav-link" :class="{ 'active text-primary': currentTab==='Übersicht', 'text-secondary': currentTab!=='Übersicht' }" href="#" @click.prevent="selectTab('Übersicht')">Übersicht</a>
                </div>
                <div class="nav-item">
                    <a class="nav-link" :class="{ 'active text-primary': currentTab==='Aufgaben', 'text-secondary': currentTab!=='Aufgaben' }" href="#" @click.prevent="selectTab('Aufgaben')">Aufgaben</a>
                </div>
                <div class="nav-item">
                    <a class="nav-link" :class="{ 'active text-primary': currentTab==='Nachweise', 'text-secondary': currentTab!=='Nachweise' }" href="#" @click.prevent="selectTab('Nachweise')">Nachweise</a>
                </div>
                <div class="nav-item">
                    <a class="nav-link" :class="{ 'active text-primary': currentTab==='Mitglieder', 'text-secondary': currentTab!=='Mitglieder' }" href="#" @click.prevent="selectTab('Mitglieder')">Mitglieder</a>
                </div>
            </div>
        </div>

    <!-- show overview by default -->
    <div v-if="currentTab === 'Übersicht'">
      <div class="cover bg-secondary">
          <div class="row">
              <div class="col-4 ">
                  <img src="/src/assets/images/fireflyVolunteer.png" alt="profile picture" width="118" height="121"
                      class="profile-img rounded-circle">
              </div>
              <div class="col-8 ps-0 text-light">
                  <div class="p-2 text-center">
                      <h3>{{ org.name }}</h3>
                  </div>
                  <div class="row pb-3 text-center">
                      <div class="col">
                          <i class="fs-2 bi bi-command"></i><br>
                          <small>
                              QR-Code
                          </small>
                      </div>
                      <div class="col">
                          <a class="text-white text-decoration-none" :href="'mailto:' + org.contactPoint.email">
                              <i class="fs-2 bi bi-envelope-fill"></i><br>
                              <small>Email</small>
                          </a>

                      </div>
                      <div class="col">
                          <a class="text-white text-decoration-none":href="'tel:' + org.contactPoint.telephone">
                              <i class="fs-2 bi bi-telephone-fill"></i><br>
                              <small>Phone</small>
                          </a>

                      </div>
                  </div>
              </div>
          </div>
      </div>
    </div>

  

    <div v-if="currentTab === 'Übersicht'" class="card cover-subtext bg-secondary-subtle shadow-sm">
        <div class="card-body ">
            <div class="d-flex justify-content-between  align-items-center ">
                <h3>Über Uns</h3>
                <button class="btn text-primary" @click="toggleEdit">
                    <template v-if="isEditable">
                        <i class="bi bi-check fs-2"></i>
                    </template>
                    <template v-else>
                        <i class="bi bi-pen fs-3"></i>
                    </template>

                </button>
            </div>
            <template v-if="isEditable">
                <textarea v-model="org.description" class="mb-5 form-control" id="exampleFormControlTextarea1"
                    rows="6"></textarea>
            </template>
            <template v-else>
                <p class="mb-5">{{ org.description }}</p>
            </template>
            <div class="d-flex gap-2 justify-content-end ">
                <button class="btn btn-outline-primary" type="submit">Empfehlen</button>
                <button class="btn btn-primary text-light" type="submit">Jetzt Beitreten</button>
            </div>
            <small>
                #Feuerwehr #Tierrettung #Organisationstalent
            </small>
        </div>
    </div>
    <!-- additional overview content -->

    <br v-if="currentTab === 'Übersicht'">

    <div v-if="currentTab === 'Übersicht'" class="accordion p-2" id="accordionExample">
        <h3 class="m-1">Informationen</h3>
        <div class="accordion-item">
            <h2 class="accordion-header" id="headingOne">
                <button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne"
                    aria-expanded="true" aria-controls="collapseOne">
                    Allgemeine Angaben
                </button>
            </h2>
            <div id="collapseOne" class="accordion-collapse collapse show" data-bs-parent="#accordionExample">
                <div class="accordion-body">
                    <table class="table table-borderless">
                        <tbody>
                            <tr>
                                <td scope="row">Adresse</td>
                                <td>
                                    {{ org.address.streetAddress }}<br>
                                    {{ org.address.postalCode }} {{ org.address.addressLocality }}<br>
                                    {{ org.address.addressCountry }}
                                </td>
                            </tr>
                            <tr>
                                <td scope="row">Mobile</td>
                                <td>{{ org.contactPoint.telephone }}</td>

                            </tr>
                            <tr>
                                <td scope="row">UID Nr.</td>
                                <td>{{ org.identifier }}</td>
                            </tr>
                            <tr>
                                <td scope="row">gegründet</td>
                                <td>{{ org.foundingDate }}</td>
                            </tr>
                            <tr>
                                <td scope="row">registiert seit</td>
                                <td> ... </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
        <div class="accordion-item">
            <h2 class="accordion-header" id="headingThree">
                <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse"
                    data-bs-target="#collapseThree" aria-expanded="false" aria-controls="collapseThree">
                    Zusatzinfo
                </button>
            </h2>
            <div id="collapseThree" class="accordion-collapse collapse" data-bs-parent="#accordionExample">
                <div class="accordion-body">
                    Zusatzinfo ....
                </div>
            </div>
        </div>
    </div>

    <!-- Task View -->
      <div v-if="currentTab === 'Aufgaben'">
        <div class="m-4">
            <h2 class="mb-3">Aufgaben der Organisation</h2>
            <div class="d-flex justify-content-end">
                <RouterLink to="/addtask" class="btn btn-primary">Neue Aufgabe erstellen</RouterLink>
            </div>
        </div>

        <CardBody :message="`9 Personen melden sich um 4 Aufgaben zu erledigen. Bitte bestätigen.`" class="mt-4"></CardBody>
        <CardBody :message="`Sie haben ${items.length} neue Nachweisanfragen, bitte geben Sie diese frei.`" class="mt-2"></CardBody>
        <List :items="items" :title="'Offene Aufgaben'" class="mt-4"></List>
        <List :items="items" :title="'Abgeschlossene Aufgaben'" class="mt-4"></List>
    </div>

    <div v-if="currentTab === 'Nachweise'">
        <h2 class="mt-4">Nachweise der Organisation</h2>
        <CardBody :message="`Sie haben ${items.length} neue Nachweisanfragen, bitte geben Sie diese frei.`" class="mt-2"></CardBody>
        <List :items="items" :title="'Offene Nachweise'" class="mt-4"></List>
    </div>
    <div v-if="currentTab === 'Mitglieder'">
        <div class="mt-4">
            <h2 class="mb-3">Mitglieder der Organisation</h2>
            <TableSearch/>
        </div>
    </div>
</template>

<script setup>
import Navbar from "@/components/navbars/Navbar.vue";
import org from "@/assets/data/organisation.json";
import TableSearch from "@/components/TableSearch.vue";
import CardCarousell from "@/components/CardCarousell.vue";
import CardBody from "@/components/CardBody.vue";
import List from "@/components/List.vue";
import { ref, computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useTasks } from "@/composables/useTasks";

const route = useRoute();
const { allTasks } = useTasks();

const profileLink = computed(() => {
  const role = localStorage.getItem('userRole');
  return role === 'admin' ? '/organisation' : '/profile';
});
const isEditable = ref(false);
// tab state for Organisation view
const currentTab = ref('Übersicht');

onMounted(() => {
  const tabParam = route.query.tab;
  if (tabParam) {
    currentTab.value = tabParam;
  }
});

const selectTab = (tab) => { currentTab.value = tab; };

const toggleEdit = () => {
    isEditable.value = !isEditable.value;
};

const items = computed(() => {
    return allTasks.value;
});

</script>

