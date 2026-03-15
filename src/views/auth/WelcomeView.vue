<script setup>
import { useRouter } from 'vue-router'
import AppButton from '../../components/AppButton.vue'
import { ref, onMounted } from 'vue'

const router = useRouter()
const animateFeatures = ref(false)

onMounted(() => {
  setTimeout(() => {
    animateFeatures.value = true
  }, 300)
})
</script>

<template>
  <div class="welcome-page">
    <!-- Navigation Bar -->
    <nav class="navbar">
      <div class="nav-container">
        <div class="nav-logo">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" fill="url(#grad1)" stroke="currentColor" stroke-width="1"/>
            <path d="M12 6V18M6 12H18" stroke="white" stroke-width="2" stroke-linecap="round"/>
            <defs>
              <linearGradient id="grad1" x1="0" y1="0" x2="24" y2="24">
                <stop offset="0%" stop-color="#0EA5E9"/>
                <stop offset="100%" stop-color="#06B6D4"/>
              </linearGradient>
            </defs>
          </svg>
          <span>GEN'ET</span>
        </div>
        <div class="nav-spacer"></div>
        <div class="nav-links">

        </div>
    
       
      </div>
    </nav>

    <!-- Hero Section -->
    <section class="hero">
      <div class="background-decoration">
        <div class="gradient-orb orb-1"></div>
        <div class="gradient-orb orb-2"></div>
        <div class="gradient-orb orb-3"></div>
      </div>

      <div class="hero-content">
        <div class="hero-text">
          <h1 class="hero-title">
            Your Personal
            <span class="gradient-text">Finance Manager</span>
          </h1>
          <p class="hero-subtitle">
            Track expenses and manage budgets effortlessly
          </p>

          <div class="hero-cta">
            <AppButton 
              @click="router.push('/signup')"
              class="cta-primary"
              aria-label="Start using GEN'ET"
            >
              Start
            </AppButton>
            <AppButton 
              @click="router.push('/login')"
              class="cta-secondary"
              aria-label="Login to your account"
            >
              Login
            </AppButton>
          </div>

          <div class="hero-stats" style="display: none;">
            <div class="stat">
              <span class="stat-number">10K+</span>
              <span class="stat-label">Users</span>
            </div>
            <div class="stat-divider"></div>
            <div class="stat">
              <span class="stat-number">4.9★</span>
              <span class="stat-label">Rated</span>
            </div>
          </div>
        </div>

        <div class="hero-visual">
          <div class="device-mockup">
            <div class="device-screen">
              <div class="screen-content">
                <div class="dashboard-header">
                  <div class="balance-card">
                    <p class="balance-label">Total Balance</p>
                    <p class="balance-amount">$2,450.50</p>
                  </div>
                </div>
                <div class="transaction-list">
                  <div class="tx-item" style="animation-delay: 0.1s">
                    <div class="tx-icon">🏪</div>
                    <div class="tx-info">
                      <p class="tx-name">Grocery</p>
                      <p class="tx-date">Today</p>
                    </div>
                    <p class="tx-amount">-$45.00</p>
                  </div>
                  <div class="tx-item" style="animation-delay: 0.2s">
                    <div class="tx-icon">💼</div>
                    <div class="tx-info">
                      <p class="tx-name">Salary</p>
                      <p class="tx-date">Yesterday</p>
                    </div>
                    <p class="tx-amount amount-positive">+$2,500.00</p>
                  </div>
                  <div class="tx-item" style="animation-delay: 0.3s">
                    <div class="tx-icon">🚗</div>
                    <div class="tx-info">
                      <p class="tx-name">Gas</p>
                      <p class="tx-date">2 days ago</p>
                    </div>
                    <p class="tx-amount">-$60.00</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section class="features" style="display: none;">
      <div class="section-header">
        <h2>Powerful Features</h2>
        <p>Everything you need to manage your finances effectively</p>
      </div>

      <div class="features-grid" :class="{ animate: animateFeatures }">
        <div class="feature-card">
          <div class="feature-icon">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5S9.33 8 8.5 8 7 8.67 7 9.5 7.67 11 8.5 11zm3.5 6.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z" fill="currentColor"/>
            </svg>
          </div>
          <h3 class="feature-title">Smart Tracking</h3>
          <p class="feature-description">
            Automatically categorize and track all your expenses in real-time
          </p>
        </div>

        <div class="feature-card">
          <div class="feature-icon">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M3 12a9 9 0 1 0 18 0 9 9 0 0 0-18 0" stroke-width="2"/>
              <path d="M12 6v6l4 2" stroke-width="2" stroke-linecap="round"/>
            </svg>
          </div>
          <h3 class="feature-title">Budget Planning</h3>
          <p class="feature-description">
            Set budgets and get alerts when you're approaching limits
          </p>
        </div>

        <div class="feature-card">
          <div class="feature-icon">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M3 3v18h18" stroke-width="2" stroke-linecap="round"/>
              <path d="M18 17V9M12 17v-5M6 17v-2" stroke-width="2" stroke-linecap="round"/>
            </svg>
          </div>
          <h3 class="feature-title">Visual Analytics</h3>
          <p class="feature-description">
            Beautiful charts and insights into your spending patterns
          </p>
        </div>

        <div class="feature-card">
          <div class="feature-icon">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M12 1v22M17 5H9.5a4.5 4.5 0 0 0 0 9H12m5-14h-4" stroke-width="2" stroke-linecap="round"/>
            </svg>
          </div>
          <h3 class="feature-title">Multi-Currency</h3>
          <p class="feature-description">
            Support for multiple currencies and automatic conversion
          </p>
        </div>

        <div class="feature-card">
          <div class="feature-icon">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke-width="2" stroke-linejoin="round"/>
            </svg>
          </div>
          <h3 class="feature-title">Bank-Level Security</h3>
          <p class="feature-description">
            Your data is encrypted and protected with industry standards
          </p>
        </div>

        <div class="feature-card">
          <div class="feature-icon">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <circle cx="12" cy="12" r="1" fill="currentColor"/>
              <path d="M12 1v6m0 6v6M4.22 4.22l4.24 4.24m5.08 5.08l4.24 4.24M1 12h6m6 0h6M4.22 19.78l4.24-4.24m5.08-5.08l4.24-4.24" stroke-width="2" stroke-linecap="round"/>
            </svg>
          </div>
          <h3 class="feature-title">Offline Mode</h3>
          <p class="feature-description">
            Works completely offline—no internet connection required
          </p>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="cta-section" style="display: none;">
      <div class="cta-content">
        <h2>Ready to Take Control of Your Finances?</h2>
        <p>Join thousands of users managing their money smarter</p>
        <AppButton 
          @click="router.push('/signup')"
          class="cta-button-large"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor">
            <path d="M10 4v12m6-6H4" stroke-width="2" stroke-linecap="round"/>
          </svg>
          Start For Free
        </AppButton>
      </div>
    </section>

    <!-- Footer -->
    <footer class="footer">
      <div class="footer-bottom">
        <p>&copy; 2024 GEN'ET. All rights reserved.</p>
      </div>
    </footer>
  </div>
</template>

<style scoped>
:root {
  --primary: #0EA5E9;
  --primary-dark: #0284C7;
  --primary-light: #E0F2FE;
  --secondary: #06B6D4;
  --text: var(--text, #1F2937);
  --text2: var(--text2, #6B7280);
  --surface: var(--surface, #FFFFFF);
  --surface2: var(--surface2, #F9FAFB);
  --border: var(--border, #E5E7EB);
}

[data-theme="dark"] {
  --text: #F9FAFB;
  --text2: #D1D5DB;
  --surface: #0F172A;
  --surface2: #1E293B;
  --border: #334155;
}

html {
  scroll-behavior: smooth;
}

body {
  margin: 0;
  padding: 0;
}

/* Navbar */
.navbar {
  position: sticky;
  top: 0;
  z-index: 100;
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid var(--border);
}

[data-theme="dark"] .navbar {
  background: rgba(15, 23, 42, 0.8);
}

.nav-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 12px 24px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: 40px;
}

.nav-spacer {
  flex: 1;
}

.nav-logo {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 18px;
  font-weight: 700;
  color: var(--text);
  color: var(--primary);
}

.nav-logo svg {
  display: block;
}

.nav-links {
  display: flex;
  gap: 40px;
  align-items: center;
}

.nav-link {
  color: var(--text2);
  text-decoration: none;
  font-size: 14px;
  font-weight: 500;
  transition: color 0.3s ease;
  white-space: nowrap;
}

.nav-link:hover {
  color: var(--primary);
}

.nav-login-btn {
  background: none;
  border: 2px solid var(--border);
  color: var(--text);
  padding: 8px 16px;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  white-space: nowrap;
}

.nav-login-btn:hover {
  border-color: var(--primary);
  color: var(--primary);
}

/* Hero Section */
.hero {
  position: relative;
  padding: 40px 16px;
  overflow: hidden;
}

.background-decoration {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: -1;
}

.gradient-orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(100px);
  opacity: 0.15;
}

.orb-1 {
  width: 400px;
  height: 400px;
  background: var(--primary);
  top: -100px;
  right: -100px;
  animation: float 8s ease-in-out infinite;
}

.orb-2 {
  width: 300px;
  height: 300px;
  background: var(--secondary);
  top: 50%;
  left: -150px;
  animation: float 10s ease-in-out infinite reverse;
}

.orb-3 {
  width: 350px;
  height: 350px;
  background: #A78BFA;
  bottom: -100px;
  right: 10%;
  animation: float 12s ease-in-out infinite;
}

@keyframes float {
  0%, 100% { transform: translate(0, 0); }
  50% { transform: translate(30px, -50px); }
}

.hero-content {
  max-width: 100%;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr 0.9fr;
  gap: 40px;
  align-items: center;
  width: 100%;
  overflow: hidden;
}

.hero-text {
  animation: slideUpFade 0.8s ease-out;
}

.hero-title {
  font-size: 48px;
  font-weight: 800;
  color: var(--text);
  margin: 0 0 16px 0;
  line-height: 1.2;
  letter-spacing: -1px;
}

.gradient-text {
  background: linear-gradient(135deg, #0EA5E9 0%, #06B6D4 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.hero-subtitle {
  font-size: 16px;
  color: var(--text2);
  margin: 0 0 24px 0;
  line-height: 1.6;
}

.hero-cta {
  display: flex;
  gap: 12px;
  margin-bottom: 20px;
}

.cta-primary :deep(.btn),
.cta-secondary :deep(.btn) {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 14px 32px;
  font-size: 15px;
  font-weight: 600;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
  letter-spacing: 0.3px;
}

.cta-primary :deep(.btn) {
  background: #0EA5E9;
  color: white;
  box-shadow: 0 4px 12px rgba(14, 165, 233, 0.25);
}

.cta-primary :deep(.btn):hover {
  background: #0284C7;
  transform: translateY(-2px);
  box-shadow: 0 6px 18px rgba(14, 165, 233, 0.35);
}

.cta-secondary :deep(.btn) {
  background: white;
  color: #0EA5E9;
  border: 2px solid #0EA5E9;
  font-weight: 600;
}

.cta-secondary :deep(.btn):hover {
  background: #E0F2FE;
  transform: translateY(-2px);
}

.hero-stats {
  display: flex;
  gap: 24px;
  padding-top: 12px;
  border-top: 1px solid var(--border);
}

.stat {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.stat-number {
  font-size: 20px;
  font-weight: 700;
  color: var(--text);
}

.stat-label {
  font-size: 12px;
  color: var(--text2);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.stat-divider {
  width: 1px;
  background: var(--border);
}

/* Hero Visual */
.hero-visual {
  animation: slideUpFade 0.8s ease-out 0.1s backwards;
}

.device-mockup {
  perspective: 1000px;
}

.device-screen {
  width: 260px;
  aspect-ratio: 9 / 14;
  background: linear-gradient(135deg, #0EA5E9 0%, #06B6D4 100%);
  border-radius: 24px;
  padding: 10px;
  box-shadow: 0 20px 60px rgba(14, 165, 233, 0.3);
  transform: rotateX(5deg) rotateY(-10deg);
  display: flex;
  flex-direction: column;
}

.screen-content {
  background: white;
  border-radius: 18px;
  padding: 14px;
  color: #1F2937;
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
}

.dashboard-header {
  margin-bottom: 8px;
}

.balance-card {
  background: linear-gradient(135deg, #0EA5E9 0%, #06B6D4 100%);
  border-radius: 14px;
  padding: 14px;
  color: white;
}

.balance-label {
  font-size: 10px;
  opacity: 0.9;
  margin: 0;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.balance-amount {
  font-size: 22px;
  font-weight: 700;
  margin: 6px 0 0 0;
}

.transaction-list {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.tx-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px;
  background: #F3F4F6;
  border-radius: 10px;
  animation: slideUpFade 0.5s ease-out forwards;
  opacity: 0;
}

.tx-icon {
  font-size: 18px;
  flex-shrink: 0;
}

.tx-info {
  flex: 1;
}

.tx-name {
  font-size: 12px;
  font-weight: 600;
  color: #1F2937;
  margin: 0;
}

.tx-date {
  font-size: 10px;
  color: #6B7280;
  margin: 2px 0 0 0;
}

.tx-amount {
  font-size: 12px;
  font-weight: 700;
  color: #EF4444;
  margin: 0;
}

.amount-positive {
  color: #10B981;
}

/* Features Section */
.features {
  max-width: 1200px;
  margin: 0 auto;
  padding: 60px 24px;
}

.section-header {
  text-align: center;
  margin-bottom: 40px;
  animation: slideUpFade 0.8s ease-out;
}

.section-header h2 {
  font-size: 36px;
  font-weight: 800;
  color: var(--text);
  margin: 0 0 12px 0;
}

.section-header p {
  font-size: 16px;
  color: var(--text2);
  margin: 0;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 24px;
}

.features-grid.animate .feature-card {
  animation: slideUpFade 0.6s ease-out forwards;
  opacity: 0;
}

.feature-card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 16px;
  padding: 32px 24px;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.feature-card:hover {
  border-color: var(--primary);
  transform: translateY(-4px);
  box-shadow: 0 12px 24px rgba(14, 165, 233, 0.1);
}

.feature-icon {
  width: 56px;
  height: 56px;
  background: var(--primary-light);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--primary);
}

.feature-title {
  font-size: 18px;
  font-weight: 700;
  color: var(--text);
  margin: 0;
}

.feature-description {
  font-size: 14px;
  color: var(--text2);
  margin: 0;
  line-height: 1.6;
}

/* CTA Section */
.cta-section {
  background: linear-gradient(135deg, #0EA5E9 0%, #06B6D4 100%);
  padding: 60px 24px;
  text-align: center;
  color: white;
}

.cta-content {
  max-width: 600px;
  margin: 0 auto;
}

.cta-content h2 {
  font-size: 36px;
  font-weight: 800;
  margin: 0 0 12px 0;
}

.cta-content p {
  font-size: 16px;
  opacity: 0.9;
  margin: 0 0 32px 0;
}

.cta-button-large :deep(.btn) {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 16px 32px;
  font-size: 16px;
  font-weight: 700;
  background: white;
  color: var(--primary);
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.cta-button-large :deep(.btn):hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.2);
}

/* Footer */
.footer {
  background: var(--surface2);
  border-top: 1px solid var(--border);
  padding: 12px 24px;
}

.footer-content {
  max-width: 1200px;
  margin: 0 auto 24px;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 40px;
}

.footer-section h4 {
  font-size: 14px;
  font-weight: 700;
  color: var(--text);
  margin: 0 0 12px 0;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.footer-section p {
  font-size: 14px;
  color: var(--text2);
  margin: 0;
}

.footer-section ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.footer-section li {
  margin-bottom: 8px;
}

.footer-section a {
  color: var(--text2);
  text-decoration: none;
  font-size: 14px;
  transition: color 0.3s ease;
}

.footer-section a:hover {
  color: var(--primary);
}

.footer-bottom {
  max-width: 1200px;
  margin: 0 auto;
  padding-top: 0;
  border-top: none;
  text-align: center;
  font-size: 12px;
  color: var(--text2);
}

.footer-bottom p {
  margin: 0;
}

/* Animations */
@keyframes slideUpFade {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Responsive */
@media (max-width: 1024px) {
  .hero-content {
    grid-template-columns: 1fr;
    gap: 30px;
  }

  .hero-title {
    font-size: 40px;
  }

  .hero-visual {
    display: flex;
    justify-content: center;
  }
}

@media (max-width: 768px) {
  .nav-links {
    display: none;
  }

  .hero-content {
    grid-template-columns: 1fr;
    gap: 40px;
  }

  .hero-title {
    font-size: 32px;
  }

  .hero-subtitle {
    font-size: 16px;
  }

  .hero-cta {
    flex-direction: column;
  }

  .hero-stats {
    flex-direction: column;
    gap: 12px;
  }

  .section-header h2 {
    font-size: 28px;
  }

  .cta-content h2 {
    font-size: 28px;
  }
}

@media (max-width: 480px) {
  .nav-container {
    padding: 12px 16px;
  }

  .hero {
    padding: 40px 16px;
  }

  .hero-title {
    font-size: 24px;
  }

  .features {
    padding: 40px 16px;
  }

  .cta-section {
    padding: 40px 16px;
  }

  .features-grid {
    grid-template-columns: 1fr;
  }
}
</style>