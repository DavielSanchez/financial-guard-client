## Financial Guard – Cyber Finance PRD

### 1. Visión General

**Financial Guard** es una aplicación fintech tipo *command center* orientada a usuarios individuales que quieren gestionar su “imperio financiero digital” desde el móvil.  
La app consolida en una única experiencia:
- **Autenticación segura** con sesión persistente via backend (`/auth/*`).
- **Dashboard financiero en tiempo real** con balance, ingresos, gastos, deltas y gráficas.
- **Registro guiado de transacciones** con categorías personalizables.
- **Control de presupuesto** (envelopes y “drainers” por suscripciones).
- **Wallet multi-cuenta** (cuentas bancarias, ahorro, cripto) con vista de “bridge” entre cuentas.
- **Retos de ahorro gamificados** (goals abiertos y retos de progresión diaria).
- **AI Coach financiero simulado** para explicar decisiones y proponer optimizaciones.
- **Centro de settings** para tema, idioma, moneda y preferencias de visualización (privacy mode).

El modelo de negocio apunta a un **SaaS B2C freemium** con foco en:
- Incrementar **engagement financiero diario** (registro de transacciones, retos de ahorro).
- Crear **contexto rico de datos** (ingresos, gastos, categorías, suscripciones) para:
  - Ofrecer **insights premium** (AI coach avanzado, forecast reales, alertas inteligentes).
  - Desbloquear **monetización futura** (cross-sell de productos financieros, afiliados).

### 2. Stack Tecnológico

- **Framework frontend**: `Next 16 (app router, TypeScript, React 19)`
  - Directorios `app/` con rutas segmentadas: `/(app)/dashboard`, `/(app)/wallet`, etc.
  - `next/navigation` para `redirect` y navegación protegida.
- **Lenguaje**: TypeScript end-to-end (páginas, hooks, servicios, tipos).
- **UI & diseño**
  - `tailwindcss 4 + @tailwindcss/postcss` y `tw-animate-css` para estilos.
  - Librería de componentes propia en `components/ui/*` basada en Radix:
    - `@radix-ui/react-*` (dialog, drawer, select, tabs, tooltip, toast, etc.).
  - Motion/animaciones: `framer-motion`, `embla-carousel-react`.
  - Iconografía: `lucide-react`, `@fortawesome/*`.
  - Gráficas: `recharts` + wrapper `DashboardChart`.
  - Theming: `next-themes` + `SettingsProvider` y `ThemeProvider`.
- **Gestión de estado y datos**
  - **Client state**: `zustand` (`use-auth-store`, settings).
  - **Server state / data fetching**: `@tanstack/react-query` con `QueryClientProvider`.
  - Formularios y validación: `react-hook-form`, `zod`, `@hookform/resolvers`.
- **Network / Backend**
  - HTTP client: `axios` con instancia central en `lib/axios.ts`:
    - `baseURL` configurable via `process.env.NEXT_PUBLIC_API_URL` (fallback `http://localhost:3000/api`).
    - `withCredentials: true` para cookies de sesión.
    - Interceptor de respuesta para tratar `401` y potencial redirección a `/login`.
  - Endpoints esperados (no implementados en este repo):  
    - `/auth/login`, `/auth/register`, `/auth/logout`, `/auth/me`  
    - `/dashboard/summary`  
    - `/categories` (GET/POST)  
    - `/transactions` (GET/POST/DELETE)
- **Infra / Configuración**
  - `next.config.mjs`: desactiva optimización de imágenes y permite ignorar errores de TypeScript en build (útil mientras el dominio evoluciona).
  - Tooling: `typescript 5.7`, `eslint` (script `lint`), `postcss`.

### 3. Arquitectura de Información y Rutas

- **Nivel de aplicación (`app/`)**
  - `app/layout.tsx`
    - Define fuentes, metadatos y tema global.
    - Wrap global con `Providers` (React Query + PrivacyContext) y `SettingsProvider`.
  - `app/page.tsx`
    - Redirección inmediata a `/login` (entrypoint público).
  - `app/(app)/layout.tsx`
    - Layout autenticado:
      - Envuelve children en `ProtectedRoute` (hook `useAuth` + router).
      - Inyecta `BottomNav` fijo (navegación principal móvil).
  - **Rutas públicas**
    - `/login` → `app/login/page.tsx`
      - Formulario de login con email/password.
      - Usa `useAuth().login` y `use-translations` para textos.
    - `/register` → `app/register/page.tsx`
      - Formulario de registro (email, password, firstName, lastName).
      - Usa `useAuth().register`.
  - **Rutas protegidas (bajo `/(app)`):**
    - `/dashboard`
    - `/transactions`
    - `/savings`
    - `/budgeting`
    - `/wallet`
    - `/ai-coach`
    - `/settings`

- **Capa de servicios (`services/*.service.ts`)**
  - `auth.service.ts`
    - `login(email, password)` → `POST /auth/login`
    - `register({ email, password, firstName, lastName })` → `POST /auth/register`
    - `logout()` → `POST /auth/logout`
    - `getMe()` → `GET /auth/me`
  - `dashboard.service.ts`
    - `getSummary(period)` → `GET /dashboard/summary?period=...`  
      Devuelve `DashboardResponse` consumido por `useDashboard`.
  - `categories.service.ts`
    - `getAll()` → `GET /categories`
    - `create(category)` → `POST /categories`
  - `transaction.service.ts`
    - `create(data)` → `POST /transactions`
    - `getHistory(params?)` → `GET /transactions`
    - `delete(id)` → `DELETE /transactions/:id`

- **Capa de hooks (`hooks/*`)**
  - `use-auth.ts`
    - Orquesta `react-query` + `authService` + `useAuthStore`.
    - Expone `{ user, isAuthenticated, isLoading, isError, login, register, logout }`.
  - `useDashboard(period)`
    - Gestiona `DashboardResponse` (+ loading/error/refresh) a partir de `DashboardService`.
  - `useCategories()`
    - Carga categorías de usuario, permite `addCategory`.
  - `useTransactions()`
    - Expone `addTransaction`, `deleteTransaction`, estado de loading/error.
    - Refresca dashboard tras cambios (acoplamiento controlado: UX “live update”).
  - `use-settings.ts`, `use-translations.ts`, `use-mobile.ts`, `use-toast.ts`:  
    - Hooks utilitarios para settings globales, i18n, comportamiento responsive y notificaciones.

- **Tipos (`types/*.types.ts`)**
  - `auth.types.ts` → `AuthUser`, `LoginResponse`.
  - `dashboard.types.ts` → `DashboardResponse` + estructuras de chart.
  - `categories.types.ts`, `transactions.types.ts` → contratos de dominio entre frontend y backend.

### 4. Funcionalidades Implementadas

- **Autenticación y sesión**
  - Login y registro con integración real al backend (`authService`).
  - Persistencia de sesión via `useAuth` + `useAuthStore` + `getMe()`.
  - Rutas protegidas con `ProtectedRoute`:
    - Bloqueo de contenido si no hay usuario o hay error.
    - Redirección a `/login` ante fallo.

- **Dashboard financiero**
  - Selector de periodo: `Day | Week | Month | Year`.
  - Tabs de métrica principal: `BALANCE | INCOME | EXPENSE`.
  - Valor numérico formateado via `SettingsProvider` (moneda configurable).
  - Cálculo y render de delta porcentual (`data.delta`, `data.deltaLabel`) con UI condicional.
  - Gráfica reactiva (`DashboardChart`) por tab usando `chartBalance`, `chartIncome`, `chartExpense`.
  - Bloques de insight:
    - “Left Today” (restante de gasto diario).
    - Próxima suscripción (ej. Netflix).
    - Widget de “Savings Challenge” conectado a `/savings`.
    - “Recent Activity” (mock actual, pensada para conectar a `/transactions`).

- **Gestión de transacciones**
  - Página `/transactions` con:
    - Modo `expense`/`income` toggleado con animaciones.
    - Input de cantidad + nota.
    - Selector horizontal de categorías (alimentado por `useCategories` → backend).
    - CTA para crear nuevas categorías (`AddCategoryDrawer` + `categoryService.create`).
    - Quick-add de transacciones recurrentes (coffee, lunch, gas, gym).
    - Acciones para “Scan Receipt” (simulada) y “Log Income/Expense” (lógica local lista para conectar a `useTransactions()`).
  - Hook `useTransactions` ya preparado para:
    - Crear/eliminar transacciones contra backend.
    - Refrescar dashboard tras los cambios.

- **Budgeting / Control de gasto**
  - Página `/budgeting`:
    - Tab “Liquid Envelopes”: tarjetas por categoría de gasto (housing, food, health, etc.) con:
      - Cálculo de `%` de presupuesto gastado, alertas visuales si se excede.
      - Indicador circular de uso presupuestario total.
      - UI lista para conectar a datos reales (actualmente mock).
    - Tab “Drainers”: lista de suscripciones con:
      - Coste mensual, próxima fecha de cobro.
      - Lógica de “cancelar/reactivar” a nivel de UI (estado local).

- **Wallet multi-cuenta**
  - Carrusel swipeable de cuentas (checking, savings, crypto) con:
    - Números enmascarados, balance con `PrivacyValue`.
    - Tarjeta virtual para crear nueva cuenta (slot “+1”).
  - Modo “Bridge”:
    - Selección `From/To` de cuentas.
    - Input de cantidad y CTA `Execute Bridge` (a implementar contra backend).
  - Sección “Vault Accounts”:
    - Cuentas tipo bóveda con visibility toggle (`faEye`/`faEyeSlash`).

- **Savings Goals gamificado**
  - Página `/savings`:
    - Goals tipo “open” (meta fija) y “progression” (reto de depósitos crecientes).
    - Cálculo de progreso, niveles de “Security Level” y estado “Complete”.
    - “Check-in” diario automatico para retos de progresión con lógica de aritmética.
    - Formulario para crear nuevos goals (open o progression) con preview de depósitos diarios.
    - La data es mock en frontend pero la estructura permite persistencia posterior.

- **AI Coach**
  - Página `/ai-coach`:
    - Chat UI con historial en memoria y simulación de respuestas.
    - Chips de acciones rápidas (“Analyze subscriptions”, “Can I afford a PS5?”, etc.).
    - Preparado para conectar a un backend / LLM real más adelante.

- **Settings centralizado**
  - Página `/settings` con:
    - Edición de nombre de usuario (a nivel de UI + settings context).
    - Selección de tema (lista de `themeList` + colores neon).
    - Switching light/dark mode.
    - Idioma (`en`/`es`) y moneda (`DOP`, `USD`, `EUR`, `MXN`) con impacto en formateo.
    - Flujo de logout confirmable, conectado a `useAuth().logout`.

- **Otros elementos clave**
  - `BottomNav` para navegación principal en modo móvil.
  - `PrivacyValue` y `usePrivacy` para ocultar/mostrar montos de forma global.
  - `SettingsProvider` como orquestador de:
    - Tema, modo, idioma, moneda, userName.
    - Traductor `t()` usado en todas las vistas orientadas a negocio.

### 5. Funcionalidades Pendientes / Roadmap Lógico

Basado en el código actual y en las piezas “stub” o mock:

- **Persistencia completa de datos de producto**
  - Conectar todas las acciones de `/transactions` a `useTransactions` + `transactionService`.
  - Conectar “Recent Activity” del dashboard al endpoint real de histórico de transacciones.
  - Persistir `SavingsGoal` en backend (crear `savings.service.ts` + tipos).
  - Persistir `vaultAccounts` y `wallet cards` (crear `wallet.service.ts`).

- **AI Coach real**
  - Sustituir respuestas hardcoded por integración a:
    - Motor LLM con *contexto de usuario* (ingresos, gastos, suscripciones, goals).
    - API interna tipo `/ai/coach` que haga:
      - Enriquecimiento de prompt con datos financieros reales.
      - Registro de sesiones de coaching para analítica de uso (monetización).

- **Onboarding y planes de suscripción (Vibecoding → ingresos)**
  - Pantallas y lógica para:
    - Plan Free vs Pro (features gating: AI avanzado, automatizaciones, alertas push).
    - Gestión de suscripciones (Stripe/RevenueCat/etc.).
  - Backend de billing (no presente en este repo).

- **Seguridad y cumplimiento**
  - Endurecer `axios` interceptor para:
    - Revocación centralizada de sesión en 401.
    - Manejo de CSRF si aplica.
  - Gestión de errores global (`ErrorBoundary`, toasts centralizados).
  - Telemetría de incidentes (Sentry o similar) – aún no presente.

- **Multi-dispositivo y sincronización**
  - Estrategia de “device trust” y login múltiple (sólo hinted por cookies).
  - Notificaciones push (recordatorios de retos de ahorro, suscripciones próximas).

- **Backoffice / Analytics interno**
  - No existe aún interfaz de administración.
  - Roadmap lógico:
    - Panel admin para ver cohortes, churn de retos, uso de features AI, etc.

- **Internacionalización avanzada**
  - `locales/` contiene diccionario y guías de migración, pero:
    - Falta pipeline para añadir nuevos idiomas y *copy testing* orientado a conversión.

### 6. Guía de Estilo y Patrones de Diseño

- **Arquitectura de frontend**
  - **Segmentación por dominio de negocio**:
    - Páginas agrupadas por contexto (`/(app)/dashboard`, `/(app)/wallet`, `/(app)/savings`).
    - Servicios específicos por agregado (`auth.service`, `dashboard.service`, `transaction.service`, `categories.service`).
  - **Separación UI / datos / dominio**:
    - UI declarativa en páginas y componentes.
    - Lógica de acceso a datos en `services/*`.
    - Orquestación y side-effects en `hooks/*`.
    - Contratos de dominio en `types/*` (tipo DTO).

- **Patrones usados**
  - **Repository/Service pattern (frontend)**:
    - Cada recurso backend tiene un `*.service.ts` que actúa como repositorio remoto.
  - **Hooks personalizados como controladores de caso de uso**:
    - `useAuth`, `useDashboard`, `useCategories`, `useTransactions` encapsulan casos de uso y estado de UI.
  - **Global providers**:
    - `Providers` (React Query + Privacy).
    - `SettingsProvider` como “orquestador de experiencia” (tema, idioma, moneda).
  - **Presentational vs container components**:
    - `components/ui/*` son building blocks reutilizables.
    - Páginas combinan estos bloques con lógica de negocio (container).
  - **i18n basado en hook + diccionario**:
    - `use-translations` + `locales/dictionary.ts` y JSONs (según se vaya añadiendo).

- **Guía visual**
  - **Look & feel “cyber-finance”**:
    - Fondos oscuros con neones (`--neon-*`) en acentos.
    - Glassmorphism (`glass`, `bg-glass-bg`, `border-glass-border`, `backdrop-blur`).
    - Motion constante pero sutil usando `framer-motion`.
  - **Enfoque en claridad de KPIs**:
    - Montos grandes, legibles, con `PrivacyValue` para modo oculto.
    - Gráficas y badges con codificación de color consistente:
      - Verde → positivo / ahorro.
      - Rojo/rosa → gasto / alerta.
      - Cian/morado → información / navegación.

### 7. Decisiones de Producto Clave

- **Mobile-first**: toda la jerarquía de componentes y navegación está pensada para pantalla móvil (bottom nav, cards, scroll vertical).
- **Data-driven UX**: casi todas las pantallas se diseñan alrededor de **una métrica principal** (balance, ahorro total, drain mensual, etc.) + contexto accionable.
- **Privacy by design**: `PrivacyValue` y `privacyMode` permiten usar la app en público sin exponer montos.
- **Preparada para monetización por valor**:
  - Módulo de AI Coach ya expone el tipo de insight que puede moverse a “pro”.
  - Retos de ahorro y budgeting generan hábitos → aumenta LTV.

### 8. Variables de Entorno y Configuración

- **Variables actuales detectadas**
  - `NEXT_PUBLIC_API_URL`
    - Usada en `lib/axios.ts` para configurar el backend financiero.
    - Fallback local: `http://localhost:3000/api`.

- **Propuesta de `.env.example`**
  - `NEXT_PUBLIC_API_URL=https://api.financial-guard.dev`
  - `NEXT_PUBLIC_ENV=development|staging|production`
  - (Futuro) `NEXT_PUBLIC_AI_ENDPOINT=https://ai.financial-guard.dev`

### 9. KPI y Métricas de Éxito (Sugeridos)

- **Activación**
  - % de usuarios que completan onboarding + primer registro de transacción en < 24h.
- **Engagement de hábito**
  - Días activos/mes.
  - % de usuarios con goals activos en `/savings`.
  - Número de check-ins de retos de ahorro por semana.
- **Monetización (futuro)**
  - ARPU por plan.
  - % de usuarios que usan AI Coach >= 3 veces/mes.
  - Conversión de free → pro tras recomendaciones de AI Coach.

### 10. Próximos Pasos Recomendados

- Formalizar contrato del backend (OpenAPI/Swagger) alineado con los tipos existentes (`auth`, `dashboard`, `categories`, `transactions`).
- Sustituir mocks de `/dashboard`, `/budgeting`, `/savings`, `/wallet` por datos del backend de forma incremental.
- Diseñar `AI Coach v1` con endpoint real y *guardrails* para recomendaciones financieras responsables.
- Añadir tracking de eventos clave (login, creación de goal, cierre de mes, uso de AI) para medir el impacto en ingresos futuros.

