import { createRouter, createWebHistory } from 'vue-router';
import Home from '@/views/shared/Home.vue';
import Login from '@/views/auth/Login.vue';
import Profile from '@/views/volunteer/Profile.vue';
import Registry from '@/views/auth/Registry.vue';
import QRcode from '@/views/shared/QRcode.vue';
import Organisation from '@/views/admin/Organisation.vue';
import AddTask from '@/views/admin/AddTask.vue';
import Tasks from '@/views/volunteer/Tasks.vue';
import MyCommunity from './views/volunteer/MyCommunity.vue';
import OrgCommunity from './views/admin/OrgCommunity.vue';
import ReviewRequests from '@/views/admin/ReviewRequests.vue';
import MyVerifications from '@/views/volunteer/MyVerifications.vue';
import OrgRegistration from '@/views/auth/OrgRegistry.vue';
import TaskSearch from '@/views/shared/TaskSearch.vue';
import Chat from '@/views/shared/Chat.vue';
import Community from '@/views/shared/Community.vue';
import TaskDetails from '@/views/volunteer/TaskDetails.vue';
import Onboarding from '@/views/auth/Onboarding.vue';
import ChatArchiv from '@/views/shared/ChatArchiv.vue';
import OrganisationDetail from './views/volunteer/OrganisationDetail.vue';
import VerificationDetail from './views/volunteer/VerificationDetail.vue';
import ReviewVerification from './views/admin/ReviewVerification.vue';
import OrganisationSearch from './views/volunteer/OrganisationSearch.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.VITE_BASE_URL || '/'),
  routes: [
    { path: '/', name: 'home', component: Home, meta: { requiresAuth: true } },
    { path: '/qrcode', name: 'qrcode', component: QRcode, meta: { requiresAuth: true } },
    { path: '/task-search', name: 'tasksearch', component: TaskSearch, meta: { requiresAuth: true } },
    { path: '/chat/:name', name: 'chat', component: Chat, meta: { requiresAuth: true } },
    { path: '/chatarchiv', name: 'chatarchiv', component: ChatArchiv, meta: { requiresAuth: true } },
    { path: '/community', name: 'community', component: Community, meta: { requiresAuth: true } },
    { path: '/login', name: 'login', component: Login },
    { path: '/registry', name: 'registry', component: Registry },
    { path: '/onboarding', name: 'onboarding', component: Onboarding },
    { path: '/profile', name: 'profile', component: Profile, meta: { requiresAuth: true } },
    { path: '/tasks', name: 'tasks', component: Tasks, meta: { requiresAuth: true } },
    { path: '/task/:itemId', name: 'task', component: TaskDetails, meta: { requiresAuth: true }, props: true },
    { path: '/verification/:itemId', name: 'verification', component: VerificationDetail, meta: { requiresAuth: true }, props: true },
    { path: '/review-verification/:itemId', name: 'reviewverification', component: ReviewVerification, meta: { requiresAuth: true }, props: true },
    { path: '/orgDetail/:organisationId', name: 'orgDetail', component: OrganisationDetail, meta: { requiresAuth: true }, props: true },
    { path: '/my-verifications', name: 'myverifications', component: MyVerifications, meta: { requiresAuth: true } },
    { path: '/review-requests', name: 'reviewrequests', component: ReviewRequests, meta: { requiresAuth: true } },
    { path: '/organisation', name: 'organisation', component: Organisation, meta: { requiresAuth: true } },
    { path: '/addtask', name: 'addtask', component: AddTask, meta: { requiresAuth: true } },
    { path: '/my-community', name: 'mycommunity', component: MyCommunity, meta: { requiresAuth: true, role: 'volunteer' } },
    { path: '/org-community', name: 'orgcommunity', component: OrgCommunity, meta: { requiresAuth: true, role: 'admin' } },
    { path: '/settings', name: 'settings', component: () => import('@/views/volunteer/Settings.vue'), meta: { requiresAuth: true, role: 'volunteer' } },
    {
        path: '/registry-org',
        name: 'registry-org',
        component: OrgRegistration
    },
    {
        path: '/organisation-search',
        name: 'OrganisationSearch',
        component: OrganisationSearch
    }

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
  const userRole = localStorage.getItem('userRole') || 'volunteer';

  // special handling for profile route: admins should see organisation view
  if (to.name === 'profile' && userRole === 'admin') {
    next({ name: 'organisation' });
    return;
  }
if (to.meta.role && to.meta.role !== userRole) {
    
    // If they don't match, redirect them to their correct safe space!
    if (userRole === 'admin') {
      return next('/org-community'); 
    } else {
      return next('/my-community'); 
    }
  }
  if (to.meta.requiresAuth && !isAuthenticated) {
    next('/login'); // Redirect if not logged in
  } else if (to.meta.role && userRole !== to.meta.role) {
    next('/'); // Redirect if wrong role
  } else if (to.name === "login" && isAuthenticated) {
    next('/')
  } else {
    next();
  }
});

export default router;
