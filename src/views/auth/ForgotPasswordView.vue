<script setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../../stores/useAuthStore.js'
import { useFormValidation } from '../../composables/useFormValidation.js'
import { isRequired, isValidEmail, isStrongPassword } from '../../utils/validators.js'
import { useToast } from '../../composables/useToast.js'
import AppInput from '../../components/AppInput.vue'
import AppButton from '../../components/AppButton.vue'

const auth = useAuthStore()
const router = useRouter()
const { showToast } = useToast()

const step = ref(1)
const loading = ref(false)

const form = reactive({ email: '', newPassword: '' })

const valStep1 = useFormValidation({ email: [isRequired, isValidEmail] })
const valStep2 = useFormValidation({ newPassword: [isRequired, isStrongPassword] })

async function sendResetLink() {
  if (!valStep1.validate(form)) return
  loading.value = true
  await new Promise(r => setTimeout(r, 600))
  loading.value = false

  const res = auth.sendResetEmail(form.email)
  if (res.ok) {
    showToast('✅ Reset link sent to your email.')
    step.value = 2
  } else {
    showToast(res.error, 'error')
  }
}

async function setNewPassword() {
  if (!valStep2.validate(form)) return
  loading.value = true
  await new Promise(r => setTimeout(r, 600))
  loading.value = false

  const res = auth.setNewPassword(form.email, form.newPassword)
  if (res.ok) {
    showToast('✅ Password reset successful. Please log in.')
    router.push('/login')
  } else {
    showToast(res.error, 'error')
  }
}
</script>

<template>
  <div class="screen forgot-screen">
    <button class="back-btn" @click="router.push('/login')">← Back to login</button>
    
    <h2 class="header-title">
      <span class="header-icon">🔄</span>
      Reset Password
    </h2>
    <p class="header-subtitle" v-if="step === 1">Enter your email to receive a reset link.</p>
    <p class="header-subtitle" v-else>Set your new password below.</p>

    <!-- Step 1: Request reset -->
    <form v-if="step === 1" @submit.prevent="sendResetLink" class="reset-form">
      <div class="form-group">
        <label class="form-label">
          <span class="input-icon">📧</span>
          Email Address
        </label>
        <AppInput 
          type="email" 
          v-model="form.email" 
          :error="valStep1.errors.email" 
          placeholder="Enter your registered email"
        />
      </div>
      <AppButton type="submit" class="mt-4" :loading="loading">
        <span>✉️</span> Send Reset Link
      </AppButton>
    </form>

    <!-- Step 2: Set new password -->
    <form v-else @submit.prevent="setNewPassword" class="reset-form">
      <div class="info-card card p-3 text-xs mb-2">
        <span class="info-icon">✅</span>
        <div>You clicked the reset link in your email.</div>
      </div>
      <div class="form-group">
        <label class="form-label">
          <span class="input-icon">🔑</span>
          New Password
        </label>
        <AppInput 
          type="password" 
          v-model="form.newPassword" 
          :error="valStep2.errors.newPassword" 
          placeholder="Min. 8 characters"
        />
      </div>
      <AppButton type="submit" class="mt-4" :loading="loading">
        <span>💾</span> Save New Password
      </AppButton>
    </form>
  </div>
</template>

<style scoped>
.forgot-screen {
  max-width: 500px;
  margin: 0 auto;
  padding: 40px 20px;
}

.back-btn {
  background: none;
  border: none;
  color: var(--text2);
  cursor: pointer;
  font-size: 14px;
  margin-bottom: 16px;
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

.reset-form {
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

.info-card {
  background: rgba(16, 185, 129, 0.1);
  border: 1.5px solid var(--green);
  color: var(--green-dark);
  display: flex;
  gap: 10px;
  align-items: flex-start;
}

.info-icon {
  flex-shrink: 0;
  font-size: 16px;
  margin-top: 2px;
}

[data-theme="dark"] .info-card {
  background: rgba(16, 185, 129, 0.1);
  border-color: var(--green);
}

.p-3 {
  padding: 12px;
}

.mb-2 {
  margin-bottom: 8px;
}

.mt-4 {
  margin-top: 16px;
}
</style>