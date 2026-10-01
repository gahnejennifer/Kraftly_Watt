import { createRouter, createWebHistory } from 'vue-router'
// TODO: look into "lazy loading" at some point, ran out of time /M
import LoginView from '../views/LoginView.vue'
import DashboardView from '../views/DashboardView.vue'
import InvoicesView from '../views/InvoicesView.vue'
import MoveFormView from '../views/MoveFormView.vue'
import ProfileView from '../views/ProfileView.vue'
import { getAccessToken } from '../services/token'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/login', component: LoginView },
    { path: '/', component: DashboardView },
    { path: '/fakturor', component: InvoicesView },
    { path: '/flytt', component: MoveFormView },
    { path: '/profil', component: ProfileView },
  ],
})

// Guarden är UX: den skickar utloggade till /login så de slipper se en tom/trasig sida.
// Det riktiga skyddet sitter i API:t (v2 svarar 401 utan giltig token), inte här.
router.beforeEach((to) => {
  if (to.path !== '/login' && !getAccessToken()) {
    return '/login'
  }
})

export default router
