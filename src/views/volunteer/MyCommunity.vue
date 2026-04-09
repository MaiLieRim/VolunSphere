<template>
    <Navbar title="Netzwerk"></Navbar>
    <div class="bg-light">
        <TabNavigation :tabs="[
            { name: 'hub', label: 'Beiträge' },
            { name: 'groups', label: 'Gruppen' },
        ]" :currentTab="activeTab" @update:tab="activeTab = $event" :showSearch="false" :activitySearch="false"
            :backgroundClass="bg - light" />
    </div>
    <div class="content-container">
        <div v-if="activeTab === 'hub'">
            <div v-for="post in posts" :key="post.id" class="card shadow-sm mb-3 border-0">
                <div class="card-body">
                    <div class="d-flex align-items-center justify-content-between mb-3">
                        <div class="d-flex align-items-center">
                            <div class="bg-primary text-white rounded-circle d-flex justify-content-center align-items-center me-3"
                                style="width: 45px; height: 45px;">
                                <i class="bi bi-building"></i>
                            </div>
                            <div>
                                <h6 class="mb-0 fw-bold">{{ post.organization }}</h6>
                                <small class="text-muted">{{ post.time }}</small>
                            </div>
                        </div>
                        <div class="dropdown">
                            <button class="btn btn-sm btn-link text-muted" type="button" data-bs-toggle="dropdown">
                                <i class="bi bi-three-dots-vertical"></i>
                            </button>
                            <ul class="dropdown-menu dropdown-menu-end shadow-sm border-0">
                                <li><a class="dropdown-item text-danger" href="#"><i class="bi bi-flag me-2"></i>Beitrag
                                        melden</a></li>
                            </ul>
                        </div>
                    </div>
                    <p class="mb-3">{{ post.content }}</p>
                    <div class="d-flex justify-content-between border-top pt-2 mt-2 text-muted">
                        <button class="btn btn-sm btn-link text-decoration-none text-muted" @click="toggleLike(post)">
                            <i class="bi" :class="post.liked ? 'bi-heart-fill text-danger' : 'bi-heart'"></i>
                            {{ post.likes }} Gefällt mir
                        </button>
                        <button class="btn btn-sm btn-link text-decoration-none text-muted">
                            <i class="bi bi-chat"></i> {{ post.comments }} Kommentare
                        </button>
                    </div>
                </div>
            </div>
        </div>
        <div v-if="activeTab === 'groups'">
            <div class="d-flex justify-content-between align-items-center mb-3">
                <h3 class="mb-0">Meine Gruppen</h3>
                <button class="btn btn-sm btn-outline-primary rounded-pill"><i class="bi bi-search"></i> Finden</button>
            </div>
            <div class="row g-3">
                <div v-for="group in groups" :key="group.id" class="col-6">
                    <div class="card h-100 shadow-sm border-0 text-center">
                        <div class="card-body p-3">
                            <div class="bg-info text-white rounded-circle d-flex justify-content-center align-items-center mx-auto mb-2"
                                style="width: 50px; height: 50px;">
                                <i :class="['bi fs-4', group.icon]"></i>
                            </div>
                            <h6 class="fw-bold mb-1">{{ group.name }}</h6>
                            <small class="text-muted d-block">{{ group.members }} Mitglieder</small>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <Footer />
</template>

<script setup>
import Navbar from '@/components/navbars/Navbar.vue';
import Footer from '@/components/Footer.vue';
import TabNavigation from '@/components/navbars/TabNavigation.vue';
import { ref, computed } from 'vue';

const activeTab = ref('hub');

// Dummy Data: Feed Posts (Organisationsposts)
const posts = ref([
    {
        id: 1,
        organization: 'Samariterbund Linz',
        time: 'Vor 2 Stunden',
        content: 'Wir suchen noch dringend Unterstützung für den Sanitätsdienst beim Stadtlauf am Wochenende! Meldet euch gerne direkt hier oder in der App.',
        likes: 12,
        comments: 3,
        liked: false
    },
    {
        id: 2,
        organization: 'Rotes Kreuz OÖ',
        time: 'Gestern',
        content: 'Danke an alle Freiwilligen, die gestern bei der Blutspendeaktion geholfen haben. Ihr seid spitze! 🙌',
        likes: 45,
        comments: 8,
        liked: true
    }
]);

// Dummy Data: Direct Messages
const messages = ref([
    { id: 1, sender: 'Lisa Schluntz (Einsatzleitung)', lastMessage: 'Kannst du am Freitag die Schicht übernehmen?', time: '10:30', unread: true },
    { id: 2, sender: 'Tommi Sieg', lastMessage: 'Alles klar, bis später!', time: 'Gestern', unread: false },
    { id: 3, sender: 'Support Team', lastMessage: 'Dein Nachweis wurde bestätigt.', time: 'Mo.', unread: false },
]);

const unreadMessages = computed(() => messages.value.filter(m => m.unread).length);

// Dummy Data: Groups
const groups = ref([
    { id: 1, name: 'Nachtschicht-Team', members: 14, icon: 'bi-moon-stars' },
    { id: 2, name: 'Sanitäter Ausbildung 2024', members: 25, icon: 'bi-bandaid' },
    { id: 3, name: 'Fahrerpool Linz', members: 40, icon: 'bi-car-front' },
]);

// Interactive Methods
const toggleLike = (post) => {
    post.liked = !post.liked;
    post.likes += post.liked ? 1 : -1;
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