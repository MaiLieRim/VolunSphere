<script setup>
import Navbar from "@/components/navbars/Navbar.vue";
import Accordion from "@/components/Accordion.vue";
import { ref, nextTick } from 'vue';
import user from "@/assets/data/volunteer"

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
</script>

<template>
    <Navbar title="Profil"></Navbar>
    <div class="tab-navigation bg-white">
        <div class="nav nav-underline d-inline-flex">
            <div class="nav-item">
                <RouterLink class="nav-link" to="/search">
                    <i class="bi bi-search"></i>
                </RouterLink>
            </div>
            <div class="nav-item">
                <a class="nav-link text-primary  active" aria-current="page" href="#">Übersicht</a>
            </div>

            <div class="nav-item">
                <a class="nav-link disabled" href="#">Nachweise</a>
            </div>
            <div class="nav-item">
                <RouterLink class="nav-link" to="">
                    Organisation
                </RouterLink>
            </div>
            <div class="nav-item">
                <a class="nav-link disabled" href="#">Stammdaten</a>
            </div>
            <div class="nav-item">
                <a class="nav-link disabled" href="#">Einstellungen</a>
            </div>

        </div>
    </div>


    <div class="cover bg-primary">
        <div class="row">
            <div class="col-4 ">
                <img src="/src/assets/images/liselotte.png" alt="profile picture" width="118"
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
                <textarea v-model="user.description" class="form-control" id="descriptionArea" rows="6"></textarea>
            </template>
            <template v-else>
                <p class="mb-5">{{ user.description }}</p>
            </template>

            <small>
                #Feuerwehr #Tierrettung #Organisationstalent
            </small>
        </div>
    </div>

    <div class="mx-3 my-3">
        <h3 class="mb-0">Dein Code in der Krise</h3>
        <div class="text-center">
            <img class="m-3 bg-light" alt="QRCode" src="/src/assets/images/qrCode.png">
            <br>
            <small>
                erstellt am 14.6.2024, gültig bis 14.8.2024;
                Liselotte Pulver; 18051978; lise@email.at; +436506006670; 2411;  Strafregisterauszug super!;
                Gruppenleiterin
                St. Isidor; 1= Führerschein B, 12= Sprengmeisterin, Englisch, Deutsch
            </small>
        </div>
    </div>

    <Accordion> </Accordion>


</template>
