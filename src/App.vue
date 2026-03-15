<script setup>
import { onMounted, watch } from 'vue'
import { RouterView, useRouter } from 'vue-router'
import { useAuthStore } from './stores/useAuthStore.js'
import { useToast } from './composables/useToast.js'
import AppToast from './components/AppToast.vue'
import SidebarNav from './components/SidebarNav.vue'

const auth = useAuthStore()
const router = useRouter()
const { toasts } = useToast()

// ── Dark mode ─────────────────────────────────────────────────────────
function applyTheme(dark) {
  document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light')
  localStorage.setItem('et_dark', JSON.stringify(dark))
}
const savedDark = JSON.parse(localStorage.getItem('et_dark') ?? 'false')
applyTheme(savedDark)

// Expose toggle to descendants via provide
import { ref, provide } from 'vue'
const isDark = ref(savedDark)
function toggleTheme() {
  isDark.value = !isDark.value
  applyTheme(isDark.value)
}
provide('isDark', isDark)
provide('toggleTheme', toggleTheme)
</script>

<template>
  <div class="app-container">
    <!-- Toast layer -->
    <AppToast :toasts="toasts" />

    <!-- Sidebar (only when authenticated) -->
    <SidebarNav v-if="auth.isAuthenticated" />

    <!-- Main content area -->
    <div class="main-content" :class="{ 'with-sidebar': auth.isAuthenticated }">
      <RouterView v-slot="{ Component, route }">
        <Transition name="fade" mode="out-in">
          <component :is="Component" :key="route.name" />
        </Transition>
      </RouterView>
    </div>
  </div>
</template>

<style scoped>
.app-container {
  display: flex;
  min-height: 100vh;
  background: var(--bg);
}

.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.main-content.with-sidebar {
  margin-left: 280px;
}

@media (max-width: 768px) {
  .main-content.with-sidebar {
    margin-left: 240px;
  }
}

@media (max-width: 480px) {
  .main-content.with-sidebar {
    margin-left: 0;
  }

  .app-container {
    flex-direction: column;
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
