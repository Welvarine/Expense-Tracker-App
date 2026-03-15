<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../../stores/useAuthStore.js'
import { useTransactionStore } from '../../stores/useTransactionStore.js'
import { useToast } from '../../composables/useToast.js'
import AppModal from '../../components/AppModal.vue'

const auth = useAuthStore()
const store = useTransactionStore()
const router = useRouter()
const { showToast } = useToast()

const users = auth.allUsers
const showDelete = ref(false)
const userToDelete = ref(null)

function editUser(user) {
  router.push(`/admin/users/${user.id}`)
}

function requestDelete(user) {
  if (user.id === auth.currentUser.id) {
    showToast("❌ You can't delete yourself!", 'error')
    return
  }
  userToDelete.value = user
  showDelete.value = true
}

function confirmDelete() {
  const uId = userToDelete.value.id
  auth.deleteUser(uId)
  store.deleteByUser(uId) // cascade delete transactions
  showToast('✅ User and their transactions deleted')
  showDelete.value = false
  userToDelete.value = null
}
</script>

<template>
  <div class="screen">
    <header class="page-header">
      <h1 class="page-title">👥 Manage Users</h1>
      <p class="page-subtitle">View and manage all user accounts</p>
    </header>

    <div v-if="users.length === 0" class="empty-state">
      <span class="empty-icon">👤</span>
      <h3 class="empty-title">No users found</h3>
      <p class="empty-text">There are no user accounts in the system.</p>
    </div>

    <div v-else class="card p-0 overflow-hidden">
      <div 
        v-for="u in users" 
        :key="u.id" 
        class="user-row"
      >
        <div class="user-info">
          <div class="user-header">
            <h3 class="user-name">{{ u.name }}</h3>
            <span class="role-badge" :class="u.role === 'admin' ? 'badge-admin' : 'badge-user'">
              {{ u.role === 'admin' ? '🔑 Admin' : '👤 User' }}
            </span>
          </div>
          <p class="user-email">{{ u.email }}</p>
          <div class="user-meta">
            <span v-if="u.verified" class="meta-badge verified">✅ Verified</span>
            <span v-else class="meta-badge unverified">⏳ Unverified</span>
            <span v-if="u.id === auth.currentUser.id" class="meta-badge current">You</span>
          </div>
        </div>

        <div class="user-actions">
          <button 
            class="action-btn edit-btn"
            @click="editUser(u)"
            title="Edit user"
          >
            ✏️
          </button>
          <button 
            v-if="u.id !== auth.currentUser.id"
            class="action-btn delete-btn"
            @click="requestDelete(u)"
            title="Delete user"
          >
            🗑️
          </button>
        </div>
      </div>
    </div>

    <!-- Delete Modal -->
    <AppModal
      :show="showDelete"
      title="🗑️ Delete User"
      message="This will delete the user and all their transactions permanently. Continue?"
      confirmText="Delete"
      danger
      @cancel="showDelete = false"
      @confirm="confirmDelete"
    />
  </div>
</template>

<style scoped>
.page-header {
  margin-bottom: 32px;
  padding: 32px 40px 0 40px;
}

.page-title {
  font-size: 28px;
  font-weight: 800;
  color: var(--text);
  margin: 0 0 6px 0;
}

.page-subtitle {
  font-size: 13px;
  color: var(--text2);
  margin: 0;
  font-weight: 500;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 40px;
  gap: 12px;
  text-align: center;
  margin-top: 48px;
}

.empty-icon {
  font-size: 64px;
  line-height: 1;
  margin-bottom: 8px;
}

.empty-title {
  font-size: 18px;
  font-weight: 700;
  color: var(--text);
  margin: 0;
}

.empty-text {
  font-size: 13px;
  color: var(--text2);
  margin: 0;
}

.card {
  overflow: hidden;
  border-radius: 16px;
  border: 1.5px solid var(--border);
  margin: 0 40px;
}

.p-0 {
  padding: 0;
}

.overflow-hidden {
  overflow: hidden;
}

.user-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
  border-bottom: 1px solid var(--border);
  transition: all 0.2s;
}

.user-row:last-child {
  border-bottom: none;
}

.user-row:hover {
  background: var(--surface2);
}

.user-info {
  flex: 1;
  min-width: 0;
}

.user-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 6px;
}

.user-name {
  font-size: 15px;
  font-weight: 700;
  color: var(--text);
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.role-badge {
  padding: 4px 10px;
  border-radius: 8px;
  font-size: 11px;
  font-weight: 700;
  white-space: nowrap;
  flex-shrink: 0;
}

.badge-admin {
  background: var(--blue-dim);
  color: var(--blue);
}

.badge-user {
  background: var(--green-dim);
  color: var(--green-dark);
}

.user-email {
  font-size: 12px;
  color: var(--text2);
  margin: 0 0 8px 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.user-meta {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.meta-badge {
  padding: 3px 8px;
  border-radius: 6px;
  font-size: 10px;
  font-weight: 600;
  white-space: nowrap;
}

.meta-badge.verified {
  background: var(--green-dim);
  color: var(--green-dark);
}

.meta-badge.unverified {
  background: var(--amber-dim);
  color: var(--amber);
}

.meta-badge.current {
  background: var(--blue-dim);
  color: var(--blue);
}

.user-actions {
  display: flex;
  gap: 8px;
  flex-shrink: 0;
  margin-left: 12px;
}

.action-btn {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  border: 1.5px solid var(--border);
  background: var(--surface);
  font-size: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
}

.action-btn:hover {
  transform: scale(1.05);
}

.edit-btn:hover {
  border-color: var(--blue);
  background: var(--blue-dim);
}

.delete-btn:hover {
  border-color: var(--red);
  background: var(--red-dim);
}
</style>
