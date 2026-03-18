<script setup>
import { computed, ref } from 'vue'

const props = defineProps({
  label: String,
  modelValue: [String, Number],
  type: { type: String, default: 'text' },
  error: String,
  placeholder: String,
  options: Array, // For select type
  id: String // Optional explicit id
})
defineEmits(['update:modelValue'])

const inputId = computed(() => props.id || `input-${Math.random().toString(36).substring(2, 9)}`)
const showPassword = ref(false)

const actualType = computed(() => {
  if (props.type === 'password') {
    return showPassword.value ? 'text' : 'password'
  }
  return props.type
})
</script>

<template>
  <div class="field">
    <label v-if="label" :for="inputId">{{ label }}</label>
    
    <select
      v-if="type === 'select'"
      :id="inputId"
      :value="modelValue"
      @change="$emit('update:modelValue', $event.target.value)"
      :class="{ error }"
    >
      <option value="" disabled>{{ placeholder || 'Select an option' }}</option>
      <option v-for="opt in options" :key="opt.value" :value="opt.value">
        {{ opt.label }}
      </option>
    </select>

    <div class="input-wrapper" v-else>
      <input
        :id="inputId"
        :type="actualType"
        :value="modelValue"
        @input="$emit('update:modelValue', $event.target.value)"
        :placeholder="placeholder"
        :class="{ error }"
      />
      
      <button 
        v-if="type === 'password'" 
        type="button" 
        class="password-toggle" 
        @click="showPassword = !showPassword"
        :aria-label="showPassword ? 'Hide password' : 'Show password'"
      >
        {{ showPassword ? '👁️' : '👁️‍🗨️' }}
      </button>
    </div>

    <span v-if="error" class="error-msg">{{ error }}</span>
  </div>
</template>

<style scoped>
.input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.input-wrapper input {
  width: 100%;
}

.password-toggle {
  position: absolute;
  right: 12px;
  background: none;
  border: none;
  font-size: 16px;
  cursor: pointer;
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0.6;
  transition: opacity 0.2s;
}

.password-toggle:hover {
  opacity: 1;
}

.password-toggle:focus-visible {
  outline: 2px solid var(--blue);
  border-radius: 4px;
}
</style>
