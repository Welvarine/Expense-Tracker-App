<script setup>
import { reactive, ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '../../stores/useAuthStore.js'
import { useTransactionStore } from '../../stores/useTransactionStore.js'
import { useFormValidation } from '../../composables/useFormValidation.js'
import { isRequired, isPositiveAmount } from '../../utils/validators.js'
import { useToast } from '../../composables/useToast.js'
import AppInput from '../../components/AppInput.vue'
import AppButton from '../../components/AppButton.vue'

const auth = useAuthStore()
const store = useTransactionStore()
const router = useRouter()
const route = useRoute()
const { showToast } = useToast()

const categories = {
  expense: [
    { value: 'Food & Drink', label: '🍕 Food & Drink' },
    { value: 'Groceries', label: '🛒 Groceries' },
    { value: 'Transport', label: '🚌 Transport' },
    { value: 'Shopping', label: '🛍️ Shopping' },
    { value: 'Utilities', label: '⚡ Utilities' },
    { value: 'Other', label: '📦 Other Expense' }
  ],
  income: [
    { value: 'Salary', label: '💰 Salary' },
    { value: 'Freelance', label: '💻 Freelance' },
    { value: 'Gift', label: '🎁 Gift' },
    { value: 'Other', label: '💸 Other Income' }
  ]
}

const form = reactive({
  type: 'expense',
  amount: '',
  description: '',
  category: '',
  date: '',
  dueDate: ''
})

const currentCategories = ref([])
const loading = ref(false)
const transactionId = route.params.id

const { errors, validate } = useFormValidation({
  amount: [isRequired, isPositiveAmount],
  category: [isRequired],
  date: [isRequired]
})

onMounted(() => {
  const userId = auth.currentUser.id
  const userTxs = store.userTransactions(userId)
  
  console.log('🔍 DEBUG INFO:')
  console.log('User ID:', userId)
  console.log('Transaction ID from URL:', transactionId)
  console.log('All user transactions:', userTxs.value)
  
  // Find the transaction by ID
  const tx = userTxs.value.find(t => {
    console.log(`Comparing: ${String(t.id)} === ${String(transactionId)}`)
    return String(t.id) === String(transactionId)
  })
  
  console.log('Found transaction:', tx)
  
  if (!tx) {
    console.error('❌ Transaction not found!')
    showToast('❌ Transaction not found')
    router.push('/dashboard')
    return
  }

  // Load transaction into form
  form.type = tx.type
  form.amount = String(tx.amount)
  form.description = tx.description
  form.category = tx.category
  form.date = tx.date
  form.dueDate = tx.dueDate || ''
  currentCategories.value = categories[form.type]
  
  console.log('✅ Transaction loaded successfully')
})

function setType(type) {
  form.type = type
  form.category = ''
  currentCategories.value = categories[type]
}

async function submit() {
  if (!validate(form)) return
  
  loading.value = true
  await new Promise(r => setTimeout(r, 400))
  
  store.updateTransaction(transactionId, { 
    ...form,
    amount: parseFloat(form.amount)
  })
  loading.value = false
  
  showToast('✅ Transaction updated successfully')
  router.back()
}
</script>

<template>
  <div class="screen">
    <header class="page-header">
      <button class="back-btn" @click="router.back()">
        <span class="back-icon">←</span>
      </button>
      <div class="header-content">
        <h2 class="header-title">
          <span class="header-emoji">✏️</span>
          Edit Transaction
        </h2>
        <p class="header-subtitle">Update your transaction details</p>
      </div>
    </header>

    <!-- Type Toggle -->
    <div class="type-toggle-container animate-fade-in">
      <button 
        class="type-toggle-btn" 
        :class="{ active: form.type === 'expense' }" 
        @click="setType('expense')"
      >
        <span>📤</span> Expense
      </button>
      <button 
        class="type-toggle-btn" 
        :class="{ active: form.type === 'income' }" 
        @click="setType('income')"
      >
        <span>📥</span> Income
      </button>
    </div>

    <form @submit.prevent="submit" class="form-container">
      <!-- Amount -->
      <div class="amount-section animate-slide-in" style="animation-delay: 0.1s">
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

      <!-- Description -->
      <div class="form-group animate-slide-in" style="animation-delay: 0.2s">
        <AppInput 
          label="📝 Description (Optional)" 
          v-model="form.description" 
          placeholder="e.g. Morning coffee" 
        />
      </div>

      <!-- Category -->
      <div class="form-group animate-slide-in" style="animation-delay: 0.3s">
        <AppInput 
          label="🏷️ Category" 
          type="select" 
          v-model="form.category" 
          :options="currentCategories"
          :error="errors.category" 
        />
      </div>

      <!-- Date -->
      <div class="form-group animate-slide-in" style="animation-delay: 0.4s">
        <AppInput 
          label="📅 Date" 
          type="date" 
          v-model="form.date" 
          :error="errors.date" 
        />
      </div>

      <!-- Due Date -->
      <div class="form-group animate-slide-in" style="animation-delay: 0.45s">
        <AppInput 
          label="🔔 Due Date (Optional)" 
          type="date" 
          v-model="form.dueDate" 
          placeholder="Set a deadline"
        />
      </div>

      <!-- Review Summary -->
      <div v-if="form.amount > 0" class="review-card glass animate-fade-in">
        <div class="review-header">
          <span class="review-icon">👀</span>
          <p class="review-title">Quick Review</p>
        </div>
        <div class="review-content">
          <div class="review-row">
            <span class="review-label">Transaction Type:</span>
            <span class="review-value-tag" :class="form.type">
              {{ form.type === 'income' ? '📥 Income' : '📤 Expense' }}
            </span>
          </div>
          <div class="review-row">
            <span class="review-label">Total Amount:</span>
            <span class="review-amount">${{ form.amount }}</span>
          </div>
          <div class="review-row">
            <span class="review-label">Category:</span>
            <span class="review-value">{{ form.category || 'Not selected' }}</span>
          </div>
        </div>
      </div>

      <AppButton type="submit" class="submit-btn animate-slide-in" style="animation-delay: 0.5s" :loading="loading">
        <span>💾</span> Update Transaction
      </AppButton>
    </form>
  </div>
</template>

<style scoped>
/* Animations */
.animate-slide-in {
  opacity: 0;
  transform: translateY(10px);
  animation: slide-in 0.4s ease forwards;
}

@keyframes slide-in {
  to { opacity: 1; transform: translateY(0); }
}

.animate-fade-in {
  opacity: 0;
  animation: fade-in 0.3s ease forwards;
}

@keyframes fade-in {
  to { opacity: 1; }
}

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
  display: flex;
  align-items: center;
  gap: 8px;
}

.header-emoji {
  font-size: 24px;
}

.header-subtitle {
  font-size: 13px;
  color: var(--text2);
  margin: 4px 0 0 0;
}

.type-toggle-container {
  display: flex;
  gap: 12px;
  margin-bottom: 32px;
  padding: 4px 40px;
  background: var(--surface2);
  border-radius: 14px;
  border: 1px solid var(--border);
}

.type-toggle-btn {
  flex: 1;
  padding: 10px 16px;
  border-radius: 10px;
  border: none;
  background: transparent;
  color: var(--text2);
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-family: var(--font);
}

.type-toggle-btn:hover:not(.active) {
  background: rgba(14, 165, 233, 0.05);
  color: var(--blue);
}

.type-toggle-btn.active {
  background: var(--surface);
  color: var(--blue);
  box-shadow: 0 4px 12px rgba(14, 165, 233, 0.15);
  transform: scale(1.02);
}

.type-toggle-btn.active span {
  transform: scale(1.1);
}

.form-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 0 40px 40px 40px;
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
  border-radius: 18px;
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
  color: var(--blue);
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
  transition: all 0.3s;
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

.review-card.glass {
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1.5px solid var(--blue);
  padding: 16px;
  border-radius: 18px;
}

[data-theme="dark"] .review-card.glass {
  background: rgba(26, 58, 82, 0.7);
}

.review-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
}

.review-icon {
  font-size: 18px;
}

.review-title {
  font-size: 13px;
  font-weight: 700;
  color: var(--text);
  margin: 0;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.review-content {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.review-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 13px;
}

.review-label {
  color: var(--text2);
  font-weight: 500;
}

.review-value-tag {
  padding: 4px 10px;
  border-radius: 8px;
  font-weight: 700;
  font-size: 12px;
}

.review-value-tag.income { background: var(--green-dim); color: var(--green-dark); }
.review-value-tag.expense { background: var(--red-dim); color: var(--red-dark); }

.review-value {
  color: var(--text);
  font-weight: 600;
}

.review-amount {
  color: var(--blue);
  font-weight: 800;
  font-size: 18px;
}

.submit-btn {
  margin-top: 12px;
  height: 54px;
  font-size: 16px;
  border-radius: 16px;
}

.submit-btn:hover {
  transform: translateY(-2px) scale(1.01);
}
</style>
