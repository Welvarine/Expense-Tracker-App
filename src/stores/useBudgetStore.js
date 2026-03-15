import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { storage } from '../utils/storage.js'
import { useTransactionStore } from './useTransactionStore.js'

export const useBudgetStore = defineStore('budgets', () => {
  const budgets = ref(storage.get('et_budgets', []))

  const transactionStore = useTransactionStore()

  function _persist() {
    storage.set('et_budgets', budgets.value)
  }

  // ── Salary Actions (calculated from income transactions) ────────────
  function getSalary(userId) {
    // Salary is the total income from all transactions
    return transactionStore.totalIncome(userId).value
  }

  // ── Budget CRUD ───────────────────────────────────────────────────
  function userBudgets(userId) {
    return computed(() => budgets.value.filter(b => b.userId === userId))
  }

  function addBudget({ userId, category, amount, period = 'monthly' }) {
    const budget = {
      id: `bg-${Date.now()}`,
      userId,
      category,
      amount: parseFloat(amount),
      period,
      createdAt: new Date().toISOString()
    }
    budgets.value.push(budget)
    _persist()
    return budget
  }

  function updateBudget(id, updates) {
    const index = budgets.value.findIndex(b => b.id === id)
    if (index === -1) return null
    budgets.value[index] = { 
      ...budgets.value[index], 
      ...updates,
      amount: updates.amount !== undefined ? parseFloat(updates.amount) : budgets.value[index].amount
    }
    _persist()
    return budgets.value[index]
  }

  function deleteBudget(id) {
    budgets.value = budgets.value.filter(b => b.id !== id)
    _persist()
  }

  // ── Analysis ──────────────────────────────────────────────────────
  function getRemainingSalary(userId) {
    const salary = getSalary(userId)
    const expenses = transactionStore.totalExpense(userId).value
    return computed(() => salary - expenses)
  }

  function getCategorySpending(userId, category) {
    return computed(() => {
      const txs = transactionStore.transactions.filter(t => 
        t.userId === userId && 
        t.category === category && 
        t.type === 'expense'
      )
      return txs.reduce((sum, t) => sum + t.amount, 0)
    })
  }

  return {
    budgets,
    userBudgets, addBudget, updateBudget, deleteBudget,
    getSalary, getRemainingSalary, getCategorySpending
  }
})
