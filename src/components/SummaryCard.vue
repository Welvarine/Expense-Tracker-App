<script setup>
defineProps({
  title: String,
  amount: [String, Number],
  icon: String,
  variant: { type: String, default: 'neutral' } // neutral, income, expense
})
</script>

<template>
  <div class="summary-card card" :class="`variant-${variant}`">
    <div class="sc-header">
      <span class="sc-icon">{{ icon }}</span>
      <span class="sc-title">{{ title }}</span>
    </div>
    <div class="sc-amount">{{ amount }}</div>
  </div>
</template>

<style scoped>
.summary-card {
  display: flex; flex-direction: column; gap: 8px;
}
.sc-header {
  display: flex; align-items: center; gap: 6px;
  font-size: 13px; font-weight: 600; color: var(--text2);
}
.sc-amount {
  font-size: 24px; font-weight: 800; color: var(--text);
  letter-spacing: -0.5px;
}
.variant-income .sc-amount  { color: var(--green-dark); }
.variant-expense .sc-amount { color: var(--red); }
</style>
