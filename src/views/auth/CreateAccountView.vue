<script setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../../stores/useAuthStore.js'
import { useFormValidation } from '../../composables/useFormValidation.js'
import { isRequired, isValidEmail, isStrongPassword } from '../../utils/validators.js'
import AppInput from '../../components/AppInput.vue'
import AppButton from '../../components/AppButton.vue'

const auth = useAuthStore()
const router = useRouter()
const loading = ref(false)
const topError = ref('')

const form = reactive({
  name: '',
  email: '',
  password: '',
  role: 'user'
})

const { errors, validate } = useFormValidation({
  name: [isRequired],
  email: [isRequired, isValidEmail],
  password: [isRequired, isStrongPassword]
})

const roleOptions = [
  { value: 'user', label: 'Regular User' },
  { value: 'admin', label: 'Admin' }
]

async function submit() {
  topError.value = ''
  if (!validate(form)) return

  loading.value = true
  // Fake network delay
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
  <div class="screen">
    <h2 class="font-bold">Create Account</h2>
    <p class="text-sm text-muted mt-1">Join to start tracking expenses.</p>

    <div v-if="topError" class="card variant-expense mt-4 mb-2 p-3 text-red text-sm font-bold border-red">
      {{ topError }}
    </div>

    <form @submit.prevent="submit" class="mt-6 flex flex-col gap-4">
      <AppInput 
        label="Full Name" 
        v-model="form.name" 
        :error="errors.name" 
        placeholder="John Doe" 
      />
      
      <AppInput 
        label="Email Address" 
        type="email" 
        v-model="form.email" 
        :error="errors.email" 
        placeholder="john@example.com" 
      />
      
      <AppInput 
        label="Password" 
        type="password" 
        v-model="form.password" 
        :error="errors.password" 
        placeholder="Min. 8 characters" 
      />

      <AppInput 
        label="Account Role" 
        type="select" 
        v-model="form.role" 
        :options="roleOptions" 
      />

      <AppButton type="submit" class="mt-4" :loading="loading">
        Sign Up
      </AppButton>
    </form>

    <div class="mt-6 text-center text-sm">
      <span class="text-muted">Already have an account?</span>
      <button class="btn-ghost text-green" @click="router.push('/login')">Log In</button>
    </div>
  </div>
</template>

<style scoped>
.border-red { border-color: var(--red); }
</style>
