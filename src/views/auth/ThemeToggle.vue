<script setup>
import { ref, onMounted } from 'vue'

const isDarkMode = ref(false)

onMounted(() => {
  // Check system preference or localStorage
  const savedTheme = localStorage.getItem('theme')
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
  const theme = savedTheme || (prefersDark ? 'dark' : 'light')
  
  isDarkMode.value = theme === 'dark'
  document.documentElement.setAttribute('data-theme', theme)
})

function toggleTheme() {
  isDarkMode.value = !isDarkMode.value
  const theme = isDarkMode.value ? 'dark' : 'light'
  document.documentElement.setAttribute('data-theme', theme)
  localStorage.setItem('theme', theme)
}
</script>

<template>
  <button 
    class="theme-toggle" 
    @click="toggleTheme" 
    :title="isDarkMode ? '☀️ Switch to Light Mode' : '🌙 Switch to Dark Mode'"
  >
    <span class="toggle-icon">{{ isDarkMode ? '☀️' : '🌙' }}</span>
  </button>
</template>

<style scoped>
.theme-toggle {
  position: fixed;
  top: 16px;
  right: 16px;
  z-index: 1000;
  background: var(--surface);
  border: 2px solid var(--border);
  border-radius: 12px;
  padding: 10px 12px;
  cursor: pointer;
  font-size: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 50px;
  height: 50px;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  font-weight: 600;
}

.theme-toggle:hover {
  transform: scale(1.1);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
  border-color: var(--blue);
}

.theme-toggle:active {
  transform: scale(0.95);
}

.toggle-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  animation: spin 0.3s ease-in-out;
}

@keyframes spin {
  0% { transform: rotate(-180deg); opacity: 0; }
  100% { transform: rotate(0); opacity: 1; }
}
</style>