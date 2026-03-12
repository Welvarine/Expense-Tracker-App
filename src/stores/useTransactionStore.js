import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { storage } from '../utils/storage.js'

export const useTransactionStore = defineStore('transactions', () => {
  const transactions = ref(storage.get('et_transactions', []))

  function _persist() {
    storage.set('et_transactions', transactions.value)
  }

  // ── Getters (all-user) ────────────────────────────────────────────
  const allTransactions = computed(() => transactions.value)

  // ── Per-user getters ──────────────────────────────────────────────
  function userTransactions(userId) {
    return computed(() => transactions.value.filter(t => t.userId === userId))
  }

  function filteredTransactions(userId, type) {
    return computed(() => {
      const list = transactions.value.filter(t => t.userId === userId)
      if (type === 'all') return list
      return list.filter(t => t.type === type)
    })
  }

  function totalIncome(userId) {
    return computed(() =>
      transactions.value
        .filter(t => t.userId === userId && t.type === 'income')
        .reduce((s, t) => s + t.amount, 0)
    )
  }

  function totalExpense(userId) {
    return computed(() =>
      transactions.value
        .filter(t => t.userId === userId && t.type === 'expense')
        .reduce((s, t) => s + t.amount, 0)
    )
  }

  function balance(userId) {
    return computed(() => totalIncome(userId).value - totalExpense(userId).value)
  }

  // ── Admin getters ─────────────────────────────────────────────────
  const platformTotals = computed(() => {
    const income  = transactions.value.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0)
    const expense = transactions.value.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0)
    return { income, expense, balance: income - expense, count: transactions.value.length }
  })

  // ── Actions ───────────────────────────────────────────────────────
  function addTransaction({ userId, type, amount, description, category, date, dueDate }) {
    const tx = {
      id: `tx-${Date.now()}`,
      userId,
      type,
      amount: parseFloat(amount),
      description: description || '',
      category,
      date: date || new Date().toISOString().split('T')[0],
      dueDate: dueDate || null,
      createdAt: new Date().toISOString()
    }
    transactions.value = [tx, ...transactions.value]
    _persist()
    return tx
  }

  function deleteTransaction(id) {
    transactions.value = transactions.value.filter(t => t.id !== id)
    _persist()
  }

  function deleteByUser(userId) {
    transactions.value = transactions.value.filter(t => t.userId !== userId)
    _persist()
  }

  function updateTransaction(id, updates) {
    const index = transactions.value.findIndex(t => t.id === id)
    if (index === -1) return null

    const updated = {
      ...transactions.value[index],
      ...updates,
      amount: updates.amount !== undefined ? parseFloat(updates.amount) : transactions.value[index].amount,
      updatedAt: new Date().toISOString()
    }
    
    transactions.value[index] = updated
    // Force reactivity update for the array
    transactions.value = [...transactions.value]
    _persist()
    return updated
  }

  return {
    transactions, allTransactions,
    platformTotals,
    userTransactions, filteredTransactions,
    totalIncome, totalExpense, balance,
    addTransaction, deleteTransaction, deleteByUser, updateTransaction
  }
})
