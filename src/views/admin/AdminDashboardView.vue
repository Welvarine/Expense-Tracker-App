<script setup>
import { useAuthStore } from '../../stores/useAuthStore.js'
import { useTransactionStore } from '../../stores/useTransactionStore.js'
import { formatCurrency } from '../../utils/formatters.js'
import SummaryCard from '../../components/SummaryCard.vue'

const auth = useAuthStore()
const store = useTransactionStore()

const totals = store.platformTotals
const totalUsers = auth.allUsers.length
</script>

<template>
  <div class="screen pb-24">
    <header class="mb-6 mt-2">
      <h1 class="font-bold">Admin Console</h1>
      <p class="text-sm mt-1">Platform overview and totals.</p>
    </header>

    <div class="card mb-4 bg-purple-dim border-purple text-center py-6 block-stats">
      <p class="text-xs font-bold text-purple uppercase tracking-wider mb-2">Platform Volume</p>
      <h2 class="text-4xl font-bold tracking-tight text-purple-dark">
        {{ formatCurrency(totals.income + totals.expense) }}
      </h2>
      <p class="text-xs text-purple mt-2 font-bold">{{ totals.count }} Total Transactions</p>
    </div>

    <div class="grid-2 mb-6">
      <SummaryCard title="Platform Income" icon="🏢" :amount="formatCurrency(totals.income)" variant="income" />
      <SummaryCard title="Platform Expense" icon="🏢" :amount="formatCurrency(totals.expense)" variant="expense" />
    </div>

    <div class="card flex justify-between items-center p-4">
      <div class="flex items-center gap-3">
        <span class="icon text-2xl">👥</span>
        <div>
          <h3 class="font-bold text-sm">Registered Users</h3>
          <p class="text-xs text-muted">{{ totalUsers }} Active Accounts</p>
        </div>
      </div>
      <router-link to="/admin/users" class="btn btn-secondary btn-sm">Manage</router-link>
    </div>
  </div>
</template>

<style scoped>
.pb-24 { padding-bottom: 96px; }
.grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
.bg-purple-dim { background: var(--purple-dim); }
.border-purple { border-color: var(--purple); }
.text-purple { color: var(--purple); }
.text-purple-dark { color: #5b21b6; }
</style>
