<script setup>
defineProps({ toasts: Array })
</script>

<template>
  <div class="toast-stack">
    <TransitionGroup name="toast" tag="div">
      <div
        v-for="t in toasts"
        :key="t.id"
        class="toast"
        :class="t.type"
      >
        <span class="toast-icon">{{ t.type === 'success' ? '✅' : '❌' }}</span>
        <span class="toast-msg">{{ t.message }}</span>
      </div>
    </TransitionGroup>
  </div>
</template>

<style scoped>
.toast-stack {
  position: absolute;
  top: 52px; left: 12px; right: 12px;
  z-index: 1000;
  display: flex; flex-direction: column; gap: 6px;
}
.toast {
  display: flex; align-items: center; gap: 8px;
  padding: 11px 14px;
  border-radius: 10px;
  font-size: 13px;
  font-weight: 600;
  box-shadow: var(--shadow-lg);
  animation: slideDown .3s ease;
}
@keyframes slideDown {
  from { transform: translateY(-12px); opacity: 0; }
  to   { transform: translateY(0);     opacity: 1; }
}
.toast.success { background: var(--green-dim); color: var(--green-dark); border: 1px solid var(--green); }
.toast.error   { background: var(--red-dim);   color: var(--red-dark);   border: 1px solid var(--red);   }
.toast-icon { font-size: 15px; }
.toast-msg  { flex: 1; }
</style>
