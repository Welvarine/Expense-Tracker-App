<script setup>
import { computed } from 'vue'
import { formatCurrency } from '../utils/formatters.js'

const props = defineProps({
  category: String,
  spent: { type: Number, default: 0 },
  limit: { type: Number, default: 0 },
  icon: { type: String, default: '📊' }
})

const percentage = computed(() => {
  if (props.limit <= 0) return 0
  return Math.min(Math.round((props.spent / props.limit) * 100), 100)
})

const isOver = computed(() => props.spent > props.limit)
const statusColor = computed(() => {
  if (isOver.value) return 'var(--red)'
  if (percentage.value > 80) return 'var(--amber)'
  return 'var(--blue)'
})
</script>

<template>
  <div class="budget-progress animate-fade-in">
    <div class="progress-info">
      <div class="category-name">
        <span class="category-icon">{{ icon }}</span>
        <span>{{ category }}</span>
      </div>
      <div class="progress-stats">
        <span class="spent">{{ formatCurrency(spent) }}</span>
        <span class="limit">of {{ formatCurrency(limit) }}</span>
      </div>
    </div>
    
    <div class="progress-bar-container">
      <div 
        class="progress-bar" 
        :style="{ width: percentage + '%', backgroundColor: statusColor }"
      ></div>
    </div>
    
    <div v-if="isOver" class="over-budget-warning">
      ⚠️ Over budget by {{ formatCurrency(spent - limit) }}
    </div>
  </div>
</template>

<style scoped>
.budget-progress {
  padding: 12px;
  background: var(--surface2);
  border-radius: 12px;
  border: 1px solid var(--border);
  margin-bottom: 12px;
}

.progress-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.category-name {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 700;
  font-size: 13px;
  color: var(--text);
}

.progress-stats {
  font-size: 12px;
  display: flex;
  align-items: baseline;
  gap: 4px;
}

.spent {
  font-weight: 800;
  color: var(--text);
}

.limit {
  color: var(--text2);
  font-weight: 500;
}

.progress-bar-container {
  height: 8px;
  background: var(--border);
  border-radius: 4px;
  overflow: hidden;
}

.progress-bar {
  height: 100%;
  border-radius: 4px;
  transition: width 1s cubic-bezier(0.4, 0, 0.2, 1);
}

.over-budget-warning {
  margin-top: 6px;
  font-size: 11px;
  font-weight: 700;
  color: var(--red);
  display: flex;
  align-items: center;
  gap: 4px;
}

.animate-fade-in {
  animation: fadeIn 0.4s ease forwards;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(4px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
