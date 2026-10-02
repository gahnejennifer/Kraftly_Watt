import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '../views/LoginView.vue'
import DashboardView from '../views/DashboardView.vue'
import InvoicesView from '../views/InvoicesView.vue'
import MoveFormView from '../views/MoveFormView.vue'
import ProfileView from '../views/ProfileView.vue'
import { getAccessToken, setAccessToken } from '../services/token'
import { refresh } from '../services/api'

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

// Försök återställa sessionen EN gång vid appstart (ny access token via
// refresh-cookien). Memoiseras så det bara blir ett anrop.
let restorePromise = null
const restoreSession = () => {
  if (!restorePromise) {
    restorePromise = refresh()
      .then(({ accessToken }) => setAccessToken(accessToken))
      .catch(() => {})
  }
  return restorePromise
}

// Guarden är UX: den skickar utloggade till /login. Det riktiga skyddet sitter
// i API:t (v2 svarar 401 utan giltig token). Guarden väntar på restoreSession
// så att en omladdning hinner hämta en ny token innan den beslutar.
router.beforeEach(async (to) => {
  await restoreSession()
  if (to.path !== '/login' && !getAccessToken()) {
    return '/login'
  }
})

export default router
