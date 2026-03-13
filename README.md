# 💰 Expense Tracker

A modern, secure, and responsive Vue 3 + Vite expense tracking application with budgeting features, dual-theme support, and role-based admin panel.

## ✨ Features

### 🎯 Core Features
- **Transaction Management** - Add, view, filter, and delete income and expense transactions
- **Budget Management** - Set monthly salary and allocate budgeted amounts with automatic deductions
- **Real-time Dashboard** - View balance, income, expenses, and recent transactions at a glance
- **Category Organization** - Organize transactions with predefined categories (Food, Transport, Shopping, etc.)
- **Transaction Filtering** - Filter transactions by type (All, Income, Expense)
- **Transaction History** - Complete transaction list with detailed information

### 💎 User Features
- **Dual Theme Support** - Toggle between light blue/white and dark blue modes
- **Responsive Design** - Works seamlessly on mobile, tablet, and desktop
- **Intuitive UI** - Clean interface with icons and visual feedback
- **Form Validation** - Real-time validation for amounts, emails, and passwords
- **Empty States** - Helpful prompts when no transactions exist
- **Toast Notifications** - User feedback for actions (success, errors)

### 🔐 Security Features
- **Offline-First Architecture** - No network calls, all data stored locally in localStorage
- **Zero Credentials** - No passwords or sensitive authentication data stored
- **XSS Protection** - Vue.js auto-escapes all template bindings
- **Secure Storage** - Same-origin storage scoping with JSON validation
- **No Third-Party Scripts** - Zero analytics, ads, or external SDKs
- **Data Validation** - onMounted() re-validates all stored data on load
- **Graceful Error Handling** - Corrupted data triggers fallback, not crashes

### 👨‍💼 Admin Features
- **Platform Analytics** - View total platform volume, income, and expenses
- **User Management** - Manage all registered users with role assignment
- **Transaction Oversight** - Global view of all transactions across accounts
- **Platform Statistics** - Monitor user count, transaction averages, and trends
- **User Deletion** - Remove users and cascade delete their transactions
- **Transaction Audit** - Review all transactions by type and user

## 🎨 Design System

### Color Palette

**Light Mode:**
- Background: `#e0f2fe` (Light Sky Blue)
- Surface: `#ffffff` (White)
- Text: `#0c2d4d` (Dark Blue)
- Accent: `#0ea5e9` (Bright Cyan Blue)
- Border: `#bae6fd` (Light Blue)

**Dark Mode:**
- Background: `#0f172a` (Very Dark Blue)
- Surface: `#1a3a52` (Dark Blue)
- Text: `#e0f2fe` (Light Sky Blue)
- Accent: `#60a5fa` (Lighter Bright Blue)
- Border: `#2d5f7f` (Darker Blue)

### Typography
- Font Family: Inter
- Weights: 300, 400, 500, 600, 700, 800
- Responsive sizing with proper hierarchy

### Components
- **Buttons** - Primary (Blue) and Secondary (Ghost) variants
- **Input Fields** - Text, email, password, select, date with validation
- **Cards** - Styled containers with shadows and borders
- **Chips/Filters** - Toggle-based filtering with active states
- **Modals** - Confirmation dialogs for destructive actions
- **Avatars** - User initials in colored circles
- **Badges** - Role indicators (Admin, User)

## 🗂️ Project Structure

```
src/
├── components/          # Reusable Vue components
│   ├── AppInput.vue
│   ├── AppButton.vue
│   ├── AppModal.vue
│   ├── SummaryCard.vue
│   └── TransactionItem.vue
├── views/              # Page-level components
│   ├── auth/
│   │   ├── WelcomeView.vue
│   │   ├── LoginView.vue
│   │   ├── CreateAccountView.vue
│   │   ├── ForgotPasswordView.vue
│   │   ├── VerifyEmailView.vue
│   │   └── ThemeToggle.vue
│   ├── dashboard/
│   │   ├── DashboardView.vue
│   │   ├── TransactionsView.vue
│   │   └── AddTransactionView.vue
│   └── admin/
│       ├── AdminDashboardView.vue
│       ├── AdminTransactionsView.vue
│       └── AdminUsersView.vue
├── stores/             # Pinia state management
│   ├── useAuthStore.js
│   └── useTransactionStore.js
├── composables/        # Reusable logic
│   ├── useFormValidation.js
│   └── useToast.js
├── utils/              # Helper functions
│   ├── validators.js
│   └── formatters.js
├── router/             # Vue Router configuration
│   └── index.js
├── style.css           # Global styles & design tokens
└── App.vue             # Root component
```

## 🚀 Getting Started

### Prerequisites
- Node.js 16+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/Welvarine/Expense-Tracker-App

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at `http://localhost:5173`

### Build for Production

```bash
npm run build
```

## 📋 User Flows

### Authentication Flow
1. **Welcome Screen** - Landing page with login/signup options
2. **Signup** - Create account with name, email, password, role selection
3. **Email Verification** - Simulated email verification step
4. **Login** - Enter credentials and authenticate
5. **Dashboard** - Redirected to user or admin dashboard

### Transaction Management Flow
1. **Dashboard** - View balance and recent transactions
2. **Add Transaction** - Click "Add Transaction" button
3. **Select Type** - Choose between Expense or Income
4. **Enter Details** - Amount, description, category, date
5. **Review** - Preview transaction before saving
6. **Save** - Transaction added to history
7. **View All** - Navigate to transactions list for complete view

### Budget Management Flow
1. **Set Salary** - User enters monthly salary amount
2. **Allocate Budget** - Choose budgeted amount from salary
3. **Track Spending** - Budget amount auto-deducts with transactions
4. **Monitor Usage** - View remaining budget vs. spent amount
5. **Adjust** - Update salary or budget allocation as needed

### Admin Dashboard Flow
1. **Admin Console** - View platform-wide statistics
2. **Platform Volume** - See total income/expense across all users
3. **User Management** - Manage accounts, assign roles
4. **Transaction Audit** - Review all platform transactions
5. **Analytics** - Monitor user activity and trends

## 🔐 Security Architecture

### Data Storage
- **localStorage Only** - All data persisted to browser storage
- **Same-Origin Policy** - Storage scoped to application origin only
- **JSON Validation** - Data re-validated on every load
- **Graceful Degradation** - Corrupted data resets to empty state

### Network Security
- **Zero Network Calls** - Application is fully offline
- **No Authentication** - Eliminates credential theft vector
- **No External Scripts** - Zero third-party dependencies at runtime
- **No Analytics** - No data exfiltration to external services

### Input Security
- **Auto-Escaping** - Vue.js escapes all template bindings
- **No HTML Rendering** - User input treated as plain text
- **Form Validation** - All inputs validated client-side
- **Type Safety** - Strict validation rules for amounts and dates

## 🎮 User Roles

### Regular User
- Create and manage personal transactions
- Set personal salary and budget
- View personal dashboard and reports
- Filter and search transactions
- Cannot access admin features

### Admin User
- Everything regular users can do PLUS:
- View all platform transactions
- Manage all user accounts
- Delete users and cascade transactions
- Platform-wide analytics and statistics
- User role assignment

## 💳 Transaction Types

### Expense Categories
- 🍕 Food & Drink
- 🛒 Groceries
- 🚌 Transport
- 🛍️ Shopping
- ⚡ Utilities
- 📦 Other Expense

### Income Categories
- 💰 Salary
- 💻 Freelance
- 🎁 Gift
- 💸 Other Income

## 📊 Dashboard Overview

### User Dashboard
- **Balance Card** - Current account balance
- **Income Summary** - Total income received
- **Expense Summary** - Total expenses spent
- **Recent Transactions** - Latest 5 transactions
- **Quick Actions** - Add transaction, view all

### Admin Dashboard
- **Platform Volume** - Total platform transaction value
- **Platform Income/Expense** - Income/Expense split
- **Active Users** - Count of registered accounts
- **User Management** - Quick access to user list
- **Quick Stats** - Average transaction, total count

## 🎯 Budget Feature

### How It Works
1. User enters monthly salary amount
2. User allocates a budget amount (less than or equal to salary)
3. When expenses are added from the budget, amount is deducted
4. Income transactions do not affect budget
5. User can see remaining budget vs. spent amount
6. Budget resets monthly

### Budget Tracking
- Visual progress indicator showing budget usage
- Real-time budget balance update
- Warning alerts when approaching budget limit
- Ability to adjust budget anytime

## 🌐 Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## ⌨️ Available Scripts

```bash
# Start development server with HMR
npm run dev

# Build for production
npm run build

# Preview production build locally
npm run preview

# Lint files (if eslint configured)
npm run lint
```

## 📦 Dependencies

### Core
- **Vue 3** - Progressive JavaScript framework
- **Vue Router** - Client-side routing
- **Pinia** - State management
- **Vite** - Build tool and dev server

### UI/Utilities
- **Inter Font** - Open-source typeface

## 🔄 State Management (Pinia)

### Auth Store (`useAuthStore`)
- Current user information
- Authentication state
- User list (for admin)
- User CRUD operations

### Transaction Store (`useTransactionStore`)
- User transactions
- Platform transactions (for admin)
- Transaction filters
- Transaction CRUD operations
- Budget data

## 🎨 Theme Switching

- **Toggle Button** - Fixed position top-right corner
- **System Preference** - Respects OS dark mode setting
- **LocalStorage** - Persists user preference
- **Smooth Transitions** - Instant color theme changes
- **Icons** - 🌙 for dark mode, ☀️ for light mode

## 🔄 Offline Functionality

The application works completely offline:
- ✅ No internet required
- ✅ All data stored locally
- ✅ Full feature access
- ✅ Automatic persistence
- ✅ Works across browser sessions

## 💡 Tips & Best Practices

### For Users
1. **Regular Backups** - Export transactions periodically
2. **Clear Cookies** - Clearing cookies will reset your data
3. **Budget Planning** - Allocate realistic budgets for better tracking
4. **Categorization** - Use consistent categories for better analysis
5. **Regular Review** - Check dashboard weekly for spending patterns

### For Developers
1. **Environment Setup** - Use Node 16+ for best compatibility
2. **Browser DevTools** - Use Vue DevTools extension for debugging
3. **LocalStorage** - Monitor storage usage, max ~5-10MB per origin
4. **Theme System** - Extend color variables in `style.css` for customization
5. **Component Reuse** - Leverage existing components for new features

## 🐛 Known Limitations

- Data stored in browser storage only (lost if cache is cleared)
- Maximum ~5-10MB storage per origin (browser dependent)
- No data sync across devices
- No backup/export feature (can be added)
- Simulated email verification (for demo purposes)

## 🚧 Future Enhancements

- [ ] Data export (CSV, PDF)
- [ ] Recurring transactions
- [ ] Spending reports and charts
- [ ] Budget alerts and notifications
- [ ] Multi-currency support
- [ ] Advanced filtering and search
- [ ] Custom categories
- [ ] Photo receipts/attachments
- [ ] Savings goals
- [ ] Expense forecasting

## 🤝 Contributing

Contributions are welcome! Please follow these guidelines:
1. Creating  branches
2. Commit the changes
3.  Push to the branch
4.  Open a pull request

## 📝 License

This project is open source and available under the MIT License.

## 📞 Support

For issues, questions, or suggestions:
- Create an issue on GitHub
- Check existing documentation
- Review component examples

---

**Made with ❤️ for financial awareness and personal money management**

*Last Updated: March 2026*
