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

function requestDelete(user) {
  if (user.id === auth.currentUser.id) {
    showToast("You can't delete yourself!", 'error')
    return
  }
  userToDelete.value = user
  showDelete.value = true
}

function confirmDelete() {
  const uId = userToDelete.value.id
  auth.deleteUser(uId)
  store.deleteByUser(uId) // cascade delete transactions
  showToast('User and their transactions deleted')
  showDelete.value = false
  userToDelete.value = null
}
</script>

<template>
  <div class="screen pb-24">
    <header class="flex items-center gap-4 mb-6 mt-2">
      <h1 class="font-bold flex-1">Manage Users</h1>
    </header>

    <div class="card p-0 overflow-hidden">
      <div 
        v-for="u in users" 
        :key="u.id" 
        class="user-row p-4 border-b flex items-center justify-between"
      >
        <div class="flex-1 min-w-0 pr-4">
          <div class="flex gap-2 items-center">
            <h3 class="font-bold truncate">{{ u.name }}</h3>
            <span class="badge" :class="u.role === 'admin' ? 'badge-admin' : 'badge-user'">
              {{ u.role }}
            </span>
          </div>
          <p class="text-xs text-muted mt-1 truncate">{{ u.email }}</p>
        </div>

        <button 
          v-if="u.id !== auth.currentUser.id"
          class="btn-ghost text-red p-2 border border-red rounded-lg text-xs"
          @click="requestDelete(u)"
        >
          Delete
        </button>
      </div>
    </div>

    <!-- Delete Modal -->
    <AppModal
      :show="showDelete"
      title="Delete User"
      message="This will delete the user and all their transactions permanently. Continue?"
      confirmText="Delete"
      danger
      @cancel="showDelete = false"
      @confirm="confirmDelete"
    />
  </div>
</template>

<style scoped>
.pb-24 { padding-bottom: 96px; }
.border-b { border-bottom: 1px solid var(--border); }
.user-row:last-child { border-bottom: none; }
</style>
