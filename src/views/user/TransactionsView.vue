<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../../stores/useAuthStore.js'
import { useTransactionStore } from '../../stores/useTransactionStore.js'
import { useToast } from '../../composables/useToast.js'
import TransactionItem from '../../components/TransactionItem.vue'
import AppModal from '../../components/AppModal.vue'

const auth = useAuthStore()
const store = useTransactionStore()
const router = useRouter()
const { showToast } = useToast()

const filterType = ref('all') // all, income, expense
const transactions = store.filteredTransactions(auth.currentUser.id, filterType)

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
    <header class="flex justify-between items-center mb-6 mt-2">
      <h1 class="font-bold">Transactions</h1>
      <button class="icon-btn" @click="router.push('/add')">➕</button>
    </header>

    <!-- Filters -->
    <div class="flex gap-2 mb-6">
      <button class="chip" :class="{ active: filterType === 'all' }" @click="filterType = 'all'">All</button>
      <button class="chip" :class="{ active: filterType === 'income' }" @click="filterType = 'income'">Income</button>
      <button class="chip" :class="{ active: filterType === 'expense' }" @click="filterType = 'expense'">Expense</button>
    </div>

    <!-- List -->
    <div v-if="transactions.length === 0" class="empty-state mt-8">
      <span class="icon">🔍</span>
      <h3 class="font-bold">No transactions found</h3>
      <p class="text-sm">Try changing filters or add a new one.</p>
    </div>

    <div v-else class="card p-0">
      <div class="px-4">
        <TransactionItem 
          v-for="tx in transactions" 
          :key="tx.id" 
          :transaction="tx" 
          @delete="requestDelete"
        />
      </div>
    </div>

    <!-- Delete Modal -->
    <AppModal
      :show="showDelete"
      title="Confirm Delete"
      message="Delete this transaction? This action cannot be undone and will update your dashboard totals."
      confirmText="Delete"
      danger
      @cancel="showDelete = false"
      @confirm="confirmDelete"
    />
  </div>
</template>

<style scoped>
.pb-24 { padding-bottom: 96px; }
.icon-btn {
  width: 40px; height: 40px; border-radius: 50%;
  border: 1.5px solid var(--border); background: var(--surface);
  font-size: 16px; display: flex; align-items: center; justify-content: center;
  cursor: pointer; transition: all 0.2s;
}
.icon-btn:hover { background: var(--green-dim); border-color: var(--green); }
</style>
