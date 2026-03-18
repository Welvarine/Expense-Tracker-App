<script setup>
import { reactive, ref, inject } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../../stores/useAuthStore.js'
import { useFormValidation } from '../../composables/useFormValidation.js'
import { isRequired, isValidEmail, isStrongPassword } from '../../utils/validators.js'
import AppInput from '../../components/AppInput.vue'
import AppButton from '../../components/AppButton.vue'

const auth = useAuthStore()
const router = useRouter()
const isDark = inject('isDark')
const toggleTheme = inject('toggleTheme')
const loading = ref(false)
const topError = ref('')

const form = reactive({
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
  role: 'user'
})

// Custom validator for confirm password
const isMatchPassword = (value) => {
  if (!value) return 'Please confirm your password'
  if (value !== form.password) return 'Passwords do not match'
  return ''
}

const { errors, validate } = useFormValidation({
  name: [isRequired],
  email: [isRequired, isValidEmail],
  password: [isRequired, isStrongPassword],
  confirmPassword: [isMatchPassword]
})

const roleOptions = [
  { value: 'user', label: '👤 Regular User' },
  { value: 'admin', label: '👨‍💼 Admin' }
]

async function submit() {
  topError.value = ''
  
  // Clean all fields first
  const isValid = validate(form)
  if (!isValid) {
    topError.value = 'Please fix the errors below to continue.'
    return
  }

  loading.value = true
  await new Promise(r => setTimeout(r, 600))
  
  const res = auth.signup({ ...form })
  loading.value = false

  if (res.ok) {
    router.push('/verify-email')
  } else {
    topError.value = res.error
  }
}
</script>

<template>
  <div class="screen signup-screen">
    <!-- Theme Toggle -->
    <button class="theme-toggle-btn" @click="toggleTheme" :title="isDark ? 'Light Mode' : 'Dark Mode'" aria-label="Toggle dark mode">
      {{ isDark ? '☀️' : '🌙' }}
    </button>

    <div class="signup-header">
      <button class="back-btn" @click="router.push('/')" aria-label="Go back to home">
        ← Back to Home
      </button>
      <h2 class="header-title">
        <span class="header-icon">✨</span>
        Create Account
      </h2>
      <p class="header-subtitle">Join to start tracking expenses.</p>
    </div>

    <div v-if="topError" class="error-alert card mt-4 mb-2 p-3">
      <span class="error-icon">⚠️</span>
      <span class="error-text">{{ topError }}</span>
    </div>

    <form @submit.prevent="submit" class="signup-form" novalidate>
      <div class="form-group">
        <label class="form-label" for="signup-name">
          <span class="input-icon" aria-hidden="true">👤</span>
          Full Name
        </label>
        <AppInput 
          id="signup-name"
          v-model="form.name" 
          :error="errors.name" 
          placeholder="" 
        />
      </div>
      
      <div class="form-group">
        <label class="form-label" for="signup-email">
          <span class="input-icon" aria-hidden="true">📧</span>
          Email Address
        </label>
        <AppInput 
          id="signup-email"
          type="email" 
          v-model="form.email" 
          :error="errors.email" 
          placeholder="" 
        />
      </div>
      
      <div class="form-group">
        <label class="form-label" for="signup-password">
          <span class="input-icon" aria-hidden="true">🔑</span>
          Password
        </label>
        <AppInput 
          id="signup-password"
          type="password" 
          v-model="form.password" 
          :error="errors.password" 
          placeholder="Min. 8 characters" 
        />
      </div>

      <div class="form-group">
        <label class="form-label" for="signup-confirm-password">
          <span class="input-icon" aria-hidden="true">🔒</span>
          Confirm Password
        </label>
        <AppInput 
          id="signup-confirm-password"
          type="password" 
          v-model="form.confirmPassword" 
          :error="errors.confirmPassword" 
          placeholder="Re-enter password" 
        />
      </div>

      <div class="form-group">
        <label class="form-label" for="signup-role">
          <span class="input-icon" aria-hidden="true">🎯</span>
          Account Role
        </label>
        <AppInput 
          id="signup-role"
          type="select" 
          v-model="form.role" 
          :options="roleOptions" 
        />
      </div>

      <AppButton type="submit" class="mt-4" :loading="loading">
        <span>🚀</span> Sign Up
      </AppButton>
    </form>

    <div class="login-prompt">
      <span class="text-muted">Already have an account?</span>
      <button class="login-link" @click="router.push('/login')">Log In</button>
    </div>
  </div>
</template>

<style scoped>
.signup-screen {
  max-width: 500px;
  margin: 0 auto;
  padding: 40px 20px;
  position: relative;
}

.theme-toggle-btn {
  position: fixed;
  top: 20px;
  right: 20px;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  border: 1.5px solid var(--border);
  background: var(--surface);
  color: var(--text);
  font-size: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  z-index: 50;
}

.theme-toggle-btn:hover {
  transform: scale(1.1);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  border-color: var(--blue);
  background: var(--blue-dim);
}

.signup-header {
  padding-bottom: 16px;
}

.back-btn {
  background: none;
  border: none;
  color: var(--text2);
  cursor: pointer;
  font-size: 14px;
  margin-bottom: 12px;
  padding: 0;
  transition: color 0.2s;
  font-weight: 600;
}

.back-btn:hover {
  color: var(--blue);
}

.header-title {
  font-size: 32px;
  font-weight: 700;
  color: var(--text);
  margin: 12px 0;
  display: flex;
  align-items: center;
  gap: 8px;
}

.header-icon {
  font-size: 28px;
}

.header-subtitle {
  font-size: 14px;
  color: var(--text2);
  margin: 4px 0 0 0;
}

.error-alert {
  background: rgba(239, 68, 68, 0.1);
  border: 1.5px solid var(--red);
  border-radius: 8px;
  padding: 12px;
  display: flex;
  gap: 10px;
  align-items: center;
}

.error-icon {
  flex-shrink: 0;
  font-size: 18px;
}

.error-text {
  color: var(--red);
  font-size: 13px;
  font-weight: 600;
}

[data-theme="dark"] .error-alert {
  background: rgba(239, 68, 68, 0.1);
  border-color: var(--red);
}

.signup-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-top: 32px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-label {
  font-size: 13px;
  font-weight: 600;
  color: var(--text);
  display: flex;
  align-items: center;
  gap: 6px;
}

.input-icon {
  font-size: 16px;
}

.login-prompt {
  text-align: center;
  margin-top: 24px;
  font-size: 14px;
}

.login-link {
  background: none;
  border: none;
  color: var(--blue-dark);
  cursor: pointer;
  font-weight: 600;
  padding: 0;
  margin-left: 4px;
  transition: opacity 0.2s;
}

.login-link:hover {
  opacity: 0.8;
  text-decoration: underline;
}

.mb-2 {
  margin-bottom: 8px;
}

.mt-4 {
  margin-top: 16px;
}

.text-muted {
  color: var(--text2);
}

.p-3 {
  padding: 12px;
}
</style>