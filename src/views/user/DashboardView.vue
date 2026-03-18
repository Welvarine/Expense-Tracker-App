<script setup>
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../../stores/useAuthStore.js'
import { useTransactionStore } from '../../stores/useTransactionStore.js'
import { useBudgetStore } from '../../stores/useBudgetStore.js'
import { formatCurrency } from '../../utils/formatters.js'
import SummaryCard from '../../components/SummaryCard.vue'
import TransactionItem from '../../components/TransactionItem.vue'
import AppModal from '../../components/AppModal.vue'
import BudgetProgress from '../../components/BudgetProgress.vue'
import ThemeToggle from '../auth/ThemeToggle.vue'
import { useToast } from '../../composables/useToast.js'

const auth = useAuthStore()
const store = useTransactionStore()
const budgetStore = useBudgetStore()
const router = useRouter()
const { showToast } = useToast()

const selectedCurrency = ref(auth.currentUser?.currency || 'USD')
const currencyOptions = [
  { value: 'USD', label: '🇺🇸 USD' },
  { value: 'EUR', label: '🇪🇺 EUR' },
  { value: 'GBP', label: '🇬🇧 GBP' },
  { value: 'JPY', label: '🇯🇵 JPY' },
  { value: 'RWF', label: '🇷🇼 RWF' }
]

function handleCurrencyChange(e) {
  selectedCurrency.value = e.target.value
  auth.updatePreferences({ currency: e.target.value })
  showToast('✅ Currency updated')
}

const userId = auth.currentUser.id
const balance = store.balance(userId)
const totalIncomeComputed = store.totalIncome(userId)
const totalExpenseComputed = store.totalExpense(userId)

const income = computed(() => totalIncomeComputed.value)
const expense = computed(() => totalExpenseComputed.value)

const salary = computed(() => budgetStore.getSalary(userId))
const remainingSalary = computed(() => salary.value - expense.value)

const budgets = budgetStore.userBudgets(userId)
const budgetSummary = computed(() => {
  return budgets.value.slice(0, 3).map(b => ({
    ...b,
    spent: budgetStore.getCategorySpending(userId, b.category).value
  }))
})

const transactions = store.userTransactions(userId)
const recent = computed(() => transactions.value.slice(0, 5))

// Delete handling
const showDelete = ref(false)
const itemToDelete = ref(null)

function requestDelete(tx) {
  itemToDelete.value = tx
  showDelete.value = true
}

function confirmDelete() {
  store.deleteTransaction(itemToDelete.value.id)
  showToast('✅ Transaction deleted')
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
    <header class="dashboard-header animate-fade-in">
      <div class="header-left">
        <h1 class="page-title">📊 Dashboard</h1>
        <p class="greeting">Hello, {{ auth.currentUser?.name }}! 👋</p>
      </div>
      
      <div class="header-tools">
        <select 
          class="currency-select"
          v-model="selectedCurrency"
          @change="handleCurrencyChange"
          aria-label="Select preferred currency"
        >
          <option v-for="opt in currencyOptions" :key="opt.value" :value="opt.value">
            {{ opt.label }}
          </option>
        </select>
        <div class="avatar">{{ auth.currentUser?.name.charAt(0).toUpperCase() }}</div>
      </div>
    </header>

    <!-- Main Balance Card Area -->
    <div class="balance-area animate-fade-in">
      <div class="balance-card card" :key="'balance-' + selectedCurrency">
        <p class="balance-label">💰 Total Balance</p>
        <h2 class="balance-amount">{{ formatCurrency(balance) }}</h2>
        <p class="balance-description">Current combined account total</p>
      </div>

      <div v-if="salary > 0" class="salary-card card animate-slide-in">
        <div class="salary-info">
          <p class="salary-label">💵 Remaining Salary</p>
          <h3 class="salary-amount" :class="{ 'text-red': remainingSalary < 0 }">
            {{ formatCurrency(remainingSalary) }}
          </h3>
        </div>
        <div class="salary-total">of {{ formatCurrency(salary) }}</div>
      </div>
    </div>

    <!-- Income / Expense Split -->
    <div class="summary-grid animate-fade-in" style="animation-delay: 0.1s">
      <SummaryCard title="Income" icon="📥" :amount="formatCurrency(income)" variant="income" />
      <SummaryCard title="Expense" icon="📤" :amount="formatCurrency(expense)" variant="expense" />
    </div>

    <!-- Quick Actions -->
    <div class="quick-actions animate-slide-in" style="animation-delay: 0.2s">
      <button class="action-btn primary" @click="router.push('/add')">
        <span>➕</span> Add Transaction
      </button>
      <button class="action-btn secondary" @click="router.push('/income')">
        <span>💰</span> Manage Income
      </button>
      <button class="action-btn secondary" @click="router.push('/budgets')">
        <span>🎯</span> Budgets
      </button>
    </div>

    <!-- Budget Progress Section -->
    <div v-if="budgetSummary.length > 0" class="budget-section animate-fade-in" style="animation-delay: 0.25s">
      <div class="section-header">
        <h3 class="section-title">🎯 Budget Tracking</h3>
        <button class="view-all-link" @click="router.push('/budgets')">Manage →</button>
      </div>
      <div class="budget-list">
        <BudgetProgress 
          v-for="b in budgetSummary" 
          :key="b.id"
          :category="b.category"
          :spent="b.spent"
          :limit="b.amount"
        />
      </div>
    </div>

    <!-- Transaction List Section -->
    <div class="section-header mt-4 animate-fade-in" style="animation-delay: 0.3s">
      <h3 class="section-title">📝 Recent Transactions</h3>
      <button v-if="transactions.length > 0" class="view-all-link" @click="router.push('/transactions')">
        See All →
      </button>
    </div>

    <div v-if="transactions.length > 0" class="transactions-container animate-fade-in" style="animation-delay: 0.35s">
      <div class="transactions-list">
        <TransactionItem 
          v-for="tx in recent" 
          :key="tx.id" 
          :transaction="tx" 
          @delete="requestDelete"
          @edit="editTransaction"
        />
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="empty-state animate-fade-in" style="animation-delay: 0.35s">
      <span class="empty-icon">🧾</span>
      <h3 class="empty-title">No transactions yet</h3>
      <p class="empty-text">Tap the button above to add your first expense or income.</p>
      <button class="empty-action-btn" @click="router.push('/add')">
        <span>➕</span> Add First Transaction
      </button>
    </div>

    <!-- Delete Modal -->
    <AppModal
      :show="showDelete"
      title="🗑️ Delete Transaction?"
      message="Are you sure you want to delete this transaction? This action cannot be undone."
      confirmText="Delete"
      danger
      @cancel="showDelete = false"
      @confirm="confirmDelete"
    />
  </div>
</template>

<style scoped>
.pb-24 { padding-bottom: 0; }
.dashboard-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 32px; gap: 16px; }
.header-left { flex: 1; }
.page-title { font-size: 32px; font-weight: 800; color: var(--text); margin: 0; }
.greeting { font-size: 14px; color: var(--text2); margin: 6px 0 0 0; font-weight: 500; }
.avatar { width: 56px; height: 56px; border-radius: 50%; background: linear-gradient(135deg, var(--blue), var(--blue-dark)); color: #fff; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 20px; box-shadow: 0 4px 12px rgba(14, 165, 233, 0.25); flex-shrink: 0; }

.balance-area { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 20px; margin-bottom: 32px; }
.balance-card { text-align: center; padding: 28px; background: linear-gradient(135deg, var(--blue-dim), var(--surface)); border: 1.5px solid var(--blue); border-radius: 16px; }
.balance-label { font-size: 12px; font-weight: 700; color: var(--text2); text-transform: uppercase; letter-spacing: 0.5px; margin: 0 0 12px 0; }
.balance-amount { font-size: 48px; font-weight: 800; color: var(--blue); margin: 0 0 8px 0; line-height: 1; }
.balance-description { font-size: 13px; color: var(--text2); margin: 0; font-weight: 500; }
.salary-card { display: flex; justify-content: space-between; align-items: center; padding: 20px 24px; background: var(--surface); border-left: 4px solid var(--blue); border-radius: 12px; }
.salary-label { font-size: 11px; font-weight: 700; color: var(--text2); text-transform: uppercase; margin-bottom: 4px; }
.salary-amount { font-size: 24px; font-weight: 800; color: var(--text); margin: 0; }
.salary-total { font-size: 13px; font-weight: 600; color: var(--text2); }
.text-red { color: var(--red); }
.summary-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px; margin-bottom: 32px; }
.quick-actions { display: grid; grid-template-columns: repeat(auto-fit, minmax(160px, 1fr)); gap: 12px; margin-bottom: 32px; }
.action-btn { padding: 14px 20px; border-radius: 12px; border: none; font-size: 14px; font-weight: 600; cursor: pointer; transition: all 0.2s; display: flex; align-items: center; justify-content: center; gap: 8px; font-family: var(--font); }
.action-btn.primary { background: var(--blue); color:#16164F; box-shadow: 0 4px 12px rgba(14, 165, 233, 0.2); }
.action-btn.primary:hover { background: var(--blue-dark); transform: translateY(-2px); }
.action-btn.secondary { background: var(--surface2); color: var(--text); border: 1.5px solid var(--border); }
.action-btn.secondary:hover { border-color: var(--blue); background: var(--blue-dim); }
.budget-section { margin-bottom: 32px; }
.section-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; }
.section-title { font-size: 18px; font-weight: 700; color: var(--text); margin: 0; }
.view-all-link { background: none; border: none; color: var(--blue); font-size: 13px; font-weight: 700; cursor: pointer; padding: 0; transition: all 0.2s; }
.view-all-link:hover { color: var(--blue-dark); }
.mt-4 { margin-top: 24px; }
.empty-state { display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 60px 40px; text-align: center; }
.empty-icon { font-size: 64px; margin-bottom: 16px; }
.empty-title { font-size: 20px; font-weight: 700; color: var(--text); margin: 0 0 8px 0; }
.empty-text { font-size: 14px; color: var(--text2); margin: 0 0 20px 0; }
.empty-action-btn { padding: 12px 24px; background: var(--blue); color: #16164F; border: none; border-radius: 12px; font-size: 14px; font-weight: 600; cursor: pointer; transition: all 0.2s; display: inline-flex; align-items: center; gap: 8px; }
.empty-action-btn:hover { background: var(--blue-dark); transform: translateY(-2px); }
.transactions-card { margin-bottom: 20px; }
.transactions-list { padding: 0; }

.animate-fade-in { animation: fadeIn 0.5s ease forwards; opacity: 0; }
.animate-slide-in { animation: slideIn 0.5s ease forwards; opacity: 0; }
@keyframes fadeIn { to { opacity: 1; } }
@keyframes slideIn { from { transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }

@media (max-width: 768px) {
  .dashboard-header { margin-bottom: 24px; }
  .page-title { font-size: 26px; }
  .balance-area { gap: 16px; margin-bottom: 24px; }
  .summary-grid { margin-bottom: 24px; }
  .quick-actions { margin-bottom: 24px; }
  .section-header { margin-bottom: 12px; }
  .section-title { font-size: 16px; }
}
</style>