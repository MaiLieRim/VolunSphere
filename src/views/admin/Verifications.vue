<template>
  <Navbar title="Nachweise"></Navbar>


  <div class="content-container ">
    <template v-if="userRole === 'admin'">
      <CardBody :message="`Sie haben ${requested.length} neue Nachweisanfragen, bitte geben Sie diese frei.`" />
      <SwipeList title="Anfragen Nachweise" :items="requested"></SwipeList>
      <SwipeList title="Archiv" :items="certified"></SwipeList>

    </template>
    <template v-if="userRole === 'volunteer'">
      <h1>Ihre Nachweise auf einem Blick</h1>
      <SwipeList title="Offene Anfragen" :items="requested"></SwipeList>
      <SwipeList title="Zertifizierte Nachweise" :items="certified"></SwipeList>
      <SwipeList title="Bestätigten Nachweise" :items="confirmed"></SwipeList>
      <div class="justify-content-center gap-1 d-flex space">
        <button class="btn btn-lg btn-outline-primary">
          <i class="fs-1 bi bi-printer"></i>
        </button>
        <button class="btn btn-lg btn-outline-primary">
          <i class="fs-1 bi bi-qr-code-scan"></i>
        </button>
      </div>
    </template>
  </div>

  <Footer></Footer>

</template>

<script setup>
import { ref, onMounted } from 'vue';
import Navbar from '@/components/navbars/Navbar.vue';
import Footer from '@/components/Footer.vue';
import SwipeList from '@/components/SwipeList.vue';
import verifications from '@/assets/data/verifications.json';
import CardBody from '@/components/CardBody.vue';

// Get logged-in user role & name
const userRole = ref(localStorage.getItem('userRole')) || "volunteer";
const loggedInUser = ref(localStorage.getItem('username')) || "Liselotte Pulver"; 

// State for different verification categories
const certified = ref([]);
const requested = ref([]);
const confirmed = ref([]);

onMounted(() => {
  verifications.itemListElement.forEach(job => {
    // Check if the logged-in user is relevant to the verification
    const isVolunteerMatch = userRole.value === 'volunteer' && job.requester.name.toLowerCase() === loggedInUser.value;
    const isAdminMatch = userRole.value === 'admin' && job.organization.admin.toLowerCase() === loggedInUser.value;

    if (isVolunteerMatch || isAdminMatch) {
      const name = isVolunteerMatch ? job.organization.admin : job.requester.name;
      const item = {
        club: job.organization.name,
        hours: job.hours,
        requester: name,
        title: job.name,
        id: job.identifier.value,
        swiped: false, // Track swipe state
      };

      // Categorize the items based on their status
      if (job.status === 'Pending') {
        requested.value.push(item);
      } else if (job.status === 'Confirmed') {
        confirmed.value.push(item);
      } else {
        certified.value.push(item);
      }
    }
  });
});
</script>
