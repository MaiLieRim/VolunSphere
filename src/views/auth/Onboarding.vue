<template>
    <div class="bg-primary-subtle"> 
    <div class="bg-primary-subtle container p-3 vh-100 ">
        <img src="/src/assets/images/logo/logo.png " class="w-50">
        <h1 class="mt-5">Onboarding</h1>
        <p>Schön, dass sie sich freiwillig Engagieren möchten. Verfeinern Sie Ihr Profil, damit wir Sie über Sie über
            ein passendes Engagement informieren können, </p>


        <div class="tab-content" id="myTabContent">
            <!-- Tab 1 -->
            <div class="tab-pane fade show active mx-auto " id="interests" role="tabpanel"
                aria-labelledby="interests-page">
                <h3>Interessen</h3>
                <p>
                    Bitte wählen Sie Kategorien aus in denen Sie freiwillig tätig sein möchten.
                </p>
                <ul class="list-group responsive">
                    <li class="list-group-item list-group-item-action">
                        <div class="form-check">
                            <input class="form-check-input" type="checkbox" value="" id="1CheckboxStretched">
                            <label class="form-check-label stretched-link"
                                for="1CheckboxStretched">Flüchtlingshilfe</label>
                        </div>
                    </li>
                    <li class="list-group-item list-group-item-action">
                        <div class="form-check">
                            <input class="form-check-input" type="checkbox" value="" id="2CheckboxStretched">
                            <label class="form-check-label stretched-link"
                                for="2CheckboxStretched">Altenbetreuung</label>
                        </div>
                    </li>
                    <li class="list-group-item list-group-item-action">
                        <div class="form-check">
                            <input class="form-check-input " type="checkbox" value="" id="3CheckboxStretched">
                            <label class="form-check-label stretched-link"
                                for="3CheckboxStretched">Kinderbetreuung</label>
                        </div>
                    </li>
                    <li class="list-group-item list-group-item-action">
                        <div class="form-check">
                            <input class="form-check-input" type="checkbox" value="" id="4CheckboxStretched">
                            <label class="form-check-label stretched-link" for="4CheckboxStretched">Sport</label>
                        </div>
                    </li>
                    <li class="list-group-item list-group-item-action">
                        <div class="form-check">
                            <input class="form-check-input " type="checkbox" value="" id="5CheckboxStretched">
                            <label class="form-check-label stretched-link" for="5CheckboxStretched">Umwelt</label>
                        </div>
                    </li>
                </ul>
            </div>

            <!-- Tab 2-->
            <div class="tab-pane fade mx-auto" id="competences" role="tabpanel" aria-labelledby="competences-page">
                <h3>Kompetenzen</h3>
                <p> Welche Kompetenzen können Sie in Ihre Tätigkeit einbringen?</p>
                <ul class="list-group ">
                    <div class="mt-1">
                        <div class="justify-content-between align-items-center d-flex">
                            Organisation
                            <span class="badge bg-primary"> {{ orgValue }}</span>
                        </div>
                        <input type="range" class="form-range" min="0" max="100" step="1" v-model="orgValue"
                            id="organisationSlider" />
                    </div>
                    <div>
                        <div class="justify-content-between align-items-center d-flex">
                            Teamfähigkeit
                            <span class="badge bg-primary"> {{ teamValue }}</span>
                        </div>
                        <input type="range" class="form-range" min="0" max="100" step="1" v-model="teamValue"
                            id="teamSlider" />
                    </div>

                    <div class="">
                        <div class="justify-content-between align-items-center d-flex">
                            Fleiß
                            <span class="badge bg-primary"> {{ workValue }}</span>
                        </div>
                        <input type="range" class="form-range" min="0" max="100" step="1" v-model="workValue"
                            id="workSlider" />
                    </div>

                    <div>
                        <div class="justify-content-between align-items-center d-flex">
                            Anpassungsfähigkeit
                            <span class="badge bg-primary"> {{ customisationValue }}</span>
                        </div>
                        <input type="range" class="form-range" min="0" max="100" step="1" v-model="customisationValue"
                            id="customisationSlider" />
                    </div>

                    <div>
                        <div class="justify-content-between align-items-center d-flex">
                            Lernbereitschaft
                            <span class="badge bg-primary"> {{ learnValue }}</span>
                        </div>
                        <input type="range" class="form-range" min="0" max="100" step="1" v-model="learnValue"
                            id="learnSlider" />
                    </div>
                </ul>
            </div>

            <!-- Tab 3 -->
            <div class="tab-pane fade mx-auto" id="availability" role="tabpanel" aria-labelledby="availability-page">
                <h3>Verfügbarkeit</h3>
                <p> Bitte wählen Sie die Anzahl an Tagen an denen Sie Zeit haben.</p>
                <ul class="list-group">
                    <li class="list-group-item list-group-item-action">
                        <label class="form-check-label">Tage</label>
                    </li>
                    <li class="list-group-item list-group-item-action">
                        <input class="form-check-input me-1" type="radio" name="listGroupRadio" id="firstRadio" checked>
                        <label class="form-check-label" for="firstRadio">1-2</label>
                    </li>
                    <li class="list-group-item list-group-item-action">
                        <input class="form-check-input me-1" type="radio" name="listGroupRadio" value=""
                            id="secondRadio">
                        <label class="form-check-label" for="secondRadio">2-3</label>
                    </li>
                    <li class="list-group-item list-group-item-action">
                        <input class="form-check-input me-1" type="radio" name="listGroupRadio" value=""
                            id="thirdRadio">
                        <label class="form-check-label" for="thirdRadio">3-4</label>
                    </li>
                    <li class="list-group-item list-group-item-action">
                        <input class="form-check-input me-1" type="radio" name="listGroupRadio" value="" id="4Radio">
                        <label class="form-check-label" for="4Radio">4-5</label>
                    </li>
                </ul>
            </div>
        </div>
    </div>
    <ChatBot></ChatBot>
   <nav class="position-fixed bottom-0 start-0 end-0 ">
        <div class="container p-3 col-lg-3 d-flex justify-content-between align-items-center">
            
            <ul class="pagination mb-0" id="activityTabs" role="tablist">
                <li class="page-item " aria-current="page">
                    <button class="page-link rounded active " id="interests-page" data-bs-toggle="tab"
                        @click="updateCurrentIndex(0)" data-bs-target="#interests" type="button" role="tab"
                        aria-controls="interests" aria-selected="true">
                        1
                    </button>
                </li>
                <li class="page-item mx-4">
                    <button class="page-link rounded" id="competences-page" data-bs-toggle="tab"
                        data-bs-target="#competences" type="button" role="tab" aria-controls="competences"
                        @click="updateCurrentIndex(1)" aria-selected="false">
                        2
                    </button>
                </li>
                <li class="page-item ">
                    <button class="page-link rounded" id="availability-page" data-bs-toggle="tab"
                        data-bs-target="#availability" type="button" role="tab" aria-controls="availability"
                        @click="updateCurrentIndex(2)" aria-selected="false">
                        3
                    </button>
                </li>
            </ul>

            <div class="d-flex align-items-center gap-3">
                
                <router-link to="/" class="text-muted text-decoration-none fw-medium" @click="login()">
                    Überspringen
                </router-link>

                <button v-if="!isReady" @click="goNext" id="goNextBtn" class="btn btn-primary text-light px-4"
                    type="button">Weiter</button>
                <template v-else>
                    <router-link to="/" class="btn btn-primary text-light px-4" @click="login()"
                        type="submit">Fertig</router-link>
                </template>
                
            </div>

        </div>
    </nav>
    </div>
</template>
<script setup>
import { ref } from "vue";
import { useAuth } from '@/assets/js/auth';
import ChatBot from "@/components/common/ChatBot.vue";
const { login } = useAuth();
const tabOrder = ["interests-page", "competences-page", "availability-page"];
const currentIndex = ref(0);
const isReady = ref(false);
const orgValue = ref(50);
const teamValue = ref(50);
const learnValue = ref(50);
const customisationValue = ref(50);
const workValue = ref(50);

const goNext = () => {
    if (currentIndex.value < tabOrder.length - 1) {
        currentIndex.value++;
        switchTab(tabOrder[currentIndex.value]);
        isReady.value = currentIndex.value === 2;
    }
};

const switchTab = (tabId) => {
    const nextTabButton = document.getElementById(tabId);
    if (nextTabButton) {
        nextTabButton.click(); // Triggers Bootstrap tab switching
    }
};

const updateCurrentIndex = (index) => {
    currentIndex.value = index;
    isReady.value = currentIndex.value === 2;
};


</script>
