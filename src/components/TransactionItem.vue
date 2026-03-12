<script setup>
import { computed } from 'vue'
import { formatCurrency, formatDate } from '../utils/formatters.js'

const props = defineProps({
  transaction: Object,
  showUser: Boolean
})
defineEmits(['delete', 'edit'])

const isIncome = computed(() => props.transaction.type === 'income')
const sign = computed(() => isIncome.value ? '+' : '-')

const categoryIconMap = {
  'Food & Drink': '🍱',
  'Groceries': '🛒',
  'Transport': '🚗',
  'Shopping': '🛍️',
  'Utilities': '🔋',
  'Salary': '💰',
  'Freelance': '💻',
  'Gift': '🎁',
  'Other': '📋'
}

const icon = computed(() => categoryIconMap[props.transaction.category] || '💵')

// Check if due soon (simplified logic: tomorrow or overdue)
const isDueSoon = computed(() => {
  if (!props.transaction.dueDate) return false
  const due = new Date(props.transaction.dueDate)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const diffTime = due - today
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  return diffDays <= 2 && diffDays >= 0
})

const isOverdue = computed(() => {
  if (!props.transaction.dueDate) return false
  const due = new Date(props.transaction.dueDate)
  const today = new Date()
  today.setHours(0,0,0,0)
  return due < today
})
</script>

<template>
  <div class="transaction-item animate-fade-in">
    <div class="ti-container">
      <div class="ti-icon" :class="isIncome ? 'income' : 'expense'">
        {{ icon }}
      </div>
      
      <div class="ti-main">
        <div class="ti-header">
          <span class="ti-desc">{{ transaction.description || 'Transaction' }}</span>
          <span class="ti-amount" :class="isIncome ? 'text-green' : 'text-main'">
            {{ sign }}{{ formatCurrency(transaction.amount) }}
          </span>
        </div>
        
        <div class="ti-sub">
          <div class="ti-meta">
            <span class="ti-cat">{{ transaction.category }}</span> 
            <span class="ti-dot">•</span>
            <span class="ti-date">{{ formatDate(transaction.date) }}</span>
            <span v-if="showUser" class="ti-user">• User: {{ transaction.userId.slice(-4) }}</span>
          </div>
          
          <div v-if="transaction.dueDate" class="ti-due-tag" :class="{ 'due-soon': isDueSoon, 'overdue': isOverdue }">
            📅 Due: {{ formatDate(transaction.dueDate) }}
          </div>
        </div>
      </div>
    </div>

    <!-- Actions Overlay (Always present but hidden until hover/interaction) -->
    <div class="ti-actions">
      <button class="ti-btn edit-btn" @click="$emit('edit', transaction)">
        ✏️
      </button>
      <button class="ti-btn delete-btn" @click="$emit('delete', transaction)">
        🗑️
      </button>
    </div>
  </div>
</template>

<style scoped>
.transaction-item {
  position: relative;
  padding: 14px 12px;
  margin-bottom: 8px;
  border-radius: 16px;
  background: var(--surface);
  border: 1px solid var(--border);
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  overflow: hidden;
}

.transaction-item:hover {
  transform: translateY(-2px);
  border-color: var(--blue);
  box-shadow: 0 4px 12px rgba(14, 165, 233, 0.1);
}

.ti-container {
  display: flex;
  align-items: center;
  gap: 16px;
}

.ti-icon {
  width: 44px;
  height: 44px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 22px;
  flex-shrink: 0;
  background: var(--surface2);
  box-shadow: inset 0 2px 4px rgba(0,0,0,0.02);
}

.ti-icon.income { 
  background: var(--green-dim); 
  border: 1px solid rgba(34, 197, 94, 0.2);
}
.ti-icon.expense { 
  background: var(--red-dim); 
  border: 1px solid rgba(239, 68, 68, 0.2);
}

.ti-main {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.ti-header {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: 12px;
}

.ti-desc {
  font-weight: 700;
  font-size: 15px;
  color: var(--text);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.ti-amount {
  font-weight: 800;
  font-size: 16px;
  white-space: nowrap;
}

.ti-sub {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 8px;
}

.ti-meta {
  font-size: 11px;
  font-weight: 600;
  color: var(--text3);
  display: flex;
  align-items: center;
  gap: 4px;
}

.ti-cat {
  color: var(--blue);
  background: var(--blue-dim);
  padding: 1px 6px;
  border-radius: 6px;
}

.ti-dot {
  opacity: 0.5;
}

.ti-due-tag {
  font-size: 10px;
  font-weight: 700;
  padding: 2px 6px;
  border-radius: 6px;
  background: var(--surface2);
  color: var(--text2);
  white-space: nowrap;
}

.ti-due-tag.due-soon {
  background: rgba(234, 179, 8, 0.1);
  color: #ca8a04;
}

.ti-due-tag.overdue {
  background: rgba(239, 68, 68, 0.1);
  color: #dc2626;
}

/* Actions */
.ti-actions {
  position: absolute;
  right: 0;
  top: 0;
  bottom: 0;
  width: 100px;
  display: flex;
  transform: translateX(100%);
  transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  background: linear-gradient(to right, transparent, var(--surface) 20%);
}

.transaction-item:hover .ti-actions {
  transform: translateX(0);
}

.ti-btn {
  flex: 1;
  border: none;
  background: transparent;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 16px;
  transition: transform 0.2s;
}

.ti-btn:hover {
  transform: scale(1.1);
}

.edit-btn { color: var(--blue); }
.delete-btn { color: var(--red); }

.animate-fade-in {
  animation: fadeIn 0.4s ease forwards;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(4px); }
  to { opacity: 1; transform: translateY(0); }
}

.text-green { color: var(--green); }
.text-main { color: var(--text); }
</style>
