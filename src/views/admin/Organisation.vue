<style scoped>
.content-container {
    padding: unset;
}
</style>
<template>
    <Navbar title="Organisation"></Navbar>
    <TabNavigation :tabs="[
        { name: 'Übersicht', label: 'Übersicht' },
        { name: 'Aufgaben', label: 'Aufgaben' },
        { name: 'Nachweise', label: 'Nachweise' },
        { name: 'Mitglieder', label: 'Mitglieder' }
    ]" :currentTab="currentTab" @update:tab="currentTab = $event" :background-class="bg-white"/>
    
    <!-- show overview by default -->
    <div v-if="currentTab === 'Übersicht'" class="content-container">
        <div class="cover bg-secondary">
            <div class="row">
                <div class="col-4 ">
                    <img src="/src/assets/images/tasks/firedepartment/fireflyVolunteer.png" alt="profile picture" width="118" height="121"
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
                            <a class="text-white text-decoration-none" :href="'tel:' + org.contactPoint.telephone">
                                <i class="fs-2 bi bi-telephone-fill"></i><br>
                                <small>Phone</small>
                            </a>

                        </div>
                    </div>
                </div>
            </div>
        </div>




        <div class="card cover-subtext bg-secondary-subtle shadow-sm">
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
                </div>
                <small>
                    #Feuerwehr #Tierrettung #Organisationstalent
                </small>
            </div>
        </div>


        <div class="accordion p-2" id="accordionExample">
            <h3 class="m-1">Informationen</h3>
            <div class="accordion-item">
                <h2 class="accordion-header" id="headingOne">
                    <button class="accordion-button" type="button" data-bs-toggle="collapse"
                        data-bs-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
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
    </div>
    <!-- Task View -->
    <div v-if="currentTab === 'Aufgaben'">
        <div class="m-4">
            <h2 class="mb-3">Aufgaben der Organisation</h2>
            <div class="d-flex justify-content-end">
                <RouterLink to="/addtask" class="btn btn-primary">Neue Aufgabe erstellen</RouterLink>
            </div>
        </div>

        <CardBody :message="`9 Personen melden sich um 4 Aufgaben zu erledigen. Bitte bestätigen.`" class="mt-4">
        </CardBody>
        <CardBody :message="`Sie haben ${items.length} neue Nachweisanfragen, bitte geben Sie diese frei.`"
            class="mt-2">
        </CardBody>
        <TaskList :items="items" :title="'Offene Aufgaben'" class="mt-4"></TaskList>
        <TaskList :items="items" :title="'Abgeschlossene Aufgaben'" class="mt-4"></TaskList>
    </div>

    <div v-if="currentTab === 'Nachweise'">
        <h2 class="mt-4">Nachweise der Organisation</h2>
        <CardBody :message="`Sie haben ${items.length} neue Nachweisanfragen, bitte geben Sie diese frei.`"
            class="mt-2">
        </CardBody>
        <TaskList :items="items" :title="'Offene Nachweise'" class="mt-4"></TaskList>
    </div>
    <div v-if="currentTab === 'Mitglieder'">
        <div class="mt-4">
            <h2 class="mb-3">Mitglieder der Organisation</h2>
            <TableSearch :items="org.member" />
        </div>
    </div>
</template>

<script setup>
import Navbar from "@/components/navbars/Navbar.vue";
import organisations from "@/assets/data/organisations.json";
import TableSearch from "@/components/TableSearch.vue";
import CardBody from "@/components/CardBody.vue";
import TaskList from "@/components/TaskList.vue";
import { ref, computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useTasks } from "@/composables/useTasks";
import user from "@/assets/data/admin.json";
import TabNavigation from "@/components/navbars/TabNavigation.vue";
const route = useRoute();
const { allTasks } = useTasks();


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

const org = computed(() => {
    return organisations.find(o =>
        o.member?.some(m => m.name === user.name)
    )
})
</script>
