# PRD: Módulo de Presupuesto (Budget)

## 1. Visión General

El módulo de presupuesto de Financial Guard se compone de **dos apartados**:

1. **Liquid Envelopes (Sobres Líquidos)** – Categorías de gasto con límite mensual asignado. El gasto real se calcula a partir de las transacciones del periodo.
2. **Drainers (Drenadores)** – Suscripciones y gastos recurrentes que drenan el presupuesto mensual. Incluye control de próxima fecha de cobro y estado activo/cancelado.

---

## 2. Parte A: Liquid Envelopes

### 2.1 Descripción

Cada **Budget Envelope** representa una categoría de gasto con un límite presupuestario para un periodo (mes/año). El gasto real (`spent`) se deriva de la suma de transacciones de tipo `expense` asociadas a esa categoría en el periodo activo.

### 2.2 Modelo de Datos

```ts
// Budget Envelope (Sobre)
interface BudgetEnvelope {
  id: string
  user_id: string
  category_id: string          // FK a categories - vincula con transacciones
  budget_amount: number        // Límite asignado (ej: 800)
  currency: string             // USD, EUR, DOP, MXN
  period_type: "monthly"       // Futuro: weekly, yearly
  period_month?: number        // 1-12
  period_year?: number         // 2025
  color?: string               // #8F00FF - para UI
  gradient?: string            // linear-gradient(...) - opcional, puede calcularse en front
  icon?: string                // Nombre del icono (Wallet, Home, etc.)
  sort_order?: number
  created_at: string
  updated_at: string
}
```

**Relaciones:**
- `category_id` → `categories.id` (categoría de gasto existente)
- `user_id` → `users.id`

**Nota:** Las categorías de transacciones (`categories`) ya existen. Un Budget Envelope vincula una categoría con un límite presupuestario para un periodo. Si no existe categoría, el usuario puede crear una desde el flujo de categorías.

### 2.3 Cálculo de `spent`

```sql
-- Ejemplo: gasto en el mes actual para un envelope
SELECT COALESCE(SUM(t.amount), 0) AS spent
FROM transactions t
WHERE t.user_id = :user_id
  AND t.category_id = :category_id
  AND t.type = 'expense'
  AND t.date >= :period_start
  AND t.date < :period_end
```

### 2.4 Endpoints – Budget Envelopes

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/budget/envelopes` | Lista de envelopes del usuario para el periodo actual. Query params: `month`, `year`. Incluir `spent` calculado. |
| POST | `/budget/envelopes` | Crear envelope. Body: `{ category_id, budget_amount, currency, period_type, color?, icon? }` |
| PATCH | `/budget/envelopes/:id` | Actualizar envelope (amount, color, icon). |
| DELETE | `/budget/envelopes/:id` | Eliminar envelope. |

**Ejemplo respuesta GET `/budget/envelopes?month=2&year=2025`:**

```json
[
  {
    "id": "env_1",
    "user_id": "usr_1",
    "category_id": "cat_1",
    "category": {
      "id": "cat_1",
      "name": "Food & Dining",
      "icon": "Utensils",
      "color": "#00D4FF"
    },
    "budget_amount": 800,
    "currency": "USD",
    "period_type": "monthly",
    "period_month": 2,
    "period_year": 2025,
    "spent": 680,
    "color": "#00D4FF",
    "gradient": "linear-gradient(135deg, #00D4FF 0%, #0099CC 100%)",
    "icon": "Utensils",
    "created_at": "2025-01-15T00:00:00Z",
    "updated_at": "2025-02-01T00:00:00Z"
  }
]
```

---

## 3. Parte B: Drainers (Suscripciones)

### 3.1 Descripción

Los **Drainers** son suscripciones o gastos recurrentes (Netflix, gym, Spotify, etc.). El usuario ve el costo mensual total y puede marcar suscripciones como “canceladas” (archivadas) para excluirlas del total.

### 3.2 Modelo de Datos

```ts
// Subscription / Drainer
interface Subscription {
  id: string
  user_id: string
  name: string               // "Netflix", "Gym Membership"
  amount: number             // 15.99, 45.00
  currency: string           // USD, EUR, etc.
  billing_cycle: "monthly" | "yearly" | "weekly"
  next_bill_date: string     // ISO date: "2025-03-15"
  color?: string             // #FF007F
  icon?: string              // "RotateCcw" o similar
  is_active: boolean         // true = activo, false = cancelado/archivado
  category_id?: string       // Opcional: vincular a categoría
  reminder_days_before?: number  // Opcional: avisar X días antes
  created_at: string
  updated_at: string
}
```

### 3.3 Endpoints – Drainers

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/budget/subscriptions` | Lista de suscripciones del usuario. Incluir activas y archivadas. |
| POST | `/budget/subscriptions` | Crear suscripción. Body: `{ name, amount, currency, billing_cycle, next_bill_date, color?, icon?, category_id? }` |
| PATCH | `/budget/subscriptions/:id` | Actualizar (nombre, monto, next_bill_date, is_active, etc.). |
| DELETE | `/budget/subscriptions/:id` | Eliminar suscripción. |

**Toggle cancelar/reactivar:** `PATCH /budget/subscriptions/:id` con `{ is_active: false }` o `{ is_active: true }`.

**Ejemplo respuesta GET `/budget/subscriptions`:**

```json
[
  {
    "id": "sub_1",
    "user_id": "usr_1",
    "name": "Netflix",
    "amount": 15.99,
    "currency": "USD",
    "billing_cycle": "monthly",
    "next_bill_date": "2025-03-15",
    "color": "#FF007F",
    "icon": "RotateCcw",
    "is_active": true,
    "created_at": "2025-01-10T00:00:00Z",
    "updated_at": "2025-02-27T00:00:00Z"
  }
]
```

**Cálculo de costo mensual para drainers:**
- `billing_cycle === "monthly"` → `amount` directo.
- `billing_cycle === "yearly"` → `amount / 12`.
- `billing_cycle === "weekly"` → `amount * 4.33` (aprox. mensual).

---

## 4. Resumen de Endpoints Completos

### Budget Envelopes (Sobres)

| Método | Ruta | Body (POST/PATCH) |
|--------|------|-------------------|
| GET | `/budget/envelopes?month=2&year=2025` | - |
| POST | `/budget/envelopes` | `{ category_id, budget_amount, currency, period_type?, color?, icon? }` |
| PATCH | `/budget/envelopes/:id` | `{ budget_amount?, color?, icon? }` |
| DELETE | `/budget/envelopes/:id` | - |

### Subscriptions (Drainers)

| Método | Ruta | Body (POST/PATCH) |
|--------|------|-------------------|
| GET | `/budget/subscriptions` | - |
| POST | `/budget/subscriptions` | `{ name, amount, currency, billing_cycle, next_bill_date, color?, icon?, category_id? }` |
| PATCH | `/budget/subscriptions/:id` | `{ name?, amount?, next_bill_date?, is_active?, color?, icon? }` |
| DELETE | `/budget/subscriptions/:id` | - |

---

## 5. Tablas Sugeridas (SQL)

### `budget_envelopes`

```sql
CREATE TABLE budget_envelopes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  category_id UUID NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
  budget_amount DECIMAL(12,2) NOT NULL,
  currency VARCHAR(3) NOT NULL DEFAULT 'USD',
  period_type VARCHAR(20) NOT NULL DEFAULT 'monthly',
  period_month INT,
  period_year INT,
  color VARCHAR(7),
  icon VARCHAR(50),
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, category_id, period_month, period_year)
);

CREATE INDEX idx_budget_envelopes_user_period ON budget_envelopes(user_id, period_year, period_month);
```

### `subscriptions`

```sql
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  amount DECIMAL(12,2) NOT NULL,
  currency VARCHAR(3) NOT NULL DEFAULT 'USD',
  billing_cycle VARCHAR(20) NOT NULL DEFAULT 'monthly',
  next_bill_date DATE NOT NULL,
  color VARCHAR(7),
  icon VARCHAR(50),
  is_active BOOLEAN DEFAULT TRUE,
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  reminder_days_before INT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_subscriptions_user_active ON subscriptions(user_id, is_active);
```

---

## 6. Integración con el Frontend

El frontend actual en `/budgeting` usa:
- **Envelopes:** `budgetCategoriesData` (mock) con `id`, `key`, `icon`, `spent`, `budget`, `gradient`, `iconBg`.
- **Drainers:** `subscriptions` (mock) con `id`, `name`, `price`, `color`, `nextBill`, más estado local `cancelledSubs`.

Para conectar al backend:
1. Crear `services/budget.service.ts` con `getEnvelopes`, `createEnvelope`, `updateEnvelope`, `deleteEnvelope`, `getSubscriptions`, `createSubscription`, `updateSubscription`, `deleteSubscription`.
2. Crear `hooks/useBudgetEnvelopes.ts` y `hooks/useSubscriptions.ts` (o un único `useBudget`).
3. Reemplazar mocks por datos de la API.
4. El campo `next_bill_date` se formatea en front como "Mar 15" (`nextBill`).
5. `cancelledSubs` se reemplaza por `is_active: false` vía `PATCH`.

---

## 7. Autenticación y Permisos

- Todos los endpoints requieren usuario autenticado (sesión/cookie o JWT).
- `user_id` se obtiene del token/sesión. Solo se devuelven registros del usuario actual.
- Validar que `category_id` en envelopes pertenezca al usuario (si las categorías son por usuario).

---

## 8. Próximos Pasos (Opcional)

- Notificaciones: recordar próxima fecha de cobro de suscripciones (`reminder_days_before`).
- Historial de presupuestos: copiar envelopes del mes anterior.
- Sugerencias de categorías basadas en gastos históricos.
