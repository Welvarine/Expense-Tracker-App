import { useAuthStore } from '../stores/useAuthStore.js'

// Hardcoded exchange rates relative to USD (Base Currency)
// All transaction amounts are stored in USD internally
const EXCHANGE_RATES = {
  'USD': 1,
  'EUR': 0.92,
  'GBP': 0.79,
  'JPY': 149.50,
  'RWF': 1380.0 // Approx 1 USD = 1,380 RWF
}

export const formatCurrency = (n = 0) => {
  let currency = 'USD'
  let rate = 1

  try {
    const auth = useAuthStore()
    if (auth.currentUser && auth.currentUser.currency) {
      currency = auth.currentUser.currency
      rate = EXCHANGE_RATES[currency] || 1
    }
  } catch (e) {
    // Failsafe if used outside component setup context
  }

  // Ensure n is a valid number
  const numericValue = parseFloat(n) || 0
  
  // Calculate the converted value
  const convertedValue = numericValue * rate

  // Specific handling to format RWF/JPY cleanly without decimals
  const options = { style: 'currency', currency }
  if (currency === 'RWF' || currency === 'JPY') {
    options.minimumFractionDigits = 0
    options.maximumFractionDigits = 0
  }

  return new Intl.NumberFormat('en-US', options).format(convertedValue)
}

export const formatDate = (d) =>
  new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
