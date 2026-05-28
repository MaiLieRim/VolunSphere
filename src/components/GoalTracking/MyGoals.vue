<template>
    <div class="nav-underline-container bg-primary mt-0">
        <div class="d-flex justify-content-between text-center overflow-x-auto no-scrollbar">
            <button class="nav-tab-item" :class="{ active: activeTab === 'new' }" @click="activeTab = 'new'">
                <i class="bi bi-plus-circle mb-1"></i>
                <span>Neu</span>
            </button>
            <button class="nav-tab-item" :class="{ active: activeTab === 'challenges' }"
                @click="activeTab = 'challenges'">
                <i class="bi bi-flag mb-1"></i>
                <span>Challenges</span>
            </button>
            <button class="nav-tab-item" :class="{ active: activeTab === 'active' }" @click="activeTab = 'active'">
                <i class="bi bi-arrow-repeat mb-1"></i>
                <span>Laufend</span>
            </button>
            <button class="nav-tab-item" :class="{ active: activeTab === 'past' }" @click="activeTab = 'past'">
                <i class="bi bi-clock-history mb-1"></i>
                <span>Vergangen</span>
            </button>
            <button class="nav-tab-item" :class="{ active: activeTab === 'badges' }" @click="activeTab = 'badges'">
                <i class="bi bi-trophy mb-1"></i>
                <span>Badges</span>
            </button>
        </div>
    </div>
    <div class="content-body px-3 pt-4">
        <div v-if="activeTab === 'new'" class="animate-fade-in">

            <div class="mb-4">
                <h5 class="fw-bold mb-3 px-1 text-muted small text-uppercase">NPO auswählen</h5>
                <div class="d-flex gap-2 overflow-x-auto pb-2 no-scrollbar">
                    <button class="btn btn-primary rounded-pill px-4 shadow-sm text-nowrap">
                        FF Eidenberg
                    </button>
                    <button class="btn btn-white bg-white border rounded-pill px-4 text-muted text-nowrap">
                        Nachbarschaftshilfe
                    </button>
                </div>
            </div>

            <div class="card border-0 shadow-sm rounded-4 mb-4">
                <div class="card-body p-4">
                    <h5 class="fw-bold mb-4 text-center">1. In welchem Bereich möchtest du dein Ziel verfolgen?</h5>

                    <div class="row align-items-center">
                        <div class="col-12 col-md-5 d-flex justify-content-center mb-4 mb-md-0">
                            <div class="css-pie-chart shadow-sm"></div>
                        </div>
                        <div class="col-12 col-md-7">
                            <div class="list-group list-group-flush gap-2">
                                <button
                                    class="list-group-item list-group-item-action border rounded-3 d-flex justify-content-between align-items-center p-2 active-area">
                                    <div class="d-flex align-items-center gap-2">
                                        <span class="rounded-circle"
                                            style="width: 12px; height: 12px; background-color: #15b74b;"></span>
                                        <span class="fw-medium small">Aktivität</span>
                                    </div>
                                    <span class="badge bg-light text-dark">50.7%</span>
                                </button>
                                <button
                                    class="list-group-item list-group-item-action border rounded-3 d-flex justify-content-between align-items-center p-2">
                                    <div class="d-flex align-items-center gap-2">
                                        <span class="rounded-circle"
                                            style="width: 12px; height: 12px; background-color: #0c943b;"></span>
                                        <span class="fw-medium small">Kompetenz</span>
                                    </div>
                                    <span class="badge bg-light text-dark">21.3%</span>
                                </button>
                                <button
                                    class="list-group-item list-group-item-action border rounded-3 d-flex justify-content-between align-items-center p-2">
                                    <div class="d-flex align-items-center gap-2">
                                        <span class="rounded-circle"
                                            style="width: 12px; height: 12px; background-color: #2de26a;"></span>
                                        <span class="fw-medium small">Funktion</span>
                                    </div>
                                    <span class="badge bg-light text-dark">17.3%</span>
                                </button>
                                <button
                                    class="list-group-item list-group-item-action border rounded-3 d-flex justify-content-between align-items-center p-2">
                                    <div class="d-flex align-items-center gap-2">
                                        <span class="rounded-circle"
                                            style="width: 12px; height: 12px; background-color: #72f59f;"></span>
                                        <span class="fw-medium small">Verdienst</span>
                                    </div>
                                    <span class="badge bg-light text-dark">10.7%</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <h5 class="fw-bold mb-3 text-center mt-2">2. Wie möchtest du dein Ziel erstellen?</h5>
            <div class="row g-3 mb-4">
                <div class="col-6">
                    <button
                        class="btn w-100 h-100 p-3 rounded-4 d-flex flex-column align-items-center justify-content-center gap-2 transition-all shadow-sm"
                        :class="goalCreationMode === 'suggested' ? 'btn-primary' : 'btn-white bg-white border'"
                        @click="goalCreationMode = 'suggested'">
                        <i class="bi bi-stars fs-2"
                            :class="goalCreationMode === 'suggested' ? 'text-white' : 'text-primary'"></i>
                        <span class="fw-bold small"
                            :class="goalCreationMode === 'suggested' ? 'text-white' : 'text-dark'">Empfehlung
                            wählen</span>
                    </button>
                </div>
                <div class="col-6">
                    <button
                        class="btn w-100 h-100 p-3 rounded-4 d-flex flex-column align-items-center justify-content-center gap-2 transition-all shadow-sm"
                        :class="goalCreationMode === 'custom' ? 'btn-primary' : 'btn-white bg-white border'"
                        @click="goalCreationMode = 'custom'">
                        <i class="bi bi-pencil-square fs-2"
                            :class="goalCreationMode === 'custom' ? 'text-white' : 'text-primary'"></i>
                        <span class="fw-bold small"
                            :class="goalCreationMode === 'custom' ? 'text-white' : 'text-dark'">Eigenes erstellen</span>
                    </button>
                </div>
            </div>

            <div v-if="goalCreationMode === 'suggested'"
                class="card border-0 shadow-sm rounded-4 mb-4 overflow-hidden animate-fade-in">
                <div class="bg-primary bg-opacity-10 p-3 border-bottom text-center">
                    <h5 class="fw-bold text-primary mb-0">Vorgeschlagene Ziele für dich</h5>
                </div>
                <div class="card-body p-0">
                    <ul class="list-group list-group-flush">
                        <li v-for="goal in suggestedNewGoals" :key="goal.id"
                            class="list-group-item p-3 border-bottom-0 border-bottom d-flex align-items-center justify-content-between action-list-item">
                            <div class="d-flex align-items-center gap-3">
                                <div class="rounded-circle d-flex align-items-center justify-content-center text-white"
                                    :class="goal.colorClass" style="width: 45px; height: 45px;">
                                    <i :class="['bi fs-5', goal.icon]"></i>
                                </div>
                                <div>
                                    <h5 class="fw-bold mb-0">{{ goal.title }}</h5>
                                    <small class="text-muted">{{ goal.type }}</small>
                                </div>
                            </div>
                            <button class="btn btn-sm btn-outline-primary rounded-pill px-3 fw-bold">Wählen</button>
                        </li>
                    </ul>
                </div>
            </div>

            <div v-if="goalCreationMode === 'custom'"
                class="card border-0 shadow-sm rounded-4 mb-4 overflow-hidden animate-fade-in">
                <div class="bg-primary bg-opacity-10 p-3 border-bottom text-center">
                    <h5 class="fw-bold text-primary mb-0">Welche Art von Ziel?</h5>
                </div>
                <div class="card-body p-3">
                    <div class="d-grid gap-2">
                        <button v-for="type in customGoalTypes" :key="type.id"
                            class="btn btn-white border rounded-3 p-3 text-start d-flex align-items-center gap-3 custom-goal-btn shadow-sm">
                            <div class="bg-light rounded-circle d-flex align-items-center justify-content-center"
                                style="width: 45px; height: 45px;">
                                <i :class="['bi fs-4 text-primary', type.icon]"></i>
                            </div>
                            <div>
                                <h5 class="fw-bold mb-0 text-dark">{{ type.title }}</h5>
                                <small class="text-muted" style="font-size: 0.75rem;">{{ type.description }}</small>
                            </div>
                        </button>
                    </div>
                </div>
            </div>

        </div>

        <div v-if="activeTab === 'challenges'">
            <div class="d-flex justify-content-between align-items-center mb-3 ">
                <h4 class="fw-bold mb-0">Verfügbare Challenges</h4>
                <span class="badge bg-primary rounded-pill px-3">{{ challenges.length }}</span>
            </div>

            <div class="row g-3">
                <div v-for="challenge in challenges" :key="challenge.id" class="col-12 col-md-6">
                    <div class="card border-0 shadow-sm rounded-4 h-100 bg-light bg-opacity-50">
                        <div class="card-body position-relative d-flex flex-column">

                            <button class="btn btn-sm btn-link text-muted position-absolute top-0 end-0 mt-2 me-2"
                                @click="dismissChallenge(challenge.id)">
                                <i class="bi bi-x-lg"></i>
                            </button>

                            <div class="d-flex align-items-center gap-3 mb-4">
                                <div class="rounded-circle d-flex align-items-center justify-content-center shadow-sm"
                                    :class="challenge.iconBg" style="width: 55px; height: 55px;">
                                    <i :class="['bi fs-3', challenge.icon]"></i>
                                </div>
                                <div class="pe-4">
                                    <h5 class="fw-bold mb-0 text-dark">{{ challenge.title }}</h5>
                                    <small class="text-muted">{{ challenge.type }}</small>
                                </div>
                            </div>

                            <ul class="list-unstyled mb-4 flex-grow-1">
                                <li v-for="(detail, index) in challenge.details" :key="index"
                                    class="d-flex align-items-center gap-3 mb-2 small text-dark fw-medium">
                                    <i :class="['bi text-muted fs-6', detail.icon]"></i>
                                    <span>{{ detail.text }}</span>
                                </li>
                            </ul>

                            <button class="btn btn-outline-primary w-100 rounded-pill fw-bold"
                                @click="acceptChallenge(challenge)">
                                Annehmen
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div v-if="challenges.length === 0" class="text-center text-muted mt-5">
                <i class="bi bi-flag fs-1 mb-3 d-block opacity-50"></i>
                <p>Du hast aktuell alle Challenges bearbeitet.</p>
            </div>
        </div>
        <div v-if="activeTab === 'active'">
            <h4 class="fw-bold mb-3">Deine Ziele</h4>
            <div v-if="activeGoals.length == 0" :key="'empty'" class="text-center text-muted mt-5">
                <i class="bi bi-arrow-repeat fs-1 mb-3 d-block opacity-50"></i>
                <p>Du hast aktuell keine laufenden Ziele.</p>
            </div>
            <div v-else>
                <div v-for="goal in activeGoals" :key="goal.id"
                    class="card shadow-sm mb-3 border-0 rounded-4 overflow-hidden bg-light bg-opacity-50">
                    <div class="card-body" @click="toggleGoal(goal)" style="cursor: pointer;">
                        <div class="d-flex justify-content-between align-items-start">
                            <div class="d-flex align-items-center gap-3">

                                <div class="bg-white text-primary rounded-circle d-flex align-items-center justify-content-center shadow-sm"
                                    style="width: 45px; height: 45px;">
                                    <i :class="['bi fs-4', goal.icon]"></i>
                                </div>
                                <div>
                                    <h5 class="fw-bold mb-0">{{ goal.title }}</h5>
                                    <small class="text-muted small">{{ goal.description }}</small>
                                </div>
                            </div>
                            <button class="btn btn-sm text-primary p-2" @click="deleteGoal(goal.id)"
                                title="Ziel löschen">
                                <i class="bi bi-trash3-fill fs-3"></i>
                            </button>
                        </div>
                        <div class="progress mt-3" style="height: 6px;">
                            <div class="progress-bar bg-success"
                                :style="{ width: calculateProgress(goal.current, goal.target) + '%' }"></div>
                        </div>

                    </div>

                    <transition name="expand">
                        <div v-if="goal.expanded" class="p-3 border-top bg-white">
                            <div class="row g-3">
                                <div class="col-12 col-md-4">
                                    <small class="fw-bold text-uppercase text-muted"
                                        style="font-size: 0.65rem;">Erledigt</small>
                                    <div v-for="task in goal.tasks.completed" :key="task.id" class="small mt-1"><i
                                            class="bi bi-check2 text-success me-1"></i> {{ task.title }}</div>
                                </div>
                                <div class="col-12 col-md-4">
                                    <small class="fw-bold text-uppercase text-muted"
                                        style="font-size: 0.65rem;">Geplant</small>
                                    <div v-for="task in goal.tasks.accepted" :key="task.id" class="small mt-1"><i
                                            class="bi bi-clock text-warning me-1"></i> {{ task.title }}</div>
                                </div>
                                <div class="col-12 col-md-4">
                                    <small class="fw-bold text-uppercase text-muted"
                                        style="font-size: 0.65rem;">Vorschlag</small>
                                    <div v-for="task in goal.tasks.suggested" :key="task.id"
                                        @click.stop="acceptTask(goal, task)" class="small mt-1 text-primary"><i
                                            class="bi bi-plus-circle me-1"></i> {{ task.title }}</div>
                                </div>
                            </div>
                        </div>
                    </transition>
                </div>

                <div class="form-check form-switch">
                    <input class="form-check-input" type="checkbox" role="switch" id="flexSwitchCheckChecked"
                        v-model="showTimeline">
                    <label class="form-check-label" for="flexSwitchCheckChecked">Laufende Ziele im Zeitverlauf
                        anzeigen</label>
                </div>
                <img v-if="showTimeline" :src="goalTimelineImg" alt="Zeitstrahl" class="img-fluid mt-4">
            </div>
        </div>

        <div v-if="activeTab === 'past'">
            <div class="input-group mb-3 bg-light rounded-pill px-2">
                <span class="input-group-text bg-transparent border-0 text-muted"><i class="bi bi-search"></i></span>
                <input type="text" class="form-control bg-transparent border-0 small" placeholder="Ziele durchsuchen..."
                    v-model="pastFilter">
            </div>

            <ul class="list-group list-group-flush">
                <li v-for="goal in filteredPastGoals" :key="goal.id"
                    class="list-group-item p-0 border-bottom-0 mb-3 bg-transparent">

                    <div class="card border-0 shadow-sm rounded-4 overflow-hidden" style="cursor: pointer;"
                        @click="toggleGoal(goal)">
                        <div class="card-body p-3">
                            <div class="d-flex justify-content-between align-items-center mb-2">
                                <div class="d-flex align-items-center gap-3">
                                    <div class="bg-light text-secondary rounded-circle d-flex align-items-center justify-content-center"
                                        style="width: 40px; height: 40px;">
                                        <i
                                            :class="['bi fs-5', goal.icon, goal.status === 'success' ? 'text-success' : 'text-danger']"></i>
                                    </div>
                                    <div>
                                        <h5 class="fw-bold mb-0 text-dark">{{ goal.title }}</h5>
                                        <small class="text-muted">{{ goal.type }}</small>
                                    </div>
                                </div>
                                <div class="d-flex align-items-center gap-3">
                                    <div class="rounded-circle"
                                        :class="goal.status === 'success' ? 'bg-success' : 'bg-danger'"
                                        style="width: 12px; height: 12px;" title="Ziel-Zustand">
                                    </div>
                                    <i class="bi text-muted small"
                                        :class="goal.expanded ? 'bi-chevron-up' : 'bi-chevron-down'"></i>
                                </div>
                            </div>

                            <div class="progress mt-2" style="height: 6px;">
                                <div class="progress-bar"
                                    :class="goal.status === 'success' ? 'bg-success' : 'bg-danger'" role="progressbar"
                                    :style="{ width: calculateProgress(goal.current, goal.target) + '%' }">
                                </div>
                            </div>
                        </div>

                        <transition name="expand">
                            <div v-if="goal.expanded" class="bg-white border-top p-3">
                                <p class="small text-muted mb-3">{{ goal.description || 'Keine Beschreibung verfügbar.'
                                    }}</p>

                                <div class="d-flex justify-content-between align-items-end">
                                    <div>
                                        <h5 class="fw-bold text-muted small mb-2">Abgeschlossene Aufgaben</h5>
                                        <ul class="list-unstyled mb-0">
                                            <li class="small text-dark mb-1"><i
                                                    class="bi bi-check-circle text-success me-2"></i>Dienst, 03.09.20
                                            </li>
                                            <li class="small text-dark"><i
                                                    class="bi bi-check-circle text-success me-2"></i>Einsatz, 12.09.20
                                            </li>
                                        </ul>
                                    </div>

                                    <button v-if="goal.status === 'failed'"
                                        class="btn btn-sm btn-outline-primary fw-bold px-3"
                                        @click.stop="retryGoal(goal)">
                                        Erneut versuchen
                                    </button>
                                </div>
                            </div>
                        </transition>
                    </div>
                </li>
            </ul>

            <div class="d-flex justify-content-end align-items-center text-muted small mt-2 pe-2">
                <span class="me-3">Ziele pro Seite: <strong>6</strong> <i class="bi bi-caret-down-fill ms-1"></i></span>
                <span>1 - {{ filteredPastGoals.length }} of {{ filteredPastGoals.length }}</span>
                <i class="bi bi-chevron-left ms-3"></i>
                <i class="bi bi-chevron-right ms-3"></i>
            </div>
            <div class="row g-2 mb-4">
                <div class="col-6">
                    <div class="card border-0 shadow-sm rounded-4 p-3 bg-light h-100">
                        <small class="text-muted fw-bold small d-block mb-2">Erfolgsrate</small>
                        <div class="d-flex align-items-end gap-2">
                            <h3 class="mb-0 fw-bold">75%</h3>
                            <small class="text-success pb-1">3/4</small>
                        </div>
                    </div>
                </div>
                <div class="col-6">
                    <div
                        class="card border-0 shadow-sm rounded-4 p-3 bg-light h-100 d-flex flex-row align-items-center justify-content-center">
                        <div class="css-donut-chart-mini"></div>
                        <div class="ms-2">
                            <small class="text-muted fw-bold d-block" style="font-size: 0.6rem;">Top-Art</small>
                            <small class="fw-bold">Leistung</small>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div v-if="activeTab === 'badges'">
            <h5 class="fw-bold mb-3">Deine Badges</h5>
            <div class="row g-2">
                <div v-for="badge in badges" :key="badge.id" class="col-4">
                    <div class="card border-0 shadow-sm rounded-4 py-3 text-center"
                        :class="{ 'opacity-50 grayscale': !badge.earned }">
                        <i :class="['bi fs-2', badge.icon, badge.earned ? badge.color : 'text-secondary']"></i>
                        <div class="fw-bold mt-1" style="font-size: 0.65rem;">{{ badge.title }}</div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import goalTimelineImg from '/assets/images/goal-time-line.png';

const goalCreationMode = ref('suggested');
const activeTab = ref('active');
const pastFilter = ref('');
const totalPoints = ref(450);

const suggestedNewGoals = ref([
    { id: 1, title: 'Ausgebildet', type: 'Leistungs-Ziel', icon: 'bi-mortarboard-fill', colorClass: 'bg-primary' },
    { id: 2, title: 'Verdient', type: 'Fremdvergleichs-Ziel', icon: 'bi-award-fill', colorClass: 'bg-info' },
    { id: 3, title: 'Engagiert', type: 'Selbstvergleichs-Ziel', icon: 'bi-briefcase-fill', colorClass: 'bg-danger' }
]);

const customGoalTypes = ref([
    { id: 1, title: 'Leistungs-Ziel', description: 'Erbringen Sie besondere Leistungen', icon: 'bi-bullseye' },
    { id: 2, title: 'Selbstvergleichs-Ziel', description: 'Übertreffen Sie sich selbst', icon: 'bi-person-up' },
    { id: 3, title: 'Fremdvergleichs-Ziel', description: 'Messen Sie sich mit Anderen', icon: 'bi-trophy' }
]);

const challenges = ref([
    {
        id: 101,
        title: 'MC Volunteer',
        type: 'Gutschein',
        icon: 'bi-cup-hot-fill',
        iconBg: 'bg-danger text-white',
        details: [
            { icon: 'bi-gear-fill', text: '2 Dienste' },
            { icon: 'bi-hourglass-split', text: 'Innerhalb von 1 Monat' },
            { icon: 'bi-trophy-fill', text: '1 gratis Menü' }
        ]
    },
    {
        id: 102,
        title: 'Nachtdienstprofi',
        type: 'Leistungs-Ziel',
        icon: 'bi-moon-stars-fill',
        iconBg: 'bg-warning text-dark',
        details: [
            { icon: 'bi-gear-fill', text: '2 Nachtdienste' },
            { icon: 'bi-hourglass-split', text: 'Innerhalb von 3 Tagen' }
        ]
    },
    {
        id: 103,
        title: 'Einsatzchampion',
        type: 'Fremdvergleichs-Ziel',
        icon: 'bi-cone-striped',
        iconBg: 'bg-info text-white',
        details: [
            { icon: 'bi-gear-fill', text: 'Mehr Stunden im Einsatz' },
            { icon: 'bi-people-fill', text: 'Als Bester aus Gruppe Offiziere' },
            { icon: 'bi-hourglass-split', text: 'Innerhalb von 1 Monat' }
        ]
    }
]);

const activeGoals = ref([
    {
        id: 1,
        title: 'Arbeitstier',
        description: '100h im Büro bis 25.08.',
        icon: 'bi-briefcase',
        current: 65,
        target: 100,
        expanded: true,
        tasks: {
            completed: [{ title: 'Bürodienst 13.07.' }],
            accepted: [{ title: 'Bürodienst 25.07.' }],
            suggested: [{ id: 10, title: 'IT-Check 20.07.' }]
        }
    },
    {
        id: 2,
        title: 'Vorbild',
        description: 'Mehr Kompetenz als Vormonat',
        icon: 'bi-person-badge',
        current: 8,
        target: 10,
        expanded: false,
        tasks: { completed: [], accepted: [], suggested: [] }
    }
]);

const pastGoals = ref([
    { id: 3, title: 'Retter', type: 'Leistungs-Ziel', icon: 'bi-life-preserver', current: 10, target: 10, status: 'success' },
    { id: 4, title: 'Marathon', type: 'Leistungs-Ziel', icon: 'bi-activity', current: 38, target: 42, status: 'failed' }
]);

const badges = ref([
    { id: 1, title: 'Lebensretter', icon: 'bi-heart-pulse-fill', color: 'text-danger', earned: true },
    { id: 2, title: 'Nachteule', icon: 'bi-moon-stars-fill', color: 'text-info', earned: true },
    { id: 3, title: 'Mentor', icon: 'bi-people-fill', color: 'text-primary', earned: false },
    { id: 4, title: 'Fahrer', icon: 'bi-car-front-fill', color: 'text-success', earned: true },
    { id: 5, title: 'Jubiläum', icon: 'bi-award-fill', color: 'text-warning', earned: false },
    { id: 6, title: 'Bereit', icon: 'bi-lightning-fill', color: 'text-warning', earned: false }
]);

const retryGoal = (goal) => {
    window.alert(`Ziel Wiederholen!\n\nSie haben das Ziel "${goal.title}" neu gestartet!`);

    activeGoals.value.push({
        ...goal,
        id: Date.now(),
        current: 0,
        expanded: false,
        tasks: { completed: [], accepted: [], suggested: [] }
    });

    activeTab.value = 'active';
};

const deleteGoal = (goalId) => {
    if (window.confirm('Möchtest du dieses Ziel wirklich entfernen?')) {
        activeGoals.value = activeGoals.value.filter((goal) => goal.id !== goalId);
    }
};

const dismissChallenge = (challengeId) => {
    challenges.value = challenges.value.filter((challenge) => challenge.id !== challengeId);
};

const acceptChallenge = (challenge) => {
    dismissChallenge(challenge.id);

    activeGoals.value.unshift({
        id: Date.now(),
        title: challenge.title,
        type: challenge.type,
        description: challenge.details[0]?.text || '',
        icon: challenge.icon,
        current: 0,
        target: 2,
        expanded: false,
        tasks: { completed: [], accepted: [], suggested: [] }
    });

    activeTab.value = 'active';
};

const toggleGoal = (goal) => {
    goal.expanded = !goal.expanded;
};

const acceptTask = (goal, task) => {
    goal.tasks.suggested = goal.tasks.suggested.filter((item) => item.id !== task.id);
    goal.tasks.accepted.push(task);
};

const calculateProgress = (current, target) => {
    return target ? (current / target) * 100 : 0;
};

const filteredPastGoals = computed(() => {
    return pastGoals.value.filter((goal) => goal.title.toLowerCase().includes(pastFilter.value.toLowerCase()));
});

const showTimeline = ref(true); 


</script>

<style scoped>
/* --- CSS Pie Chart (Neues Ziel) --- */
.css-pie-chart {
    width: 140px;
    height: 140px;
    border-radius: 50%;
    /* Prozentuale Aufteilung in Grüntönen: 50.7%, 21.3%, 17.3%, 10.7% */
    background: conic-gradient(#15b74b 0% 50.7%,
            #0c943b 50.7% 72%,
            #2de26a 72% 89.3%,
            #72f59f 89.3% 100%);
    /* Ein kleiner weißer Innenkreis (Donut-Effekt), falls gewünscht, ansonsten weglassen für vollen Pie */
    display: flex;
    justify-content: center;
    align-items: center;
}

.css-pie-chart::after {
    content: "";
    width: 30px;
    height: 30px;
    background-color: white;
    border-radius: 50%;
}

/* Hover-Effekte für Listen und Buttons */
.action-list-item:hover,
.custom-goal-btn:hover {
    background-color: #f8f9fa !important;
    cursor: pointer;
}

.active-area {
    border-color: #15b74b !important;
    background-color: rgba(21, 183, 75, 0.05);
}

.animate-fade-in {
    animation: fadeIn 0.3s ease-in;
}

@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(5px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}

/* Navigation Styling */
.nav-underline-container {
    margin-top: 10px;
    border-bottom: 0px solid rgba(255, 255, 255, 0.1);
}

.nav-tab-item {
    background: none;
    border: none;
    color: rgba(255, 255, 255, 0.6);
    padding: 10px 5px;
    font-size: 0.75rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    flex: 1;
    min-width: 80px;
    transition: all 0.2s ease;
    border-bottom: 3px solid transparent;
}

.nav-tab-item i {
    font-size: 1.2rem;
}

.nav-tab-item.active {
    color: white;
    font-weight: bold;
    border-bottom: 3px solid #ffc107;
    /* Gelber Underline für aktiven Tab */
}

/* Hilfsklassen */
.no-scrollbar::-webkit-scrollbar {
    display: none;
}

.grayscale {
    filter: grayscale(100%);
}

/* Donut Mini */
.css-donut-chart-mini {
    width: 30px;
    height: 30px;
    border-radius: 50%;
    background: conic-gradient(#3f51b5 0% 50%, #e91e63 50% 80%, #009688 80% 100%);
}

/* Accordion Animation */
.expand-enter-active,
.expand-leave-active {
    transition: all 0.3s ease-in-out;
    max-height: 200px;
    overflow: hidden;
}

.expand-enter-from,
.expand-leave-to {
    max-height: 0;
    opacity: 0;
}
</style>