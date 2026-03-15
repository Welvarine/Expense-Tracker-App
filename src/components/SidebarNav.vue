<script setup>
import { useAuthStore } from '../stores/useAuthStore.js'
import { useRouter, useRoute } from 'vue-router'
import { inject } from 'vue'

const auth = useAuthStore()
const router = useRouter()
const route = useRoute()
const isDark = inject('isDark')
const toggleTheme = inject('toggleTheme')

const userLinks = [
  { name: 'dashboard', icon: '🏠', label: 'Dashboard' },
  { name: 'income', icon: '💰', label: 'Income' },
  { name: 'add', icon: '➕', label: 'Add Transaction' },
  { name: 'transactions', icon: '📋', label: 'Transactions' },
  { name: 'budgets', icon: '🎯', label: 'Budgets' },
]

const adminLinks = [
  { name: 'admin', icon: '📊', label: 'Dashboard' },
  { name: 'admin-users', icon: '👥', label: 'Users' },
  { name: 'admin-transactions', icon: '💳', label: 'Transactions' },
]

const links = auth.isAdmin ? adminLinks : userLinks
const active = (name) => route.name === name
</script>

<template>
  <aside class="sidebar">
    <!-- Logo / Brand -->
    <div class="sidebar-header">
      <div class="logo">
        <span class="logo-icon">💼</span>
        <span class="logo-text">ExpenseTracker</span>
      </div>
    </div>

    <!-- Navigation Links -->
    <nav class="sidebar-nav">
      <button
        v-for="link in links"
        :key="link.name"
        class="nav-link"
        :class="{ active: active(link.name) }"
        @click="router.push({ name: link.name })"
        :title="link.label"
      >
        <span class="nav-icon">{{ link.icon }}</span>
        <span class="nav-label">{{ link.label }}</span>
      </button>
    </nav>

    <!-- Sidebar Footer -->
    <div class="sidebar-footer">
      <button class="footer-btn theme-btn" @click="toggleTheme" :title="isDark ? 'Light Mode' : 'Dark Mode'">
        <span class="btn-icon">{{ isDark ? '☀️' : '🌙' }}</span>
        <span class="btn-label">{{ isDark ? 'Light' : 'Dark' }}</span>
      </button>

      <button class="footer-btn logout-btn" @click="auth.logout(); router.push({ name: 'welcome' })" title="Logout">
        <span class="btn-icon">🚪</span>
        <span class="btn-label">Logout</span>
      </button>
    </div>
  </aside>
</template>

<style scoped>
.sidebar {
  width: 280px;
  background: var(--surface);
  border-right: 1.5px solid var(--border);
  display: flex;
  flex-direction: column;
  height: 100vh;
  position: fixed;
  left: 0;
  top: 0;
  z-index: 100;
  overflow-y: auto;
  box-shadow: 2px 0 8px rgba(0, 0, 0, 0.08);
}

.sidebar-header {
  padding: 24px 20px;
  border-bottom: 1.5px solid var(--border);
  display: flex;
  align-items: center;
  gap: 12px;
}

.logo {
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  transition: all 0.2s;
}

.logo:hover {
  transform: scale(1.02);
}

.logo-icon {
  font-size: 28px;
  line-height: 1;
}

.logo-text {
  font-size: 18px;
  font-weight: 800;
  color: var(--text);
  background: linear-gradient(135deg, var(--blue), var(--blue-dark));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.sidebar-nav {
  flex: 1;
  padding: 16px 12px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  overflow-y: auto;
}

.nav-link {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  border: none;
  background: transparent;
  color: var(--text2);
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s;
  font-family: var(--font);
  font-size: 14px;
  font-weight: 600;
  white-space: nowrap;
  text-align: left;
}

.nav-link:hover {
  background: var(--surface2);
  color: var(--blue);
  transform: translateX(4px);
}

.nav-link.active {
  background: linear-gradient(135deg, var(--blue-dim), var(--surface2));
  color: var(--blue);
  border-left: 3px solid var(--blue);
  padding-left: 13px;
  box-shadow: inset 0 0 12px rgba(14, 165, 233, 0.1);
}

.nav-icon {
  font-size: 20px;
  line-height: 1;
  flex-shrink: 0;
}

.nav-label {
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
}

.sidebar-footer {
  padding: 16px 12px;
  border-top: 1.5px solid var(--border);
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.footer-btn {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  border: 1.5px solid var(--border);
  background: var(--surface2);
  color: var(--text2);
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s;
  font-family: var(--font);
  font-size: 14px;
  font-weight: 600;
  white-space: nowrap;
}

.footer-btn:hover {
  border-color: var(--blue);
  background: var(--blue-dim);
  color: var(--blue);
  transform: translateY(-2px);
}

.theme-btn:hover {
  border-color: var(--amber);
  background: var(--amber-dim);
  color: var(--amber);
}

.logout-btn:hover {
  border-color: var(--red);
  background: var(--red-dim);
  color: var(--red);
}

.btn-icon {
  font-size: 18px;
  line-height: 1;
  flex-shrink: 0;
}

.btn-label {
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* Scrollbar styling */
.sidebar::-webkit-scrollbar {
  width: 6px;
}

.sidebar::-webkit-scrollbar-track {
  background: transparent;
}

.sidebar::-webkit-scrollbar-thumb {
  background: var(--border);
  border-radius: 3px;
}

.sidebar::-webkit-scrollbar-thumb:hover {
  background: var(--text2);
}

@media (max-width: 768px) {
  .sidebar {
    width: 240px;
  }

  .logo-text {
    display: none;
  }

  .nav-label,
  .btn-label {
    display: none;
  }

  .nav-link,
  .footer-btn {
    justify-content: center;
    padding: 12px;
  }

  .nav-link.active {
    border-left: none;
    border-bottom: 3px solid var(--blue);
    padding-left: 12px;
  }
}
</style>
