<script setup>
defineProps({
  label: String,
  modelValue: [String, Number],
  type: { type: String, default: 'text' },
  error: String,
  placeholder: String,
  options: Array // For select type
})
defineEmits(['update:modelValue'])
</script>

<template>
  <div class="field">
    <label v-if="label">{{ label }}</label>
    
    <select
      v-if="type === 'select'"
      :value="modelValue"
      @change="$emit('update:modelValue', $event.target.value)"
      :class="{ error }"
    >
      <option value="" disabled>{{ placeholder || 'Select an option' }}</option>
      <option v-for="opt in options" :key="opt.value" :value="opt.value">
        {{ opt.label }}
      </option>
    </select>

    <input
      v-else
      :type="type"
      :value="modelValue"
      @input="$emit('update:modelValue', $event.target.value)"
      :placeholder="placeholder"
      :class="{ error }"
    />

    <span v-if="error" class="error-msg">{{ error }}</span>
  </div>
</template>
