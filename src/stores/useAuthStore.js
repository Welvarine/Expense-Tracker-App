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
  const currentUser = ref(storage.get('et_current_user', null))

  // Persist whenecd expense-tracker-appver state changes
  function _persist() {
    storage.set('et_users', users.value)
    storage.set('et_current_user', currentUser.value)
  }

  // ── Getters ───────────────────────────────────────────────────────
  const isAuthenticated = computed(() => !!currentUser.value)
  const isAdmin         = computed(() => currentUser.value?.role === 'admin')
  const isUser          = computed(() => currentUser.value?.role === 'user')
  const needsVerification = computed(() => currentUser.value && !currentUser.value.verified)

  // ── Actions ───────────────────────────────────────────────────────
  function signup({ name, email, password, role }) {
    if (users.value.find(u => u.email.toLowerCase() === email.toLowerCase())) {
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
    users.value = [...users.value, newUser]
    currentUser.value = newUser
    _persist()
    return { ok: true }
  }

  function login({ email, password }) {
    const user = users.value.find(
      u => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    )
    if (!user) return { ok: false, error: 'Invalid email or password.' }
    currentUser.value = user
    _persist()
    return { ok: true }
  }

  function logout() {
    currentUser.value = null
    storage.remove('et_current_user')
  }

  function verifyEmail() {
    if (!currentUser.value) return
    users.value = users.value.map(u =>
      u.id === currentUser.value.id ? { ...u, verified: true } : u
    )
    currentUser.value = { ...currentUser.value, verified: true }
    _persist()
  }

  function sendResetEmail(email) {
    const user = users.value.find(u => u.email.toLowerCase() === email.toLowerCase())
    if (!user) return { ok: false, error: 'No account found with that email.' }
    storage.set('et_reset_email', email)
    return { ok: true }
  }

  function setNewPassword(email, newPassword) {
    const exists = users.value.find(u => u.email.toLowerCase() === email.toLowerCase())
    if (!exists) return { ok: false, error: 'User not found.' }
    users.value = users.value.map(u =>
      u.email.toLowerCase() === email.toLowerCase() ? { ...u, password: newPassword } : u
    )
    _persist()
    storage.remove('et_reset_email')
    return { ok: true }
  }

  // Admin: delete a user
  function deleteUser(userId) {
    users.value = users.value.filter(u => u.id !== userId)
    _persist()
  }

  // Admin: get all users list
  const allUsers = computed(() => users.value)

  return {
    users, currentUser,
    isAuthenticated, isAdmin, isUser, needsVerification,
    allUsers,
    signup, login, logout, verifyEmail,
    sendResetEmail, setNewPassword, deleteUser
  }
})
