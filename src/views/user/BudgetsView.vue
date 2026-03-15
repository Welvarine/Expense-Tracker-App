<script setup>
import { reactive, ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../../stores/useAuthStore.js'
import { useBudgetStore } from '../../stores/useBudgetStore.js'
import { useToast } from '../../composables/useToast.js'
import AppInput from '../../components/AppInput.vue'
import AppButton from '../../components/AppButton.vue'
import AppModal from '../../components/AppModal.vue'

const auth = useAuthStore()
const budgetStore = useBudgetStore()
const router = useRouter()
const { showToast } = useToast()

const userId = auth.currentUser.id
const budgets = budgetStore.userBudgets(userId)
const salary = ref(budgetStore.getSalary(userId))

const categories = [
  'Food & Drink', 'Groceries', 'Transport', 'Shopping', 
  'Utilities', 'Salary', 'Freelance', 'Gift', 'Other'
]

const form = reactive({
  category: '',
  amount: ''
})

const showAddModal = ref(false)
const budgetToDelete = ref(null)

function saveSalary() {
  budgetStore.setSalary(userId, salary.value)
  showToast('✅ Salary updated')
}

function handleAddBudget() {
  if (!form.category || !form.amount) return
  budgetStore.addBudget({ userId, ...form })
  showToast('✅ Budget added')
  showAddModal.value = false
  form.category = ''
  form.amount = ''
}

function confirmDelete(b) {
  budgetToDelete.value = b
}

function handleDelete() {
  budgetStore.deleteBudget(budgetToDelete.value.id)
  showToast('🗑️ Budget removed')
  budgetToDelete.value = null
}
</script>

<template>
  <div class="screen">
    <header class="page-header">
      <button class="back-btn" @click="router.back()">←</button>
      <div class="header-content">
        <h2 class="header-title">🎯 Budget Management</h2>
        <p class="header-subtitle">Plan your spending and salary</p>
      </div>
    </header>

    <!-- Salary Section -->
    <div class="card salary-section animate-fade-in">
      <h3 class="card-title">💵 Monthly Salary</h3>
      <p class="card-desc">Set your base monthly income to calculate remaining balance.</p>
      <div class="salary-input-group">
        <AppInput 
          type="number" 
          v-model="salary" 
          placeholder="0.00" 
        />
        <AppButton @click="saveSalary" class="save-btn">Save</AppButton>
      </div>
    </div>

    <!-- Budgets List -->
    <div class="section-header">
      <h3 class="section-title">📦 Category Budgets</h3>
      <button class="add-btn" @click="showAddModal = true">➕ Add Budget</button>
    </div>

    <div v-if="budgets.length === 0" class="empty-budgets animate-fade-in">
      <span class="empty-icon">🎯</span>
      <p>No budgets set yet. Track your spending by category!</p>
    </div>

    <div v-else class="budget-grid">
      <div v-for="b in budgets" :key="b.id" class="budget-card card animate-slide-in">
        <div class="budget-header">
          <span class="budget-cat">{{ b.category }}</span>
          <button class="delete-btn" @click="confirmDelete(b)">✕</button>
        </div>
        <div class="budget-amount">{{ budgetStore.getCategorySpending(userId, b.category).value }} / {{ b.amount }}</div>
      </div>
    </div>

    <!-- Add Budget Modal -->
    <AppModal :show="showAddModal" title="➕ New Category Budget" @cancel="showAddModal = false" @confirm="handleAddBudget">
      <div class="modal-form">
        <AppInput label="Category" type="select" v-model="form.category" :options="categories.map(c => ({ value: c, label: c }))" />
        <AppInput label="Budget Amount" type="number" v-model="form.amount" placeholder="0.00" />
      </div>
    </AppModal>

    <!-- Delete Confirm -->
    <AppModal 
      :show="!!budgetToDelete" 
      title="🗑️ Remove Budget?" 
      danger 
      @cancel="budgetToDelete = null" 
      @confirm="handleDelete"
    >
      <p>Are you sure you want to remove the budget for <strong>{{ budgetToDelete?.category }}</strong>?</p>
    </AppModal>
  </div>
</template>

<style scoped>
.page-header { display: flex; align-items: center; gap: 16px; margin-bottom: 32px; padding: 32px 40px 0 40px; }
.back-btn { width: 44px; height: 44px; border-radius: 50%; border: 1.5px solid var(--border); background: var(--surface); cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: 18px; }
.header-title { font-size: 28px; font-weight: 700; margin: 0; }
.header-subtitle { font-size: 13px; color: var(--text2); margin: 4px 0 0 0; }

.salary-section { margin-bottom: 32px; padding: 24px 40px; border-radius: 16px; }
.card-title { font-size: 16px; font-weight: 700; margin: 0 0 8px 0; }
.card-desc { font-size: 13px; color: var(--text2); margin-bottom: 16px; }
.salary-input-group { display: flex; gap: 12px; align-items: flex-start; }
.save-btn { height: 44px; padding: 0 20px; }

.section-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; padding: 0 40px; }
.section-title { font-size: 16px; font-weight: 700; margin: 0; }
.add-btn { background: none; border: none; color: var(--blue); font-weight: 700; font-size: 13px; cursor: pointer; }

.empty-budgets { text-align: center; padding: 60px 40px; color: var(--text2); }
.empty-icon { font-size: 48px; display: block; margin-bottom: 12px; }

.budget-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 16px; padding: 0 40px; }
.budget-card { padding: 16px; position: relative; }
.budget-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; }
.budget-cat { font-weight: 700; font-size: 14px; }
.delete-btn { background: none; border: none; color: var(--text3); cursor: pointer; font-size: 16px; padding: 4px; }
.budget-amount { font-size: 18px; font-weight: 800; color: var(--blue); }

.modal-form { display: flex; flex-direction: column; gap: 16px; padding: 8px 0; }

.animate-fade-in { animation: fadeIn 0.4s ease forwards; }
.animate-slide-in { animation: slideIn 0.4s ease forwards; }
@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
@keyframes slideIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
</style>
