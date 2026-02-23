/**
 * @/locales/MIGRATION_GUIDE.md
 * 
 * Step-by-step guide to migrate existing components to use the new i18n system
 */

# 🔄 Migration Guide: Hardcoded Strings → Type-Safe i18n

## 📋 Overview

This guide helps you migrate components from hardcoded strings to the new type-safe i18n dictionary system.

**Time per component:** ~5-10 minutes  
**Complexity:** Easy - just find & replace patterns

---

## ✅ Pre-Migration Checklist

Before starting, ensure you have:
- [ ] Read `@/locales/README.md`
- [ ] Reviewed `@/locales/dictionary.ts` for available keys
- [ ] Checked `@/locales/EXAMPLE_LOGIN_REFACTOR.tsx` for patterns
- [ ] Your component compiles without errors

---

## 🚀 Migration Steps

### Step 1: Import the Translation Hook

**Before:**
```tsx
import { GlassCard } from "@/components/glass-card"
```

**After:**
```tsx
import { GlassCard } from "@/components/glass-card"
import { useI18n } from "@/hooks/use-translations" // ✨ Add this
```

### Step 2: Call the Hook in Your Component

**Before:**
```tsx
export function LoginPage() {
  const [email, setEmail] = useState("")
  // ... rest of component
}
```

**After:**
```tsx
export function LoginPage() {
  const { t } = useI18n() // ✨ Add this line (near top of component)
  const [email, setEmail] = useState("")
  // ... rest of component
}
```

### Step 3: Find & Replace Hardcoded Strings

To find where strings need to be replaced, search for:
1. Text inside JSX: `<button>Save Changes</button>`
2. Placeholder attributes: `placeholder="Email address"`
3. aria-labels: `aria-label="Close menu"`
4. Error/success messages: `"Login failed"`

**Before:**
```tsx
<h1>FINANCIAL GUARD</h1>
<p>Access your command center</p>
<input placeholder="Email address" />
<button>ENTER THE GUARD</button>
<span>{errorMessage === "Invalid credentials" ? "ACCESO DENEGADO: CREDENCIALES INVÁLIDAS" : errorMessage}</span>
```

**After:**
```tsx
<h1>{t('auth.title')}</h1>
<p>{t('auth.subtitle')}</p>
<input placeholder={t('auth.login.emailPlaceholder')} />
<button>{t('auth.login.submitButton')}</button>
<span>{errorMessage === "Invalid credentials" ? t('auth.login.errorAccessDenied') : errorMessage}</span>
```

---

## 📋 Component Migration Checklist

Use this checklist to track migration across all components:

### Authentication Pages
- [ ] `/app/login/page.tsx`
- [ ] `/app/register/page.tsx`

### App Routes
- [ ] `/app/(app)/dashboard/page.tsx`
- [ ] `/app/(app)/transactions/page.tsx`
- [ ] `/app/(app)/wallet/page.tsx`
- [ ] `/app/(app)/budgeting/page.tsx`
- [ ] `/app/(app)/savings/page.tsx`
- [ ] `/app/(app)/ai-coach/page.tsx`
- [ ] `/app/(app)/settings/page.tsx`

### Components
- [ ] `@/components/bottom-nav.tsx`
- [ ] `@/components/dashboard-chart.tsx`
- [ ] `@/components/glass-card.tsx`
- [ ] `@/components/protected-route.tsx`
- [ ] `@/components/providers.tsx`

### UI Components (as needed)
- [ ] `@/components/ui/button.tsx`
- [ ] `@/components/ui/dialog.tsx`
- [ ] `@/components/ui/toast.tsx`
- [ ] Other UI components with text...

---

## 🔍 Common Patterns to Replace

### 1. UI Labels

**Before:**
```tsx
<label>Display Name</label>
<label>Color Theme</label>
<label>Interface Mode</label>
```

**After:**
```tsx
<label>{t('settings.displayName')}</label>
<label>{t('settings.theme')}</label>
<label>{t('settings.mode')}</label>
```

### 2. Button Text

**Before:**
```tsx
<button>Save Changes</button>
<button>Cancel</button>
<button>Delete</button>
```

**After:**
```tsx
<button>{t('common.save')}</button>
<button>{t('common.cancel')}</button>
<button>{t('common.delete')}</button>
```

### 3. Placeholder Text

**Before:**
```tsx
<input placeholder="Email address" />
<input placeholder="Password" />
<input placeholder="Search..." />
```

**After:**
```tsx
<input placeholder={t('auth.login.emailPlaceholder')} />
<input placeholder={t('auth.login.passwordPlaceholder')} />
<input placeholder={t('common.search')} />
```

### 4. Error Messages

**Before:**
```tsx
setErrorMessage("An unexpected error occurred")
return <div>{t('common.error')}</div>
```

**After:**
```tsx
setErrorMessage(t('auth.login.errorInvalid'))
return <div>{t('common.error')}</div>
```

### 5. aria-labels (Accessibility)

**Before:**
```tsx
<button aria-label="Close menu">×</button>
<button aria-label="Settings">⚙️</button>
```

**After:**
```tsx
<button aria-label={t('common.close')}>×</button>
<button aria-label={t('settings.title')}>⚙️</button>
```

### 6. Navigation Links

**Before:**
```tsx
<Link href="/dashboard">Dashboard</Link>
<Link href="/settings">Settings</Link>
<Link href="/logout">Log Out</Link>
```

**After:**
```tsx
<Link href="/dashboard">{t('nav.dashboard')}</Link>
<Link href="/settings">{t('nav.settings')}</Link>
<Link href="/logout">{t('auth.logout.confirmTitle')}</Link>
```

---

## 🧪 Testing Your Migration

After migrating a component, verify:

1. **No TypeScript Errors**
   ```bash
   npm run lint  # Should show no errors
   ```

2. **Component Renders**
   - Navigate to the component in browser
   - Verify text displays correctly

3. **Language Switching**
   - Change language in Settings
   - Verify component text updates in real-time

4. **Autocomplete Works**
   - In IDE, type `t('` and verify autocomplete suggestions appear

5. **No Console Errors**
   - Open DevTools Console
   - Should show no translation warnings

---

## ⚠️ Common Mistakes

### ❌ Mistake 1: Forgetting to Import Hook
```tsx
// This will fail - t is not defined
export function MyComponent() {
  return <div>{t('common.save')}</div> // ❌ ReferenceError
}
```

**Fix:** Always import `import { useI18n } from '@/hooks/use-translations'`

### ❌ Mistake 2: Using Wrong Translation Key
```tsx
const { t } = useI18n()
return <button>{t('settings.invalidKey')}</button> // ❌ TypeScript error
```

**Fix:** Use keys that exist in `@/locales/dictionary.ts`, or add them first

### ❌ Mistake 3: Not Handling Fallback
```tsx
// If key doesn't exist, this returns the key itself as string
t('possibly.missing.key') // Returns "possibly.missing.key"
```

**Best Practice:** Always add missing keys to dictionary, don't rely on fallback

### ❌ Mistake 4: Mixing Hardcoded and i18n
```tsx
// ❌ Inconsistent - some translated, some not
<h1>{t('auth.title')}</h1>
<p>Access your command center</p> // Should be t('auth.subtitle')
```

**Fix:** Replace ALL user-facing text with translations

---

## 🆘 Troubleshooting

### Issue: "t is not defined"
**Solution:** Make sure you imported and called the hook:
```tsx
import { useI18n } from '@/hooks/use-translations'

export function MyComponent() {
  const { t } = useI18n() // ← Required!
  return <div>{t('key')}</div>
}
```

### Issue: "Property does not exist" TypeScript error
**Solution:** The translation key doesn't exist. Check:
1. Key spelling matches `@/locales/dictionary.ts` exactly
2. If key doesn't exist, add it to both `en` and `es` objects

### Issue: Text not updating when language changes
**Solution:** Ensure you're inside SettingsProvider context:
```tsx
// app/layout.tsx
<SettingsProvider>
  <Providers>{children}</Providers>
</SettingsProvider>
```

### Issue: No autocomplete suggestions
**Solution:**
1. Restart your IDE
2. Ensure TypeScript version is up to date
3. Try VS Code's "TypeScript: Restart TS Server" command

---

## 📊 Progress Tracking

Track how many components you've migrated:

```
Total Components: ___
Migrated: ___
In Progress: ___
Not Yet Started: ___

Estimated Completion: ______
```

---

## 🎓 Learning Resources

- **Dictionary Structure:** See `@/locales/README.md`
- **Complete Types:** Check type exports in `@/locales/dictionary.ts`
- **Full Example:** Review `@/locales/EXAMPLE_LOGIN_REFACTOR.tsx`
- **Hook Documentation:** Read JSDoc in `@/hooks/use-translations.ts`

---

## ✅ Post-Migration Checklist

After migrating all components:

- [ ] All components use `useI18n()` hook
- [ ] No hardcoded user-facing strings remain
- [ ] TypeScript compiles without errors
- [ ] All translations exist in both `en` and `es`
- [ ] Language switching works end-to-end
- [ ] Browser console shows no warnings
- [ ] Accessibility tested (aria-labels translated)
- [ ] Shared links/links updated if necessary

---

## 🚀 Quick Reference

### Import
```tsx
import { useI18n } from '@/hooks/use-translations'
```

### Usage
```tsx
const { t, language, isEnglish, isSpanish } = useI18n()
```

### Examples
```tsx
{t('auth.title')}                    // Regular string
{t('settings.displayName')}          // Settings
{t('common.save')}                   // Common actions
{t('themes.neon')}                   // Theme names
{t('nav.dashboard')}                 // Navigation
```

### Type Safety
```tsx
t('invalid.key')  // ✅ TypeScript error - key doesn't exist
t('auth.title')   // ✅ Valid - shows autocomplete
```

---

**Last Updated:** February 21, 2026  
**Status:** ✅ Ready for use  
**Maintained by:** Team
