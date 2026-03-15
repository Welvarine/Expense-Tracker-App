import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { storage } from '../utils/storage.js'

export const useTransactionStore = defineStore('transactions', () => {
  const transactions = ref(storage.get('et_transactions', []))

  function _persist() {
    storage.set('et_transactions', transactions.value)
  }

  // ── Utility: Normalize userId (string/number handling) ────────────
  function normalizeUserId(userId) {
    return String(userId).trim()
  }

  // ── Getters (all-user) ────────────────────────────────────────────
  const allTransactions = computed(() => transactions.value)

  // ── Per-user getters ──────────────────────────────────────────────
  function userTransactions(userId) {
    return computed(() => {
      if (!userId) {
        console.warn('⚠️ userTransactions called without userId')
        return []
      }
      const normalized = normalizeUserId(userId)
      return transactions.value.filter(t => normalizeUserId(t.userId) === normalized)
    })
  }

  function filteredTransactions(userId, type) {
    return computed(() => {
      if (!userId) {
        console.warn('⚠️ filteredTransactions called without userId')
        return []
      }
      const normalized = normalizeUserId(userId)
      const list = transactions.value.filter(t => normalizeUserId(t.userId) === normalized)
      
      if (type.value === 'all') return list
      return list.filter(t => t.type === type.value)
    })
  }

  function totalIncome(userId) {
    return computed(() => {
      if (!userId) return 0
      const normalized = normalizeUserId(userId)
      return transactions.value
        .filter(t => normalizeUserId(t.userId) === normalized && t.type === 'income')
        .reduce((s, t) => s + (parseFloat(t.amount) || 0), 0)
    })
  }

  function totalExpense(userId) {
    return computed(() => {
      if (!userId) return 0
      const normalized = normalizeUserId(userId)
      return transactions.value
        .filter(t => normalizeUserId(t.userId) === normalized && t.type === 'expense')
        .reduce((s, t) => s + (parseFloat(t.amount) || 0), 0)
    })
  }

  function balance(userId) {
    return computed(() => {
      if (!userId) return 0
      return totalIncome(userId).value - totalExpense(userId).value
    })
  }

  // ── Admin getters ─────────────────────────────────────────────────
  const platformTotals = computed(() => {
    const income = transactions.value
      .filter(t => t.type === 'income')
      .reduce((s, t) => s + (parseFloat(t.amount) || 0), 0)
    
    const expense = transactions.value
      .filter(t => t.type === 'expense')
      .reduce((s, t) => s + (parseFloat(t.amount) || 0), 0)
    
    return {
      income,
      expense,
      balance: income - expense,
      count: transactions.value.length
    }
  })

  // ── Actions ───────────────────────────────────────────────────────
  function addTransaction({ userId, type, amount, description, category, date, dueDate }) {
    // Validation
    if (!userId) {
      console.error('❌ addTransaction: userId is required')
      return null
    }
    if (!type || !['income', 'expense'].includes(type)) {
      console.error('❌ addTransaction: invalid type')
      return null
    }
    if (!category) {
      console.error('❌ addTransaction: category is required')
      return null
    }

    const parsedAmount = parseFloat(amount)
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      console.error('❌ addTransaction: invalid amount')
      return null
    }

    const tx = {
      id: `tx-${Date.now()}`,
      userId: normalizeUserId(userId),
      type,
      amount: parsedAmount,
      description: description || '',
      category,
      date: date || new Date().toISOString().split('T')[0],
      dueDate: dueDate || null,
      createdAt: new Date().toISOString()
    }

    console.log('✅ Adding transaction:', tx)
    transactions.value = [tx, ...transactions.value]
    _persist()
    console.log('✅ Persisted. Total transactions:', transactions.value.length)

    return tx
  }

  function deleteTransaction(id) {
    if (!id) {
      console.error('❌ deleteTransaction: id is required')
      return false
    }

    const before = transactions.value.length
    transactions.value = transactions.value.filter(t => t.id !== id)
    
    if (transactions.value.length < before) {
      _persist()
      console.log('✅ Transaction deleted')
      return true
    }

    console.warn('⚠️ Transaction not found:', id)
    return false
  }

  function deleteByUser(userId) {
    if (!userId) {
      console.error('❌ deleteByUser: userId is required')
      return false
    }

    const normalized = normalizeUserId(userId)
    const before = transactions.value.length
    transactions.value = transactions.value.filter(t => normalizeUserId(t.userId) !== normalized)
    
    if (transactions.value.length < before) {
      _persist()
      console.log(`✅ Deleted ${before - transactions.value.length} transactions for user ${userId}`)
      return true
    }

    console.warn('⚠️ No transactions found for user:', userId)
    return false
  }

  function updateTransaction(id, updates) {
    if (!id) {
      console.error('❌ updateTransaction: id is required')
      return null
    }

    const index = transactions.value.findIndex(t => t.id === id)
    if (index === -1) {
      console.error('❌ updateTransaction: transaction not found:', id)
      return null
    }

    const updated = {
      ...transactions.value[index],
      ...updates,
      amount: updates.amount !== undefined 
        ? parseFloat(updates.amount) 
        : transactions.value[index].amount,
      updatedAt: new Date().toISOString()
    }

    transactions.value[index] = updated
    // Force reactivity
    transactions.value = [...transactions.value]
    _persist()

    console.log('✅ Transaction updated:', updated)
    return updated
  }

  return {
    transactions,
    allTransactions,
    platformTotals,
    userTransactions,
    filteredTransactions,
    totalIncome,
    totalExpense,
    balance,
    addTransaction,
    deleteTransaction,
    deleteByUser,
    updateTransaction
  }
})