<script setup>
import { onMounted, watch } from 'vue'
import { RouterView, useRouter } from 'vue-router'
import { useAuthStore } from './stores/useAuthStore.js'
import { useToast } from './composables/useToast.js'
import AppToast from './components/AppToast.vue'
import BottomNav from './components/BottomNav.vue'

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
  <div class="phone-shell">
    <div class="phone-inner">
      <!-- Toast layer -->
      <AppToast :toasts="toasts" />

      <RouterView v-slot="{ Component, route }">
        <Transition name="fade" mode="out-in">
          <component :is="Component" :key="route.name" />
        </Transition>
      </RouterView>

      <!-- Bottom Nav (only when authenticated) -->
      <BottomNav v-if="auth.isAuthenticated" />
    </div>
  </div>
</template>
