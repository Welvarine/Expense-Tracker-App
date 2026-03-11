<script setup>
import { reactive, ref, computed } from 'vue'
import { useRouter } from 'vue-router'
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
  date: new Date().toISOString().split('T')[0]
})

const currentCategories = computed(() => categories[form.type])

const { errors, validate } = useFormValidation({
  amount: [isRequired, isPositiveAmount],
  category: [isRequired],
  date: [isRequired]
})

const loading = ref(false)

function setType(type) {
  form.type = type
  form.category = '' // reset category on type change
}

async function submit() {
  if (!validate(form)) return
  
  loading.value = true
  await new Promise(r => setTimeout(r, 400)) // simulate save delay
  
  store.addTransaction({ ...form, userId: auth.currentUser.id })
  loading.value = false
  
  showToast('Transaction added successfully')
  router.back()
}
</script>

<template>
  <div class="screen pb-24">
    <header class="flex items-center gap-4 mb-6 mt-2">
      <button class="icon-btn" @click="router.back()">←</button>
      <h2 class="font-bold">Add Transaction</h2>
    </header>

    <!-- Type Toggle -->
    <div class="type-toggle flex p-1 bg-surface2 rounded-lg border mb-6">
      <button 
        class="toggle-btn" 
        :class="{ active: form.type === 'expense' }" 
        @click="setType('expense')"
      >Expense</button>
      <button 
        class="toggle-btn" 
        :class="{ active: form.type === 'income' }" 
        @click="setType('income')"
      >Income</button>
    </div>

    <!-- Offline Banner indicator -->
    <div v-if="!navigator.onLine" class="card bg-amber-dim border-amber text-amber mb-4 p-3 text-xs font-bold flex gap-2">
      <span>📵</span> You are offline. Changes will be saved locally.
    </div>

    <form @submit.prevent="submit" class="flex flex-col gap-5">
      <!-- Amount -->
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
      <p v-if="errors.amount" class="error-msg -mt-3">{{ errors.amount }}</p>

      <AppInput 
        label="Description (Optional)" 
        v-model="form.description" 
        placeholder="e.g. Morning coffee" 
      />

      <AppInput 
        label="Category" 
        type="select" 
        v-model="form.category" 
        :options="currentCategories"
        :error="errors.category" 
      />

      <AppInput 
        label="Date" 
        type="date" 
        v-model="form.date" 
        :error="errors.date" 
      />

      <!-- Review / Summary preview -->
      <div v-if="form.amount > 0" class="review-card card mt-2 p-4 text-sm bg-surface2 border">
        <p class="font-bold mb-2">Review</p>
        <div class="flex justify-between text-muted mb-1">
          <span>Type:</span> <span class="text-text capitalize font-bold">{{ form.type }}</span>
        </div>
        <div class="flex justify-between text-muted">
          <span>Amount:</span> <span class="text-text font-bold">${{ form.amount }}</span>
        </div>
      </div>

      <AppButton type="submit" class="mt-4" :loading="loading">
        Save Transaction
      </AppButton>
    </form>
  </div>
</template>

<style scoped>
.pb-24 { padding-bottom: 96px; }
.icon-btn {
  width: 40px; height: 40px; border-radius: 50%;
  border: 1px solid var(--border); background: var(--surface);
  font-size: 18px; display: flex; align-items: center; justify-content: center;
  cursor: pointer;
}

.type-toggle {
  background: var(--surface2);
  border-radius: var(--radius-sm);
  border: 1.5px solid var(--border);
}
.toggle-btn {
  flex: 1; padding: 10px; border-radius: 6px; border: none; background: transparent;
  font-size: 13px; font-weight: 700; color: var(--text3); cursor: pointer;
  transition: all 0.2s;
}
.toggle-btn.active {
  background: var(--surface); color: var(--text); box-shadow: var(--shadow);
}

.amount-field {
  position: relative;
  display: flex; align-items: center; justify-content: center;
}
.amount-field .currency-symbol {
  position: absolute; left: 16px; font-size: 32px; font-weight: 800; color: var(--text3);
}
.amount-field input {
  width: 100%;
  padding: 20px 20px 20px 48px;
  font-size: 36px; font-weight: 800; font-family: var(--font);
  border: 1.5px solid var(--border); border-radius: var(--radius);
  background: var(--surface2); color: var(--text);
  outline: none; transition: border-color .2s;
}
.amount-field input:focus { border-color: var(--blue); }
.amount-field input.error { border-color: var(--red); }

.error-msg { font-size: 12px; color: var(--red); font-weight: 600; }

.bg-amber-dim { background: var(--amber-dim); }
.text-amber { color: var(--amber); }
.border-amber { border-color: var(--amber); }
</style>
