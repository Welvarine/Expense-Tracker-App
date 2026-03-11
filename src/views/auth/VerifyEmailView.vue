<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../../stores/useAuthStore.js'
import { useToast } from '../../composables/useToast.js'
import AppButton from '../../components/AppButton.vue'

const auth = useAuthStore()
const router = useRouter()
const { showToast } = useToast()
const loading = ref(false)

async function verify() {
  loading.value = true
  await new Promise(r => setTimeout(r, 800))
  auth.verifyEmail()
  loading.value = false
  
  showToast('Account created and verified!')
  router.push(auth.isAdmin ? '/admin' : '/dashboard')
}
</script>

<template>
  <div class="screen text-center justify-center">
    <div class="empty-state">
      <div class="icon">📧</div>
      <h2 class="font-bold">Verify Your Email</h2>
      <p class="text-sm">We've "sent" a verification link to <b>{{ auth.currentUser?.email }}</b>.</p>
    </div>

    <div class="flex flex-col gap-3 w-full mt-6">
      <AppButton @click="verify" :loading="loading">
        Simulate click link in email 🚀
      </AppButton>
      <AppButton variant="secondary" @click="showToast('Resent email (simulated)');">
        Resend Email
      </AppButton>
    </div>
  </div>
</template>
