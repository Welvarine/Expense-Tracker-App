<script setup>
import { useAuthStore } from '../stores/useAuthStore.js'
import { useRouter, useRoute } from 'vue-router'
import { inject } from 'vue'

const auth   = useAuthStore()
const router = useRouter()
const route  = useRoute()
const isDark = inject('isDark')
const toggleTheme = inject('toggleTheme')

const userLinks = [
  { name: 'dashboard',    icon: '🏠', label: 'Dashboard' },
  { name: 'add',         icon: '➕', label: 'Add' },
  { name: 'transactions', icon: '📋', label: 'Transactions' },
]
const adminLinks = [
  { name: 'admin',              icon: '📊', label: 'Overview' },
  { name: 'admin-users',        icon: '👥', label: 'Users' },
  { name: 'admin-transactions', icon: '💳', label: 'All Txns' },
]

const links = auth.isAdmin ? adminLinks : userLinks
const active = (name) => route.name === name
</script>

<template>
  <nav class="bottom-nav">
    <button
      v-for="link in links"
      :key="link.name"
      class="nav-item"
      :class="{ active: active(link.name) }"
      @click="router.push({ name: link.name })"
    >
      <span class="nav-icon">{{ link.icon }}</span>
      <span class="nav-label">{{ link.label }}</span>
    </button>

    <button class="nav-item" @click="toggleTheme">
      <span class="nav-icon">{{ isDark ? '☀️' : '🌙' }}</span>
      <span class="nav-label">{{ isDark ? 'Light' : 'Dark' }}</span>
    </button>

    <button class="nav-item logout" @click="auth.logout(); router.push({ name: 'welcome' })">
      <span class="nav-icon">🚪</span>
      <span class="nav-label">Logout</span>
    </button>
  </nav>
</template>

<style scoped>
.bottom-nav {
  position: absolute; bottom: 0; left: 0; right: 0;
  background: var(--surface);
  border-top: 1px solid var(--border);
  display: flex; align-items: center;
  padding: 6px 4px;
  gap: 2px;
  z-index: 50;
}
.nav-item {
  flex: 1;
  display: flex; flex-direction: column; align-items: center; gap: 2px;
  padding: 6px 4px;
  border: none; background: none; cursor: pointer;
  color: var(--text2);
  border-radius: var(--radius-sm);
  transition: all var(--transition);
}
.nav-item:hover { background: var(--surface2); }
.nav-item.active { color: var(--green-dark); }
.nav-item.logout { color: var(--red); }
.nav-icon  { font-size: 18px; }
.nav-label { font-size: 10px; font-weight: 600; font-family: var(--font); }
</style>
