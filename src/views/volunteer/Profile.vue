<style scoped>
.content-container {
    padding: unset;
}
</style>

<template>
    <Navbar title="Profil"></Navbar>

    <TabNavigation :tabs="[
        { name: 'overview', label: 'Übersicht' },
        { name: 'goals', label: 'Ziele' },
        { name: 'statistic', label: 'Statistik' },
        { name: 'org', label: 'Organisation' },
        { name: 'community', label: 'Community' }
    ]" :currentTab="currentTab" :showSearch="false" :activitySearch="false" @update:tab="currentTab = $event" />

    <div class="content-container">
        <div v-if="currentTab === 'overview'">
            <div class="cover bg-primary">
                <div class="row">
                    <div class="col-4 ">
                        <img :src="`${user.image}`" alt="profile picture" width="118"
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
                    <div class="d-flex justify-content-between align-items-center ">
                        <h3>Über mich</h3>
                        <button class="btn text-primary" @click="toggleAboutEdit">
                            <template v-if="isAboutEditable">
                                <i class="bi bi-check fs-3"></i>
                            </template>
                            <template v-else>
                                <i class="bi bi-pen fs-3"></i>
                            </template>
                        </button>
                    </div>

                    <template v-if="isAboutEditable">
                        <textarea v-model="user.description" class="form-control" id="descriptionArea"
                            rows="6"></textarea>
                    </template>
                    <template v-else>
                        <p class="mb-5">{{ user.description }}</p>
                    </template>

                    <div class="d-flex flex-wrap align-items-center gap-2 mt-3">
                        <span v-for="tag in user.interests" :key="tag"
                            class="btn rounded-pill badge text-bg-light shadow-sm border d-flex align-items-center"
                            @click="removeTag(tag)">
                            #{{ tag }}
                            <i class="bi bi-x ms-1 fs-6"></i>
                        </span>

                        <span class="btn rounded-pill badge text-bg-light shadow-sm border" @click="addTag">
                            <i class="bi bi-plus fs-6"></i>
                        </span>
                    </div>
                </div>
            </div>

            <div class="p-2 mt-3">
                <div class="d-flex justify-content-between align-items-center ">
                    <h3>Wünsche</h3>
                    <button class="btn text-primary" @click="toggleWishesEdit">
                        <template v-if="isWishesEditable">
                            <i class="bi bi-check fs-3"></i>
                        </template>
                        <template v-else>
                            <i class="bi bi-pen fs-3"></i>
                        </template>
                    </button>
                </div>

                <div class="card bg-light shadow border-0">
                    <div class="card-body">
                        <template v-if="isWishesEditable">
                            <textarea v-model="user.wishes" class="form-control" id="wishesArea" rows="6"></textarea>
                        </template>
                        <template v-else>
                            {{ user.wishes }}
                        </template>
                    </div>
                </div>
            </div>



            <Accordion> </Accordion>


        </div>

        <div v-if="currentTab === 'goals'">
            <MyGoals></MyGoals>
        </div>
        <div v-if="currentTab === 'statistic'">
            <Statistics></Statistics>
        </div>
        <div v-if="currentTab === 'org'" class=" px-2">
            <OrganisationList :items="myOrganizations" title="Meine Organisationen"></OrganisationList>
            <OrganisationList class="mt-3" :items="organizations.filter(org => !myOrganizations.includes(org))"
                title="Empfehlungen" />
        </div>
    </div>
</template>

<script setup>
import Navbar from "@/components/navbars/Navbar.vue";
import Accordion from "@/components/Accordion.vue";
import MyGoals from "@/components/Goalification/MyGoals.vue";
import { ref, nextTick, computed, watch } from 'vue'; 
import { useRoute, useRouter } from "vue-router";     

// Import raw data
import rawUser from "@/assets/data/volunteer"
import organizations from "@/assets/data/organisations.json";
import OrganisationList from "@/components/OrganisationList.vue";
import TabNavigation from "@/components/navbars/TabNavigation.vue";
import Statistics from "@/components/Statistics.vue";


// Deep clone the object so nested arrays become fully reactive!
const user = ref(JSON.parse(JSON.stringify(rawUser)));

// Add a default "wishes" field if it doesn't exist in your raw JSON yet
if (!user.value.wishes) {
    user.value.wishes = "Abwechslung in der Nachbarschaft, neue Leute kennenlernen, mich engagieren, etwas zurückgeben, Spaß haben, neue Erfahrungen sammeln.";
}

// 1. Separate State for "Über mich"
const isAboutEditable = ref(false);
const toggleAboutEdit = () => {
    isAboutEditable.value = !isAboutEditable.value;
    nextTick(() => {
        if (isAboutEditable.value) {
            document.getElementById('descriptionArea')?.focus();
        }
    });
};

// 2. Separate State for "Wünsche"
const isWishesEditable = ref(false);
const toggleWishesEdit = () => {
    isWishesEditable.value = !isWishesEditable.value;
    nextTick(() => {
        if (isWishesEditable.value) {
            document.getElementById('wishesArea')?.focus();
        }
    });
};

const route = useRoute()
const currentTab = ref(route.query.tab || 'overview')
const router = useRouter(); // Initialize the router


// WATCHER: Automatically update the URL when currentTab changes
watch(currentTab, (newTab) => {
    router.replace({ 
        query: { ...route.query, tab: newTab } 
    });
});
const myOrganizations = computed(() => {
    return organizations.filter(org =>
        org.member?.some(m => m.name === user.value.name)
    )
})

// Tag Logic
const removeTag = (tagToRemove) => {
    user.value.interests = user.value.interests.filter(tag => tag !== tagToRemove);
};

const addTag = () => {
    const newTag = prompt("Neuen Tag eingeben (ohne #):");

    if (newTag && newTag.trim() !== "") {
        const cleanedTag = newTag.trim();
        if (!user.value.interests.includes(cleanedTag)) {
            user.value.interests.push(cleanedTag);
        }
    }
};
</script>