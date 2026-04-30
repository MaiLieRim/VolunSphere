<script setup>
import { ref, computed, onMounted } from 'vue';
import Navbar from '@/components/navbars/Navbar.vue';
import Footer from '@/components/common/Footer.vue';
import verifications from '@/assets/data/verifications.json';
import VerificationList from '@/components/verification/VerificationList.vue';

// --- 1. Constants & Configuration ---
const STATUS = {
  PENDING: 'Pending',
  REQUESTED: 'Requested',
  DELETED: 'Deleted',
  CONFIRMED: 'Confirmed',
  CERTIFIED: 'Certified'
};

const user = ref(localStorage.getItem('username') || "Liselotte Pulver");

const verificationsList = ref(verifications.itemListElement);
const verificationsByUser = computed(() => {
  return verificationsList.value.filter(item =>
    item.requester.name.toLowerCase() === user.value.toLowerCase()
  );
});
// --- 2. Computed Properties (This is what was missing!) ---
const pendingRequests = computed(() => {
  // Return items that are either Pending or Requested
  return verificationsByUser.value.filter(item =>
    item.status === STATUS.PENDING ||
    item.status === STATUS.REQUESTED
  );
});

const verifiedItems = computed(() => {
  return verificationsByUser.value.filter(item =>
    item.status === STATUS.CONFIRMED ||
    item.status == STATUS.CERTIFIED
  );
});
</script>

<template>
  <Navbar title="Nachweise"></Navbar>
  <div class="content-container">

    <h4 class="fw-bold mb-3">Offene Anfragen</h4>
    <VerificationList :items="pendingRequests" />

    <h4 class="fw-bold mt-4 mb-3">Nachweise</h4>
    <VerificationList :items="verifiedItems" />
  </div>

  <Footer></Footer>
</template>

<style scoped>
/* Added a little padding-bottom (pb-5) in the template 
   so the footer doesn't overlap the bottom items! */
</style>