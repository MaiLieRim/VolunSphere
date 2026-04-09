<template>
  <nav class="navbar bg-dark fixed-bottom ">
    <div class="container align-items-center">
      <router-link to="/" class="navbar-brand text-center position-relative" active-class="active-link">
        <i class="bi bi-house-door">
          <div class="fs-4">Home</div>
        </i>
      </router-link>
      <router-link :to="verificationsRoute" class="navbar-brand text-center position-relative" active-class="active-link">
        <span class="badge badge-sm">
          3
        </span>
        <i class="bi bi-card-checklist">
          <div class="fs-4">Nachweise</div>
        </i>
      </router-link>
      <router-link to="/tasks" class="navbar-brand text-center position-relative"  :class="{ 'active-link': isTaskRelated }">
        <i class="bi bi-zoom-in">
          <div class="fs-4">Aufgaben</div>
        </i>
      </router-link>
     
      <router-link :to="communityRoute" class="navbar-brand text-center position-relative" active-class="active-link">
        <i class="bi bi-emoji-sunglasses">
          <div class="fs-4">Netzwerk</div>
        </i>
      </router-link>
      <router-link 
        to="/chatarchiv" 
        class="navbar-brand text-center position-relative"
        :class="{ 'active-link': isChatActive }"
      >
        <span class="badge badge-sm">
          1
          <span class="visually-hidden">unread messages</span>
        </span>
        <i class="bi bi-chat">
          <div class="fs-4">Chat</div>
        </i>
      </router-link>
    </div>
  </nav>
</template>
<script setup>
import { useRoute } from 'vue-router';
import {ref,computed} from 'vue';

const route = useRoute();
const isChatActive = computed(() => route.path.startsWith("/chat"));
const isTaskRelated = computed(() => route.path.startsWith("/task") || route.path.startsWith("/tasks") || route.path.startsWith("/task-search"));
// Fetch the logged-in user role safely (assuming you are still using localStorage)
const userRole = ref(localStorage.getItem('userRole') || 'volunteer');

// Dynamically determine the route based on the role
const verificationsRoute = computed(() => {
  return userRole.value === 'admin' ? '/review-requests' : '/my-verifications';
});
const communityRoute = computed(() => {
  return userRole.value === 'admin' ? '/org-community' : '/my-community';
});
</script>

<style >
.navbar-brand {
  color: white;
  text-decoration: none;
}

.active-link {
  color: var(--bs-primary) /* Bootstrap primary color */
}

.badge-sm{
  position: absolute;
  font-size: 0.75rem;
  left:55%;
  bottom:70%;
  border-radius: 50%;
  background-color: var(--bs-primary);
}
</style>
