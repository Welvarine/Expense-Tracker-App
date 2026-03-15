<script setup>
import { reactive, ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '../../stores/useAuthStore.js'
import { useToast } from '../../composables/useToast.js'
import { useFormValidation } from '../../composables/useFormValidation.js'
import { isRequired, isValidEmail } from '../../utils/validators.js'
import AppInput from '../../components/AppInput.vue'
import AppButton from '../../components/AppButton.vue'
import AppModal from '../../components/AppModal.vue'

const auth = useAuthStore()
const router = useRouter()
const route = useRoute()
const { showToast } = useToast()

const userId = route.params.id
const loading = ref(false)
const showDelete = ref(false)

const form = reactive({
  name: '',
  email: '',
  role: 'user',
  verified: false
})

const { errors, validate } = useFormValidation({
  name: [isRequired],
  email: [isRequired, isValidEmail],
  role: [isRequired]
})

onMounted(() => {
  const user = auth.getUserById(userId)
  
  if (!user) {
    showToast('❌ User not found')
    router.push('/admin/users')
    return
  }

  form.name = user.name
  form.email = user.email
  form.role = user.role
  form.verified = user.verified
})

async function submit() {
  if (!validate(form)) return
  
  loading.value = true
  await new Promise(r => setTimeout(r, 400))
  
  const result = auth.updateUser(userId, form)
  
  if (!result) {
    showToast('❌ Failed to update user')
    loading.value = false
    return
  }
  
  loading.value = false
  showToast('✅ User updated successfully')
  router.push('/admin/users')
}

function requestDelete() {
  if (userId === auth.currentUser.id) {
    showToast("❌ You can't delete yourself!", 'error')
    return
  }
  showDelete.value = true
}

function confirmDelete() {
  auth.deleteUser(userId)
  showToast('✅ User deleted successfully')
  showDelete.value = false
  router.push('/admin/users')
}
</script>

<template>
  <div class="screen pb-24">
    <!-- Header -->
    <header class="page-header">
      <button class="back-btn" @click="router.back()">
        <span>←</span>
      </button>
      <div class="header-content">
        <h2 class="header-title">👤 Edit User</h2>
        <p class="header-subtitle">Manage user account details</p>
      </div>
    </header>

    <form @submit.prevent="submit" class="form-container">
      <!-- Name -->
      <div class="form-group animate-slide-in" style="animation-delay: 0.1s">
        <AppInput 
          label="👤 Full Name" 
          v-model="form.name" 
          placeholder="Enter user's full name"
          :error="errors.name"
        />
      </div>

      <!-- Email -->
      <div class="form-group animate-slide-in" style="animation-delay: 0.2s">
        <AppInput 
          label="📧 Email" 
          type="email"
          v-model="form.email" 
          placeholder="Enter user's email"
          :error="errors.email"
        />
      </div>

      <!-- Role -->
      <div class="form-group animate-slide-in" style="animation-delay: 0.3s">
        <AppInput 
          label="🔐 Role" 
          type="select"
          v-model="form.role"
          :options="[
            { value: 'user', label: '👤 Regular User' },
            { value: 'admin', label: '🔑 Administrator' }
          ]"
          :error="errors.role"
        />
      </div>

      <!-- Email Verification Status -->
      <div class="form-group animate-slide-in" style="animation-delay: 0.4s">
        <label class="checkbox-label">
          <input 
            type="checkbox" 
            v-model="form.verified"
            class="checkbox-input"
          />
          <span class="checkbox-text">✅ Email Verified</span>
        </label>
      </div>

      <!-- Info Card -->
      <div class="info-card animate-fade-in" style="animation-delay: 0.45s">
        <p class="info-title">ℹ️ Admin Privileges</p>
        <p class="info-text">As an admin, you have full control over user accounts. You can:</p>
        <ul class="info-list">
          <li>Update user name and email</li>
          <li>Change user role (user ↔ admin)</li>
          <li>Verify or unverify email status</li>
          <li>Delete user accounts and their data</li>
        </ul>
      </div>

      <!-- Action Buttons -->
      <div class="button-group animate-slide-in" style="animation-delay: 0.5s">
        <AppButton type="submit" class="submit-btn" :loading="loading">
          <span>💾</span> Save Changes
        </AppButton>
        <button 
          v-if="userId !== auth.currentUser.id"
          type="button"
          class="delete-btn"
          @click="requestDelete"
        >
          <span>🗑️</span> Delete User
        </button>
      </div>
    </form>

    <!-- Delete Modal -->
    <AppModal
      :show="showDelete"
      title="🗑️ Delete User"
      message="This will permanently delete the user account and all associated data. This action cannot be undone."
      confirmText="Delete"
      danger
      @cancel="showDelete = false"
      @confirm="confirmDelete"
    />
  </div>
</template>

<style scoped>
.pb-24 { padding-bottom: 96px; }

.page-header {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  margin-bottom: 24px;
  padding-top: 8px;
}

.back-btn {
  flex-shrink: 0;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  border: 1.5px solid var(--border);
  background: var(--surface);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 18px;
  font-weight: 600;
}

.back-btn:hover {
  border-color: var(--blue);
  color: var(--blue);
  background: var(--blue-dim);
  transform: translateX(-2px);
}

.header-content {
  flex: 1;
}

.header-title {
  font-size: 22px;
  font-weight: 700;
  color: var(--text);
  margin: 0;
}

.header-subtitle {
  font-size: 13px;
  color: var(--text2);
  margin: 4px 0 0 0;
}

.form-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 16px;
  background: var(--surface2);
  border-radius: 12px;
  border: 1.5px solid var(--border);
  cursor: pointer;
  transition: all 0.2s;
}

.checkbox-label:hover {
  border-color: var(--blue);
  background: var(--blue-dim);
}

.checkbox-input {
  width: 18px;
  height: 18px;
  cursor: pointer;
  accent-color: var(--blue);
}

.checkbox-text {
  font-size: 14px;
  font-weight: 600;
  color: var(--text);
}

.info-card {
  background: var(--blue-dim);
  border: 1.5px solid var(--blue);
  border-radius: 12px;
  padding: 16px;
}

.info-title {
  font-size: 13px;
  font-weight: 700;
  color: var(--blue);
  margin: 0 0 8px 0;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.info-text {
  font-size: 13px;
  color: var(--text);
  margin: 0 0 12px 0;
  font-weight: 500;
}

.info-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.info-list li {
  font-size: 12px;
  color: var(--text2);
  padding-left: 20px;
  position: relative;
}

.info-list li:before {
  content: '✓';
  position: absolute;
  left: 0;
  color: var(--blue);
  font-weight: 700;
}

.button-group {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 12px;
}

.submit-btn {
  height: 54px;
  font-size: 16px;
  border-radius: 16px;
}

.submit-btn:hover {
  transform: translateY(-2px) scale(1.01);
}

.delete-btn {
  height: 54px;
  padding: 12px 16px;
  background: var(--red-dim);
  color: var(--red);
  border: 1.5px solid var(--red);
  border-radius: 16px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-family: var(--font);
}

.delete-btn:hover {
  background: var(--red);
  color: #fff;
  transform: translateY(-2px);
}

.animate-slide-in {
  opacity: 0;
  transform: translateY(10px);
  animation: slide-in 0.4s ease forwards;
}

.animate-fade-in {
  opacity: 0;
  animation: fade-in 0.3s ease forwards;
}

@keyframes slide-in {
  to { opacity: 1; transform: translateY(0); }
}

@keyframes fade-in {
  to { opacity: 1; }
}
</style>
