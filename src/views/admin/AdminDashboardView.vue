<script setup>
import { useAuthStore } from '../../stores/useAuthStore.js'
import { useTransactionStore } from '../../stores/useTransactionStore.js'
import { formatCurrency } from '../../utils/formatters.js'
import SummaryCard from '../../components/SummaryCard.vue'

const auth = useAuthStore()
const store = useTransactionStore()

const totalUsers = auth.allUsers.length
</script>

<template>
  <div class="screen">
    <header class="mb-6 mt-2 px-10">
      <h1 class="font-bold">Admin Console</h1>
      <p class="text-sm mt-1">Platform overview and totals.</p>
    </header>

    <div class="card mb-4 bg-purple-dim border-purple text-center py-6 block-stats">
      <p class="text-xs font-bold text-purple uppercase tracking-wider mb-2">Platform Volume</p>
      <h2 class="text-4xl font-bold tracking-tight text-purple-dark">
        {{ formatCurrency(store.platformTotals.income + store.platformTotals.expense) }}
      </h2>
      <p class="text-xs text-purple mt-2 font-bold">{{ store.platformTotals.count }} Total Transactions</p>
    </div>

    <div class="grid-2 mb-6">
      <SummaryCard title="Platform Income" icon="🏢" :amount="formatCurrency(store.platformTotals.income)" variant="income" />
      <SummaryCard title="Platform Expense" icon="🏢" :amount="formatCurrency(store.platformTotals.expense)" variant="expense" />
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
.px-10 { padding: 0 40px; }
.mb-6 { margin-bottom: 32px; }
.mt-2 { margin-top: 8px; }
.mb-4 { margin-bottom: 24px; }
.mb-6 { margin-bottom: 32px; }
.grid-2 { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 20px; margin-bottom: 32px; }
.bg-purple-dim { background: var(--purple-dim); }
.border-purple { border-color: var(--purple); }
.text-purple { color: var(--purple); }
.text-purple-dark { color: #5b21b6; }
.block-stats { display: block; }
.p-4 { padding: 20px 40px; }
.flex { display: flex; }
.justify-between { justify-content: space-between; }
.items-center { align-items: center; }
.gap-3 { gap: 12px; }
.icon { font-size: 24px; }
.font-bold { font-weight: 700; }
.text-sm { font-size: 14px; }
.text-xs { font-size: 12px; }
.text-2xl { font-size: 24px; }
.text-4xl { font-size: 36px; }
.text-purple { color: var(--purple); }
.text-purple-dark { color: #5b21b6; }
.uppercase { text-transform: uppercase; }
.tracking-wider { letter-spacing: 0.05em; }
.py-6 { padding: 24px 0; }
.py-3 { padding: 12px 0; }
.mt-1 { margin-top: 4px; }
.mt-2 { margin-top: 8px; }
.btn { padding: 8px 16px; border-radius: 8px; border: none; cursor: pointer; font-weight: 600; }
.btn-secondary { background: var(--surface2); color: var(--text); border: 1px solid var(--border); }
.btn-sm { font-size: 12px; padding: 6px 12px; }
</style>
