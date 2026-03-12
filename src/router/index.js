import { createRouter, createWebHashHistory } from 'vue-router'
import { useAuthStore } from '../stores/useAuthStore.js'

const routes = [
  // ── Public ────────────────────────────────────────────────────────
  { path: '/',                 name: 'welcome',        component: () => import('../views/auth/WelcomeView.vue') },
  { path: '/signup',           name: 'signup',         component: () => import('../views/auth/CreateAccountView.vue') },
  { path: '/login',            name: 'login',          component: () => import('../views/auth/LoginView.vue') },
  { path: '/verify-email',     name: 'verify-email',   component: () => import('../views/auth/VerifyEmailView.vue') },
  { path: '/forgot-password',  name: 'forgot-password',component: () => import('../views/auth/ForgotPasswordView.vue') },

  // ── User ──────────────────────────────────────────────────────────
  { path: '/dashboard',      name: 'dashboard',     component: () => import('../views/user/DashboardView.vue'),     meta: { requiresAuth: true, role: 'user' } },
  { path: '/add',            name: 'add',            component: () => import('../views/user/AddTransactionView.vue'), meta: { requiresAuth: true, role: 'user' } },
  { path: '/edit/:id',       name: 'edit',           component: () => import('../views/user/EditTransactionView.vue'), meta: { requiresAuth: true, role: 'user' } },
  { path: '/transactions',   name: 'transactions',   component: () => import('../views/user/TransactionsView.vue'),  meta: { requiresAuth: true, role: 'user' } },
  { path: '/budgets',        name: 'budgets',        component: () => import('../views/user/BudgetsView.vue'),       meta: { requiresAuth: true, role: 'user' } },

  // ── Admin ─────────────────────────────────────────────────────────
  { path: '/admin',               name: 'admin',              component: () => import('../views/admin/AdminDashboardView.vue'),    meta: { requiresAuth: true, role: 'admin' } },
  { path: '/admin/users',         name: 'admin-users',        component: () => import('../views/admin/AdminUsersView.vue'),        meta: { requiresAuth: true, role: 'admin' } },
  { path: '/admin/transactions',  name: 'admin-transactions', component: () => import('../views/admin/AdminTransactionsView.vue'), meta: { requiresAuth: true, role: 'admin' } },

  // Catch-all
  { path: '/:pathMatch(.*)*', redirect: '/' }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
  scrollBehavior: () => ({ top: 0 })
})

router.beforeEach((to) => {
  const auth = useAuthStore()

  if (to.meta.requiresAuth && !auth.isAuthenticated) return { name: 'welcome' }

  if (auth.isAuthenticated) {
    // Redirect away from public pages
    if (['welcome','login','signup','forgot-password'].includes(to.name) && !to.name.includes('verify')) {
      return auth.isAdmin ? { name: 'admin' } : { name: 'dashboard' }
    }
    // Role guard
    if (to.meta.role && to.meta.role !== auth.currentUser?.role) {
      return auth.isAdmin ? { name: 'admin' } : { name: 'dashboard' }
    }
  }
})

export default router
