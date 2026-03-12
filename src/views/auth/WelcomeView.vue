<script setup>
import { useRouter } from 'vue-router'
import AppButton from '../../components/AppButton.vue'
import ThemeToggle from './ThemeToggle.vue'

const router = useRouter()
</script>

<template>
  <div class="screen welcome-screen">
    <ThemeToggle />
    <div class="welcome-header">
      <div class="brand-label">🔵 Expense Tracker</div>
      <h1 class="welcome-title">GEN'ET</h1>
    </div>

    <div class="flow-container">
      <div class="flow-step active">
        <div class="step-number">
          <span class="step-icon">👋</span>
        </div>
        <div class="step-label">WELCOME</div>
      </div>
      <div class="flow-line"></div>
      <div class="flow-step">
        <div class="step-number">
          <span class="step-icon">📝</span>
        </div>
        <div class="step-label">SIGNUP</div>
      </div>
      <div class="flow-line"></div>
      <div class="flow-step">
        <div class="step-number">
          <span class="step-icon">📊</span>
        </div>
        <div class="step-label">DASHBOARD</div>
      </div>
    </div>

    <div class="phone-mockup">
      <div class="phone-frame">
        <div class="phone-content">
          <div class="logo-icon">💰</div>
          <h2>EXPENSE<br>TRACKER</h2>
          <p class="tagline">Welcome!</p>
          <p class="subtitle">Welcome to your Expense Tracker</p>
        </div>

        <div class="actions">
          <AppButton @click="router.push('/login')" class="btn-primary">
            🔐 LOG IN
          </AppButton>
          <AppButton @click="router.push('/signup')" class="btn-secondary">
            ✨ CREATE ACCOUNT
          </AppButton>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.welcome-screen {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40px 24px;
  gap: 32px;
}

.welcome-header {
  text-align: center;
}

.brand-label {
  color: var(--blue);
  font-size: 14px;
  font-weight: 600;
  letter-spacing: 0.5px;
  margin-bottom: 8px;
}

.welcome-title {
  font-size: 32px;
  font-weight: 800;
  color: var(--text);
  margin: 0;
}

.flow-container {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  width: 100%;
  max-width: 600px;
  margin: 16px 0;
}

.flow-step {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  text-align: center;
  min-width: 80px;
}

.step-number {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  border: 2px solid var(--border);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  color: var(--text2);
  font-size: 18px;
  transition: all 0.3s ease;
  background: var(--surface2);
}

.step-icon {
  font-size: 22px;
  line-height: 1;
}

.flow-step.active .step-number {
  background: var(--blue);
  color: #fff;
  border-color: var(--blue);
  box-shadow: 0 4px 16px rgba(14, 165, 233, 0.3);
}

.step-label {
  font-size: 11px;
  font-weight: 700;
  color: var(--text2);
  letter-spacing: 0.5px;
  text-transform: uppercase;
}

.flow-line {
  width: 24px;
  height: 2px;
  background: var(--border);
  flex-shrink: 0;
}

.phone-mockup {
  display: flex;
  justify-content: center;
  margin-top: 24px;
}

.phone-frame {
  width: 280px;
  background: var(--surface);
  border-radius: 32px;
  border: 8px solid var(--border);
  padding: 20px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
  display: flex;
  flex-direction: column;
  gap: 20px;
  aspect-ratio: 9/16;
  justify-content: space-between;
}

.phone-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  flex: 1;
}

.logo-icon {
  font-size: 56px;
  line-height: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: float 3s ease-in-out infinite;
}

@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
}

.phone-content h2 {
  font-size: 20px;
  font-weight: 700;
  text-align: center;
  line-height: 1.2;
  color: var(--text);
  margin: 0;
  letter-spacing: 0.5px;
}

.tagline {
  font-size: 16px;
  font-weight: 700;
  color: var(--text);
  margin: 0;
}

.subtitle {
  font-size: 12px;
  color: var(--text2);
  text-align: center;
  margin: 0;
}

.actions {
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 100%;
}

.actions :deep(.btn) {
  font-size: 13px;
  padding: 10px 16px;
  border-radius: 10px;
  font-weight: 600;
}

@media (prefers-color-scheme: dark) {
  .phone-frame {
    background: var(--surface);
    border-color: var(--border);
  }
}
</style>