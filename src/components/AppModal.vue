<script setup>
defineProps({
  show: Boolean,
  title: String,
  message: String,
  confirmText: { type: String, default: 'Confirm' },
  cancelText: { type: String, default: 'Cancel' },
  danger: Boolean
})
defineEmits(['confirm', 'cancel'])
</script>

<template>
  <Teleport to="body">
    <Transition name="fade">
      <div v-if="show" class="modal-backdrop" @click.self="$emit('cancel')">
        <div class="modal-card card">
          <h3 class="font-bold">{{ title }}</h3>
          <div class="modal-body mt-2">
            <slot>{{ message }}</slot>
          </div>
          <div class="modal-actions mt-4 flex gap-3">
            <button class="btn btn-secondary" @click="$emit('cancel')">{{ cancelText }}</button>
            <button 
              class="btn" 
              :class="danger ? 'btn-danger' : 'btn-primary'" 
              @click="$emit('confirm')"
            >
              {{ confirmText }}
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.modal-backdrop {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.5);
  backdrop-filter: blur(4px);
  z-index: 2000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}
.modal-card {
  width: 100%;
  max-width: 320px;
  animation: scaleUp 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}
.modal-actions button { flex: 1; }
@keyframes scaleUp {
  from { transform: scale(0.95); opacity: 0; }
  to   { transform: scale(1); opacity: 1; }
}
</style>
