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

const step = ref(1) // 1 = email, 2 = new password
const loading = ref(false)

const form = reactive({ email: '', newPassword: '' })

// Validation for Step 1
const valStep1 = useFormValidation({ email: [isRequired, isValidEmail] })
// Validation for Step 2
const valStep2 = useFormValidation({ newPassword: [isRequired, isStrongPassword] })

async function sendResetLink() {
  if (!valStep1.validate(form)) return
  loading.value = true
  await new Promise(r => setTimeout(r, 600))
  loading.value = false

  const res = auth.sendResetEmail(form.email)
  if (res.ok) {
    showToast('Reset link sent to your email.')
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
    showToast('Password reset successful. Please log in.')
    router.push('/login')
  } else {
    showToast(res.error, 'error')
  }
}
</script>

<template>
  <div class="screen">
    <button class="btn-ghost p-0 text-muted mb-4" @click="router.push('/login')">← Back to login</button>
    
    <h2 class="font-bold">Reset Password</h2>
    <p class="text-sm text-muted mt-1" v-if="step === 1">Enter your email to receive a reset link.</p>
    <p class="text-sm text-muted mt-1" v-else>Set your new password below.</p>

    <!-- Step 1: Request reset -->
    <form v-if="step === 1" @submit.prevent="sendResetLink" class="mt-6 flex flex-col gap-4">
      <AppInput 
        label="Email Address" 
        type="email" 
        v-model="form.email" 
        :error="valStep1.errors.email" 
        placeholder="Enter your registered email"
      />
      <AppButton type="submit" class="mt-4" :loading="loading">
        Send Reset Link
      </AppButton>
    </form>

    <!-- Step 2: Set new password (Simulated flow) -->
    <form v-else @submit.prevent="setNewPassword" class="mt-6 flex flex-col gap-4">
      <div class="card bg-green-dim text-green-dark border-green p-3 text-xs mb-2">
        <b>Simulation:</b> You clicked the reset link in your email.
      </div>
      <AppInput 
        label="New Password" 
        type="password" 
        v-model="form.newPassword" 
        :error="valStep2.errors.newPassword" 
        placeholder="Min. 8 characters"
      />
      <AppButton type="submit" class="mt-4" :loading="loading">
        Save New Password
      </AppButton>
    </form>
  </div>
</template>

<style scoped>
.bg-green-dim { background: var(--green-dim); }
.border-green { border-color: var(--green); }
</style>
