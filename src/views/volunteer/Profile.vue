<style scoped>
.content-container {
    padding: unset;
}
</style>
<template>
    <Navbar title="Profil"></Navbar>
    <TabNavigation :tabs="[
        { name: 'Übersicht', label: 'Übersicht' },
        { name: 'Nachweise', label: 'Nachweise' },
        { name: 'Organisation', label: 'Organisation' },
        { name: 'Community', label: 'Community' }
    ]" :currentTab="currentTab" :showSearch="false" @update:tab="currentTab = $event" />

    <div class="content-container">
        <div v-if="currentTab === 'Übersicht'">
            <div class="cover bg-primary">
                <div class="row">
                    <div class="col-4 ">
                        <img src="/src/assets/images/profile-pictures/liselotte.png" alt="profile picture" width="118"
                            class="profile-img rounded-circle">
                    </div>
                    <div class="col-8 ps-0 text-light">
                        <div class="fs-3 p-2 text-center">
                            {{ user.honorificPrefix }} <strong>{{ user.name }}</strong>, {{ user.honorificSuffix }}
                        </div>
                        <div class="row pb-3 text-center">
                            <div class="col">
                                <i class="fs-2 bi bi-command"></i><br>
                                <small>
                                    QR-Code
                                </small>
                            </div>
                            <div class="col">
                                <i class="fs-2 bi bi-envelope-fill"></i><br>
                                <small>
                                    email
                                </small>
                            </div>
                            <div class="col">
                                <i class="fs-2 bi bi-telephone-fill"></i><br>
                                <small>
                                    Phone
                                </small>
                            </div>
                        </div>
                    </div>
                </div>
            </div>


            <div class="card cover-subtext bg-primary-subtle shadow-sm">
                <div class="card-body ">
                    <div class="d-flex justify-content-between  align-items-center ">
                        <h3>Über mich</h3>
                        <button class="btn text-primary" @click="toggleEdit">
                            <template v-if="isEditable">
                                <i class="bi bi-check fs-3"></i>
                            </template>
                            <template v-else>
                                <i class="bi bi-pen fs-3"></i>
                            </template>

                        </button>
                    </div>
                    <template v-if="isEditable">
                        <textarea v-model="user.description" class="form-control" id="descriptionArea"
                            rows="6"></textarea>
                    </template>
                    <template v-else>
                        <p class="mb-5">{{ user.description }}</p>
                    </template>

                    <small>
                        #Feuerwehr #Tierrettung #Organisationstalent
                    </small>
                </div>
            </div>



            <Accordion> </Accordion>

            <QualificationList :title="qualifications.title" :items="qualifications.qualifications" />
        </div>

        <div v-if="currentTab === 'Nachweise'">

        </div>

        <div v-if="currentTab === 'Organisation'">
            <OrganisationList :items="myOrganizations" title="Meine Organisationen"></OrganisationList>
            <OrganisationList :items="organizations.filter(org => !myOrganizations.includes(org))"
                title="Empfehlungen" />
        </div>
    </div>
</template>


<script setup>
import Navbar from "@/components/navbars/Navbar.vue";
import Accordion from "@/components/Accordion.vue";
import { ref, nextTick, computed } from 'vue';
import { useRoute } from "vue-router";
import user from "@/assets/data/volunteer"
import organizations from "@/assets/data/organisations.json";
import OrganisationList from "@/components/OrganisationList.vue";
import TabNavigation from "@/components/navbars/TabNavigation.vue";
import QualificationList from "@/components/ListWithImage.vue";
import qualifications from "@/assets/data/qualifications.json";
const isEditable = ref(false);
const toggleEdit = () => {
    isEditable.value = !isEditable.value;
    nextTick(() => {
        if (isEditable) {
            const descriptionArea = document.getElementById('descriptionArea');
            descriptionArea.focus();
        }
    });
};

const route = useRoute()
const currentTab = ref(route.query.tab || 'Übersicht')

const myOrganizations = computed(() => {
    return organizations.filter(org =>
        org.member?.some(m => m.name === user.name)
    )
})
</script>
