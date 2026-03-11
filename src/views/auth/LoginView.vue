<script setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../../stores/useAuthStore.js'
import { useFormValidation } from '../../composables/useFormValidation.js'
import { isRequired, isValidEmail } from '../../utils/validators.js'
import AppInput from '../../components/AppInput.vue'
import AppButton from '../../components/AppButton.vue'
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
  <div class="screen">
    <h2 class="font-bold">Welcome Back</h2>
    <p class="text-sm text-muted mt-1">Log in to your account.</p>

    <!-- Pre-filled info helper for demo -->
    <div class="card bg-blue-dim border-blue mt-4 p-3 text-xs">
      <b>Demo Accounts:</b><br>
      Admin: admin@expense.app / Admin123!<br>
      User: user@expense.app / User123!
    </div>

    <form @submit.prevent="submit" class="mt-6 flex flex-col gap-4">
      <AppInput 
        label="Email" 
        type="email" 
        v-model="form.email" 
        :error="errors.email" 
      />
      <AppInput 
        label="Password" 
        type="password" 
        v-model="form.password" 
        :error="errors.password" 
      />

      <div class="flex justify-between items-center mt-1 text-sm">
        <label class="flex items-center gap-2">
          <input type="checkbox"> Remember me
        </label>
        <button type="button" class="btn-ghost text-blue font-bold p-0" @click="router.push('/forgot-password')">
          Forgot Password?
        </button>
      </div>

      <AppButton type="submit" class="mt-4" :loading="loading">
        Log In
      </AppButton>
    </form>

    <div class="mt-8 text-center text-sm">
      <span class="text-muted">Don't have an account?</span>
      <button class="btn-ghost text-green" @click="router.push('/signup')">Sign Up</button>
    </div>
  </div>
</template>

<style scoped>
.bg-blue-dim { background: var(--blue-dim); }
.border-blue { border-color: var(--blue); }
</style>
