<script setup>
import { reactive, ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../../stores/useAuthStore.js'
import { useTransactionStore } from '../../stores/useTransactionStore.js'
import { formatCurrency } from '../../utils/formatters.js'
import { useToast } from '../../composables/useToast.js'
import { useFormValidation } from '../../composables/useFormValidation.js'
import { isRequired, isPositiveAmount } from '../../utils/validators.js'
import AppInput from '../../components/AppInput.vue'
import AppButton from '../../components/AppButton.vue'

const auth = useAuthStore()
const store = useTransactionStore()
const router = useRouter()
const { showToast } = useToast()

const userId = auth.currentUser.id
const totalIncome = store.totalIncome(userId)
const totalExpense = store.totalExpense(userId)
const remainingBalance = computed(() => totalIncome.value - totalExpense.value)

const incomeTransactions = computed(() => {
  return store.userTransactions(userId).value.filter(t => t.type === 'income')
})

const form = reactive({
  amount: '',
  description: '',
  category: 'Salary',
  date: new Date().toISOString().split('T')[0]
})

const incomeCategories = [
  { value: 'Salary', label: '💰 Salary' },
  { value: 'Freelance', label: '💻 Freelance' },
  { value: 'Gift', label: '🎁 Gift' },
  { value: 'Bonus', label: '🎉 Bonus' },
  { value: 'Investment', label: '📈 Investment' },
  { value: 'Other', label: '💸 Other Income' }
]

const { errors, validate } = useFormValidation({
  amount: [isRequired, isPositiveAmount],
  category: [isRequired],
  date: [isRequired]
})

const loading = ref(false)

async function addIncome() {
  if (!validate(form)) return
  
  loading.value = true
  await new Promise(r => setTimeout(r, 400))
  
  const result = store.addTransaction({
    userId,
    type: 'income',
    ...form,
    amount: parseFloat(form.amount)
  })
  
  if (result) {
    showToast('✅ Income added successfully')
    form.amount = ''
    form.description = ''
    form.category = 'Salary'
    form.date = new Date().toISOString().split('T')[0]
  } else {
    showToast('❌ Failed to add income')
  }
  
  loading.value = false
}

function deleteIncome(id) {
  store.deleteTransaction(id)
  showToast('✅ Income removed')
}
</script>

<template>
  <div class="screen">
    <!-- Header -->
    <header class="page-header">
      <button class="back-btn" @click="router.back()">
        <span>←</span>
      </button>
      <div class="header-content">
        <h2 class="header-title">💰 Income Management</h2>
        <p class="header-subtitle">Track and manage your income sources</p>
      </div>
    </header>

    <!-- Balance Overview -->
    <div class="balance-overview animate-fade-in">
      <div class="balance-card card">
        <p class="balance-label">Total Income</p>
        <h2 class="balance-amount income">{{ formatCurrency(totalIncome.value) }}</h2>
      </div>
      <div class="balance-card card">
        <p class="balance-label">Total Expenses</p>
        <h2 class="balance-amount expense">{{ formatCurrency(totalExpense.value) }}</h2>
      </div>
      <div class="balance-card card primary">
        <p class="balance-label">Remaining Balance</p>
        <h2 class="balance-amount" :class="{ 'text-red': remainingBalance.value < 0 }">
          {{ formatCurrency(remainingBalance.value) }}
        </h2>
      </div>
    </div>

    <!-- Add Income Form -->
    <div class="form-section card animate-slide-in" style="animation-delay: 0.1s">
      <h3 class="form-title">➕ Add Income</h3>
      <form @submit.prevent="addIncome" class="form-container">
        <!-- Amount -->
        <div class="amount-section">
          <label class="amount-label">Amount</label>
          <div class="amount-field">
            <span class="currency-symbol">$</span>
            <input 
              type="number" 
              step="0.01" 
              v-model="form.amount" 
              placeholder="0.00"
              :class="{ error: errors.amount }"
            />
          </div>
          <p v-if="errors.amount" class="error-msg">{{ errors.amount }}</p>
        </div>

        <!-- Category -->
        <div class="form-group">
          <AppInput 
            label="Category" 
            type="select" 
            v-model="form.category" 
            :options="incomeCategories"
            :error="errors.category"
          />
        </div>

        <!-- Description -->
        <div class="form-group">
          <AppInput 
            label="Description (Optional)" 
            v-model="form.description" 
            placeholder="e.g. Monthly salary"
          />
        </div>

        <!-- Date -->
        <div class="form-group">
          <AppInput 
            label="Date" 
            type="date" 
            v-model="form.date" 
            :error="errors.date"
          />
        </div>

        <AppButton type="submit" class="submit-btn" :loading="loading">
          <span>✅</span> Add Income
        </AppButton>
      </form>
    </div>

    <!-- Income History -->
    <div class="section-header animate-fade-in" style="animation-delay: 0.2s">
      <h3 class="section-title">📊 Income History</h3>
      <span class="income-count">{{ incomeTransactions.length }} entries</span>
    </div>

    <div v-if="incomeTransactions.length === 0" class="empty-state animate-fade-in">
      <span class="empty-icon">📥</span>
      <h3 class="empty-title">No income recorded</h3>
      <p class="empty-text">Add your first income source above to get started.</p>
    </div>

    <div v-else class="income-list card p-0 animate-fade-in" style="animation-delay: 0.25s">
      <div 
        v-for="income in incomeTransactions" 
        :key="income.id"
        class="income-item"
      >
        <div class="income-info">
          <div class="income-header">
            <span class="income-category">{{ income.category }}</span>
            <span class="income-date">{{ income.date }}</span>
          </div>
          <p v-if="income.description" class="income-description">{{ income.description }}</p>
        </div>
        <div class="income-amount-section">
          <span class="income-amount">{{ formatCurrency(income.amount) }}</span>
          <button 
            class="delete-btn"
            @click="deleteIncome(income.id)"
            title="Delete income"
          >
            ✕
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.page-header {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  margin-bottom: 32px;
  padding: 32px 40px 0 40px;
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
  font-size: 28px;
  font-weight: 700;
  color: var(--text);
  margin: 0;
}

.header-subtitle {
  font-size: 13px;
  color: var(--text2);
  margin: 4px 0 0 0;
}

.balance-overview {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  margin-bottom: 32px;
  padding: 0 40px;
}

.balance-card {
  padding: 16px;
  border-radius: 12px;
  text-align: center;
}

.balance-card.primary {
  grid-column: 1 / -1;
  background: linear-gradient(135deg, var(--blue-dim), var(--surface));
  border: 1.5px solid var(--blue);
}

.balance-label {
  font-size: 11px;
  font-weight: 700;
  color: var(--text2);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin: 0 0 8px 0;
}

.balance-amount {
  font-size: 24px;
  font-weight: 800;
  margin: 0;
  color: var(--text);
}

.balance-amount.income {
  color: var(--green-dark);
}

.balance-amount.expense {
  color: var(--red);
}

.balance-amount.text-red {
  color: var(--red);
}

.form-section {
  margin-bottom: 32px;
  padding: 24px 40px;
  border-radius: 16px;
}

.form-title {
  font-size: 16px;
  font-weight: 700;
  color: var(--text);
  margin: 0 0 16px 0;
}

.form-container {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.amount-section {
  display: flex;
  flex-direction: column;
  gap: 12px;
  background: var(--surface2);
  padding: 16px;
  border-radius: 12px;
  border: 1.5px solid var(--border);
}

.amount-label {
  font-size: 13px;
  font-weight: 700;
  color: var(--text2);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.amount-field {
  position: relative;
  display: flex;
  align-items: center;
}

.currency-symbol {
  position: absolute;
  left: 0;
  font-size: 32px;
  font-weight: 800;
  color: var(--green-dark);
}

.amount-field input {
  width: 100%;
  padding: 12px 0 12px 40px;
  font-size: 44px;
  font-weight: 800;
  font-family: var(--font);
  border: none;
  background: transparent;
  color: var(--text);
  outline: none;
}

.amount-field input::placeholder {
  color: var(--border);
}

.amount-field input.error {
  color: var(--red);
}

.error-msg {
  font-size: 12px;
  color: var(--red);
  font-weight: 600;
  margin: 0;
}

.submit-btn {
  height: 54px;
  font-size: 16px;
  border-radius: 12px;
  margin-top: 8px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  margin-top: 32px;
  padding: 0 40px;
}

.section-title {
  font-size: 16px;
  font-weight: 700;
  color: var(--text);
  margin: 0;
}

.income-count {
  font-size: 12px;
  font-weight: 600;
  color: var(--text2);
  background: var(--surface2);
  padding: 4px 10px;
  border-radius: 8px;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 40px;
  gap: 12px;
  text-align: center;
  margin-top: 24px;
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

.income-list {
  overflow: hidden;
  border-radius: 12px;
  margin: 0 40px;
}

.p-0 {
  padding: 0;
}

.income-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  border-bottom: 1px solid var(--border);
  transition: all 0.2s;
}

.income-item:last-child {
  border-bottom: none;
}

.income-item:hover {
  background: var(--surface2);
}

.income-info {
  flex: 1;
  min-width: 0;
}

.income-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 4px;
}

.income-category {
  font-size: 14px;
  font-weight: 700;
  color: var(--text);
}

.income-date {
  font-size: 12px;
  color: var(--text2);
  background: var(--surface2);
  padding: 2px 8px;
  border-radius: 6px;
}

.income-description {
  font-size: 12px;
  color: var(--text2);
  margin: 0;
}

.income-amount-section {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-left: 16px;
  flex-shrink: 0;
}

.income-amount {
  font-size: 18px;
  font-weight: 800;
  color: var(--green-dark);
}

.delete-btn {
  width: 36px;
  height: 36px;
  border-radius: 8px;
  border: 1.5px solid var(--border);
  background: var(--surface);
  color: var(--text2);
  font-size: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
}

.delete-btn:hover {
  border-color: var(--red);
  background: var(--red-dim);
  color: var(--red);
}

.animate-fade-in {
  opacity: 0;
  animation: fadeIn 0.4s ease forwards;
}

.animate-slide-in {
  opacity: 0;
  transform: translateY(10px);
  animation: slideIn 0.4s ease forwards;
}

@keyframes fadeIn {
  to { opacity: 1; }
}

@keyframes slideIn {
  to { opacity: 1; transform: translateY(0); }
}
</style>
