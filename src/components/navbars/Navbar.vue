<style>
.picture {
  position: absolute;
  top: 0;
  right: 0.75rem;
  display: flex;
  align-content: flex-end;
  padding: 0.75rem 0;

}

.user {
  line-height: 137%;
}
</style>
<template>
  <nav class="navbar bg-dark ">
    <div class="container">

      <template v-if="!isHomePage">
        <router-link class="navbar-brand d-flex align-items-center " to="/">
          <i class="bi bi-arrow-left me-2"></i>
          {{ title }}
        </router-link>
      </template>
      <template v-if="isHomePage">
        <div class="row w-100">
          <div class="px-0 pt-0  navbar-brand">
            {{ title }}
          </div>
        </div>
        <div class="d-flex justify-content-between w-100 mt-2">
          <router-link to="/qrCode">
            <img src="/src/assets/images/qrCode.png" width="59" height="59" class="bg-light mb-1" alt="QRCode">
          </router-link>
          <div class="d-flex align-items-end">

            <router-link class="navbar-brand picture" :to="profileLink">
              <img :src="user.image" width="60" height="60" class="d-inline-block align-top rounded-circle mb-1"
                alt="liselotte picture">
            </router-link>

            <div class=" d-flex  text-end d-flex align-items-end">
              <div class="user">
                <strong>{{ user.name }}</strong>
                <br>
                <small class="text-top">Rolle: {{ user.jobTitle }}</small>
              </div>
              <div class="btn-group ms-2">
                <a class="  text-white rounded-2 p-2 py-1 " type="button" data-bs-toggle="dropdown"
                  aria-expanded="false">
                  <i class="bi bi-chevron-down fs-2"></i> <!--Pfeil größer button kleiner-->
                </a>
                <ul class="dropdown-menu dropdown-menu-end">
                  <li><a class="dropdown-item disabled" href="#">Einstellungen</a></li>
                  <li><a class="dropdown-item disabled" href="#">Another action</a></li>
                  <li><a class="dropdown-item disabled" href="#">Something else here</a></li>
                  <li>
                    <hr class="dropdown-divider">
                  </li>
                  <li> <button class="dropdown-item" @click="handleLogout">Abmelden <i
                        class="bi bi-box-arrow-right"></i></button>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </template>

    </div>
  </nav>
</template>

<script setup>
import { useRoute, useRouter } from 'vue-router';
import { ref, computed, onMounted } from 'vue';
defineProps({
  title: {
    type: String,
    required: true
  }
});
// Dynamic user data
const user = ref({});
const route = useRoute();
const router = useRouter();
const isHomePage = computed(() => route.path === '/');

// Load user data dynamically
const loadUserData = async () => {
  const userRole = localStorage.getItem('userRole') || 'volunteer'; // Default to volunteer
  try {
    const userData = await import(`@/assets/data/${userRole}.json`);
    user.value = userData.default;
  } catch (error) {
    console.error("Error loading user data:", error);
  }
};

onMounted(loadUserData);

const profileLink = computed(() => {
  const role = localStorage.getItem('userRole');
  return role === 'admin' ? '/organisation' : '/profile';
});

const handleLogout = () => {
  localStorage.removeItem('authToken');
  localStorage.removeItem('userRole');
  router.push('/login');
};
</script>