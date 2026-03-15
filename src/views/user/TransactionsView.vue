<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../../stores/useAuthStore.js'
import { useTransactionStore } from '../../stores/useTransactionStore.js'
import { useBudgetStore } from '../../stores/useBudgetStore.js'
import { formatCurrency } from '../../utils/formatters.js'
import { useToast } from '../../composables/useToast.js'
import TransactionItem from '../../components/TransactionItem.vue'
import AppModal from '../../components/AppModal.vue'
import ThemeToggle from '../auth/ThemeToggle.vue'

const auth = useAuthStore()
const store = useTransactionStore()
const budgetStore = useBudgetStore()
const router = useRouter()
const { showToast } = useToast()

const userId = auth.currentUser.id
const filterType = ref('all')
const transactions = store.filteredTransactions(userId, filterType)

// Salary and balance info
const salary = computed(() => budgetStore.getSalary(userId))
const remainingSalary = computed(() => salary.value - store.totalExpense(userId).value)
const totalExpense = store.totalExpense(userId)

// Delete flow
const showDelete = ref(false)
const itemToDelete = ref(null)

function requestDelete(tx) {
  itemToDelete.value = tx
  showDelete.value = true
}

function confirmDelete() {
  store.deleteTransaction(itemToDelete.value.id)
  showToast('✅ Transaction deleted successfully')
  showDelete.value = false
  itemToDelete.value = null
}

function editTransaction(tx) {
  router.push(`/edit/${tx.id}`)
}
</script>

<template>
  <div class="screen pb-24">
    <ThemeToggle />
    <!-- Header -->
    <header class="transactions-header">
      <div>
        <h1 class="page-title">📋 Transactions</h1>
        <p class="header-subtitle">Manage all your transactions</p>
      </div>
      <button class="add-btn" @click="router.push('/add')" title="Add new transaction">
        ➕
      </button>
    </header>

    <!-- Salary Balance Card -->
    <div v-if="salary > 0" class="salary-info-card card animate-fade-in">
      <div class="salary-info-content">
        <div class="salary-info-left">
          <p class="salary-info-label">💵 Salary Balance</p>
          <h3 class="salary-info-amount" :class="{ 'text-red': remainingSalary.value < 0 }">
            {{ formatCurrency(remainingSalary.value) }}
          </h3>
          <p class="salary-info-detail">of {{ formatCurrency(salary) }}</p>
        </div>
        <div class="salary-info-right">
          <div class="expense-badge">
            <span class="expense-label">Spent</span>
            <span class="expense-amount">{{ formatCurrency(totalExpense.value) }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Filter Chips -->
    <div class="filters-container">
      <button 
        class="filter-chip" 
        :class="{ active: filterType === 'all' }" 
        @click="filterType = 'all'"
      >
        <span>📊</span> All
      </button>
      <button 
        class="filter-chip" 
        :class="{ active: filterType === 'income' }" 
        @click="filterType = 'income'"
      >
        <span>📥</span> Income
      </button>
      <button 
        class="filter-chip" 
        :class="{ active: filterType === 'expense' }" 
        @click="filterType = 'expense'"
      >
        <span>📤</span> Expense
      </button>
    </div>

    <!-- Empty State -->
    <div v-if="transactions.length === 0" class="empty-state">
      <span class="empty-icon">🔍</span>
      <h3 class="empty-title">No transactions found</h3>
      <p class="empty-text">Try changing filters or add a new transaction.</p>
      <button class="empty-action-btn" @click="router.push('/add')">
        <span>➕</span> Add Transaction
      </button>
    </div>

    <!-- Transaction List -->
    <div v-else class="card transactions-card p-0">
      <div class="transactions-header-info">
        <span class="transaction-count">
          <span class="count-icon">✓</span>
          {{ transactions.length }} {{ transactions.length === 1 ? 'transaction' : 'transactions' }}
        </span>
      </div>
      <div class="transactions-list">
        <TransactionItem 
          v-for="tx in transactions" 
          :key="tx.id" 
          :transaction="tx" 
          @delete="requestDelete"
          @edit="editTransaction"
        />
      </div>
    </div>

    <!-- Delete Modal -->
    <AppModal
      :show="showDelete"
      title="🗑️ Confirm Delete"
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

.transactions-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 24px;
  padding-top: 8px;
  gap: 16px;
}

.page-title {
  font-size: 26px;
  font-weight: 800;
  color: var(--text);
  margin: 0;
  display: flex;
  align-items: center;
  gap: 8px;
}

.header-subtitle {
  font-size: 13px;
  color: var(--text2);
  margin: 6px 0 0 0;
  font-weight: 500;
}

.add-btn {
  flex-shrink: 0;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  border: none;
  background: var(--blue);
  color: #fff;
  font-size: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: 0 4px 12px rgba(14, 165, 233, 0.25);
  font-weight: 600;
}

.add-btn:hover {
  background: var(--blue-dark);
  transform: scale(1.1);
  box-shadow: 0 6px 16px rgba(14, 165, 233, 0.35);
}

.add-btn:active {
  transform: scale(0.95);
}

.salary-info-card {
  margin-bottom: 24px;
  padding: 16px;
  background: linear-gradient(135deg, var(--blue-dim), var(--surface));
  border: 1.5px solid var(--blue);
  border-radius: 16px;
}

.salary-info-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
}

.salary-info-left {
  flex: 1;
}

.salary-info-label {
  font-size: 11px;
  font-weight: 700;
  color: var(--text2);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin: 0 0 4px 0;
}

.salary-info-amount {
  font-size: 24px;
  font-weight: 800;
  color: var(--blue);
  margin: 0 0 4px 0;
}

.salary-info-amount.text-red {
  color: var(--red);
}

.salary-info-detail {
  font-size: 12px;
  color: var(--text2);
  margin: 0;
  font-weight: 500;
}

.salary-info-right {
  display: flex;
  align-items: center;
}

.expense-badge {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 12px 16px;
  background: var(--surface2);
  border-radius: 12px;
  border: 1px solid var(--border);
}

.expense-label {
  font-size: 10px;
  font-weight: 700;
  color: var(--text2);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 4px;
}

.expense-amount {
  font-size: 16px;
  font-weight: 800;
  color: var(--red);
}

.animate-fade-in {
  animation: fadeIn 0.5s ease forwards;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.filters-container {
  display: flex;
  gap: 10px;
  margin-bottom: 24px;
  padding-bottom: 12px;
  border-bottom: 1px solid var(--border);
}

.filter-chip {
  padding: 8px 14px;
  border-radius: 20px;
  border: 1.5px solid var(--border);
  background: var(--surface);
  color: var(--text2);
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 4px;
  font-family: var(--font);
  white-space: nowrap;
}

.filter-chip:hover {
  border-color: var(--blue);
  color: var(--blue);
  background: var(--blue-dim);
}

.filter-chip.active {
  background: var(--blue);
  border-color: var(--blue);
  color: #fff;
  box-shadow: 0 2px 8px rgba(14, 165, 233, 0.25);
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 48px 24px;
  gap: 12px;
  text-align: center;
  margin-top: 48px;
}

.empty-icon {
  font-size: 64px;
  line-height: 1;
  margin-bottom: 8px;
  animation: bounce 2s infinite;
}

@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-8px); }
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
  margin: 0 0 16px 0;
  max-width: 300px;
}

.empty-action-btn {
  padding: 10px 20px;
  background: var(--blue);
  color: #fff;
  border: none;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 6px;
  font-family: var(--font);
}

.empty-action-btn:hover {
  background: var(--blue-dark);
  transform: translateY(-2px);
}

.transactions-card {
  overflow: hidden;
}

.transactions-header-info {
  padding: 12px 16px;
  background: var(--surface2);
  border-bottom: 1px solid var(--border);
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.transaction-count {
  font-size: 12px;
  font-weight: 600;
  color: var(--text2);
  display: flex;
  align-items: center;
  gap: 6px;
}

.count-icon {
  color: var(--blue);
  font-weight: 800;
}

.transactions-list {
  padding: 0;
}

.p-0 {
  padding: 0;
}
</style>