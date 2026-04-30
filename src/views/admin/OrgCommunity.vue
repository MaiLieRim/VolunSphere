<template>
    <Navbar title="Netzwerk"></Navbar>
    <div class="bg-light">
        <TabNavigation :tabs="[
            { name: 'posts', label: 'Beiträge' },
            { name: 'groups', label: 'Gruppen' },
        ]" :currentTab="activeTab" @update:tab="activeTab = $event" :showSearch="false" :activitySearch="false"
            :backgroundClass="bg-light" />
    </div>
    <div class="content-container">
        <div v-if="activeTab === 'posts'">
            <div class="d-flex justify-content-between align-items-center mb-3">
                <h3 class="mb-0">Unsere Beiträge</h3>
                <button class="btn btn-sm btn-primary rounded-pill" @click="createNewPost">
                    <i class="bi bi-plus-lg"></i> Neuer Post
                </button>
            </div>

            <div v-for="post in posts" :key="post.id" class="card shadow-sm mb-3 border-0">
                <div class="card-body">
                    <div class="d-flex justify-content-between align-items-start mb-2">
                        <small class="text-muted">{{ post.time }}</small>
                        <span class="badge bg-light text-dark border"><i class="bi bi-bar-chart-fill text-primary"></i>
                            {{ post.views }} Aufrufe</span>
                    </div>

                    <p class="mb-3">{{ post.content }}</p>

                    <div class="d-flex justify-content-between align-items-center bg-light p-2 rounded border">
                        <div class="small text-muted">
                            <i class="bi bi-heart-fill text-danger"></i> {{ post.likes }} Likes &bull;
                            <i class="bi bi-chat-dots-fill"></i> {{ post.comments }} Kommentare
                        </div>
                        <div class="form-check form-switch mb-0">
                            <input class="form-check-input" type="checkbox" role="switch" :id="'commentToggle' + post.id"
                                v-model="post.commentsAllowed">
                            <label class="form-check-label small" :for="'commentToggle' + post.id">Kommentare an</label>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div v-if="activeTab === 'groups'">
            <div class="d-flex justify-content-between align-items-center mb-3">
                <h3 class="mb-0">Verwaltete Gruppen</h3>
                <button class="btn btn-sm btn-primary rounded-pill" @click="createNewGroup">
                    <i class="bi bi-plus-lg"></i> Neue Gruppe
                </button>
            </div>

            <div v-for="group in groups" :key="group.id" class="card shadow-sm mb-3 border-0">
                <div class="card-body">
                    <div class="d-flex align-items-center mb-3">
                        <div class="bg-info text-white rounded-circle d-flex justify-content-center align-items-center me-3"
                            style="width: 50px; height: 50px;">
                            <i :class="['bi fs-4', group.icon]"></i>
                        </div>
                        <div class="flex-grow-1">
                            <h5 class="fw-bold mb-0">{{ group.name }}</h5>
                            <small class="text-muted">{{ group.members }} Mitglieder</small>
                        </div>
                        <button class="btn btn-sm btn-outline-danger" title="Moderieren">
                            <i class="bi bi-shield-lock"></i>
                        </button>
                    </div>

                    <div class="d-flex gap-2">
                        <button class="btn btn-sm btn-outline-primary flex-fill">
                            <i class="bi bi-share"></i> Inhalt teilen
                        </button>
                        <button class="btn btn-sm btn-outline-secondary flex-fill">
                            <i class="bi bi-person-plus"></i> Einladen
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <Footer />
</template>

<script setup>
import { ref } from 'vue';
import Navbar from '@/components/navbars/Navbar.vue';
import Footer from '@/components/common/Footer.vue';
import TabNavigation from '@/components/navbars/TabNavigation.vue';

const activeTab = ref('posts');

// Dummy Data for EP-04-FWO-01
const posts = ref([
    {
        id: 1,
        time: 'Heute, 10:00 Uhr',
        content: 'Wir suchen noch dringend Unterstützung für den Sanitätsdienst beim Stadtlauf am Wochenende! Meldet euch gerne direkt hier.',
        likes: 12,
        comments: 3,
        views: 245, // Explorer
        commentsAllowed: true // Kommentare zulassen
    },
    {
        id: 2,
        time: 'Gestern, 14:30 Uhr',
        content: 'Wichtige Info: Die Fahrerschulung am Freitag wird auf Raum B verlegt. Bitte weitersagen.',
        likes: 45,
        comments: 0,
        views: 412,
        commentsAllowed: false
    }
]);

// Dummy Data for EP-04-FWO-02
const groups = ref([
    { id: 1, name: 'Nachtschicht-Team', members: 14, icon: 'bi-moon-stars' },
    { id: 2, name: 'Sanitäter Ausbildung 2024', members: 25, icon: 'bi-bandaid' }
]);

// Action Handlers
const createNewPost = () => {
    alert("Hier würde sich das Formular öffnen, um einen Beitrag zu erstellen und zu veröffentlichen.");
};

const createNewGroup = () => {
    alert("Hier würde sich das Formular öffnen, um eine neue Gruppe zu erstellen.");
};
</script>

<style scoped>
.nav-pills .nav-link {
    color: var(--bs-secondary);
    font-weight: 500;
}

.nav-pills .nav-link.active {
    background-color: var(--bs-primary);
    color: white;
}
</style>