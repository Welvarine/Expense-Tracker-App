<script setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../../stores/useAuthStore.js'
import { useFormValidation } from '../../composables/useFormValidation.js'
import { isRequired, isValidEmail } from '../../utils/validators.js'
import AppInput from '../../components/AppInput.vue'
import AppButton from '../../components/AppButton.vue'
import ThemeToggle from './ThemeToggle.vue'
import { useToast } from '../../composables/useToast.js'

const auth = useAuthStore()
const router = useRouter()
const { showToast } = useToast()
const loading = ref(false)
const topError = ref('')

const form = reactive({ email: '', password: '' })
const { errors, validate } = useFormValidation({
  email: [isRequired, isValidEmail],
  password: [isRequired]
})

async function submit() {
  topError.value = ''
  if (!validate(form)) return

  loading.value = true
  await new Promise(r => setTimeout(r, 600))
  
  const res = auth.login({ ...form })
  loading.value = false

  if (res.ok) {
    if (!auth.currentUser.verified) {
      router.push('/verify-email')
    } else {
      router.push(auth.isAdmin ? '/admin' : '/dashboard')
    }
  } else {
    topError.value = res.error
    showToast(res.error, 'error')
  }
}
</script>

<template>
  <div class="screen login-screen">
    <ThemeToggle />
    <div class="login-header">
      <button class="back-btn" @click="router.push('/')">
        ← Back to Home
      </button>
      <h2 class="header-title">
        <span class="header-icon">🔐</span>
        Welcome Back
      </h2>
      <p class="header-subtitle">Log in to your account.</p>
    </div>

    <!-- Pre-filled info helper for demo -->
    <div class="card demo-info mt-4 p-3 text-xs">
      <span class="demo-icon">ℹ️</span>
      <div>
        <b>Demo Accounts:</b><br>
        Admin: <a href="/cdn-cgi/l/email-protection" class="__cf_email__" data-cfemail="fb9a9f969295bb9e838b9e95889ed59a8b8b">[email&#160;protected]</a> / Admin123!<br>
        User: <a href="/cdn-cgi/l/email-protection" class="__cf_email__" data-cfemail="562325332416332e263338253378372626">[email&#160;protected]</a> / User123!
      </div>
    </div>

    <form @submit.prevent="submit" class="login-form">
      <div class="form-group">
        <label class="form-label">
          <span class="input-icon">📧</span>
          Email
        </label>
        <AppInput 
          type="email" 
          v-model="form.email" 
          :error="errors.email"
          placeholder="your@email.com"
        />
      </div>

      <div class="form-group">
        <label class="form-label">
          <span class="input-icon">🔑</span>
          Password
        </label>
        <AppInput 
          type="password" 
          v-model="form.password" 
          :error="errors.password"
          placeholder="••••••••"
        />
      </div>

      <div class="form-footer">
        <label class="checkbox-label">
          <input type="checkbox"> Remember me
        </label>
        <button type="button" class="forgot-link" @click="router.push('/forgot-password')">
          Forgot Password?
        </button>
      </div>

      <AppButton type="submit" class="mt-4" :loading="loading">
        <span>🚀</span> Log In
      </AppButton>
    </form>

    <div class="signup-prompt">
      <span class="text-muted">Don't have an account?</span>
      <button class="signup-link" @click="router.push('/signup')">Sign Up Now</button>
    </div>
  </div>
</template>

<style scoped>
.login-screen {
  max-width: 400px;
  margin: 0 auto;
}

.login-header {
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
  font-size: 24px;
  font-weight: 700;
  color: var(--text);
  margin: 8px 0;
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

.demo-info {
  background: var(--blue-dim);
  border: 1.5px solid var(--blue);
  color: var(--blue-dark);
  display: flex;
  gap: 10px;
  align-items: flex-start;
}

.demo-icon {
  font-size: 16px;
  flex-shrink: 0;
  margin-top: 2px;
}

.demo-info a {
  color: var(--blue-dark);
  font-weight: 600;
  text-decoration: none;
}

[data-theme="dark"] .demo-info {
  background: rgba(96, 165, 250, 0.1);
  border-color: var(--blue);
  color: var(--text2);
}

[data-theme="dark"] .demo-info a {
  color: var(--text2);
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-top: 24px;
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

.form-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 13px;
  margin-top: 8px;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
  color: var(--text2);
  font-weight: 500;
}

.checkbox-label input[type="checkbox"] {
  cursor: pointer;
  accent-color: var(--blue);
  width: 16px;
  height: 16px;
}

.forgot-link {
  background: none;
  border: none;
  color: var(--blue);
  cursor: pointer;
  font-weight: 600;
  padding: 0;
  font-size: 13px;
  transition: opacity 0.2s;
}

.forgot-link:hover {
  opacity: 0.8;
  text-decoration: underline;
}

.signup-prompt {
  text-align: center;
  margin-top: 24px;
  font-size: 14px;
}

.signup-link {
  background: none;
  border: none;
  color: var(--blue);
  cursor: pointer;
  font-weight: 600;
  padding: 0;
  margin-left: 4px;
  transition: opacity 0.2s;
}

.signup-link:hover {
  opacity: 0.8;
  text-decoration: underline;
}

.p-3 {
  padding: 12px;
}

.mt-4 {
  margin-top: 16px;
}

.text-muted {
  color: var(--text2);
}
</style>