<style scoped>
.picture {
  position: absolute;
  top: 0;
  display: flex;
  align-content: flex-end;
}

.navbar-home {
  padding: 0.75rem 0;
}

.navbar-brand-home {
  font-size: 1.5rem;
  font-weight: bold;
}

.nav-icons {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.auth-buttons {
  display: flex;
  gap: 0.5rem;
}

.user-profile {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.5rem;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: background-color 0.2s;
}

.user-profile:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.user-profile img {
  width: 40px;
  height: 40px;
  border-radius: 50%;
}

.user-info {
  text-align: right;
  line-height: 1.3;
}

.user-info strong {
  display: block;
  font-size: 0.9rem;
}

.user-info small {
  display: block;
  font-size: 0.75rem;
  opacity: 0.8;
}

/* QR Code Button Styling */
.qr-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 55px;
  height: 55px;
  background-color: rgba(255, 255, 255, 0.1);
  color: #ffffff;
  font-size: 2rem;
  border-radius: 0.5rem;
  text-decoration: none;
}

.navbar-brand:hover,
.navbar-brand:focus {
  color: unset !important;
}
</style>

<template>
  <nav class="navbar bg-dark text-white">
    <div class="container position-relative">
      <template v-if="!isHomePage">
        <a class="navbar-brand d-flex align-items-center text-truncate text-white" @click="goBack()"
          style="cursor: pointer;">
          <i class="bi bi-arrow-left me-2"></i>
          {{ title }}
        </a>
      </template>

      <template v-if="isHomePage">
        <div v-if="isAuthenticated" class="row w-100">
          <div class="px-0 pt-0 navbar-brand text-white">
            {{ title }}
          </div>
        </div>

        <div v-if="isAuthenticated" class="d-flex justify-content-between w-100 mt-2">
          <router-link to="/qrCode" class="qr-btn" title="QR Code anzeigen">
            <i class="bi bi-qr-code"></i>
          </router-link>

          <div class="d-flex align-items-end justify-content-end">
            <router-link class="navbar-brand picture pt-0" :to="profileLink">
              <img :src="user.image" width="60" height="60" class="d-inline-block align-top rounded-circle mb-1"
                alt="Profile picture">
            </router-link>

            <div class="dropdown">
              <div class="user-profile" data-bs-toggle="dropdown" aria-expanded="false">
                <div class="user-info text-white">
                  <strong>{{ user.name }}</strong>
                  <small class="text-light">{{ user.jobTitle }}</small>
                </div>
                <i class="bi bi-caret-down"></i>
              </div>

              <ul class="dropdown-menu dropdown-menu-end shadow">
                <li>
                  <router-link class="dropdown-item py-2" :to="profileLink">
                    <i class="bi bi-person me-2"></i>Profil
                  </router-link>
                </li>
                <li>
                  <a class="dropdown-item py-2" href="/settings">
                    <i class="bi bi-gear me-2"></i>Einstellungen
                  </a>
                </li>
                <li>
                  <hr class="dropdown-divider" />
                </li>
                <li>
                  <button class="dropdown-item py-2 text-danger" @click="handleLogout">
                    <i class="bi bi-box-arrow-right me-2"></i>Abmelden
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div v-else class="w-100 navbar-home">
          <div class="d-flex justify-content-between align-items-center">
            <div class="navbar-brand-home text-white">VolunSphere</div>
            <div class="nav-icons">
              <div class="auth-buttons">
                <router-link to="/login" class="btn btn-outline-light btn-sm">
                  <i class="bi bi-box-arrow-in-right me-1"></i>Anmelden
                </router-link>
                <router-link to="/registry" class="btn btn-light btn-sm text-dark">
                  <i class="bi bi-person-plus me-1"></i>Registrieren
                </router-link>
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

const props = defineProps({
  title: {
    type: String,
    required: true
  },
  backRoute: {
    type: [String, Object],
    default: null
  }
});

// Dynamic user data
const user = ref({});
const route = useRoute();
const router = useRouter();

const isAuthenticated = computed(() => !!localStorage.getItem('authToken'));
const isHomePage = computed(() => route.path === '/');

// Load user data dynamically
const loadUserData = async () => {
  if (!isAuthenticated.value) return;
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

const goBack = () => {
  if (props.title == "Details") {
    router.back();
  } else if (props.backRoute == null) {
    router.push("/");
  } else {
    router.push(props.backRoute);
  }
}
</script>