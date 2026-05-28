<template>
    <Navbar title="Netzwerk"></Navbar>
    <div class="bg-light">
        <TabNavigation :tabs="[
            { name: 'hub', label: 'Beiträge' },
            { name: 'groups', label: 'Gruppen' },
            { name: 'discover', label: 'Entdecken' } 
        ]" :currentTab="activeTab" @update:tab="activeTab = $event" :showSearch="false" :activitySearch="false"
            backgroundClass="bg-light" />
    </div>

    <div class="content-container pb-5">
        
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
                                <h5 class="mb-0 fw-bold">{{ post.organization }}</h5>
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
                <button class="btn btn-sm btn-outline-primary rounded-pill" @click="activeTab = 'discover'"><i class="bi bi-search"></i> Finden</button>
            </div>
            <div class="row g-3">
                <div v-for="group in groups" :key="group.id" class="col-6">
                    <div class="card h-100 shadow-sm border-0 text-center">
                        <div class="card-body p-3">
                            <div class="bg-info text-white rounded-circle d-flex justify-content-center align-items-center mx-auto mb-2"
                                style="width: 50px; height: 50px;">
                                <i :class="['bi fs-4', group.icon]"></i>
                            </div>
                            <h5 class="fw-bold mb-1">{{ group.name }}</h5>
                            <small class="text-muted d-block">{{ group.members }} Mitglieder</small>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div v-if="activeTab === 'discover'">
            
            <div class="input-group shadow-sm mb-3">
                <span class="input-group-text bg-white border-end-0 text-muted"><i class="bi bi-search"></i></span>
                <input type="search" class="form-control border-start-0 ps-0" placeholder="Personen oder Gruppen suchen..." v-model="searchQuery">
            </div>

            <div class="d-flex gap-2 mb-4 overflow-x-auto pb-1" style="white-space: nowrap;">
                <button class="btn rounded-pill btn-sm px-3" :class="searchFilter === 'people' ? 'btn-primary shadow-sm' : 'btn-light border text-muted'" @click="searchFilter = 'people'">
                    Personen
                </button>
                <button class="btn rounded-pill btn-sm px-3" :class="searchFilter === 'groups' ? 'btn-primary shadow-sm' : 'btn-light border text-muted'" @click="searchFilter = 'groups'">
                    Gruppen
                </button>
            </div>

            <div v-if="searchFilter === 'people'">
                <h4 class="fw-bold text-muted mb-3">Vorschläge für dich</h4>
                <div v-for="person in filteredPeople" :key="person.id" class="d-flex justify-content-between align-items-center bg-white p-3 rounded-3 shadow-sm mb-2">
                    <div class="d-flex align-items-center">
                        <img :src="person.avatar" class="rounded-circle object-fit-cover" width="45" height="45">
                        <div class="ms-3">
                            <h4 class="mb-0 fw-bold">{{ person.name }}</h4>
                            <small class="text-muted">{{ person.mutual }} gemeinsame Kontakte</small>
                        </div>
                    </div>
                    <button class="btn btn-sm rounded-circle transition-all" 
                            :class="person.added ? 'btn-light text-success' : 'btn-primary-subtle text-primary'" 
                            style="width: 35px; height: 35px;"
                            @click="toggleAddFriend(person)">
                        <i class="bi" :class="person.added ? 'bi-check-lg' : 'bi-person-plus-fill'"></i>
                    </button>
                </div>
                <div v-if="filteredPeople.length === 0" class="text-center text-muted mt-4">
                    Keine Personen gefunden.
                </div>
            </div>

            <div v-if="searchFilter === 'groups'">
                <h4 class="fw-bold text-muted mb-3">Interessante Gruppen</h4>
                <div v-for="group in filteredDiscoverGroups" :key="group.id" class="d-flex justify-content-between align-items-center bg-white p-3 rounded-3 shadow-sm mb-2">
                    <div class="d-flex align-items-center">
                        <div class="bg-primary-subtle text-primary rounded-circle d-flex justify-content-center align-items-center" style="width: 45px; height: 45px;">
                            <i :class="['bi', group.icon]"></i>
                        </div>
                        <div class="ms-3">
                            <h4 class="mb-0 fw-bold">{{ group.name }}</h4>
                            <small class="text-muted">{{ group.members }} Mitglieder • {{ group.type }}</small>
                        </div>
                    </div>
                    <button class="btn btn-sm rounded-pill transition-all" 
                            :class="group.joined ? 'btn-light text-success border' : 'btn-outline-primary'" 
                            @click="toggleJoinGroup(group)">
                        {{ group.joined ? 'Beigetreten' : 'Beitreten' }}
                    </button>
                </div>
                <div v-if="filteredDiscoverGroups.length === 0" class="text-center text-muted mt-4">
                    Keine Gruppen gefunden.
                </div>
            </div>

        </div>

    </div>
    <Footer />
</template>

<script setup>
import Navbar from '@/components/navbars/Navbar.vue';
import Footer from '@/components/common/Footer.vue';
import TabNavigation from '@/components/navbars/TabNavigation.vue';
import { ref, computed } from 'vue';

const activeTab = ref('hub');

// --- Search & Discover State ---
const searchQuery = ref('');
const searchFilter = ref('people'); // 'people' oder 'groups'

// Dummy Data: Feed Posts
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

// Dummy Data: My Groups
const groups = ref([
    { id: 1, name: 'Nachtschicht-Team', members: 14, icon: 'bi-moon-stars' },
    { id: 2, name: 'Sanitäter Ausbildung 2024', members: 25, icon: 'bi-bandaid' },
    { id: 3, name: 'Fahrerpool Linz', members: 40, icon: 'bi-car-front' },
]);

// Dummy Data: Discover People
const discoverPeople = ref([
    { id: 1, name: 'Lukas Meier', mutual: 3, avatar: 'https://i.pravatar.cc/100?img=11', added: false },
    { id: 2, name: 'Sarah Gruber', mutual: 1, avatar: 'https://i.pravatar.cc/100?img=5', added: false },
    { id: 3, name: 'Thomas Winkler', mutual: 5, avatar: 'https://i.pravatar.cc/100?img=12', added: false },
    { id: 4, name: 'Julia Baumgartner', mutual: 0, avatar: 'https://i.pravatar.cc/100?img=9', added: false }
]);

// Dummy Data: Discover Groups
const discoverGroups = ref([
    { id: 1, name: 'Rettungshunde Staffel', members: 120, type: 'Öffentlich', icon: 'bi-heart-pulse', joined: false },
    { id: 2, name: 'Umweltschutz Linz', members: 340, type: 'Öffentlich', icon: 'bi-tree', joined: false },
    { id: 3, name: 'Jugendbetreuer Pool', members: 55, type: 'Geschlossen', icon: 'bi-people', joined: false }
]);


// --- Computed Properties for Search ---
const filteredPeople = computed(() => {
    if (!searchQuery.value) return discoverPeople.value;
    const lowerCaseQuery = searchQuery.value.toLowerCase();
    return discoverPeople.value.filter(person => 
        person.name.toLowerCase().includes(lowerCaseQuery)
    );
});

const filteredDiscoverGroups = computed(() => {
    if (!searchQuery.value) return discoverGroups.value;
    const lowerCaseQuery = searchQuery.value.toLowerCase();
    return discoverGroups.value.filter(group => 
        group.name.toLowerCase().includes(lowerCaseQuery)
    );
});


// --- Interactive Methods ---
const toggleLike = (post) => {
    post.liked = !post.liked;
    post.likes += post.liked ? 1 : -1;
};

const toggleAddFriend = (person) => {
    person.added = !person.added;
};

const toggleJoinGroup = (group) => {
    group.joined = !group.joined;
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

.transition-all {
    transition: all 0.2s ease-in-out;
}
</style>