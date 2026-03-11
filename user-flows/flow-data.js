/**
 * Flow-data.js
 * Defines all three user-flow diagrams as node arrays.
 *
 * Node types:
 *   start     – gradient pill, entry/terminal point
 *   screen    – blue card, represents a UI screen
 *   decision  – amber diamond shape, Yes/No branch
 *   success   – green card, positive outcome
 *   error     – red card, failure / validation error
 *   toast     – green dashed card, in-app toast notification
 *   action    – purple card, system/background action
 *
 * Node shape:
 *   { id, type, icon, label, sub }
 *
 * Connector shape (placed between node objects in the array):
 *   { connector: true, label?, style? }
 *   style: 'yes' | 'no' | undefined
 *
 * Branch shape (placed where a decision forks):
 *   { branch: true, yes: [nodes...], no: [nodes...] }
 *   The branch block renders two parallel columns.
 *
 * Phase-separator shape:
 *   { phase: 'PHASE NAME' }
 */

window.FLOWS = {

  /* ═══════════════════════════════════════════════════════════════
     1) ONBOARDING
  ═══════════════════════════════════════════════════════════════ */
  onboarding: [
    { id: 'ob-start', type: 'start', icon: '🚀', label: 'App Launched' },

    { connector: true },

    { id: 'ob-welcome', type: 'screen', icon: '📱', label: 'Welcome Screen',
      sub: 'Primary: "Create Account"  ·  Secondary: "Log in"' },

    { phase: 'CREATE ACCOUNT PATH' },

    { connector: true, label: 'Tap "Create Account"' },

    { id: 'ob-form', type: 'screen', icon: '📝', label: 'Create Account Form',
      sub: 'Full name · Email · Password' },

    { connector: true, label: 'Tap "Sign Up"' },

    { id: 'ob-valid-d', type: 'decision', icon: '🔷', label: 'Form valid?' },

    {
      branch: true,
      yes: [
        { id: 'ob-verify-d', type: 'decision', icon: '🔷', label: 'Email verification required?' },
        {
          branch: true,
          yes: [
            { id: 'ob-send-email', type: 'action', icon: '📧', label: 'Send verification email',
              sub: 'Sends link to user inbox' },
            { connector: true },
            { id: 'ob-verify-screen', type: 'screen', icon: '📱', label: 'Verify Email Screen',
              sub: 'Check inbox · Resend option' },
            { connector: true },
            { id: 'ob-verified-d', type: 'decision', icon: '🔷', label: 'Verified?' },
            {
              branch: true,
              yes: [
                { id: 'ob-acc-created', type: 'success', icon: '✅', label: 'Account created',
                  sub: 'Proceed to Dashboard' },
                { connector: true },
                { id: 'ob-toast-signup', type: 'toast', icon: '🔔', label: 'Toast: "Account created successfully"' }
              ],
              no: [
                { id: 'ob-verify-err', type: 'error', icon: '❌', label: 'Show retry / Resend link',
                  sub: 'Allows re-sending verification email' }
              ]
            }
          ],
          no: [
            { id: 'ob-skip-verify', type: 'success', icon: '✅', label: 'Account created (no email verification)',
              sub: 'Skip straight to Dashboard' },
            { connector: true },
            { id: 'ob-toast-noverify', type: 'toast', icon: '🔔', label: 'Toast: "Account created successfully"' }
          ]
        }
      ],
      no: [
        { id: 'ob-show-errs', type: 'error', icon: '❌', label: 'Show validation errors',
          sub: 'Required fields · Invalid email · Weak password' },
        { connector: true, label: 'Fix & retry' },
        { id: 'ob-form-retry', type: 'screen', icon: '📝', label: 'Back to Create Account Form' }
      ]
    },

    { phase: 'DASHBOARD LANDING' },

    { id: 'ob-dashboard', type: 'screen', icon: '🏠', label: 'Dashboard',
      sub: 'Empty state (new user) or populated · Welcome toast shown' },

    { phase: 'LOGIN PATH' },

    { connector: true, label: 'Tap "Log in" from Welcome or form' },

    { id: 'ob-login', type: 'screen', icon: '🔐', label: 'Log In Screen',
      sub: 'Email · Password' },

    { connector: true, label: 'Tap "Log In"' },

    { id: 'ob-cred-d', type: 'decision', icon: '🔷', label: 'Credentials valid?' },

    {
      branch: true,
      yes: [
        { id: 'ob-login-ok', type: 'success', icon: '✅', label: 'Login successful',
          sub: 'Navigate to Dashboard' }
      ],
      no: [
        { id: 'ob-login-err', type: 'error', icon: '❌', label: 'Show login error',
          sub: '"Invalid email or password" · Retry or Forgot password?' },
        { connector: true, label: 'Tap "Forgot Password"' },
        { id: 'ob-forgot', type: 'screen', icon: '🔑', label: 'Forgot Password',
          sub: 'Enter registered email' },
        { connector: true },
        { id: 'ob-reset-sent', type: 'action', icon: '📧', label: 'Send reset email' },
        { connector: true },
        { id: 'ob-reset-link', type: 'screen', icon: '🔗', label: 'User opens reset link' },
        { connector: true },
        { id: 'ob-new-pw', type: 'screen', icon: '🔐', label: 'Set new password' },
        { connector: true },
        { id: 'ob-back-login', type: 'screen', icon: '🔐', label: 'Back to Log In Screen' }
      ]
    }
  ],

  /* ═══════════════════════════════════════════════════════════════
     2) ADD TRANSACTION
  ═══════════════════════════════════════════════════════════════ */
  addTransaction: [
    { id: 'at-start', type: 'start', icon: '🏠', label: 'Dashboard' },

    { connector: true, label: 'Tap "+ Add Transaction"' },

    { id: 'at-type', type: 'screen', icon: '🔄', label: 'Transaction Type Toggle',
      sub: 'Expense (default)  ·  Income' },

    { connector: true },

    { id: 'at-amount', type: 'screen', icon: '💵', label: 'Enter Amount',
      sub: 'Keyboard input  ·  Placeholder: 0.00' },

    { connector: true, label: 'Amount entered' },

    { id: 'at-amount-d', type: 'decision', icon: '🔷', label: 'Amount > 0?' },

    {
      branch: true,
      yes: [
        { id: 'at-desc', type: 'screen', icon: '💬', label: 'Add Description',
          sub: 'Optional · e.g. "Coffee"' }
      ],
      no: [
        { id: 'at-amount-err', type: 'error', icon: '❌', label: 'Show amount error',
          sub: '"Amount must be greater than 0"' },
        { connector: true, label: 'Fix amount & retry' },
        { id: 'at-amount-retry', type: 'screen', icon: '💵', label: 'Back to Enter Amount' }
      ]
    },

    { phase: 'CATEGORY & DATE' },

    { connector: true },

    { id: 'at-category', type: 'screen', icon: '🏷️', label: 'Select Category',
      sub: '🍕 Food & Drink · 🛒 Groceries · 🚌 Transport · 🛍️ Shopping · ⚡ Utilities' },

    { connector: true },

    { id: 'at-cat-d', type: 'decision', icon: '🔷', label: 'Category selected?' },

    {
      branch: true,
      yes: [
        { id: 'at-cat-ok', type: 'action', icon: '✔️', label: 'Category confirmed' }
      ],
      no: [
        { id: 'at-cat-default', type: 'action', icon: '🏷️', label: 'Assign default category',
          sub: '"General" applied automatically' }
      ]
    },

    { phase: 'DATE & REVIEW' },

    { connector: true },

    { id: 'at-date', type: 'screen', icon: '📅', label: 'Set Date',
      sub: 'Default: Today · Option to open date picker' },

    { connector: true },

    { id: 'at-review', type: 'screen', icon: '🔍', label: 'Review Transaction',
      sub: 'Amount · Type · Category · Date · Description' },

    { connector: true, label: 'Tap "Add Transaction"' },

    { phase: 'OFFLINE CHECK' },

    { id: 'at-online-d', type: 'decision', icon: '🔷', label: 'Online?' },

    {
      branch: true,
      yes: [
        { id: 'at-submit-d', type: 'decision', icon: '🔷', label: 'Submit successful?' },
        {
          branch: true,
          yes: [
            { id: 'at-success', type: 'success', icon: '✅', label: 'Transaction saved',
              sub: 'ID generated · synced' },
            { connector: true },
            { id: 'at-toast-ok', type: 'toast', icon: '🔔', label: 'Toast: "Transaction added successfully"' },
            { connector: true },
            { id: 'at-dash-update', type: 'screen', icon: '🏠', label: 'Dashboard updated',
              sub: 'New total balance · Transaction in list' }
          ],
          no: [
            { id: 'at-net-err', type: 'error', icon: '❌', label: 'Show submission error',
              sub: '"Network error — please retry"' },
            { connector: true, label: 'Retry' },
            { id: 'at-retry', type: 'screen', icon: '🔍', label: 'Back to Review Transaction' }
          ]
        }
      ],
      no: [
        { id: 'at-offline', type: 'error', icon: '📵', label: 'Offline detected',
          sub: 'Queue transaction locally or show error' },
        { connector: true, label: 'Online restored' },
        { id: 'at-queue-retry', type: 'action', icon: '🔄', label: 'Retry queued transaction' }
      ]
    }
  ],

  /* ═══════════════════════════════════════════════════════════════
     3) TRANSACTION MANAGEMENT (Filtering & Deletion)
  ═══════════════════════════════════════════════════════════════ */
  management: [
    { id: 'tm-start', type: 'start', icon: '🗂️', label: 'Transactions Screen' },

    { phase: 'FILTER' },

    { connector: true },

    { id: 'tm-chips', type: 'screen', icon: '🎛️', label: 'Filter Chips',
      sub: 'All  ·  Income  ·  Expense' },

    { connector: true, label: 'Tap a chip (e.g. Expense)' },

    { id: 'tm-filter-applied', type: 'action', icon: '🔍', label: 'List filters to matching transactions',
      sub: 'Only selected type shown' },

    { phase: 'REVEAL DELETE ACTION' },

    { connector: true },

    { id: 'tm-list', type: 'screen', icon: '📋', label: 'Transactions List',
      sub: 'Filtered results visible' },

    { connector: true, label: 'Swipe or hover on item' },

    { id: 'tm-reveal', type: 'action', icon: '👆', label: 'Reveal delete icon on item' },

    { connector: true },

    { id: 'tm-tap-del-d', type: 'decision', icon: '🔷', label: 'Tap delete icon?' },

    {
      branch: true,
      yes: [
        { id: 'tm-protected-d', type: 'decision', icon: '🔷', label: 'Transaction protected\n(external sync)?' },
        {
          branch: true,
          yes: [
            { id: 'tm-protected', type: 'error', icon: '🔒', label: 'Protected — cannot delete',
              sub: 'Synced from external source · Alternative actions shown' }
          ],
          no: [
            { id: 'tm-modal', type: 'screen', icon: '💬', label: 'Confirm Delete Modal',
              sub: '"Cancel" / "Delete"' },
            { connector: true },
            { id: 'tm-confirm-d', type: 'decision', icon: '🔷', label: 'User confirms delete?' },
            {
              branch: true,
              yes: [
                { id: 'tm-delete', type: 'action', icon: '🗑️', label: 'Delete transaction' },
                { connector: true },
                { id: 'tm-del-ok-d', type: 'decision', icon: '🔷', label: 'Deletion successful?' },
                {
                  branch: true,
                  yes: [
                    { id: 'tm-del-toast', type: 'toast', icon: '🔔', label: 'Toast: "Transaction deleted"' },
                    { connector: true },
                    { id: 'tm-update-list', type: 'screen', icon: '📋', label: 'List updated',
                      sub: 'Item removed · New totals reflected' },
                    { connector: true },
                    { id: 'tm-dash-update', type: 'screen', icon: '🏠', label: 'Dashboard totals updated',
                      sub: 'Balance / income / expense recalculated' }
                  ],
                  no: [
                    { id: 'tm-del-err-toast', type: 'toast', icon: '🔔', label: 'Toast: "Unable to delete"',
                      sub: 'Error message shown' },
                    { connector: true, label: 'Retry option visible' },
                    { id: 'tm-del-retry', type: 'error', icon: '❌', label: 'Show retry action',
                      sub: 'User can try again or dismiss' }
                  ]
                }
              ],
              no: [
                { id: 'tm-cancel', type: 'screen', icon: '📋', label: 'Return to Transactions list',
                  sub: 'No changes made' }
              ]
            }
          ]
        }
      ],
      no: [
        { id: 'tm-no-del', type: 'screen', icon: '📋', label: 'Transactions list',
          sub: 'No action taken' }
      ]
    }
  ]
};
