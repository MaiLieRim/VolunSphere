import { createRouter, createWebHistory } from 'vue-router';
import Home from '@/views/shared/Home.vue';
import Login from '@/views/auth/Login.vue';
import Profile from '@/views/volunteer/Profile.vue';
import Registry from '@/views/auth/Registry.vue';
import QRcode from '@/views/shared/QRcode.vue';
import Organisation from '@/views/admin/Organisation.vue';
import AddTask from '@/views/admin/AddTask.vue';
import Tasks from '@/views/volunteer/Tasks.vue';
import Verifications from '@/views/admin/Verifications.vue';
import Search from '@/views/shared/Search.vue';
import Chat from '@/views/shared/Chat.vue';
import Community from '@/views/shared/Community.vue';
import Task from '@/views/volunteer/Task.vue';
import Onboarding from '@/views/auth/Onboarding.vue';
import ChatArchiv from '@/views/shared/ChatArchiv.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.VITE_BASE_URL || '/'),
  routes: [
    { path: '/', name: 'home', component: Home, meta: { requiresAuth: true } },
    { path: '/qrcode', name: 'qrcode', component: QRcode, meta: { requiresAuth: true } },
    { path: '/search', name: 'search', component: Search, meta: { requiresAuth: true } },
    { path: '/chat/:name', name: 'chat', component: Chat, meta: { requiresAuth: true } },
    { path: '/chatarchiv', name: 'chatarchiv', component: ChatArchiv, meta: { requiresAuth: true } },
    { path: '/community', name: 'community', component: Community, meta: { requiresAuth: true } },
    { path: '/login', name: 'login', component: Login },
    { path: '/registry', name: 'registry', component: Registry },
    { path: '/onboarding', name: 'onboarding', component: Onboarding },
    { path: '/profile', name: 'profile', component: Profile, meta: { requiresAuth: true } },
    { path: '/tasks', name: 'tasks', component: Tasks, meta: { requiresAuth: true} },
    { path: '/task/:itemId', name: 'task', component: Task, meta: { requiresAuth: true }, props: true },
    { path: '/verifications', name: 'verifications', component: Verifications, meta: { requiresAuth: true} },
    { path: '/organisation', name: 'organisation', component: Organisation, meta: { requiresAuth: true } },
    { path: '/addtask', name: 'addtask', component: AddTask, meta: { requiresAuth: true } },
  ],
  scrollBehavior() {
    return { top: 0 };
  },
});


router.beforeEach((to, from, next) => {
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme) {
    document.documentElement.setAttribute('data-bs-theme', savedTheme);
  }

  const isAuthenticated = !!localStorage.getItem('authToken');
  const userRole = localStorage.getItem('userRole'); // Get user role

  // special handling for profile route: admins should see organisation view
  if (to.name === 'profile' && userRole === 'admin') {
    next({ name: 'organisation' });
    return;
  }

  if (to.meta.requiresAuth && !isAuthenticated) {
    next('/login'); // Redirect if not logged in
  } else if (to.meta.role && userRole !== to.meta.role) {
    next('/'); // Redirect if wrong role
  } else if(to.name === "login" && isAuthenticated) {
    next('/')
  }else{
    next();
  }
});

export default router;
