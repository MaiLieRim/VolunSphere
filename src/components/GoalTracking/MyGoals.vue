<template>
    <!-- ============================ TABS ============================ -->
    <div class="nav-underline-container bg-primary mt-0">
        <div class="d-flex justify-content-between text-center overflow-x-auto no-scrollbar">
            <button v-for="tab in tabs" :key="tab.id" class="nav-tab-item" :class="{ active: activeTab === tab.id }"
                @click="activeTab = tab.id">
                <i :class="['bi mb-1', tab.icon]"></i>
                <span>{{ tab.label }}</span>
            </button>
        </div>
    </div>

    <div class="content-body px-3 pt-4">

        <!-- ======================================================== -->
        <!-- TAB: NEUES ZIEL – durchklickbarer Workflow               -->
        <!-- ======================================================== -->
        <div v-if="activeTab === 'new'" class="animate-fade-in">

            <!-- Fortschritt des Workflows -->
            <ol class="wizard-steps mb-4">
                <li v-for="s in wizardSteps" :key="s.nr" :class="{
                    done: wizardStep > s.nr,
                    current: wizardStep === s.nr
                }">
                    <span class="wizard-dot">
                        <i v-if="wizardStep > s.nr" class="bi bi-check-lg"></i>
                        <template v-else>{{ s.nr }}</template>
                    </span>
                    <span class="wizard-label">{{ s.label }}</span>
                </li>
            </ol>

            <!-- ---------- NPO ---------- -->
            <div class="mb-4">
                <h6 class="fw-bold mb-2 px-1 text-muted small">In welcher NPO möchtest du dein Ziel verfolgen?</h6>
                <div class="d-flex gap-2 overflow-x-auto pb-2 no-scrollbar">
                    <button v-for="npo in npos" :key="npo" class="btn rounded-pill px-4 shadow-sm text-nowrap"
                        :class="selectedNpo === npo ? 'btn-primary' : 'btn-white bg-white border text-muted'"
                        @click="selectNpo(npo)">
                        {{ npo }}
                    </button>
                </div>
            </div>

            <!-- ---------- SCHRITT 1: BEREICH (Sunburst) ---------- -->
            <div class="card border-0 shadow-sm rounded-4 mb-4">
                <div class="card-body p-3 p-md-4">
                    <div class="d-flex align-items-center gap-2 mb-3">
                        <button v-if="path.length" class="btn btn-sm btn-light rounded-circle" title="Eine Ebene zurück"
                            @click="goUp">
                            <i class="bi bi-arrow-left"></i>
                        </button>
                        <h5 class="fw-bold mb-0 flex-grow-1 text-center">
                            1. In welchem Bereich möchtest du dein Ziel verfolgen?
                        </h5>
                    </div>

                    <!-- Breadcrumb -->
                    <nav class="small text-muted mb-2 text-center">
                        <button class="btn btn-link btn-sm p-0 text-muted text-decoration-none"
                            @click="resetArea">Alle Bereiche</button>
                        <template v-for="(node, i) in path" :key="node.id">
                            <i class="bi bi-chevron-right mx-1" style="font-size: .6rem;"></i>
                            <button class="btn btn-link btn-sm p-0 text-decoration-none"
                                :class="i === path.length - 1 ? 'fw-bold text-primary' : 'text-muted'"
                                @click="jumpTo(i)">{{ node.name }}</button>
                        </template>
                    </nav>

                    <div class="row align-items-center g-3">
                        <!-- Sunburst -->
                        <div class="col-12 col-md-6">
                            <div class="sunburst-wrap" ref="chartWrap" @mouseleave="tooltip = null">
                                <svg viewBox="0 0 300 300" class="sunburst" role="img"
                                    aria-label="Bereiche als Ringdiagramm">
                                    <!-- Ringe der übergeordneten Ebenen -->
                                    <g v-for="ring in ancestorRings" :key="ring.node.id">
                                        <path :d="ring.d" :fill="ring.fill" fill-rule="evenodd" class="ring-path"
                                            @click="jumpTo(ring.index)" />
                                        <text :x="150" :y="ring.labelY + 3" text-anchor="middle" class="ring-label">
                                            {{ ring.node.name }}
                                        </text>
                                    </g>

                                    <!-- Äußerer Ring: auswählbare Bereiche -->
                                    <g v-for="seg in segmentArcs" :key="seg.node.id">
                                        <path :d="seg.d" :fill="seg.fill" class="segment-path"
                                            :class="{ selected: seg.selected }"
                                            @mousemove="showTooltip($event, seg)"
                                            @click="selectArea(seg.node)" />
                                        <text v-if="seg.showLabel" :x="seg.lx" :y="seg.ly" text-anchor="middle"
                                            class="segment-label"
                                            :transform="`rotate(${seg.rot} ${seg.lx} ${seg.ly})`"
                                            @click="selectArea(seg.node)">
                                            {{ seg.short }}
                                        </text>
                                    </g>

                                    <!-- Zentrum -->
                                    <circle cx="150" cy="150" :r="24" class="center-circle"
                                        :class="{ clickable: path.length > 0 }" @click="goUp" />
                                    <text x="150" y="156" text-anchor="middle" class="center-icon">
                                        {{ path.length ? '–' : '+' }}
                                    </text>
                                </svg>

                                <div v-if="tooltip" class="sunburst-tooltip"
                                    :style="{ left: tooltip.x + 'px', top: tooltip.y + 'px' }">
                                    {{ tooltip.text }}
                                </div>
                            </div>
                        </div>

                        <!-- Liste der Bereiche (touch-freundlich) -->
                        <div class="col-12 col-md-6">
                            <div class="list-group list-group-flush gap-2">
                                <button v-for="seg in segmentArcs" :key="seg.node.id"
                                    class="list-group-item list-group-item-action border rounded-3 d-flex justify-content-between align-items-center p-2"
                                    :class="{ 'active-area': seg.selected }" @click="selectArea(seg.node)">
                                    <span class="d-flex align-items-center gap-2">
                                        <span class="rounded-circle d-inline-block"
                                            :style="{ width: '12px', height: '12px', backgroundColor: seg.fill }"></span>
                                        <span class="fw-medium small text-start">{{ seg.node.name }}</span>
                                    </span>
                                    <span class="d-flex align-items-center gap-2">
                                        <span class="badge bg-light text-dark">{{ seg.pct.toFixed(1) }}%</span>
                                        <i v-if="seg.node.children" class="bi bi-chevron-right text-muted"
                                            style="font-size: .7rem;"></i>
                                    </span>
                                </button>
                            </div>

                            <div v-if="selectedArea" class="alert alert-success d-flex align-items-center gap-2 mt-3 mb-0 py-2 small">
                                <i class="bi bi-geo-alt-fill"></i>
                                <span>Gewählter Bereich: <strong>{{ selectedArea.name }}</strong></span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- ---------- SCHRITT 2: ZIELART ---------- -->
            <div v-if="selectedArea && !draft" class="animate-fade-in">
                <h5 class="fw-bold mb-3 text-center">2. Wie möchtest du dein Ziel erstellen?</h5>

                <div class="row g-3 mb-4">
                    <div class="col-6">
                        <button
                            class="btn w-100 h-100 p-3 rounded-4 d-flex flex-column align-items-center justify-content-center gap-2 shadow-sm"
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
                            class="btn w-100 h-100 p-3 rounded-4 d-flex flex-column align-items-center justify-content-center gap-2 shadow-sm"
                            :class="goalCreationMode === 'custom' ? 'btn-primary' : 'btn-white bg-white border'"
                            @click="goalCreationMode = 'custom'">
                            <i class="bi bi-pencil-square fs-2"
                                :class="goalCreationMode === 'custom' ? 'text-white' : 'text-primary'"></i>
                            <span class="fw-bold small"
                                :class="goalCreationMode === 'custom' ? 'text-white' : 'text-dark'">Eigenes
                                erstellen</span>
                        </button>
                    </div>
                </div>

                <!-- Vorschläge -->
                <div v-if="goalCreationMode === 'suggested'"
                    class="card border-0 shadow-sm rounded-4 mb-4 overflow-hidden animate-fade-in">
                    <div class="bg-primary bg-opacity-10 p-3 border-bottom text-center">
                        <h5 class="fw-bold text-primary mb-0">Vorschläge für {{ selectedArea.name }}</h5>
                    </div>
                    <ul class="list-group list-group-flush">
                        <li v-for="goal in suggestedGoals" :key="goal.id"
                            class="list-group-item p-3 d-flex align-items-center justify-content-between action-list-item"
                            @click="startFromSuggestion(goal)">
                            <div class="d-flex align-items-center gap-3">
                                <div class="rounded-circle d-flex align-items-center justify-content-center text-white"
                                    :class="goal.colorClass" style="width: 45px; height: 45px;">
                                    <i :class="['bi fs-5', goal.icon]"></i>
                                </div>
                                <div>
                                    <h5 class="fw-bold mb-0">{{ goal.title }}</h5>
                                    <small class="text-muted">{{ goal.type }} · {{ goal.amount }} {{ goal.unit }}</small>
                                </div>
                            </div>
                            <span class="btn btn-sm btn-outline-primary rounded-pill px-3 fw-bold">Wählen</span>
                        </li>
                    </ul>
                </div>

                <!-- Eigene Zielart -->
                <div v-else class="card border-0 shadow-sm rounded-4 mb-4 overflow-hidden animate-fade-in">
                    <div class="bg-primary bg-opacity-10 p-3 border-bottom text-center">
                        <h5 class="fw-bold text-primary mb-0">Welche Art von Ziel?</h5>
                    </div>
                    <div class="card-body p-3">
                        <div class="d-grid gap-2">
                            <button v-for="type in customGoalTypes" :key="type.id"
                                class="btn btn-white border rounded-3 p-3 text-start d-flex align-items-center gap-3 custom-goal-btn shadow-sm"
                                @click="startFromType(type)">
                                <div class="bg-light rounded-circle d-flex align-items-center justify-content-center"
                                    style="width: 45px; height: 45px;">
                                    <i :class="['bi fs-4 text-primary', type.icon]"></i>
                                </div>
                                <div>
                                    <h5 class="fw-bold mb-0 text-dark">{{ type.title }}</h5>
                                    <small class="text-muted" style="font-size: .75rem;">{{ type.description }}</small>
                                </div>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- ---------- SCHRITT 3: ZIEL DEFINIEREN ---------- -->
            <div v-if="draft" class="card border-0 shadow-sm rounded-4 mb-4 overflow-hidden animate-fade-in">
                <div class="bg-primary bg-opacity-10 p-3 border-bottom d-flex align-items-center gap-2">
                    <button class="btn btn-sm btn-light rounded-circle" title="Zurück" @click="draft = null">
                        <i class="bi bi-arrow-left"></i>
                    </button>
                    <h5 class="fw-bold text-primary mb-0 flex-grow-1 text-center pe-4">
                        3. Definiere dein {{ draft.type }}!
                    </h5>
                </div>

                <div class="card-body p-3 p-md-4">
                    <label class="form-label fw-medium">Was ist dein Ziel im Bereich {{ draft.area.name }}?</label>
                    <div class="row g-2 mb-3">
                        <div class="col-6">
                            <div class="form-floating">
                                <select class="form-select" id="unit" v-model="draft.unit">
                                    <option v-for="u in units" :key="u" :value="u">{{ u }}</option>
                                </select>
                                <label for="unit">Maßeinheit</label>
                            </div>
                        </div>
                        <div class="col-6">
                            <div class="form-floating">
                                <input type="number" min="1" class="form-control" id="amount" v-model.number="draft.amount"
                                    placeholder="0">
                                <label for="amount">{{ draft.unit }} *</label>
                            </div>
                        </div>
                    </div>

                    <div v-if="draft.type === 'Fremdvergleichs-Ziel'" class="form-floating mb-3">
                        <select class="form-select" id="group" v-model="draft.group">
                            <option v-for="g in groups" :key="g" :value="g">{{ g }}</option>
                        </select>
                        <label for="group">Mit wem möchtest du dich vergleichen?</label>
                    </div>

                    <div v-if="draft.type === 'Selbstvergleichs-Ziel'" class="form-floating mb-3">
                        <select class="form-select" id="period" v-model="draft.period">
                            <option v-for="p in periods" :key="p" :value="p">{{ p }}</option>
                        </select>
                        <label for="period">Womit möchtest du dich vergleichen?</label>
                    </div>

                    <label class="form-label fw-medium">Wann möchtest du dein Ziel erreichen?</label>
                    <div class="form-floating mb-3">
                        <input type="date" class="form-control" id="date" v-model="draft.date">
                        <label for="date">Datum wählen</label>
                    </div>

                    <label class="form-label fw-medium">Wie möchtest du dein Ziel nennen?</label>
                    <div class="form-floating mb-4">
                        <input type="text" class="form-control" id="name" v-model="draft.name" placeholder="Name"
                            maxlength="30">
                        <label for="name">Name *</label>
                    </div>

                    <button class="btn btn-primary w-100 rounded-pill fw-bold py-2" :disabled="!draftValid"
                        @click="askToCreate">
                        Speichern
                    </button>
                    <p v-if="!draftValid" class="text-muted small text-center mt-2 mb-0">
                        Trag noch {{ missingHint }} ein.
                    </p>
                </div>
            </div>
        </div>

        <!-- ======================================================== -->
        <!-- TAB: CHALLENGES                                          -->
        <!-- ======================================================== -->
        <div v-if="activeTab === 'challenges'">
            <div class="d-flex justify-content-between align-items-center mb-3">
                <h4 class="fw-bold mb-0">Verfügbare Challenges</h4>
                <span class="badge bg-primary rounded-pill px-3">{{ challenges.length }}</span>
            </div>

            <div class="row g-3">
                <div v-for="challenge in challenges" :key="challenge.id" class="col-12 col-md-6">
                    <div class="card border-0 shadow-sm rounded-4 h-100 bg-light bg-opacity-50">
                        <div class="card-body position-relative d-flex flex-column">
                            <button class="btn btn-sm btn-link text-muted position-absolute top-0 end-0 mt-2 me-2"
                                title="Challenge ausblenden" @click="dismissChallenge(challenge.id)">
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
                                @click="acceptChallenge(challenge)">Annehmen</button>
                        </div>
                    </div>
                </div>
            </div>

            <div v-if="challenges.length === 0" class="text-center text-muted mt-5">
                <i class="bi bi-flag fs-1 mb-3 d-block opacity-50"></i>
                <p class="mb-3">Alle Challenges bearbeitet. Neue kommen am Monatsersten.</p>
                <button class="btn btn-outline-primary rounded-pill px-4" @click="activeTab = 'new'">Eigenes Ziel
                    erstellen</button>
            </div>
        </div>

        <!-- ======================================================== -->
        <!-- TAB: LAUFENDE ZIELE                                      -->
        <!-- ======================================================== -->
        <div v-if="activeTab === 'active'">
            <h4 class="fw-bold mb-3">Deine Ziele</h4>

            <div v-if="activeGoals.length === 0" class="text-center text-muted mt-5">
                <i class="bi bi-arrow-repeat fs-1 mb-3 d-block opacity-50"></i>
                <p class="mb-3">Noch kein laufendes Ziel.</p>
                <button class="btn btn-primary rounded-pill px-4" @click="activeTab = 'new'">Ziel erstellen</button>
            </div>

            <div v-else>
                <div v-for="goal in activeGoals" :key="goal.id"
                    class="card shadow-sm mb-3 border-0 rounded-4 overflow-hidden bg-light bg-opacity-50">
                    <div class="card-body" style="cursor: pointer;" @click="toggleGoal(goal)">
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
                            <button class="btn btn-sm text-primary p-2" title="Ziel löschen"
                                @click.stop="confirmDelete(goal)">
                                <i class="bi bi-trash3-fill fs-5"></i>
                            </button>
                        </div>

                        <div class="d-flex justify-content-between small text-muted mt-3 mb-1">
                            <span>{{ goal.current }} / {{ goal.target }} {{ goal.unit || '' }}</span>
                            <span>{{ Math.round(calculateProgress(goal.current, goal.target)) }}%</span>
                        </div>
                        <div class="progress" style="height: 6px;">
                            <div class="progress-bar bg-success"
                                :style="{ width: calculateProgress(goal.current, goal.target) + '%' }"></div>
                        </div>
                    </div>

                    <transition name="expand">
                        <div v-if="goal.expanded" class="p-3 border-top bg-white">
                            <div class="row g-3">
                                <div class="col-12 col-md-4">
                                    <small class="fw-bold text-muted" style="font-size: .7rem;">Erledigt</small>
                                    <div v-for="task in goal.tasks.completed" :key="task.title" class="small mt-1">
                                        <i class="bi bi-check2 text-success me-1"></i>{{ task.title }}
                                    </div>
                                    <div v-if="!goal.tasks.completed.length" class="small text-muted mt-1">–</div>
                                </div>
                                <div class="col-12 col-md-4">
                                    <small class="fw-bold text-muted" style="font-size: .7rem;">Geplant</small>
                                    <div v-for="task in goal.tasks.accepted" :key="task.title" class="small mt-1">
                                        <i class="bi bi-clock text-warning me-1"></i>{{ task.title }}
                                    </div>
                                    <div v-if="!goal.tasks.accepted.length" class="small text-muted mt-1">–</div>
                                </div>
                                <div class="col-12 col-md-4">
                                    <small class="fw-bold text-muted" style="font-size: .7rem;">Vorschlag</small>
                                    <div v-for="task in goal.tasks.suggested" :key="task.id"
                                        class="small mt-1 text-primary" style="cursor: pointer;"
                                        @click.stop="acceptTask(goal, task)">
                                        <i class="bi bi-plus-circle me-1"></i>{{ task.title }}
                                    </div>
                                    <div v-if="!goal.tasks.suggested.length" class="small text-muted mt-1">–</div>
                                </div>
                            </div>
                        </div>
                    </transition>
                </div>

                <div class="form-check form-switch">
                    <input class="form-check-input" type="checkbox" role="switch" id="timelineSwitch"
                        v-model="showTimeline">
                    <label class="form-check-label" for="timelineSwitch">Laufende Ziele im Zeitverlauf anzeigen</label>
                </div>
                <img v-if="showTimeline" :src="goalTimelineImg" alt="Zeitstrahl der laufenden Ziele"
                    class="img-fluid mt-4">
            </div>
        </div>

        <!-- ======================================================== -->
        <!-- TAB: VERGANGENE ZIELE                                    -->
        <!-- ======================================================== -->
        <div v-if="activeTab === 'past'">
            <div class="input-group mb-3 bg-light rounded-pill px-2">
                <span class="input-group-text bg-transparent border-0 text-muted"><i class="bi bi-search"></i></span>
                <input type="text" class="form-control bg-transparent border-0 small" placeholder="Ziele durchsuchen..."
                    v-model="pastFilter">
            </div>

            <ul class="list-group list-group-flush">
                <li v-for="goal in filteredPastGoals" :key="goal.id" class="list-group-item p-0 mb-3 bg-transparent border-0">
                    <div class="card border-0 shadow-sm rounded-4 overflow-hidden" style="cursor: pointer;"
                        @click="toggleGoal(goal)">
                        <div class="card-body p-3">
                            <div class="d-flex justify-content-between align-items-center mb-2">
                                <div class="d-flex align-items-center gap-3">
                                    <div class="bg-light rounded-circle d-flex align-items-center justify-content-center"
                                        style="width: 40px; height: 40px;">
                                        <i :class="['bi fs-5', goal.icon, goal.status === 'success' ? 'text-success' : 'text-danger']"></i>
                                    </div>
                                    <div>
                                        <h5 class="fw-bold mb-0 text-dark">{{ goal.title }}</h5>
                                        <small class="text-muted">{{ goal.type }}</small>
                                    </div>
                                </div>
                                <div class="d-flex align-items-center gap-3">
                                    <span class="rounded-circle"
                                        :class="goal.status === 'success' ? 'bg-success' : 'bg-danger'"
                                        style="width: 12px; height: 12px;"
                                        :title="goal.status === 'success' ? 'Erreicht' : 'Nicht erreicht'"></span>
                                    <i class="bi text-muted small"
                                        :class="goal.expanded ? 'bi-chevron-up' : 'bi-chevron-down'"></i>
                                </div>
                            </div>

                            <div class="progress mt-2" style="height: 6px;">
                                <div class="progress-bar" :class="goal.status === 'success' ? 'bg-success' : 'bg-danger'"
                                    :style="{ width: calculateProgress(goal.current, goal.target) + '%' }"></div>
                            </div>
                        </div>

                        <transition name="expand">
                            <div v-if="goal.expanded" class="bg-white border-top p-3">
                                <p class="small text-muted mb-3">{{ goal.description || 'Keine Beschreibung vorhanden.' }}</p>
                                <div class="d-flex justify-content-between align-items-end">
                                    <div>
                                        <h6 class="fw-bold text-muted small mb-2">Abgeschlossene Aufgaben</h6>
                                        <ul class="list-unstyled mb-0">
                                            <li v-for="task in goal.doneTasks" :key="task" class="small text-dark mb-1">
                                                <i class="bi bi-check-circle text-success me-2"></i>{{ task }}
                                            </li>
                                        </ul>
                                    </div>
                                    <button v-if="goal.status === 'failed'"
                                        class="btn btn-sm btn-outline-primary fw-bold px-3" @click.stop="retryGoal(goal)">
                                        Erneut versuchen
                                    </button>
                                </div>
                            </div>
                        </transition>
                    </div>
                </li>
            </ul>

            <div v-if="!filteredPastGoals.length" class="text-center text-muted my-4 small">
                Keine Ziele gefunden.
            </div>

            <div class="row g-2 my-4">
                <div class="col-6">
                    <div class="card border-0 shadow-sm rounded-4 p-3 bg-light h-100">
                        <small class="text-muted fw-bold d-block mb-2">Erfolgsrate</small>
                        <div class="d-flex align-items-end gap-2">
                            <h3 class="mb-0 fw-bold">{{ successRate }}%</h3>
                            <small class="text-success pb-1">{{ successCount }}/{{ pastGoals.length }}</small>
                        </div>
                    </div>
                </div>
                <div class="col-6">
                    <div class="card border-0 shadow-sm rounded-4 p-3 bg-light h-100 d-flex flex-row align-items-center justify-content-center">
                        <div class="css-donut-chart-mini"></div>
                        <div class="ms-2">
                            <small class="text-muted fw-bold d-block" style="font-size: .6rem;">Häufigste Zielart</small>
                            <small class="fw-bold">Leistungs-Ziel</small>
                        </div>
                    </div>
                </div>
            </div>
        </div>

       
    </div>

    <!-- ============================ DIALOG ============================ -->
    <transition name="fade">
        <div v-if="dialog" class="dialog-backdrop" @click.self="dialog = null">
            <div class="dialog-card shadow-lg" role="dialog" aria-modal="true">
                <h4 class="fw-bold mb-3">{{ dialog.title }}</h4>

                <p v-if="dialog.text" class="mb-3">{{ dialog.text }}</p>

                <dl v-if="dialog.lines" class="mb-4">
                    <div v-for="line in dialog.lines" :key="line.label" class="mb-1">
                        <span class="fw-bold">{{ line.label }}:</span> {{ line.value }}
                    </div>
                </dl>

                <div class="d-flex justify-content-end gap-2">
                    <button class="btn btn-light fw-bold px-3" @click="dialog = null">Abbrechen</button>
                    <button class="btn btn-primary fw-bold px-3" @click="runDialog">{{ dialog.confirmLabel }}</button>
                </div>
            </div>
        </div>
    </transition>

    <!-- ============================ TOAST ============================ -->
    <transition name="fade">
        <div v-if="toast" class="app-toast shadow">
            <i class="bi bi-check-circle-fill me-2"></i>{{ toast }}
        </div>
    </transition>
</template>

<script setup>
import { ref, computed } from 'vue';
import goalTimelineImg from '/assets/images/goal-time-line.png';

/* ----------------------------------------------------------------
 * Tabs
 * ---------------------------------------------------------------- */
const tabs = [
    { id: 'new', label: 'Neu', icon: 'bi-plus-circle' },
    { id: 'challenges', label: 'Challenges', icon: 'bi-flag' },
    { id: 'active', label: 'Laufend', icon: 'bi-arrow-repeat' },
    { id: 'past', label: 'Vergangen', icon: 'bi-clock-history' }
];
const activeTab = ref('new');

/* ----------------------------------------------------------------
 * Stammdaten (rein clientseitig – kein Backend)
 * ---------------------------------------------------------------- */
const npos = ['FF Eidenberg', 'Nachbarschaftshilfe'];
const selectedNpo = ref('FF Eidenberg');

const units = ['Anzahl', 'Stunden', 'Punkte'];
const groups = ['Gruppe Offiziere', 'Gruppe Chargen', 'Alle Mitglieder'];
const periods = ['Vormonat', 'Vorquartal', 'Vorjahr'];

const customGoalTypes = [
    { id: 1, title: 'Leistungs-Ziel', description: 'Erbringe besondere Leistungen', icon: 'bi-bullseye' },
    { id: 2, title: 'Selbstvergleichs-Ziel', description: 'Übertriff dich selbst', icon: 'bi-person-up' },
    { id: 3, title: 'Fremdvergleichs-Ziel', description: 'Miss dich mit Anderen', icon: 'bi-trophy' }
];

const typeIcon = {
    'Leistungs-Ziel': 'bi-bullseye',
    'Selbstvergleichs-Ziel': 'bi-person-up',
    'Fremdvergleichs-Ziel': 'bi-trophy'
};

/* Bereichs-Baum für das Sunburst-Diagramm */
const areaTree = {
    id: 'root',
    name: 'Alle Bereiche',
    children: [
        {
            id: 'aktivitaet', name: 'Aktivität', value: 50.7, children: [
                {
                    id: 'ausbildungen', name: 'Ausbildungen', value: 44, children: [
                        {
                            id: 'fuehrungsausbildung', name: 'Führungsausbildung', value: 27.3, suggestions: [
                                { title: 'Ausgebildet', type: 'Leistungs-Ziel', unit: 'Anzahl', amount: 3, icon: 'bi-mortarboard-fill', colorClass: 'bg-primary' },
                                { title: 'Chef', type: 'Fremdvergleichs-Ziel', unit: 'Anzahl', amount: 2, icon: 'bi-award-fill', colorClass: 'bg-info' },
                                { title: 'Engagiert', type: 'Selbstvergleichs-Ziel', unit: 'Stunden', amount: 20, icon: 'bi-briefcase-fill', colorClass: 'bg-danger' }
                            ]
                        },
                        { id: 'grundausbildung', name: 'Grundausbildung', value: 31.8 },
                        { id: 'erweiterte', name: 'Erweiterte Ausbildung', value: 18.2 },
                        { id: 'fach', name: 'Fach- und Sonderausbildung', value: 22.7 }
                    ]
                },
                {
                    id: 'einsaetze', name: 'Einsätze', value: 34, children: [
                        { id: 'brand', name: 'Brandeinsatz', value: 40 },
                        { id: 'technisch', name: 'Technischer Einsatz', value: 38 },
                        { id: 'schadstoff', name: 'Schadstoffeinsatz', value: 22 }
                    ]
                },
                {
                    id: 'dienste', name: 'Dienste', value: 22, children: [
                        { id: 'buero', name: 'Bürodienst', value: 45 },
                        { id: 'nacht', name: 'Nachtdienst', value: 30 },
                        { id: 'uebung', name: 'Übung', value: 25 }
                    ]
                }
            ]
        },
        {
            id: 'kompetenz', name: 'Kompetenz', value: 21.3, children: [
                { id: 'fuehrungskompetenz', name: 'Führungskompetenz', value: 55 },
                { id: 'fachkompetenz', name: 'Fachkompetenz', value: 45 }
            ]
        },
        {
            id: 'funktion', name: 'Funktion', value: 17.3, children: [
                { id: 'offizier', name: 'Offizier', value: 35 },
                { id: 'chargen', name: 'Chargen', value: 40 },
                { id: 'mannschaft', name: 'Mannschaft', value: 25 }
            ]
        },
        {
            id: 'verdienst', name: 'Verdienst', value: 10.7, children: [
                { id: 'auszeichnung', name: 'Auszeichnungen', value: 60 },
                { id: 'befoerderung', name: 'Beförderungen', value: 40 }
            ]
        }
    ]
};

/* ----------------------------------------------------------------
 * Sunburst – Geometrie
 * ---------------------------------------------------------------- */
const CX = 150, CY = 150, HOLE = 24, RING_W = 20, OUTER_R = 145;
const GREENS = ['#15b74b', '#0c943b', '#2de26a', '#1aa347', '#72f59f', '#0a7e32'];
const RING_TINTS = ['#4ccd77', '#7fe1a2'];
const SELECTED_FILL = '#2b3a8f';

const polar = (r, deg) => {
    const rad = ((deg - 90) * Math.PI) / 180;
    return [CX + r * Math.cos(rad), CY + r * Math.sin(rad)];
};

const arcPath = (r0, r1, a0, a1) => {
    const large = a1 - a0 > 180 ? 1 : 0;
    const [x0, y0] = polar(r1, a0);
    const [x1, y1] = polar(r1, a1);
    const [x2, y2] = polar(r0, a1);
    const [x3, y3] = polar(r0, a0);
    return `M${x0},${y0} A${r1},${r1} 0 ${large} 1 ${x1},${y1} L${x2},${y2} A${r0},${r0} 0 ${large} 0 ${x3},${y3} Z`;
};

const fullRing = (r0, r1) =>
    `M${CX - r1},${CY} A${r1},${r1} 0 1 1 ${CX + r1},${CY} A${r1},${r1} 0 1 1 ${CX - r1},${CY} Z ` +
    `M${CX - r0},${CY} A${r0},${r0} 0 1 0 ${CX + r0},${CY} A${r0},${r0} 0 1 0 ${CX - r0},${CY} Z`;

/* ----------------------------------------------------------------
 * Sunburst – Zustand
 * ---------------------------------------------------------------- */
const path = ref([]);            // Pfad vom Wurzelknoten zur aktuellen Ebene
const selectedArea = ref(null);
const tooltip = ref(null);
const chartWrap = ref(null);

const hasChildren = (node) => Array.isArray(node.children) && node.children.length > 0;

/* Bei einem Blatt bleiben die Geschwister im Außenring sichtbar. */
const displayPath = computed(() => {
    const p = path.value;
    return p.length && !hasChildren(p[p.length - 1]) ? p.slice(0, -1) : p;
});

const segments = computed(() => {
    const p = displayPath.value;
    const parent = p.length ? p[p.length - 1] : areaTree;
    return parent.children || [];
});

const innerR = computed(() => HOLE + displayPath.value.length * RING_W);

const ancestorRings = computed(() =>
    displayPath.value.map((node, i) => {
        const r0 = HOLE + i * RING_W;
        const r1 = r0 + RING_W;
        return {
            node,
            index: i,
            d: fullRing(r0, r1),
            fill: RING_TINTS[i % RING_TINTS.length],
            labelY: CY - (r0 + RING_W / 2)
        };
    })
);

const segmentArcs = computed(() => {
    const items = segments.value;
    const total = items.reduce((sum, n) => sum + n.value, 0) || 1;
    let angle = 0;

    return items.map((node, idx) => {
        const sweep = (node.value / total) * 360;
        const a0 = angle;
        const a1 = angle + sweep;
        angle = a1;

        const mid = (a0 + a1) / 2;
        const lr = innerR.value + (OUTER_R - innerR.value) * 0.62;
        const [lx, ly] = polar(lr, mid);
        let rot = mid - 90;
        if (mid > 180) rot += 180;

        const selected = selectedArea.value?.id === node.id;
        const pct = (node.value / total) * 100;

        return {
            node,
            selected,
            pct,
            d: arcPath(innerR.value, OUTER_R, a0, a1),
            fill: selected ? SELECTED_FILL : GREENS[idx % GREENS.length],
            lx, ly, rot,
            showLabel: sweep > 26,
            short: node.name.length > 15 ? node.name.slice(0, 14) + '…' : node.name
        };
    });
});

/* ----------------------------------------------------------------
 * Sunburst – Interaktion
 * ---------------------------------------------------------------- */
const selectArea = (node) => {
    path.value = [...displayPath.value, node];
    selectedArea.value = node;
    draft.value = null;
    tooltip.value = null;
};

const jumpTo = (index) => {
    path.value = path.value.slice(0, index + 1);
    selectedArea.value = path.value[path.value.length - 1] || null;
    draft.value = null;
};

const goUp = () => {
    if (!path.value.length) return;
    path.value = path.value.slice(0, -1);
    selectedArea.value = path.value[path.value.length - 1] || null;
    draft.value = null;
};

const resetArea = () => {
    path.value = [];
    selectedArea.value = null;
    draft.value = null;
};

const selectNpo = (npo) => {
    selectedNpo.value = npo;
    resetArea();
};

const showTooltip = (event, seg) => {
    const box = chartWrap.value?.getBoundingClientRect();
    if (!box) return;
    tooltip.value = {
        x: event.clientX - box.left + 12,
        y: event.clientY - box.top - 8,
        text: `${seg.node.name}: ${seg.pct.toFixed(1)}%`
    };
};

/* ----------------------------------------------------------------
 * Workflow: Bereich → Zielart → Details → Bestätigung
 * ---------------------------------------------------------------- */
const goalCreationMode = ref('suggested');
const draft = ref(null);

const wizardSteps = [
    { nr: 1, label: 'Bereich' },
    { nr: 2, label: 'Zielart' },
    { nr: 3, label: 'Details' }
];
const wizardStep = computed(() => (draft.value ? 3 : selectedArea.value ? 2 : 1));

const defaultDeadline = () => {
    const d = new Date();
    d.setMonth(d.getMonth() + 3);
    return d.toISOString().slice(0, 10);
};

const suggestedGoals = computed(() => {
    const area = selectedArea.value;
    if (!area) return [];
    const custom = area.suggestions;
    if (custom) return custom.map((s, i) => ({ id: `${area.id}-${i}`, ...s }));

    return [
        { id: `${area.id}-a`, title: `${area.name} Profi`, type: 'Leistungs-Ziel', unit: 'Anzahl', amount: 3, icon: 'bi-bullseye', colorClass: 'bg-primary' },
        { id: `${area.id}-b`, title: 'Besser als zuletzt', type: 'Selbstvergleichs-Ziel', unit: 'Stunden', amount: 10, icon: 'bi-person-up', colorClass: 'bg-danger' },
        { id: `${area.id}-c`, title: 'Bester der Gruppe', type: 'Fremdvergleichs-Ziel', unit: 'Punkte', amount: 50, icon: 'bi-trophy', colorClass: 'bg-info' }
    ];
});

const startFromSuggestion = (goal) => {
    draft.value = {
        area: selectedArea.value,
        type: goal.type,
        unit: goal.unit,
        amount: goal.amount,
        name: goal.title,
        date: defaultDeadline(),
        group: groups[0],
        period: periods[0],
        icon: goal.icon
    };
};

const startFromType = (type) => {
    draft.value = {
        area: selectedArea.value,
        type: type.title,
        unit: 'Anzahl',
        amount: null,
        name: '',
        date: defaultDeadline(),
        group: groups[0],
        period: periods[0],
        icon: type.icon
    };
};

const draftValid = computed(() => {
    const d = draft.value;
    return !!(d && d.amount > 0 && d.name.trim() && d.date);
});

const missingHint = computed(() => {
    const d = draft.value;
    if (!d) return '';
    const missing = [];
    if (!(d.amount > 0)) missing.push('einen Wert');
    if (!d.name.trim()) missing.push('einen Namen');
    if (!d.date) missing.push('ein Datum');
    return missing.join(' und ');
});

const formatDate = (iso) => {
    if (!iso) return '';
    const [y, m, d] = iso.split('-');
    return `${d}.${m}.${y}`;
};

const goalSentence = (d) => {
    const base = `${d.amount} ${d.unit === 'Anzahl' ? '' : d.unit + ' '}${d.area.name}`.replace(/\s+/g, ' ').trim();
    if (d.type === 'Selbstvergleichs-Ziel') return `${base} – mehr als ${d.period}`;
    if (d.type === 'Fremdvergleichs-Ziel') return `${base} – Bester aus ${d.group}`;
    return base;
};

/* ----------------------------------------------------------------
 * Dialog & Toast (ersetzen window.alert / window.confirm)
 * ---------------------------------------------------------------- */
const dialog = ref(null);
const toast = ref(null);

const showToast = (message) => {
    toast.value = message;
    window.setTimeout(() => (toast.value = null), 2600);
};

const runDialog = () => {
    const action = dialog.value?.onConfirm;
    dialog.value = null;
    if (action) action();
};

const askToCreate = () => {
    const d = draft.value;
    dialog.value = {
        title: 'Ziel erstellen?',
        confirmLabel: 'Erstellen',
        lines: [
            { label: 'Name deines Ziels', value: d.name },
            { label: 'Dein Ziel', value: goalSentence(d) },
            { label: 'Verfügbare Zeit', value: `Bis zum ${formatDate(d.date)}` },
            { label: 'NPO', value: selectedNpo.value }
        ],
        onConfirm: createGoal
    };
};

/* ----------------------------------------------------------------
 * Ziele
 * ---------------------------------------------------------------- */
const activeGoals = ref([
    {
        id: 1,
        title: 'Arbeitstier',
        description: '100 Stunden im Büro bis 25.08.',
        icon: 'bi-briefcase',
        unit: 'Stunden',
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
        description: 'Mehr Kompetenz als im Vormonat',
        icon: 'bi-person-badge',
        unit: 'Punkte',
        current: 8,
        target: 10,
        expanded: false,
        tasks: { completed: [], accepted: [], suggested: [] }
    }
]);

const pastGoals = ref([
    { id: 3, title: 'Retter', type: 'Leistungs-Ziel', icon: 'bi-life-preserver', current: 10, target: 10, status: 'success', description: '10 Einsätze bis 30.06.', doneTasks: ['Einsatz, 03.09.20', 'Einsatz, 12.09.20'] },
    { id: 4, title: 'Marathon', type: 'Leistungs-Ziel', icon: 'bi-activity', current: 38, target: 42, status: 'failed', description: '42 Stunden Übung bis 31.07.', doneTasks: ['Dienst, 03.09.20', 'Übung, 12.09.20'] },
    { id: 5, title: 'Nachteule', type: 'Selbstvergleichs-Ziel', icon: 'bi-moon-stars', current: 6, target: 5, status: 'success', description: '5 Nachtdienste bis 31.05.', doneTasks: ['Nachtdienst, 02.05.20'] },
    { id: 6, title: 'Teamplayer', type: 'Fremdvergleichs-Ziel', icon: 'bi-people', current: 12, target: 12, status: 'success', description: 'Bester aus Gruppe Chargen', doneTasks: ['Dienst, 14.04.20'] }
]);

const createGoal = () => {
    const d = draft.value;

    activeGoals.value.unshift({
        id: Date.now(),
        title: d.name,
        type: d.type,
        description: `${goalSentence(d)} bis ${formatDate(d.date)}`,
        icon: d.icon || typeIcon[d.type] || 'bi-bullseye',
        unit: d.unit,
        current: 0,
        target: d.amount,
        expanded: false,
        tasks: {
            completed: [],
            accepted: [],
            suggested: [{ id: Date.now() + 1, title: `${d.area.name} eintragen` }]
        }
    });

    draft.value = null;
    resetArea();
    activeTab.value = 'active';
    showToast(`Ziel „${d.name}“ erstellt.`);
};

const confirmDelete = (goal) => {
    dialog.value = {
        title: 'Ziel löschen?',
        text: `„${goal.title}“ wird aus deinen laufenden Zielen entfernt.`,
        confirmLabel: 'Löschen',
        onConfirm: () => {
            activeGoals.value = activeGoals.value.filter((g) => g.id !== goal.id);
            showToast('Ziel gelöscht.');
        }
    };
};

const retryGoal = (goal) => {
    activeGoals.value.unshift({
        ...goal,
        id: Date.now(),
        current: 0,
        expanded: false,
        tasks: { completed: [], accepted: [], suggested: [] }
    });
    activeTab.value = 'active';
    showToast(`„${goal.title}“ neu gestartet.`);
};

const toggleGoal = (goal) => {
    goal.expanded = !goal.expanded;
};

const acceptTask = (goal, task) => {
    goal.tasks.suggested = goal.tasks.suggested.filter((item) => item.id !== task.id);
    goal.tasks.accepted.push(task);
};

const calculateProgress = (current, target) => (target ? Math.min(100, (current / target) * 100) : 0);

const pastFilter = ref('');
const filteredPastGoals = computed(() =>
    pastGoals.value.filter((goal) => goal.title.toLowerCase().includes(pastFilter.value.toLowerCase()))
);

const successCount = computed(() => pastGoals.value.filter((g) => g.status === 'success').length);
const successRate = computed(() =>
    pastGoals.value.length ? Math.round((successCount.value / pastGoals.value.length) * 100) : 0
);

const showTimeline = ref(true);

/* ----------------------------------------------------------------
 * Challenges
 * ---------------------------------------------------------------- */
const challenges = ref([
    {
        id: 101,
        title: 'MC Volunteer',
        type: 'Gutschein',
        icon: 'bi-cup-hot-fill',
        iconBg: 'bg-danger text-white',
        target: 2,
        unit: 'Anzahl',
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
        target: 2,
        unit: 'Anzahl',
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
        target: 10,
        unit: 'Stunden',
        details: [
            { icon: 'bi-gear-fill', text: 'Mehr Stunden im Einsatz' },
            { icon: 'bi-people-fill', text: 'Als Bester aus Gruppe Offiziere' },
            { icon: 'bi-hourglass-split', text: 'Innerhalb von 1 Monat' }
        ]
    }
]);

const dismissChallenge = (challengeId) => {
    challenges.value = challenges.value.filter((challenge) => challenge.id !== challengeId);
};

const acceptChallenge = (challenge) => {
    dismissChallenge(challenge.id);
    activeGoals.value.unshift({
        id: Date.now(),
        title: challenge.title,
        type: challenge.type,
        description: challenge.details.map((d) => d.text).join(' · '),
        icon: challenge.icon,
        unit: challenge.unit,
        current: 0,
        target: challenge.target,
        expanded: false,
        tasks: { completed: [], accepted: [], suggested: [] }
    });
    activeTab.value = 'active';
    showToast(`Challenge „${challenge.title}“ angenommen.`);
};


</script>

<style scoped>
/* ---------------- Sunburst ---------------- */
.sunburst-wrap {
    position: relative;
    max-width: 320px;
    margin: 0 auto;
}

.sunburst {
    width: 100%;
    height: auto;
    display: block;
}

.segment-path {
    stroke: #fff;
    stroke-width: 2;
    cursor: pointer;
    transition: opacity .15s ease;
}

.segment-path:hover {
    opacity: .85;
}

.segment-path.selected {
    stroke-width: 3;
}

.ring-path {
    stroke: #fff;
    stroke-width: 2;
    cursor: pointer;
}

.ring-label {
    font-size: 8px;
    font-weight: 600;
    fill: #fff;
    pointer-events: none;
}

.segment-label {
    font-size: 9px;
    font-weight: 600;
    fill: #fff;
    cursor: pointer;
}

.center-circle {
    fill: #fff;
    stroke: #dee2e6;
}

.center-circle.clickable {
    fill: #5b8def;
    stroke: none;
    cursor: pointer;
}

.center-icon {
    font-size: 18px;
    font-weight: 700;
    fill: #adb5bd;
    pointer-events: none;
}

.center-circle.clickable+.center-icon {
    fill: #fff;
}

.sunburst-tooltip {
    position: absolute;
    transform: translateY(-100%);
    background: #15b74b;
    color: #fff;
    font-size: .75rem;
    font-weight: 600;
    padding: .35rem .6rem;
    border-radius: .5rem;
    white-space: nowrap;
    pointer-events: none;
    z-index: 5;
}

/* ---------------- Wizard ---------------- */
.wizard-steps {
    list-style: none;
    display: flex;
    gap: .25rem;
    padding: 0;
    margin: 0;
}

.wizard-steps li {
    flex: 1;
    display: flex;
    align-items: center;
    gap: .4rem;
    font-size: .72rem;
    color: #adb5bd;
}

.wizard-dot {
    width: 22px;
    height: 22px;
    border-radius: 50%;
    background: #e9ecef;
    color: #adb5bd;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: .7rem;
    font-weight: 700;
    flex: 0 0 auto;
}

.wizard-steps li.current {
    color: #212529;
    font-weight: 700;
}

.wizard-steps li.current .wizard-dot {
    background: var(--bs-primary, #15b74b);
    color: #fff;
}

.wizard-steps li.done {
    color: #6c757d;
}

.wizard-steps li.done .wizard-dot {
    background: rgba(21, 183, 75, .15);
    color: #15b74b;
}

/* ---------------- Dialog & Toast ---------------- */
.dialog-backdrop {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, .45);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 1.25rem;
    z-index: 1080;
}

.dialog-card {
    background: #fff;
    border-radius: 1rem;
    padding: 1.5rem;
    width: 100%;
    max-width: 420px;
}

.app-toast {
    position: fixed;
    left: 50%;
    bottom: 1.5rem;
    transform: translateX(-50%);
    background: #212529;
    color: #fff;
    padding: .6rem 1rem;
    border-radius: 2rem;
    font-size: .85rem;
    z-index: 1090;
}

.fade-enter-active,
.fade-leave-active {
    transition: opacity .2s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}

/* ---------------- Listen & Buttons ---------------- */
.action-list-item:hover,
.custom-goal-btn:hover {
    background-color: #f8f9fa !important;
    cursor: pointer;
}

.active-area {
    border-color: #2b3a8f !important;
    background-color: rgba(43, 58, 143, .06);
}

.animate-fade-in {
    animation: fadeIn .3s ease-in;
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

/* ---------------- Navigation ---------------- */
.nav-underline-container {
    margin-top: 10px;
}

.nav-tab-item {
    background: none;
    border: none;
    color: rgba(255, 255, 255, .6);
    padding: 10px 5px;
    font-size: .75rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    flex: 1;
    min-width: 80px;
    transition: all .2s ease;
    border-bottom: 3px solid transparent;
}

.nav-tab-item i {
    font-size: 1.2rem;
}

.nav-tab-item.active {
    color: #fff;
    font-weight: bold;
    border-bottom: 3px solid #ffc107;
}

/* ---------------- Hilfsklassen ---------------- */
.no-scrollbar::-webkit-scrollbar {
    display: none;
}

.grayscale {
    filter: grayscale(100%);
}

.css-donut-chart-mini {
    width: 30px;
    height: 30px;
    border-radius: 50%;
    background: conic-gradient(#3f51b5 0% 50%, #e91e63 50% 80%, #009688 80% 100%);
}

.expand-enter-active,
.expand-leave-active {
    transition: all .3s ease-in-out;
    max-height: 300px;
    overflow: hidden;
}

.expand-enter-from,
.expand-leave-to {
    max-height: 0;
    opacity: 0;
}

@media (prefers-reduced-motion: reduce) {

    .animate-fade-in,
    .expand-enter-active,
    .expand-leave-active,
    .fade-enter-active,
    .fade-leave-active {
        animation: none;
        transition: none;
    }
}
</style>