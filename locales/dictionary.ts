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
    summary: "System Summary",
    leftToday: "Left today",
    spentToday: "Spent today",
    dailyBudget: "Daily budget",
    healthScore: "Financial Health",
    recentActivity: "Recent activity",
    noActivity: "No activity to show",
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

  // ===================== GOALS & SAVINGS =====================
  goals: {
    title: "Savings Goals",
    piggyBank: "Piggy Bank",
    createGoal: "Initialize New Goal",
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

  // ===================== WALLET =====================
  wallet: {
    title: "Wallet",
    subtitle: "Your financial hub",
    
    actions: {
      bridge: "Bridge",
      accounts: "Accounts",
      addAccount: "Add Account",
    },

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
    },

    bridge: {
      title: "Bridge Mode",
      amount: "Amount",
      execute: "Execute Bridge",
      from: "From Account",
      to: "To Account",
    },

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
  },

  // ===================== AI COACH =====================
  aiCoach: {
    title: "AI Coach",
    subtitle: "Your personal financial advisor",
    
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
    dashboard: "Panel de control",
    transactions: "Transacciones",
    wallet: "Billetera",
    budgeting: "Presupuesto",
    savings: "Ahorros",
    aiCoach: "Entrenador IA",
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
    summary: "Resumen del Sistema",
    leftToday: "Restante hoy",
    spentToday: "Gastado hoy",
    dailyBudget: "Presupuesto diario",
    healthScore: "Salud Financiera",
    recentActivity: "Actividad reciente",
    noActivity: "Sin actividad para mostrar",
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
    createGoal: "Inicializar Nueva Meta",
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

  // ===================== WALLET =====================
  wallet: {
    title: "Billetera",
    subtitle: "Tu centro financiero",
    
    actions: {
      bridge: "Puente",
      accounts: "Cuentas",
      addAccount: "Agregar Cuenta",
    },

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
    },

    bridge: {
      title: "Modo Puente",
      amount: "Monto",
      execute: "Ejecutar Puente",
      from: "Desde Cuenta",
      to: "Hacia Cuenta",
    },

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
  },

  // ===================== AI COACH =====================
  aiCoach: {
    title: "Entrenador IA",
    subtitle: "Tu asesor financiero personal",
    
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
