import { reactive } from 'vue'

export function useFormValidation(fields) {
  // fields: { fieldName: [rule1, rule2, ...] }
  const errors = reactive({})

  function validate(data) {
    let valid = true
    for (const [key, rules] of Object.entries(fields)) {
      errors[key] = ''
      for (const rule of rules) {
        const result = rule(data[key])
        if (result !== true) {
          errors[key] = result
          valid = false
          break
        }
      }
    }
    return valid
  }

  function reset() {
    for (const key of Object.keys(fields)) errors[key] = ''
  }

  return { errors, validate, reset }
}
