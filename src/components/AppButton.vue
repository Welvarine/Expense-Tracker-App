<script setup>
import { computed } from 'vue'

const props = defineProps({
  variant: { type: String, default: 'primary' }, // primary, secondary, danger, ghost
  loading: Boolean,
  disabled: Boolean,
  size: String // default, sm
})

const classes = computed(() => {
  return [
    'btn',
    `btn-${props.variant}`,
    props.size === 'sm' ? 'btn-sm' : ''
  ].filter(Boolean)
})
</script>

<template>
  <button :class="classes" :disabled="disabled || loading">
    <div v-if="loading" class="spinner"></div>
    <slot v-else></slot>
  </button>
</template>
