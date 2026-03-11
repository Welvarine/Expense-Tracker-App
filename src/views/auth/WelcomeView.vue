<script setup>
import { useRouter } from 'vue-router'
import AppButton from '../../components/AppButton.vue'

const router = useRouter()
</script>

<template>
  <div class="screen welcome-screen">
    <div class="logo-hero">
      <div class="logo-icon">💰</div>
      <h1>Expense<br>Tracker</h1>
      <p class="mt-2 text-muted">Take control of your money, one transaction at a time.</p>
    </div>

    <div class="actions">
      <AppButton @click="router.push('/signup')">Create Account</AppButton>
      <AppButton variant="secondary" @click="router.push('/login')">Log in</AppButton>
    </div>
  </div>
</template>

<style scoped>
.welcome-screen {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 40px 24px 60px;
}
.logo-hero {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
}
.logo-icon {
  font-size: 72px;
  line-height: 1;
  margin-bottom: 24px;
  animation: bounceIn 0.8s cubic-bezier(0.16, 1, 0.3, 1);
}
@keyframes bounceIn {
  0%   { transform: scale(0.5); opacity: 0; }
  60%  { transform: scale(1.1); opacity: 1; }
  100% { transform: scale(1); }
}
.actions {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
</style>
