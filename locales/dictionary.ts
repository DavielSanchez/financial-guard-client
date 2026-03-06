/**
 * @/locales/dictionary.ts
 * 
 * Master i18n dictionary with strict TypeScript typing.
 * The `es` object uses `typeof en` to enforce structure parity.
 * If you add a key to `en`, TypeScript will error in `es` until you add it.
 */

export const en = {
  // ===================== AUTH =====================
  auth: {
    title: "Financial Guard",
    subtitle: "Access your command center",
    capitalTitle: "FINANCIAL GUARD",
    
    // Login
    login: {
      heading: "ENTER THE GUARD",
      subheading: "Authenticate your credentials",
      emailPlaceholder: "Email address",
      passwordPlaceholder: "Password",
      submitButton: "ENTER THE GUARD",
      submitLoading: "Verifying...",
      errorAccessDenied: "ACCESS DENIED: INVALID CREDENTIALS",
      errorInvalid: "An unexpected error occurred",
      biometricLabel: "Identity verification",
      registerLabel: "New to the system?",
      registerLink: "Create new account",
      forgotPassword: "Recover access key",
    },
    
    // Register
    register: {
      heading: "New recruit",
      subheading: "Establish your security credentials",
      emailPlaceholder: "Email address",
      passwordPlaceholder: "Encryption key",
      firstNamePlaceholder: "First identifier",
      lastNamePlaceholder: "Last identifier",
      submitButton: "INITIALIZE ACCOUNT",
      submitLoading: "Processing...",
      agreeTerms: "I agree to the terms of service",
      loginLink: "Already registered? Sign in",
      successMessage: "Account initialized. Redirecting to login...",
      errorEmailExists: "Email already registered",
      errorWeakPassword: "Password must be at least 8 characters",
    },
    
    // Logout
    logout: {
      confirmTitle: "Deauthorize Session",
      confirmMessage: "Are you sure you want to close your session?",
      confirmButton: "CONFIRM LOGOUT",
      cancelButton: "Cancel",
    },
  },

  // ===================== SETTINGS =====================
  settings: {
    title: "Settings",
    profile: "Profile",
    appearance: "Appearance",
    accessibility: "Accessibility",
    account: "Account",
    accounts: "Accounts",
    
    displayName: "Display Name",
    email: "Email Address",
    joinDate: "Account Created",
    
    theme: "Color Theme",
    mode: "Interface Mode",
    language: "Language",
    currency: "Default Currency",
    
    saveChanges: "Save Changes",
    discardChanges: "Discard",
    changesSaved: "Settings synchronized",
    changeFailed: "Failed to save settings",
  },

  // ===================== THEMES =====================
  themes: {
    neon: "Cyber Neon",
    "midnight-gold": "Luxury Gold",
    "ocean-frost": "Ocean Frost",
    "sunset-blaze": "Sunset Blaze",
  },

  // ===================== MODES =====================
  modes: {
    dark: "Dark",
    light: "Light",
  },

  // ===================== LANGUAGES =====================
  languages: {
    en: "English",
    es: "Spanish",
  },

  // ===================== CURRENCIES =====================
  currencies: {
    USD: "United States Dollar",
    EUR: "Euro",
    DOP: "Dominican Peso",
    MXN: "Mexican Peso",
  },

  // ===================== NAVIGATION =====================
  nav: {
    groupLabel: "Navigation",
    home: "Home",
    dashboard: "Dashboard",
    transactions: "Transactions",
    wallet: "Wallet",
    budgeting: "Budgeting",
    savings: "Savings",
    aiCoach: "AI Coach",
    settings: "Settings",
  },

  // ===================== COMMON =====================
  common: {
    save: "Save",
    cancel: "Cancel",
    delete: "Delete",
    edit: "Edit",
    create: "Create",
    add: "Add new",
    update: "Update",
    loading: "Loading...",
    saving: "Saving...",
    error: "Error",
    success: "Success",
    confirmation: "Are you sure?",
    yes: "Yes",
    no: "No",
    close: "Close",
    back: "Back",
    next: "Next",
    skip: "Skip",
    search: "Search",
    filter: "Filter",
    sort: "Sort",
    download: "Download",
    upload: "Upload",
    copy: "Copy",
    copied: "Copied!",
    noData: "No data available",
    tryAgain: "Try again",
    learnMore: "Learn more",
    all: "View all"
  },

  // ===================== VALIDATION =====================
  validation: {
    required: "This field is required",
    invalidEmail: "Invalid email format",
    passwordTooShort: "Password must be at least 6 characters",
    passwordMismatch: "Passwords do not match",
    invalidPhone: "Invalid phone number",
    minLength: "Minimum {length} characters",
    maxLength: "Maximum {length} characters",
  },

  // ===================== STATUS MESSAGES =====================
  status: {
    pending: "Pending",
    completed: "Completed",
    failed: "Failed",
    processing: "Processing",
    success: "Success",
    warning: "Warning",
    info: "Information",
  },

  // ===================== GREETING MESSAGES =====================
  greetings: {
    morning: "Good morning",
    afternoon: "Good afternoon",
    night: "Good night",
    evening: "Good evening",
    welcome: "Welcome back",
  },

  // ========================= PERIODS ===========================
  periods: ["Day", "Week", "Month", "Year"],

  // ========================= BALANCE ===========================
  balance: ["Balance", "Income", "Expenses"],

  // ===================== TIME & DATE =====================
  time: {
    unit: {
      second: "Second",
      minute: "Minute",
      hour: "Hour",
      day: "Day",
      week: "Week",
      month: "Month",
      quarter: "Quarter",
      year: "Year",
    },
    units: {
      second: "Seconds",
      minute: "Minutes",
      hour: "Hours",
      day: "Days",
      week: "Weeks",
      month: "Months",
      quarter: "Quarters",
      year: "Years",
    },
    periods: {
      daily: "Daily",
      weekly: "Weekly",
      monthly: "Monthly",
      yearly: "Yearly",
    },
    relative: {
      now: "Just now",
      today: "Today",
      yesterday: "Yesterday",
      lastWeek: "Last week",
      lastMonth: "Last month",
      ago: "{value} ago", // Uso: t('time.relative.ago', { value: '2d' })
    },
    short: {
      sec: "s",
      min: "m",
      hr: "h",
      d: "d",
      w: "w",
      mth: "mo",
      yr: "y",
    }
  },

  // ===================== DASHBOARD =====================
  dashboard: {
    label: "Dashboard",
    summary: "System Summary",
    leftToday: "Left today",
    spentToday: "Spent today",
    dailyBudget: "Daily budget",
    healthScore: "Financial Health",
    recentActivity: "Recent activity",
    noActivity: "No activity to show",
    accounts: "Accounts",
    active: "Active",
    loadingRecent: "Loading recent activity...",
    showValues: "Show values",
    hideValues: "Hide values",
    table: {
      movement: "Movement",
      account: "Account",
      category: "Category",
      date: "Date",
      amount: "Amount",
    },
    nextSubscription: "Next Payment",
    status: {
      onTrack: "ON TRACK",
      warning: "OVER BUDGET",
      critical: "CRITICAL LIMIT",
    },
    charts: {
      activity: "Activity Monitor",
      distribution: "Expense Distribution",
    }
  },

  // ===================== FINANCE & BANKING =====================
  finance: {
    actions: {
      deposit: "Deposit",
      withdraw: "Withdraw",
      transfer: "Transfer",
      payment: "Payment",
      exchange: "Currency Exchange",
      invest: "Invest",
    },
    transactionTypes: {
      income: "Income",
      expense: "Expense",
      subscription: "Subscription",
      debt: "Debt / Loan",
      saving: "Saving",
      adjustment: "Balance Adjustment",
    },
    accountTypes: {
      savings: "Savings Account",
      checking: "Checking Account",
      creditCard: "Credit Card",
      cash: "Cash / Wallet",
      investment: "Investment Portfolio",
    },
    details: {
      balance: "Available Balance",
      totalBalance: "Total Capital",
      amount: "Amount",
      concept: "Concept / Note",
      category: "Category",
      date: "Transaction Date",
      source: "Source Account",
      destination: "Destination Account",
      fee: "Banking Fee",
      reference: "Reference Number",
      totalSpent: "Total spent",
      limit: "Limit"
    }
  },

  // ===================== BUDGETING =====================
  budgeting: {
    budget: "Budget",
    control: "Control",
    protocolActive: "Protocol: Active",
    liquidEnvelopes: "Liquid Envelopes",
    drainers: "Drainers",
    totalSpent: "Total Spent",
    limit: "Limit",
    monthlyDrain: "Monthly Drain",
    active: "Active",
    next: "Next",
    categories: {
      housing: "Housing",
      cybernetics: "Cybernetics",
      entertainment: "Entertainment",
      transport: "Transport",
      foodDining: "Food & Dining",
      health: "Health",
    },
    newEnvelope: "New budget",
    newDrainer: "New drainer",
    drainerName: "Name",
    drainerAmount: "Amount",
    drainerBillingCycle: "Billing cycle",
    drainerNextBill: "Next bill date",
    billingMonthly: "Monthly",
    billingYearly: "Yearly",
    billingWeekly: "Weekly",
    createEnvelope: "Create budget",
    createDrainer: "Add drainer",
    noSubscriptions: "No subscriptions registered",
    addFirstBudget: "Add your first budget",
    applyToAllMonths: "Apply to all months (Fixed)",
    editEnvelope: "Edit budget",
    monthlyLimit: "Monthly limit",
    thisMonthOnly: "This month only",
  },

  // ===================== GOALS & SAVINGS =====================
  goals: {
    title: "Savings Goals",
    piggyBank: "Piggy Bank",
    savings: "Savings",
    vault: "Vault",
    neonPiggyBank: "Neon Piggy Bank",
    totalSaved: "Total Saved",
    newGoal: "New Goal",
    openGoal: "Open Goal",
    dailyChallenge: "Daily Challenge",
    goalName: "Goal Name",
    targetAmount: "Target Amount",
    day1Amount: "Day 1 Amount",
    dailyIncrement: "Daily +Increment",
    challengeDuration: "Challenge Duration (days)",
    days: "days",
    preview: "Preview",
    totalInDays: "Total in {days} days",
    createGoal: "Create Goal",
    noGoalsYet: "No goals yet",
    tapToCreate: "Tap + to create your first savings goal",
    complete: "Complete",
    deposit: "Deposit",
    todayDone: "Today done",
    todayGoalComplete: "Today's goal complete! ✅",
    comeBackTomorrow: "Come back tomorrow",
    deleteThisGoal: "Delete this goal?",
    securityLvlPrefix: "Security Lvl: ",
    securityLevel: {
      low: "LOW",
      moderate: "MODERATE",
      high: "HIGH",
      veryHigh: "VERY HIGH",
      max: "MAX",
    },
    dayStreak: "{count} day streak",
    daysLeft: "{count} days left",
    checkIn: "Check-in ${amount}",
    placeholder: {
      name: "e.g. Vacation, Emergency...",
    },
    editGoal: "Modify Target",
    deleteGoal: "Terminate Goal",
    
    details: {
      targetAmount: "Target Amount",
      currentAmount: "Current Stash",
      remaining: "Remaining to Target",
      deadline: "Target Date",
      reached: "Goal Achieved!",
      progress: "Completion Progress",
    },
    
    actions: {
      addFunds: "Contribute",
      withdrawFunds: "Extract",
      transferToGoal: "Transfer to Goal",
      markAsCompleted: "Finalize Goal",
    },

    placeholders: {
      name: "e.g., New Tesla, Emergency Fund",
      description: "What are you guarding this money for?",
    },

    status: {
      active: "In Progress",
      paused: "On Hold",
      completed: "Target Reached",
    },

    streak: {
      depositToday: "Deposit today",
      dontBreak: "Don't break the {value}-day streak"
    }
  },

  savings: {
    createFirstPiggy: "Create my first piggy",
    goalDone: "Goal completed! Rest, see you tomorrow.",
    morningPiggy: "Good morning! Your piggy is waiting for its coffee.",
    afternoonPiggy: "Your piggy is waiting for today's contribution.",
    eveningPiggy: "Don't forget to feed your piggy today.",
    dontSleepStreak: "Don't go to sleep without protecting your {count}-day streak.",
    lastChanceToday: "Last chance of the day!",
    streakProtected: "Your streak is protected for today.",
    igniteStreak: "Ignite your streak!",
    legendaryStreak: "{count} day streak",
    streakFreeze: "Streak freeze available",
    streakMaintained: "Streak maintained! 🔥",
    openGoalReminder: "{days} days left to reach your goal",
    contributeWhenReady: "Contribute whenever you're ready",
  },

  // ===================== WALLET =====================
  wallet: {
    title: "Wallet",
    subtitle: "Your financial hub",
    
    actions: {
      bridge: "Bridge",
      accounts: "Accounts",
      addAccount: "Add Account",
    },

    editAccount: "Edit Account",
    newAccount: "New Account",
    createAccount: "Create Account",

    cards: {
      mainChecking: "Main Checking",
      savingsAccount: "Savings Account",
      cryptoWallet: "Crypto Wallet",
      visa: "Visa",
      mastercard: "Mastercard",
      blockchain: "Blockchain",
    },

    vault: {
      title: "Vault Accounts",
      emergencyFund: "Emergency Fund",
      taxReserve: "Tax Reserve",
      noAccounts: "No accounts detected",
      initializeFirst: "Tap to initialize your first vault",
      initializeProtocol: "Initialize Protocol",
      contentHidden: "Content hidden",
      revealContent: "Reveal content",
      hideContent: "Hide content",
    },
    hideAccountLabel: "Hide account",
    hideAccountWarning: "This account will be moved to your Vaults and will not affect your Wallet balance.",

    bridge: {
      title: "Bridge Mode",
      amount: "Amount",
      execute: "Execute Bridge",
      from: "From",
      to: "To",
      category: "Category",
      selectCategory: "Select category",
    },

    liquidAssets: "Liquid Assets",

    details: {
      balance: "Balance",
      accountType: "Account Type",
      cardNumber: "Card Number",
      lastDigits: "{digits} ending",
    },

    link: {
      savingsVault: "Savings Vault",
      activeTargets: "{count} active targets",
    },
  },

  // ===================== TRANSACTIONS =====================
  transactions: {
    title: "Log",
    subtitle: "Record your financial activity",
    
    types: {
      expense: "Expense",
      income: "Income",
    },

    headers: {
      account: "Account",
      amountSpent: "Amount Spent",
      amountReceived: "Amount Received",
      addNote: "Add a note...",
      category: "Category",
      quickAdd: "Quick Add",
    },

    actions: {
      scanReceipt: "Scan Receipt",
      submit: "Submit Transaction",
      scanning: "Scanning receipt...",
    },

    categories: {
      food: "Food",
      shopping: "Shopping",
      transport: "Transport",
      entertainment: "Fun",
      housing: "Housing",
      health: "Health",
      gifts: "Gifts",
      work: "Work",
      education: "Education",
      travel: "Travel",
      utilities: "Utilities",
    },

    quickItems: {
      coffee: "Coffee",
      lunch: "Lunch",
      gas: "Gas",
      gym: "Gym",
    },

    logged: "Logged",
    logIncomeExpense: "Log Income / Expense",
    logIncome: "Log Income",
    logExpense: "Log Expense",
    history: "History",
    filterByType: "Type",
    filterByAccount: "Account",
    filterAll: "All",
    loadMore: "Load more",
    noTransactions: "No transactions to show",
  },

  // ===================== ONBOARDING =====================
  onboarding: {
    languageModal: {
      title: "SELECT LANGUAGE",
      subtitle: "Configure your command interface",
      startProtocol: "START PROTOCOL",
      skip: "Skip introduction",
    },
    steps: {
      welcome: {
        title: "WELCOME, GUARDIAN",
        description: "This is your command center. Follow the protocol to master cash flow.",
      },
      balanceChart: {
        title: "BALANCE MODULE",
        description: "Primary monitor. Here you visualize your capital evolution by selected period. Switch between Balance, Income and Expenses using the top tabs.",
      },
      balanceTabs: {
        title: "CASH FLOW: INCOME vs EXPENSE",
        description: "INCOME = money in. EXPENSE = money out. This distinction is critical for operational control. Toggle tabs to view each metric.",
      },
      budgetWidgets: {
        title: "BUDGET & SUBSCRIPTIONS",
        description: "Left: available balance from envelopes. Right: next subscription due. Manage budgets in the Budget tab.",
      },
      recentTransactions: {
        title: "MOVEMENT LOG",
        description: "Recent operations log. Each movement shows type (Income/Expense), account, category and amount. Keep this log updated.",
      },
      fabTransaction: {
        title: "TACTICAL ACTION: RECORD MOVEMENT",
        description: "The center button (plus emblem) opens the new transaction form. It is your main entry point for recording income and expenses. Press to continue.",
      },
      txTypeToggle: {
        title: "MOVEMENT CLASSIFICATION",
        description: "Before recording: define if it is INCOME (money in) or EXPENSE (money out). The toggle switches categories and labels. Green = income, purple = expense.",
      },
      complete: {
        title: "PROTOCOL COMPLETE",
        description: "Command center active. You are ready to operate. Record your first transaction or explore the menu. The guardian who records, controls.",
      },
    },
    driver: {
      next: "NEXT",
      prev: "BACK",
      done: "COMPLETE PROTOCOL",
      close: "Close",
    },
    settings: {
      sectionTitle: "Protocol",
      repeatProtocol: "REPEAT INITIATION PROTOCOL",
      repeatConfirm: "Restart the onboarding tour on the Dashboard?",
    },
  },

  // ===================== ADD CATEGORY =====================
  addCategory: {
    title: "New {type} Category",
    titleIncome: "New Income Category",
    titleExpense: "New Expense Category",
    name: "Name",
    customColor: "Custom Color",
    selectIcon: "Select an Icon",
    saveButton: "SAVE CATEGORY",
    placeholder: "e.g. Gym, Freelance...",
  },

  // ===================== AI COACH =====================
  aiCoach: {
    title: "AI Coach",
    subtitle: "Your personal financial advisor",
    comingSoon: "Coming Soon",
    doNotTrespass: "DO NOT TRESPASS",
    inviteTitle: "Try the AI Coach",
    inviteSubtitle: "Get personalized financial advice and answers about your finances",
    
    status: {
      online: "Online",
      analyzing: "Analyzing your data",
    },

    greeting: "Hello, Guardian. I am your AI Financial Advisor. Ask me anything about your finances, or choose an action below to get started.",

    actions: {
      affordPS5: "Can I afford a PS5?",
      analyzeSubscriptions: "Analyze subscriptions",
      savingsForecast: "Savings forecast",
      spendingTips: "Spending tips",
    },

    placeholder: "Ask your financial AI...",

    responses: {
      affordPS5: "Based on your current savings rate of $2,100/mo and discretionary budget, you could afford a PS5 ($499) without impacting your financial goals. Your entertainment budget has $115 remaining this month. Recommendation: Wait 2 weeks for your next paycheck to maintain your buffer.",
      
      analyzeSubscriptions: "You have 5 active subscriptions totaling $93.97/month ($1,127.64/year). Your most expensive is Gym at $45/mo which you used 8 times last month (cost per visit: $5.63). Netflix at $15.99/mo had 12 viewing sessions. Consider: Gym Membership has the lowest usage-to-cost ratio.",
      
      savingsForecast: "At your current savings rate of $2,100/month, projections show: 3 months: $6,300 | 6 months: $12,600 | 1 year: $25,200. You are on track to reach your emergency fund goal of $15,000 by May. After that, consider diversifying into index funds for compound growth.",
      
      spendingTips: "Top 3 optimization opportunities: 1) Food & Dining is at 85% of budget - try meal prepping Sundays to save ~$120/mo. 2) Your transport costs dropped 15% since switching to hybrid work. 3) Bundle your streaming services - switching to a family plan could save $8/mo.",
    },
  },

} as const;

// Strict TypeScript typing: if you forget a key in `es`, TypeScript will error
export const es = {
  // ===================== AUTH =====================
  auth: {
    title: "Financial Guard",
    subtitle: "Accede a tu centro de comando",
    capitalTitle: "FINANCIAL GUARD",
    
    // Login
    login: {
      heading: "ENTRA EN LA GUARDIA",
      subheading: "Autentica tus credenciales",
      emailPlaceholder: "Correo electrónico",
      passwordPlaceholder: "Contraseña",
      submitButton: "ENTRA EN LA GUARDIA",
      submitLoading: "Verificando...",
      errorAccessDenied: "ACCESO DENEGADO: CREDENCIALES INVÁLIDAS",
      errorInvalid: "Ocurrió un error inesperado",
      biometricLabel: "Verificación de identidad",
      registerLabel: "Es tu primera vez?",
      registerLink: "Crear nueva cuenta",
      forgotPassword: "Recuperar clave de acceso",
    },
    
    // Register
    register: {
      heading: "Nuevo recluta",
      subheading: "Establece tus credenciales de seguridad",
      emailPlaceholder: "Correo electrónico",
      passwordPlaceholder: "Contraseña",
      firstNamePlaceholder: "Nombre/s",
      lastNamePlaceholder: "Apellido/s",
      submitButton: "INICIALIZAR CUENTA",
      submitLoading: "Procesando...",
      agreeTerms: "Acepto los términos de servicio",
      loginLink: "¿Ya registrado? Inicia sesión",
      successMessage: "Cuenta inicializada. Redirigiendo...",
      errorEmailExists: "Correo ya registrado",
      errorWeakPassword: "La contraseña debe tener al menos 8 caracteres",
    },
    
    // Logout
    logout: {
      confirmTitle: "Desautorizar Sesión",
      confirmMessage: "¿Estás seguro de que deseas cerrar tu sesión?",
      confirmButton: "CONFIRMAR CIERRE",
      cancelButton: "Cancelar",
    },
  },

  // ===================== SETTINGS =====================
  settings: {
    title: "Ajustes",
    profile: "Perfil",
    appearance: "Apariencia",
    accessibility: "Accesibilidad",
    account: "Cuenta",
    accounts: "Cuentas",
    
    displayName: "Nombre visible",
    email: "Correo electrónico",
    joinDate: "Cuenta creada",
    
    theme: "Tema de color",
    mode: "Modo de interfaz",
    language: "Idioma",
    currency: "Moneda predeterminada",
    
    saveChanges: "Guardar cambios",
    discardChanges: "Descartar",
    changesSaved: "Ajustes sincronizados",
    changeFailed: "Error al guardar ajustes",
  },

  // ===================== THEMES =====================
  themes: {
    neon: "Ciber Neón",
    "midnight-gold": "Oro Lujo",
    "ocean-frost": "Océano Gélido",
    "sunset-blaze": "Ocaso de Fuego",
  },

  // ===================== MODES =====================
  modes: {
    dark: "Oscuro",
    light: "Claro",
  },

  // ===================== LANGUAGES =====================
  languages: {
    en: "Inglés",
    es: "Español",
  },

  // ===================== CURRENCIES =====================
  currencies: {
    USD: "Dólar estadounidense",
    EUR: "Euro",
    DOP: "Peso dominicano",
    MXN: "Peso mexicano",
  },

  // ===================== NAVIGATION =====================
  nav: {
    groupLabel: "Navegación",
    home: "Inicio",
    dashboard: "Panel de control",
    transactions: "Transacciones",
    wallet: "Billetera",
    budgeting: "Presupuesto",
    savings: "Ahorros",
    aiCoach: "Coach IA",
    settings: "Ajustes",
  },

  // ===================== COMMON =====================
  common: {
    save: "Guardar",
    cancel: "Cancelar",
    delete: "Eliminar",
    edit: "Editar",
    create: "Crear",
    add: "Añadir nueva",
    update: "Actualizar",
    loading: "Cargando...",
    saving: "Guardando...",
    error: "Error",
    success: "Éxito",
    confirmation: "¿Estás seguro?",
    yes: "Sí",
    no: "No",
    close: "Cerrar",
    back: "Atrás",
    next: "Siguiente",
    skip: "Saltar",
    search: "Buscar",
    filter: "Filtrar",
    sort: "Ordenar",
    download: "Descargar",
    upload: "Cargar",
    copy: "Copiar",
    copied: "¡Copiado!",
    noData: "Sin datos disponibles",
    tryAgain: "Intentar de nuevo",
    learnMore: "Aprende más",
    all: "Ver más",
  },

  // ===================== VALIDATION =====================
  validation: {
    required: "Este campo es obligatorio",
    invalidEmail: "Formato de correo inválido",
    passwordTooShort: "La contraseña debe tener al menos 6 caracteres",
    passwordMismatch: "Las contraseñas no coinciden",
    invalidPhone: "Número de teléfono inválido",
    minLength: "Mínimo {length} caracteres",
    maxLength: "Máximo {length} caracteres",
  },

  // ===================== STATUS MESSAGES =====================
  status: {
    pending: "Pendiente",
    completed: "Completado",
    failed: "Fallido",
    processing: "Procesando",
    success: "Éxito",
    warning: "Advertencia",
    info: "Información",
  },

  // ===================== GREETING MESSAGES =====================
  greetings: {
    morning: "Buen dia",
    afternoon: "Buenas tardes",
    night: "Buenas noches",
    evening: "Buenas noches",
    welcome: "Bienvenido/a",
  },

  // ========================= PERIODS ===========================
  periods: ["Dia", "Semana", "Mes", "Año"],

  // ========================= BALANCE ===========================
  balance: ["Balance", "Ingresos", "Gastos"],

  // ===================== TIME & DATE =====================
  time: {
    unit: {
      second: "Segundo",
      minute: "Minuto",
      hour: "Hora",
      day: "Día",
      week: "Semana",
      month: "Mes",
      quarter: "Trimestre",
      year: "Año",
    },
    units: {
      second: "Segundos",
      minute: "Minutos",
      hour: "Horas",
      day: "Días",
      week: "Semanas",
      month: "Meses",
      quarter: "Trimestres",
      year: "Años",
    },
    periods: {
      daily: "Diario",
      weekly: "Semanal",
      monthly: "Mensual",
      yearly: "Anual",
    },
    relative: {
      now: "Ahora mismo",
      today: "Hoy",
      yesterday: "Ayer",
      lastWeek: "Semana pasada",
      lastMonth: "Mes pasado",
      ago: "Hace {value}",
    },
    short: {
      sec: "s",
      min: "m",
      hr: "h",
      d: "d",
      w: "sem",
      mth: "mes",
      yr: "año",
    }
  },

  // ===================== DASHBOARD =====================
  dashboard: {
    label: "Panel de control",
    summary: "Resumen del Sistema",
    leftToday: "Restante hoy",
    spentToday: "Gastado hoy",
    dailyBudget: "Presupuesto diario",
    healthScore: "Salud Financiera",
    recentActivity: "Actividad reciente",
    noActivity: "Sin actividad para mostrar",
    accounts: "Cuentas",
    active: "Activo",
    loadingRecent: "Cargando actividad reciente...",
    showValues: "Mostrar valores",
    hideValues: "Ocultar valores",
    table: {
      movement: "Movimiento",
      account: "Cuenta",
      category: "Categoría",
      date: "Fecha",
      amount: "Monto",
    },
    nextSubscription: "Proximo pago",
    status: {
      onTrack: "EN ORDEN",
      warning: "SOBRE PRESUPUESTO",
      critical: "LÍMITE CRÍTICO",
    },
    charts: {
      activity: "Monitor de Actividad",
      distribution: "Distribución de Gastos",
    }
  },

  // ===================== BUDGETING =====================
  budgeting: {
    budget: "Presupuesto",
    control: "Control",
    protocolActive: "Protocolo: Activo",
    liquidEnvelopes: "Sobres Líquidos",
    drainers: "Drenadores",
    totalSpent: "Total Gastado",
    limit: "Límite",
    monthlyDrain: "Drenaje Mensual",
    active: "Activo",
    next: "Siguiente",
    categories: {
      housing: "Vivienda",
      cybernetics: "Cibernética",
      entertainment: "Entretenimiento",
      transport: "Transporte",
      foodDining: "Comida y Restaurantes",
      health: "Salud",
    },
    newEnvelope: "Nuevo presupuesto",
    newDrainer: "Nuevo drenador",
    drainerName: "Nombre",
    drainerAmount: "Monto",
    drainerBillingCycle: "Ciclo de facturación",
    drainerNextBill: "Próxima factura",
    billingMonthly: "Mensual",
    billingYearly: "Anual",
    billingWeekly: "Semanal",
    createEnvelope: "Crear presupuesto",
    createDrainer: "Agregar drenador",
    noSubscriptions: "Sin suscripciones registradas",
    addFirstBudget: "Añade tu primer presupuesto",
    applyToAllMonths: "Aplicar a todos los meses (Fijo)",
    editEnvelope: "Editar presupuesto",
    monthlyLimit: "Límite mensual",
    thisMonthOnly: "Solo este mes",
  },

  // ===================== FINANCE & BANKING =====================
  finance: {
    actions: {
      deposit: "Depósito",
      withdraw: "Retiro",
      transfer: "Transferencia",
      payment: "Pago",
      exchange: "Cambio de Divisa",
      invest: "Inversión",
    },
    transactionTypes: {
      income: "Ingreso",
      expense: "Gasto",
      subscription: "Suscripción",
      debt: "Deuda / Préstamo",
      saving: "Ahorro",
      adjustment: "Ajuste de Saldo",
    },
    accountTypes: {
      savings: "Cuenta de Ahorros",
      checking: "Cuenta Corriente",
      creditCard: "Tarjeta de Crédito",
      cash: "Efectivo / Billetera",
      investment: "Portafolio de Inversión",
    },
    details: {
      balance: "Saldo Disponible",
      totalBalance: "Capital Total",
      amount: "Monto",
      concept: "Concepto / Nota",
      category: "Categoría",
      date: "Fecha de Transacción",
      source: "Cuenta Origen",
      destination: "Cuenta Destino",
      fee: "Comisión Bancaria",
      reference: "Número de Referencia",
      totalSpent: "Total gastado",
      limit: "Limite"
    }
  },

  // ===================== GOALS & SAVINGS =====================
  goals: {
    title: "Metas de Ahorro",
    piggyBank: "Alcancía",
    savings: "Ahorros",
    vault: "Bóveda",
    neonPiggyBank: "Alcancía Neón",
    totalSaved: "Total Ahorrado",
    newGoal: "Nueva Meta",
    openGoal: "Meta Abierta",
    dailyChallenge: "Desafío Diario",
    goalName: "Nombre de la Meta",
    targetAmount: "Monto Objetivo",
    day1Amount: "Monto Día 1",
    dailyIncrement: "Incremento Diario +",
    challengeDuration: "Duración del Desafío (días)",
    days: "días",
    preview: "Vista Previa",
    totalInDays: "Total en {days} días",
    createGoal: "Crear Meta",
    noGoalsYet: "Aún no hay metas",
    tapToCreate: "Toca + para crear tu primera meta de ahorro",
    complete: "Completar",
    deposit: "Depositar",
    todayDone: "Hoy hecho",
    todayGoalComplete: "¡Meta de hoy cumplida! ✅",
    comeBackTomorrow: "Vuelve mañana",
    deleteThisGoal: "¿Eliminar esta meta?",
    securityLvlPrefix: "Nivel Seg: ",
    securityLevel: {
      low: "BAJO",
      moderate: "MODERADO",
      high: "ALTO",
      veryHigh: "MUY ALTO",
      max: "MÁX",
    },
    dayStreak: "racha de {count} días",
    daysLeft: "{count} días restantes",
    checkIn: "Registro ${amount}",
    placeholder: {
      name: "ej: Vacaciones, Emergencias...",
    },
    editGoal: "Modificar Objetivo",
    deleteGoal: "Terminar Meta",
    
    details: {
      targetAmount: "Monto Objetivo",
      currentAmount: "Ahorro Actual",
      remaining: "Restante para la Meta",
      deadline: "Fecha Límite",
      reached: "¡Meta Alcanzada!",
      progress: "Progreso de Completado",
    },
    
    actions: {
      addFunds: "Aportar",
      withdrawFunds: "Retirar",
      transferToGoal: "Transferir a Meta",
      markAsCompleted: "Finalizar Meta",
    },

    placeholders: {
      name: "ej: Nuevo Tesla, Fondo de Emergencia",
      description: "¿Para qué estás resguardando este dinero?",
    },

    status: {
      active: "En Progreso",
      paused: "En Pausa",
      completed: "Objetivo Logrado",
    },

    streak: {
      depositToday: "Deposita hoy",
      dontBreak: "No rompas tu racha de {value}-{unit}"
    }
  },

  savings: {
    createFirstPiggy: "Crear mi primera alcancía",
    goalDone: "¡Objetivo cumplido! Descansa, nos vemos mañana.",
    morningPiggy: "¡Buenos días! Tu alcancía está esperando su café.",
    afternoonPiggy: "Tu alcancía está esperando la contribución de hoy.",
    eveningPiggy: "No olvides alimentar tu alcancía hoy.",
    dontSleepStreak: "No te vayas a dormir sin proteger tu racha de {count} días.",
    lastChanceToday: "¡Última oportunidad del día!",
    streakProtected: "Tu racha está protegida por hoy.",
    igniteStreak: "¡Enciende tu racha!",
    legendaryStreak: "racha de {count} días",
    streakFreeze: "Congelador de racha disponible",
    streakMaintained: "¡Racha mantenida! 🔥",
    openGoalReminder: "{days} días para alcanzar tu meta",
    contributeWhenReady: "Aporta cuando quieras",
  },

  // ===================== WALLET =====================
  wallet: {
    title: "Billetera",
    subtitle: "Tu centro financiero",
    
    actions: {
      bridge: "Puente",
      accounts: "Cuentas",
      addAccount: "Agregar Cuenta",
    },

    editAccount: "Editar Cuenta",
    newAccount: "Nueva Cuenta",
    createAccount: "Crear Cuenta",

    cards: {
      mainChecking: "Cuenta Corriente Principal",
      savingsAccount: "Cuenta de Ahorros",
      cryptoWallet: "Billetera Cripto",
      visa: "Visa",
      mastercard: "Mastercard",
      blockchain: "Blockchain",
    },

    vault: {
      title: "Cuentas Bóveda",
      emergencyFund: "Fondo de Emergencia",
      taxReserve: "Reserva Fiscal",
      noAccounts: "Sin cuentas detectadas",
      initializeFirst: "Toca para inicializar tu primera bóveda",
      initializeProtocol: "Inicializar Protocolo",
      contentHidden: "Contenido oculto",
      revealContent: "Mostrar contenido",
      hideContent: "Ocultar contenido",
    },
    hideAccountLabel: "Ocultar cuenta",
    hideAccountWarning: "Esta cuenta se moverá a tus Bóvedas y no afectará el balance de tu Billetera.",

    bridge: {
      title: "Modo Puente",
      amount: "Monto",
      execute: "Ejecutar Puente",
      from: "Desde Cuenta",
      to: "Hacia Cuenta",
      category: "Categoría",
      selectCategory: "Seleccionar categoría",
    },

    liquidAssets: "Activos Líquidos",

    details: {
      balance: "Saldo",
      accountType: "Tipo de Cuenta",
      cardNumber: "Número de Tarjeta",
      lastDigits: "{digits} últimos",
    },

    link: {
      savingsVault: "Bóveda de Ahorros",
      activeTargets: "{count} objetivos activos",
    },
  },

  // ===================== TRANSACTIONS =====================
  transactions: {
    title: "Registro",
    subtitle: "Registra tu actividad financiera",
    
    types: {
      expense: "Gasto",
      income: "Ingreso",
    },

    headers: {
      account: "Cuenta",
      amountSpent: "Cantidad Gastada",
      amountReceived: "Cantidad Recibida",
      addNote: "Agregar nota...",
      category: "Categoría",
      quickAdd: "Agregación Rápida",
    },

    actions: {
      scanReceipt: "Escanear Recibo",
      submit: "Enviar Transacción",
      scanning: "Escaneando recibo...",
    },

    categories: {
      food: "Comida",
      shopping: "Compras",
      transport: "Transporte",
      entertainment: "Entretenimiento",
      housing: "Vivienda",
      health: "Salud",
      gifts: "Regalos",
      work: "Trabajo",
      education: "Educación",
      travel: "Viajes",
      utilities: "Servicios",
    },

    quickItems: {
      coffee: "Café",
      lunch: "Almuerzo",
      gas: "Gasolina",
      gym: "Gimnasio",
    },

    logged: "Registrado",
    logIncomeExpense: "Registrar Ingreso / Gasto",
    logIncome: "Registrar Ingreso",
    logExpense: "Registrar Gasto",
    history: "Historial",
    filterByType: "Tipo",
    filterByAccount: "Cuenta",
    filterAll: "Todas",
    loadMore: "Cargar más",
    noTransactions: "No hay transacciones para mostrar",
  },

  // ===================== ADD CATEGORY =====================
  addCategory: {
    title: "Nueva Categoría de {type}",
    titleIncome: "Nueva Categoría de Ingreso",
    titleExpense: "Nueva Categoría de Gasto",
    name: "Nombre",
    customColor: "Color Personalizado",
    selectIcon: "Selecciona un Icono",
    saveButton: "GUARDAR CATEGORÍA",
    placeholder: "Ejem: Gimnasio, Freelance...",
  },

  // ===================== ONBOARDING =====================
  onboarding: {
    languageModal: {
      title: "SELECCIONAR IDIOMA",
      subtitle: "Configura la interfaz de tu centro de comando",
      startProtocol: "INICIAR PROTOCOLO",
      skip: "Saltar introducción",
    },
    steps: {
      welcome: {
        title: "BIENVENIDO, GUARDIÁN",
        description: "Este es tu centro de comando. Sigue el protocolo para dominar el flujo de caja.",
      },
      balanceChart: {
        title: "MÓDULO DE BALANCE",
        description: "Monitor principal. Aquí visualizas la evolución de tu capital según el período seleccionado. Cambia entre Balance, Ingresos y Gastos usando las pestañas superiores.",
      },
      balanceTabs: {
        title: "FLUJO DE CAJA: INGRESOS vs GASTOS",
        description: "INGRESO = dinero que entra. GASTO = dinero que sale. Esta distinción es crítica para el control operativo. Alterna las pestañas para ver cada métrica.",
      },
      budgetWidgets: {
        title: "PRESUPUESTO Y SUSCRIPCIONES",
        description: "Izquierda: saldo disponible según tus sobres. Derecha: próxima suscripción a vencer. Gestiona presupuestos en la pestaña Presupuesto del menú.",
      },
      recentTransactions: {
        title: "REGISTRO DE MOVIMIENTOS",
        description: "Historial de operaciones recientes. Cada movimiento indica tipo (Ingreso/Gasto), cuenta, categoría y monto. Mantén este registro actualizado.",
      },
      fabTransaction: {
        title: "ACCIÓN TÁCTICA: REGISTRAR MOVIMIENTO",
        description: "El botón central (emblema +) abre el formulario de nueva transacción. Es tu principal punto de entrada para capturar ingresos y gastos. Pulsa para continuar.",
      },
      txTypeToggle: {
        title: "CLASIFICACIÓN DE MOVIMIENTO",
        description: "Antes de registrar: define si es INGRESO (dinero que entra) o GASTO (dinero que sale). El toggle cambia categorías y etiquetas. Usa verde para ingreso, púrpura para gasto.",
      },
      complete: {
        title: "PROTOCOLO COMPLETADO",
        description: "Centro de comando activado. Estás listo para operar. Registra tu primera transacción o explora el menú. El guardián que registra, controla.",
      },
    },
    driver: {
      next: "SIGUIENTE",
      prev: "ANTERIOR",
      done: "FINALIZAR PROTOCOLO",
      close: "Cerrar",
    },
    settings: {
      sectionTitle: "Protocolo",
      repeatProtocol: "REPETIR PROTOCOLO DE INICIACIÓN",
      repeatConfirm: "¿Reiniciar el tour de bienvenida en el Dashboard?",
    },
  },

  // ===================== AI COACH =====================
  aiCoach: {
    title: "Entrenador IA",
    subtitle: "Tu asesor financiero personal",
    comingSoon: "Próximamente",
    doNotTrespass: "PROHIBIDO EL PASO",
    inviteTitle: "Prueba el bot de IA",
    inviteSubtitle: "Obtén consejos financieros personalizados y respuestas sobre tus finanzas",
    
    status: {
      online: "En línea",
      analyzing: "Analizando tu información",
    },

    greeting: "Hola, Guardián. Soy tu Asesor Financiero IA. Pregúntame cualquier cosa sobre tus finanzas, o elige una acción abajo para comenzar.",

    actions: {
      affordPS5: "¿Puedo permitirme una PS5?",
      analyzeSubscriptions: "Analizar suscripciones",
      savingsForecast: "Pronóstico de ahorros",
      spendingTips: "Consejos de gastos",
    },

    placeholder: "Pregunta tu asistente financiero IA...",

    responses: {
      affordPS5: "Basándome en tu tasa de ahorro actual de $2,100/mes y presupuesto discrecional, podrías permitirte una PS5 ($499) sin impactar tus objetivos financieros. Tu presupuesto de entretenimiento tiene $115 restantes este mes. Recomendación: Espera 2 semanas para tu próximo pago para mantener tu resguardo.",
      
      analyzeSubscriptions: "Tienes 5 suscripciones activas totalizando $93.97/mes ($1,127.64/año). La más cara es Gimnasio a $45/mes que usaste 8 veces el mes pasado (costo por visita: $5.63). Netflix a $15.99/mes tuvo 12 sesiones de visualización. Considera: Membresía de Gimnasio tiene la proporción uso-costo más baja.",
      
      savingsForecast: "Con tu tasa de ahorro actual de $2,100/mes, las proyecciones muestran: 3 meses: $6,300 | 6 meses: $12,600 | 1 año: $25,200. Estás en camino para alcanzar tu meta de fondo de emergencia de $15,000 en mayo. Después, considera diversificar en fondos indexados para crecimiento compuesto.",
      
      spendingTips: "Top 3 oportunidades de optimización: 1) Comida y Cenas está al 85% del presupuesto - intenta preparar comidas los domingos para ahorrar ~$120/mes. 2) Tus costos de transporte bajaron 15% desde que cambiaste a trabajo híbrido. 3) Agrupa tus servicios de streaming - cambiar a un plan familiar podría ahorrar $8/mes.",
    },
  },

} as const;

// ============================================================
// TYPE HELPERS FOR TYPE-SAFE TRANSLATIONS
// ============================================================

export type LanguageCode = 'en' | 'es';

/** All possible section keys in the dictionary */
export type DictionarySection = keyof typeof en;

/** Get all keys for a specific section using dot notation */
type DictValue = typeof en[DictionarySection];
type ValueKeys = {
  [K in keyof DictValue]: DictValue[K] extends Record<string, any>
    ? `${string & K}.${string & keyof DictValue[K]}`
    : never;
}[keyof DictValue];

/** All possible translation paths using dot notation */
export type TranslationPath = 
  | { [K in DictionarySection]: (typeof en)[K] extends readonly any[] | string ? K : never }[DictionarySection]
  | ValueKeys;

/** Type-safe translation lookup type */
export type TranslationLookup = typeof en & typeof es;

/**
 * Helper type to get the value at a translation path
 * Usage: GetTranslation<'auth.login.heading'> => string
 */
export type GetTranslation<T extends TranslationPath> = T extends `${infer S}.${infer K}`
  ? S extends DictionarySection
    ? K extends keyof typeof en[S]
      ? (typeof en[S])[K]
      : never
    : never
  : never;
