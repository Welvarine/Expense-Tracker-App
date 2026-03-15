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
  
  showToast('✅ Account created and verified!')
  router.push(auth.isAdmin ? '/admin' : '/dashboard')
}
</script>

<template>
  <div class="screen text-center verify-screen">
    <div class="empty-state">
      <div class="icon">📧</div>
      <h2 class="header-title">
        <span>Verify Your Email</span>
      </h2>
      <p class="description">We've "sent" a verification link to <b>{{ auth.currentUser?.email }}</b>.</p>
      <p class="instruction">Click the button below to complete verification:</p>
    </div>

    <div class="actions-container">
      <AppButton @click="verify" :loading="loading" class="btn-primary">
        <span>🚀</span> Verify & Continue
      </AppButton>
      <AppButton @click="showToast('Resent email (simulated)'); " class="btn-secondary">
        <span>📬</span> Resend Email
      </AppButton>
    </div>
  </div>
</template>

<style scoped>
.verify-screen {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 32px;
  max-width: 500px;
  margin: 0 auto;
  padding: 40px 20px;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  text-align: center;
  padding: 40px 20px;
}

.icon {
  font-size: 72px;
  line-height: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: bounce 2s infinite;
}

@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}

.header-title {
  font-size: 32px;
  font-weight: 700;
  color: var(--text);
  margin: 0;
}

.description {
  font-size: 14px;
  color: var(--text2);
  margin: 0;
  line-height: 1.6;
}

.description b {
  font-weight: 700;
  color: var(--blue);
}

.instruction {
  font-size: 13px;
  color: var(--text2);
  margin: 8px 0 0 0;
  font-style: italic;
}

.actions-container {
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
}

.actions-container :deep(.btn) {
  font-size: 14px;
  padding: 12px 20px;
  border-radius: 10px;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}
</style>