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
  <div class="screen">
    <header class="mb-6 mt-2 px-10">
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
.px-10 { padding: 0 40px; }
.mb-6 { margin-bottom: 32px; }
.mt-2 { margin-top: 8px; }
.flex { display: flex; }
.gap-2 { gap: 8px; }
.mb-6 { margin-bottom: 32px; }
.mt-8 { margin-top: 32px; }
.font-bold { font-weight: 700; }
.text-sm { font-size: 14px; }
.mt-1 { margin-top: 4px; }
.chip { padding: 8px 14px; border-radius: 20px; border: 1.5px solid var(--border); background: var(--surface); cursor: pointer; font-size: 12px; font-weight: 600; transition: all 0.2s; }
.chip.active { background: var(--blue); border-color: var(--blue); color: #fff; }
.empty-state { text-align: center; padding: 60px 40px; color: var(--text2); }
.icon { font-size: 48px; display: block; margin-bottom: 12px; }
.card { overflow: hidden; border-radius: 16px; border: 1.5px solid var(--border); margin: 0 40px; }
.p-0 { padding: 0; }
.px-4 { padding: 0 20px; }
.border-b { border-bottom: 1px solid var(--border); }
.transaction-item { border-bottom: 1px solid var(--border); }
.transaction-item:last-child { border-bottom: none; }
.py-3 { padding: 12px 0; }
.min-w-0 { min-width: 0; }
.pr-4 { padding-right: 20px; }
.truncate { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.text-xs { font-size: 12px; }
.text-muted { color: var(--text2); }
.btn-ghost { background: none; border: none; cursor: pointer; }
.text-red { color: var(--red); }
</style>
