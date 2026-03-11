<script setup>
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../../stores/useAuthStore.js'
import { useTransactionStore } from '../../stores/useTransactionStore.js'
import { useToast } from '../../composables/useToast.js'
import { formatCurrency, formatDate } from '../../utils/formatters.js'
import AppModal from '../../components/AppModal.vue'

const auth = useAuthStore()
const store = useTransactionStore()
const router = useRouter()
const { showToast } = useToast()

const filterType = ref('all') // all, income, expense

const filtered = computed(() => {
  const list = store.allTransactions
  if (filterType.value === 'all') return list
  return list.filter(t => t.type === filterType.value)
})

// Quick lookups
const userMap = computed(() => {
  return auth.allUsers.reduce((acc, u) => { acc[u.id] = u.name; return acc }, {})
})

// Delete flow
const showDelete = ref(false)
const itemToDelete = ref(null)

function requestDelete(tx) {
  itemToDelete.value = tx
  showDelete.value = true
}

function confirmDelete() {
  store.deleteTransaction(itemToDelete.value.id)
  showToast('Transaction deleted successfully')
  showDelete.value = false
  itemToDelete.value = null
}
</script>

<template>
  <div class="screen pb-24">
    <header class="mb-6 mt-2">
      <h1 class="font-bold">All Transactions</h1>
      <p class="text-sm mt-1">Global view across all accounts.</p>
    </header>

    <!-- Filters -->
    <div class="flex gap-2 mb-6">
      <button class="chip" :class="{ active: filterType === 'all' }" @click="filterType = 'all'">All</button>
      <button class="chip" :class="{ active: filterType === 'income' }" @click="filterType = 'income'">Income</button>
      <button class="chip" :class="{ active: filterType === 'expense' }" @click="filterType = 'expense'">Expense</button>
    </div>

    <div v-if="filtered.length === 0" class="empty-state mt-8">
      <span class="icon">🔍</span>
      <h3 class="font-bold">No transactions found</h3>
    </div>

    <div v-else class="card p-0">
      <div class="px-4">
        <div 
          v-for="tx in filtered" 
          :key="tx.id" 
          class="transaction-item py-3 border-b flex items-center justify-between group"
        >
          <div class="flex-1 min-w-0 pr-4">
            <h3 class="font-bold truncate text-sm" :class="tx.type === 'income' ? 'text-green' : 'text-red'">
              {{ tx.type === 'income' ? '+' : '-' }}{{ formatCurrency(tx.amount) }}
            </h3>
            <p class="text-xs text-muted mt-1 truncate">
              {{ tx.description || tx.category }} • {{ formatDate(tx.date) }} • <b>{{ userMap[tx.userId] || 'Deleted User' }}</b>
            </p>
          </div>
          <button class="btn-ghost text-red p-1 text-xs" @click="requestDelete(tx)">Delete</button>
        </div>
      </div>
    </div>

    <!-- Delete Modal -->
    <AppModal
      :show="showDelete"
      title="Confirm Delete"
      message="Delete this transaction across the platform? This cannot be undone."
      confirmText="Force Delete"
      danger
      @cancel="showDelete = false"
      @confirm="confirmDelete"
    />
  </div>
</template>

<style scoped>
.pb-24 { padding-bottom: 96px; }
.border-b { border-bottom: 1px solid var(--border); }
.transaction-item:last-child { border-bottom: none; }
</style>
