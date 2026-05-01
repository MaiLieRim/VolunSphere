<template>
    <Navbar title="Details"></Navbar>

    <div class="content-container pb-5" v-if="detailTask">
        
        <div class="d-flex justify-content-between align-items-start mb-4">
            <div>
                <h3 class="fw-bold mb-1">{{ detailTask.name }}</h3>
                <p class="text-muted mb-0">{{ detailTask.organization.name }}</p>
            </div>
            
            <span class="badge rounded-pill px-3 py-2" :class="statusBadge.class">
                <i :class="statusBadge.icon" class="me-1"></i> 
                {{ statusBadge.text }}
            </span>
        </div>

        <div class="card border shadow-sm rounded-4 mb-4">
            <div class="card-body p-4">
                <div class="d-flex flex-column gap-4">
                    
                    <div class="d-flex align-items-start">
                        <div class="bg-primary-subtle text-primary rounded-circle d-flex justify-content-center align-items-center me-3" style="width: 40px; height: 40px; min-width: 40px;">
                            <i class="bi bi-calendar-event fs-5"></i>
                        </div>
                        <div>
                            <span class="d-block small text-muted fw-bold mb-1">Datum</span>
                            <span class="d-block text-dark">{{ formatDate(detailTask.startDate) }}</span>
                        </div>
                    </div>

                    <div class="d-flex align-items-start">
                        <div class="bg-primary-subtle text-primary rounded-circle d-flex justify-content-center align-items-center me-3" style="width: 40px; height: 40px; min-width: 40px;">
                            <i class="bi bi-geo-alt fs-5"></i>
                        </div>
                        <div>
                            <span class="d-block small text-muted fw-bold mb-1">Einsatzort</span>
                            <span class="d-block text-dark">{{ detailTask.location?.name || 'Kein Ort angegeben' }}</span>
                        </div>
                    </div>

                    <div class="d-flex align-items-start">
                        <div class="bg-primary-subtle text-primary rounded-circle d-flex justify-content-center align-items-center me-3" style="width: 40px; height: 40px; min-width: 40px;">
                            <i class="bi bi-clock-history fs-5"></i>
                        </div>
                        <div>
                            <span class="d-block small text-muted fw-bold mb-1">Dauer</span>
                            <span class="d-block text-dark fw-bold">{{ detailTask.hours }} Stunden</span>
                        </div>
                    </div>

                    <div class="d-flex justify-content-between align-items-center">
                        <div class="d-flex align-items-center">
                            <div class="bg-primary-subtle text-primary rounded-circle d-flex justify-content-center align-items-center me-3" style="width: 40px; height: 40px; min-width: 40px;">
                                <i class="bi bi-person-badge fs-5"></i>
                            </div>
                            <div>
                                <span class="d-block small text-muted fw-bold mb-0">Zuständig</span>
                                <span class="d-block text-dark fw-medium">{{ detailTask.organization.admin || 'Einsatzleitung' }}</span>
                            </div>
                        </div>
                        <router-link v-if="detailTask.organization?.admin" :to="{ name: 'chat', params: { name: detailTask.organization.admin } }" class="btn btn-outline-primary rounded-circle shadow-sm d-flex justify-content-center align-items-center" style="width: 40px; height: 40px;">
                            <i class="bi bi-chat-dots-fill"></i>
                        </router-link>
                        <button v-else class="btn btn-outline-secondary rounded-circle shadow-sm d-flex justify-content-center align-items-center" style="width: 40px; height: 40px;" disabled>
                            <i class="bi bi-chat-dots-fill"></i>
                        </button>
                    </div>

                </div>
            </div>
        </div>

        <div v-if="detailTask.description" class="mb-5">
            <h5 class="fw-bold mb-2">Beschreibung</h5>
            <p class="text-muted">{{ detailTask.description }}</p>
        </div>

        <div v-if="isSkillVerification" class="mb-4">
            <h5 class="fw-bold mb-3">Verknüpfte Einsätze</h5>
            <div class="row row-cols-1 g-3">
                <div v-for="task in skillTasks" :key="task.id" class="col">
                    <div class="card border-light shadow-sm">
                        <div class="card-body p-3">
                            <div class="d-flex justify-content-between align-items-start mb-2">
                                <div>
                                    <h5 class="mb-1 fw-bold">{{ task.title }}</h5>
                                    <small class="text-muted">{{ task.club || 'Organisation' }}</small>
                                </div>
                                <span class="badge bg-primary bg-opacity-10 text-primary rounded-pill">{{ task.hours || 4 }}h</span>
                            </div>
                            <div class="d-flex flex-wrap gap-2 text-muted small">
                                <span><i class="bi bi-calendar-event me-1"></i>{{ formatDate(task.jobStartDate || task.datePosted || task.startDate) }}</span>
                                <span><i class="bi bi-geo-alt me-1"></i>{{ task.location || task.address?.addressLocality || task.jobLocation?.address?.addressLocality || 'Kein Ort angegeben' }}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div v-if="skillNames.length > 0" class="mt-3">
                <h5 class="fw-bold mb-2">Angefragte Kompetenzen</h5>
                <div class="d-flex flex-wrap gap-2">
                    <span v-for="skill in skillNames" :key="skill" class="badge rounded-pill bg-secondary bg-opacity-10 text-secondary">
                        {{ skill }}
                    </span>
                </div>
            </div>
        </div>

        <div v-else-if="qualificationList.length > 0" class="mb-4">
            <h5 class="fw-bold mb-3">Mögliche Qualifikationen</h5>
            <div class="d-flex flex-wrap gap-2">
                <span v-for="qualification in qualificationList" :key="qualification" class="badge rounded-pill bg-success bg-opacity-10 text-success">
                    {{ qualification }}
                </span>
            </div>
        </div>

        <div v-else-if="!hasVerification" class="d-flex align-items-start">
            <div class="bg-primary-subtle text-primary rounded-circle d-flex justify-content-center align-items-center me-3" style="width: 40px; height: 40px; min-width: 40px;">
                <i class="bi bi-clock-history fs-5"></i>
            </div>
            <div class="w-100">
                <span class="d-block small text-muted fw-bold mb-1">Getätigte Stunden</span>
                <input type="number" class="form-control form-control-sm w-50" v-model.number="hours" min="1" />
            </div>
        </div>

        <div class="d-grid gap-2 mt-3">
            <button v-if="!hasVerification" class="btn btn-primary py-2 rounded-pill" @click="requestVerification">
                <i class="bi bi-send me-1"></i> Nachweis anfragen
            </button>

            <button v-if="isPending && hasVerification" class="btn btn-outline-danger py-2 rounded-pill">
                <i class="bi bi-x-circle me-1"></i> Anfrage zurückziehen
            </button>
            
            <button v-if="isConfirmed" class="btn btn-primary py-2 rounded-pill">
                <i class="bi bi-file-earmark-pdf me-1"></i> Zertifikat herunterladen
            </button>
        </div>

    </div>

    <div v-else class="content-container text-center pt-5">
        <i class="bi bi-exclamation-circle text-muted" style="font-size: 3rem;"></i>
        <h4 class="mt-3">Nachweis nicht gefunden</h4>
        <p class="text-muted">Die angeforderte Seite existiert leider nicht.</p>
        <button class="btn btn-primary mt-3" @click="$router.back()">Zurück</button>
    </div>

</template>

<script setup>
import { computed, defineProps, onMounted, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import Navbar from '@/components/navbars/Navbar.vue';
import verificationsData from '@/assets/data/verifications.json';
import { useTasks } from '@/composables/useTasks';

const props = defineProps({
    itemId: {
        type: String,
        required: false
    }
});
const route = useRoute();
const { allTasks } = useTasks();
const task = ref(null);
const hasVerification = ref(false);
const hours = ref(0);
const requestSent = ref(false);

const loadTask = () => {
    const itemId = props.itemId || route.params.itemId;
    const foundItem = verificationsData.itemListElement.find(
        job => job.identifier?.value === itemId || job.id === itemId
    );

    if (foundItem) {
        task.value = { ...foundItem };
        hasVerification.value = true;
        hours.value = foundItem.hours || 0;
        requestSent.value = false;
        return;
    }

    const foundTask = allTasks.value.find(
        job => job.id === itemId || job.identifier?.value === itemId
    );

    if (foundTask) {
        task.value = {
            ...foundTask,
            name: foundTask.title,
            organization: foundTask.hiringOrganization?.name
                ? { ...foundTask.hiringOrganization }
                : { name: foundTask.club || 'Organisation', admin: 'Einsatzleitung' },
            identifier: foundTask.identifier || { value: itemId, name: foundTask.club },
            startDate: foundTask.jobStartDate || foundTask.datePosted,
            location: { name: foundTask.location || foundTask.address?.addressLocality || 'Kein Ort angegeben' },
            hours: foundTask.hours || 4
        };
        hours.value = foundTask.hours || 4;
        hasVerification.value = false;
        requestSent.value = false;
        return;
    }

    task.value = null;
};

onMounted(loadTask);
watch([() => route.params.itemId, () => props.itemId], loadTask);

// --- Computed Helpers ---

const detailTask = computed(() => {
    if (!task.value) return null;
    return {
        ...task.value,
        name: task.value.name || task.value.title || 'Unbekannte Aufgabe',
        organization: {
            ...(task.value.organization || task.value.hiringOrganization || { name: task.value.club || 'Organisation' }),
            admin: (task.value.organization?.admin || task.value.hiringOrganization?.admin || 'Einsatzleitung')
        },
        location: task.value.location || { name: task.value.address?.addressLocality || 'Kein Ort angegeben' },
        startDate: task.value.startDate || task.value.jobStartDate || task.value.datePosted || '',
        hours: hours.value,
        description: task.value.description || '',
        qualifications: task.value.qualifications || task.value.qualification || task.value.skills || []
    };
});

const evidenceTaskIds = computed(() => {
    if (!detailTask.value) return [];
    return Array.isArray(detailTask.value.evidenceIds)
        ? detailTask.value.evidenceIds
        : Array.isArray(detailTask.value.evidenceTaskIds)
            ? detailTask.value.evidenceTaskIds
            : [];
});

const isSkillVerification = computed(() => {
    return !!detailTask.value && (
        detailTask.value.type?.toString().toLowerCase().includes('skill') ||
        evidenceTaskIds.value.length > 0
    );
});

const skillTasks = computed(() => {
    if (!detailTask.value || evidenceTaskIds.value.length === 0) return [];
    return evidenceTaskIds.value
        .map(id => allTasks.value.find(task => task.id === id || task.identifier?.value === id))
        .filter(Boolean);
});

const skillNames = computed(() => {
    if (!detailTask.value) return [];
    if (Array.isArray(detailTask.value.skills)) return detailTask.value.skills;
    if (typeof detailTask.value.skills === 'string') {
        return detailTask.value.skills.split(',').map(skill => skill.trim()).filter(Boolean);
    }
    return [];
});

const qualificationList = computed(() => {
    if (isSkillVerification.value || !detailTask.value) return [];
    const qualifications = detailTask.value.qualifications;
    if (Array.isArray(qualifications)) return qualifications.filter(Boolean);
    if (typeof qualifications === 'string') {
        return qualifications.split(/,|;/).map(item => item.trim()).filter(Boolean);
    }
    return [];
});

const isPending = computed(() => {
    if (!detailTask.value) return false;
    return detailTask.value.status === 'Pending' || detailTask.value.status === 'Requested' || requestSent.value;
});

const isConfirmed = computed(() => {
    if (!detailTask.value) return false;
    return !isPending.value && detailTask.value.status !== 'Deleted' && hasVerification.value;
});

// Dynamic styles for the badge based on status
const statusBadge = computed(() => {
    if (isPending.value) {
        return {
            text: 'Ausstehend',
            class: 'bg-warning text-dark',
            icon: 'bi-hourglass-split'
        };
    } else if (isConfirmed.value) {
        return {
            text: 'Bestätigt',
            class: 'bg-success text-white',
            icon: 'bi-check-circle-fill'
        };
    } else if (hasVerification.value) {
        return {
            text: 'Abgelehnt',
            class: 'bg-danger text-white',
            icon: 'bi-x-circle-fill'
        };
    }
    return {
        text: 'Kein Nachweis',
        class: 'bg-secondary text-white',
        icon: 'bi-file-earmark-minus'
    };
});

const requestVerification = () => {
    if (!detailTask.value) return;

    task.value = {
        ...task.value,
        status: 'Pending',
        dateRequested: new Date().toISOString().split('T')[0],
        hours: hours.value,
        requester: { name: 'Du' },
        organization: detailTask.value.organization,
        identifier: detailTask.value.identifier || { value: route.params.itemId }
    };

    if (!hasVerification.value) {
        verificationsData.itemListElement.push(task.value);
        hasVerification.value = true;
    }

    requestSent.value = true;
};

// Simple date formatter (adjust based on how dates are stored in your JSON)
const formatDate = (dateString) => {
    if (!dateString) return 'Kein Datum angegeben';
    const date = new Date(dateString);
    if (isNaN(date)) return dateString;
    
    return new Intl.DateTimeFormat('de-AT', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    }).format(date);
};
</script>