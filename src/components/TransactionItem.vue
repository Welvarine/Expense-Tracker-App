<script setup>
import { computed } from 'vue'
import { formatCurrency, formatDate } from '../utils/formatters.js'

const props = defineProps({
  transaction: Object,
  showUser: Boolean
})
defineEmits(['delete'])

const isIncome = computed(() => props.transaction.type === 'income')
const sign = computed(() => isIncome.value ? '+' : '-')
</script>

<template>
  <div class="transaction-item">
    <div class="ti-icon" :class="isIncome ? 'income' : 'expense'">
      {{ transaction.category || '💵' }}
    </div>
    
    <div class="ti-main">
      <div class="ti-desc">{{ transaction.description || 'Transaction' }}</div>
      <div class="ti-meta">
        {{ formatDate(transaction.date) }}
        <span v-if="showUser" class="ti-user">• User: {{ transaction.userId.slice(-4) }}</span>
      </div>
    </div>

    <div class="ti-amount" :class="isIncome ? 'text-green' : 'text-text'">
      {{ sign }}{{ formatCurrency(transaction.amount) }}
    </div>

    <!-- Swipe / Hover delete trigger -->
    <button class="ti-delete" @click="$emit('delete', transaction)">🗑️</button>
  </div>
</template>

<style scoped>
.transaction-item {
  display: flex; align-items: center; gap: 12px;
  padding: 12px 0;
  border-bottom: 1px solid var(--border);
  position: relative;
  overflow: hidden;
}
.transaction-item:last-child { border-bottom: none; }

.ti-icon {
  width: 40px; height: 40px;
  border-radius: 12px;
  display: flex; align-items: center; justify-content: center;
  font-size: 20px;
  background: var(--surface2);
}
.ti-icon.income { background: var(--green-dim); }
.ti-icon.expense { background: var(--red-dim); }

.ti-main { flex: 1; min-width: 0; }
.ti-desc { font-weight: 600; font-size: 15px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.ti-meta { font-size: 12px; color: var(--text3); margin-top: 2px; }

.ti-amount { font-weight: 700; font-size: 15px; }

/* Desktop hover / Mobile swipe simulation */
.ti-delete {
  position: absolute; right: 0; top: 0; bottom: 0;
  width: 48px;
  background: var(--red-dim);
  border: none;
  display: flex; align-items: center; justify-content: center;
  font-size: 18px;
  cursor: pointer;
  transform: translateX(100%);
  transition: transform 0.2s ease;
}
.transaction-item:hover .ti-delete { transform: translateX(0); }
</style>
