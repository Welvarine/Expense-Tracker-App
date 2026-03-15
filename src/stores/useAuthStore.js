import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { storage } from '../utils/storage.js'

const SEED_USERS = [
  { id: 'admin-seed', name: 'Admin', email: 'admin@expense.app', password: 'Admin123!', role: 'admin', verified: true },
  { id: 'user-seed',  name: 'Demo User', email: 'user@expense.app',  password: 'User123!',  role: 'user',  verified: true }
]

export const useAuthStore = defineStore('auth', () => {
  // ── State ─────────────────────────────────────────────────────────
  const users       = ref(storage.get('et_users', SEED_USERS))
  const currentUser = ref(null)

  // ── Initialize on Store Creation ──────────────────────────────────
  // This runs when the store is first created
  function initializeAuth() {
    const saved = storage.get('et_current_user', null)
    if (saved) {
      console.log('✅ Loaded user from localStorage:', saved.id)
      currentUser.value = saved
    } else {
      console.log('⚠️ No user in localStorage')
      currentUser.value = null
    }
  }

  // Initialize immediately
  initializeAuth()

  // Persist whenever state changes
  function _persist() {
    storage.set('et_users', users.value)
    storage.set('et_current_user', currentUser.value)
    console.log('💾 Persisted to localStorage')
  }

  // ── Getters ───────────────────────────────────────────────────────
  const isAuthenticated = computed(() => !!currentUser.value)
  const isAdmin         = computed(() => currentUser.value?.role === 'admin')
  const isUser          = computed(() => currentUser.value?.role === 'user')
  const needsVerification = computed(() => currentUser.value && !currentUser.value.verified)

  // ── Actions ───────────────────────────────────────────────────────
  function signup({ name, email, password, role }) {
    if (users.value.find(u => u.email.toLowerCase() === email.toLowerCase())) {
      console.error('❌ Email already exists')
      return { ok: false, error: 'An account with this email already exists.' }
    }
    
    const newUser = {
      id: `user-${Date.now()}`,
      name,
      email,
      password,
      role,
      verified: false
    }
    
    console.log('✅ Creating new user:', newUser.id)
    users.value = [...users.value, newUser]
    currentUser.value = newUser
    _persist()
    return { ok: true }
  }

  function login({ email, password }) {
    const user = users.value.find(
      u => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    )
    
    if (!user) {
      console.error('❌ Invalid login credentials')
      return { ok: false, error: 'Invalid email or password.' }
    }
    
    console.log('✅ User logged in:', user.id)
    currentUser.value = user
    _persist()
    return { ok: true }
  }

  function logout() {
    console.log('👋 User logged out')
    currentUser.value = null
    storage.remove('et_current_user')
  }

  function verifyEmail() {
    if (!currentUser.value) {
      console.error('❌ No user to verify')
      return
    }
    
    console.log('✅ Email verified for:', currentUser.value.id)
    users.value = users.value.map(u =>
      u.id === currentUser.value.id ? { ...u, verified: true } : u
    )
    currentUser.value = { ...currentUser.value, verified: true }
    _persist()
  }

  function sendResetEmail(email) {
    const user = users.value.find(u => u.email.toLowerCase() === email.toLowerCase())
    if (!user) {
      console.error('❌ No account found with email:', email)
      return { ok: false, error: 'No account found with that email.' }
    }
    
    console.log('📧 Reset email sent to:', email)
    storage.set('et_reset_email', email)
    return { ok: true }
  }

  function setNewPassword(email, newPassword) {
    const exists = users.value.find(u => u.email.toLowerCase() === email.toLowerCase())
    if (!exists) {
      console.error('❌ User not found:', email)
      return { ok: false, error: 'User not found.' }
    }
    
    console.log('🔐 Password reset for:', email)
    users.value = users.value.map(u =>
      u.email.toLowerCase() === email.toLowerCase() ? { ...u, password: newPassword } : u
    )
    _persist()
    storage.remove('et_reset_email')
    return { ok: true }
  }

  // Admin: delete a user
  function deleteUser(userId) {
    console.log('🗑️ Deleting user:', userId)
    users.value = users.value.filter(u => u.id !== userId)
    
    // If deleting current user, logout
    if (currentUser.value?.id === userId) {
      currentUser.value = null
    }
    
    _persist()
  }

  // Admin: update user information
  function updateUser(userId, updates) {
    if (!userId) {
      console.error('❌ updateUser: userId is required')
      return null
    }

    const index = users.value.findIndex(u => u.id === userId)
    if (index === -1) {
      console.error('❌ updateUser: user not found:', userId)
      return null
    }

    // Check if email is being changed and if it's already taken
    if (updates.email && updates.email !== users.value[index].email) {
      const emailExists = users.value.some(u => 
        u.id !== userId && u.email.toLowerCase() === updates.email.toLowerCase()
      )
      if (emailExists) {
        console.error('❌ updateUser: email already in use')
        return null
      }
    }

    const updated = {
      ...users.value[index],
      ...updates,
      updatedAt: new Date().toISOString()
    }

    users.value[index] = updated
    
    // If updating current user, update currentUser too
    if (currentUser.value?.id === userId) {
      currentUser.value = updated
    }
    
    _persist()
    console.log('✅ User updated:', updated)
    return updated
  }

  // Admin: get user by ID
  function getUserById(userId) {
    return users.value.find(u => u.id === userId)
  }

  // Admin: get all users list
  const allUsers = computed(() => users.value)

  return {
    users,
    currentUser,
    isAuthenticated,
    isAdmin,
    isUser,
    needsVerification,
    allUsers,
    signup,
    login,
    logout,
    verifyEmail,
    sendResetEmail,
    setNewPassword,
    deleteUser,
    updateUser,
    getUserById,
    initializeAuth
  }
})