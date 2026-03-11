<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../../stores/useAuthStore.js'
import { useTransactionStore } from '../../stores/useTransactionStore.js'
import { formatCurrency } from '../../utils/formatters.js'
import SummaryCard from '../../components/SummaryCard.vue'
import TransactionItem from '../../components/TransactionItem.vue'

const auth = useAuthStore()
const store = useTransactionStore()
const router = useRouter()

const userIds = [auth.currentUser.id]
const balance = store.balance(auth.currentUser.id)
const income = store.totalIncome(auth.currentUser.id)
const expense = store.totalExpense(auth.currentUser.id)

const transactions = store.userTransactions(auth.currentUser.id)
const recent = computed(() => transactions.value.slice(0, 5))

// Delete handling
import { ref } from 'vue'
import { useToast } from '../../composables/useToast.js'
import AppModal from '../../components/AppModal.vue'

const { showToast } = useToast()
const showDelete = ref(false)
const itemToDelete = ref(null)

function requestDelete(tx) {
  itemToDelete.value = tx
  showDelete.value = true
}

function confirmDelete() {
  store.deleteTransaction(itemToDelete.value.id)
  showToast('Transaction deleted')
  showDelete.value = false
  itemToDelete.value = null
}
</script>

<template>
  <div class="screen pb-24">
    <header class="flex justify-between items-center mb-6 mt-2">
      <div>
        <h1 class="font-bold">Dashboard</h1>
        <p class="text-sm mt-1">Hello, {{ auth.currentUser?.name }}!</p>
      </div>
      <div class="avatar">{{ auth.currentUser?.name.charAt(0).toUpperCase() }}</div>
    </header>

    <!-- Main Balance -->
    <div class="card mb-4 text-center py-6">
      <p class="text-xs font-bold text-muted uppercase tracking-wider mb-2">Total Balance</p>
      <h2 class="text-4xl font-bold tracking-tight">{{ formatCurrency(balance) }}</h2>
    </div>

    <!-- Income / Expense Split -->
    <div class="grid-2 mb-8">
      <SummaryCard title="Income" icon="⬇️" :amount="formatCurrency(income)" variant="income" />
      <SummaryCard title="Expense" icon="⬆️" :amount="formatCurrency(expense)" variant="expense" />
    </div>

    <!-- Recent Transactions -->
    <div class="flex justify-between items-center mb-4">
      <h3 class="font-bold">Recent Transactions</h3>
      <button 
        v-if="transactions.length > 0" 
        class="text-xs font-bold text-green" 
        @click="router.push('/transactions')"
      >
        See All
      </button>
    </div>

    <div v-if="transactions.length === 0" class="empty-state">
      <span class="icon">🧾</span>
      <h3 class="font-bold">No transactions yet</h3>
      <p class="text-sm">Tap the + button below to add your first expense or income.</p>
    </div>

    <div v-else class="card p-0">
      <div class="px-4">
        <TransactionItem 
          v-for="tx in recent" 
          :key="tx.id" 
          :transaction="tx" 
          @delete="requestDelete"
        />
      </div>
    </div>

    <!-- Delete Modal -->
    <AppModal
      :show="showDelete"
      title="Delete Transaction?"
      message="Are you sure you want to delete this? This action cannot be undone."
      confirmText="Delete"
      danger
      @cancel="showDelete = false"
      @confirm="confirmDelete"
    />
  </div>
</template>

<style scoped>
.grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
.avatar {
  width: 44px; height: 44px;
  border-radius: 50%;
  background: var(--blue-dim); color: var(--blue-dark);
  display: flex; align-items: center; justify-content: center;
  font-weight: 800; font-size: 18px;
}
.pb-24 { padding-bottom: 96px; } /* Room for bottom nav */
</style>
