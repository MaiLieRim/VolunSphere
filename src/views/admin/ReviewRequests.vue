<template>
    <Navbar title="Nachweise"></Navbar>

    <TabNavigation 
        :tabs="[
            { name: 'open', label: 'Offene Anfragen' }, 
            { name: 'archive', label: 'Archiv' }
        ]"
        :currentTab="activeTab" 
        @update:tab="setTab" 
        :showSearch="false" 
        :activitySearch="false" 
    />
    
    <div class="pt-0 content-container pb-5">
        <PaginatedSwipeList :key="activeTab" :items="currentList" :allowSwipe="activeTab === 'open'"
            :emptyMessage="activeTab === 'open' ? 'Keine offenen Anfragen vorhanden.' : 'Das Archiv ist leer.'"
            @swipeLeft="handleApprove" @swipeRight="handleReject" />

        <VerificationRequestModal ref="modalRef" />
    </div>

    <Footer></Footer>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import Navbar from '@/components/navbars/Navbar.vue';
import Footer from '@/components/common/Footer.vue';
import PaginatedSwipeList from '@/components/lists/PaginatedSwipeList.vue';
import VerificationRequestModal from '@/components/verification/VerificationRequestModal.vue';
import verifications from '@/assets/data/verifications.json';
import TabNavigation from '@/components/navbars/TabNavigation.vue';

// --- 1. Constants & Configuration ---
const STATUS = {
    PENDING: 'Pending',
    CERTIFIED: 'Certified',
    DECLINED: 'Declined',
};

const loggedInUser = ref(localStorage.getItem('username') || "Liselotte Pulver");

// --- 2. State ---
const modalRef = ref(null);
const activeTab = ref('open');
const allItems = ref([]);

// --- 3. Initialization (Functional Approach) ---
onMounted(() => {
    allItems.value = verifications.itemListElement
        .filter(job => job.organization.admin.toLowerCase() === loggedInUser.value.toLowerCase())
        .map(job => ({
            id: job.identifier.value,
            title: job.name,
            club: job.organization.name,
            hours: job.hours,
            requester: job.requester.name,
            status: job.status || STATUS.PENDING, 
            swiped: false,
        }));
});

// --- 4. Computed Properties ---
const currentList = computed(() => {
    if (activeTab.value === 'open') {
        return allItems.value.filter(item => item.status === STATUS.PENDING);
    } else {
        return allItems.value.filter(item => item.status !== STATUS.PENDING);
    }
});

// --- 5. Actions ---
const setTab = (tabName) => {
    activeTab.value = tabName;
};

const handleApprove = async (item) => {
    try {
        item.status = STATUS.CERTIFIED;
        modalRef.value?.openModal();
    } catch (error) {
        console.error("Failed to approve:", error);
    }
};

const handleReject = async (item) => {
    try {
        item.status = STATUS.DECLINED;
    } catch (error) {
        console.error("Failed to reject:", error);
    }
};
</script>
