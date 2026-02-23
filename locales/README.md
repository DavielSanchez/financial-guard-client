# 🌐 Internationalization (i18n) System

Complete type-safe translation system for Financial Guard with full autocomplete support.

## 📁 File Structure

```
@/locales/
├── dictionary.ts        # Main translation dictionary with strict typing
└── README.md           # This file

@/hooks/
└── use-translations.ts # Type-safe translation hook
```

## 🚀 Quick Start

### 1. Using Translations in Components

```tsx
import { useI18n } from '@/hooks/use-translations'

export function LoginPage() {
  const { t } = useI18n()

  return (
    <div>
      <h1>{t('auth.login.heading')}</h1>
      <p>{t('auth.login.subheading')}</p>
      <button>{t('auth.login.submitButton')}</button>
    </div>
  )
}
```

### 2. Type-Safe Translation Keys

All translation keys are type-checked at compile time:

```tsx
const { t } = useI18n()

// ✅ CORRECT - TypeScript validates the key exists
t('auth.login.heading')

// ❌ ERROR - TypeScript shows "Property does not exist"
t('auth.login.invalidKey')
```

### 3. Autocomplete & IntelliSense

When you type `t('auth.`, your IDE will show all available keys:
- `t('auth.title')`
- `t('auth.subtitle')`
- `t('auth.login.heading')`
- `t('auth.login.emailPlaceholder')`
- ... and more

## 📚 Translation Keys

### Auth Section
```
auth.title                    // "Financial Guard"
auth.subtitle                 // "Access your command center"
auth.login.heading           // "ENTER THE GUARD"
auth.login.submitButton      // "ENTER THE GUARD"
auth.register.heading        // "INITIALIZE PROTOCOL"
auth.logout.confirmTitle     // "Deauthorize Session"
```

### Settings Section
```
settings.title               // "Settings"
settings.displayName         // "Display Name"
settings.theme              // "Color Theme"
settings.mode               // "Interface Mode"
settings.language           // "Language"
settings.currency           // "Default Currency"
```

### Themes
```
themes.neon                 // "Cyber Neon"
themes.midnight-gold        // "Luxury Gold"
themes.ocean-frost          // "Ocean Frost"
themes.sunset-blaze         // "Sunset Blaze"
```

### Navigation
```
nav.dashboard               // "Dashboard"
nav.transactions            // "Transactions"
nav.wallet                  // "Wallet"
nav.budgeting              // "Budgeting"
nav.aiCoach                // "AI Coach"
```

### Common
```
common.save                 // "Save"
common.cancel              // "Cancel"
common.loading             // "Loading..."
common.error               // "Error"
common.success             // "Success"
```

## 🔧 Advanced Usage

### 1. Manual Language Selection

```tsx
import { useTranslations } from '@/hooks/use-translations'

function LanguageSwitcher() {
  const { t: tEnglish } = useTranslations({ language: 'en' })
  const { t: tSpanish } = useTranslations({ language: 'es' })

  return (
    <div>
      <p>{tEnglish('auth.login.heading')}</p>
      <p>{tSpanish('auth.login.heading')}</p>
    </div>
  )
}
```

### 2. Parameter Interpolation

Dictionary supports parameter placeholders:

```typescript
// In dictionary.ts
validation: {
  minLength: "Minimum {length} characters",
}

// In component
t('validation.minLength', { length: 8 })
// Output: "Minimum 8 characters"
```

### 3. Debug Mode

Enable debug logging for missing keys:

```tsx
const { t } = useTranslations({ debug: true, language: 'en' })
// Missing keys will log: [i18n] Missing translation key: some.missing.key
```

## ✅ Adding New Translations

### Step 1: Add to English Dictionary

Edit `@/locales/dictionary.ts` and add your key to the `en` object:

```typescript
export const en = {
  newSection: {
    newKey: "English text here",
  },
  // ... rest of dictionary
} as const;
```

### Step 2: TypeScript Auto-Validates Spanish

Because `es` uses `typeof en`, you'll see a TypeScript error:

```
Property 'newKey' is missing in type 'typeof es.newSection'
```

### Step 3: Add Spanish Translation

Add the same key to `es`:

```typescript
export const es: typeof en = {
  newSection: {
    newKey: "Texto en español aquí",
  },
  // ... rest of dictionary
}
```

✅ TypeScript error disappears automatically!

## 🔍 Type Safety Features

### 1. Structure Parity

If you forget a translation in Spanish, TypeScript errors immediately:

```typescript
// ❌ COMPILE ERROR: Missing 'newKey'
export const es: typeof en = {
  auth: { /* ... */ },
  settings: { /* ... */ },
  // ERROR: Property 'newKey' is missing
}
```

### 2. Dot Notation Types

Translation paths are validated:

```tsx
type ValidPath = 'auth.login.heading' | 'settings.title' // ✅
type InvalidPath = 'auth.invalid' // ❌ TypeScript error
```

### 3. Return Type Safety

The `t()` function always returns a `string`:

```tsx
const title: string = t('auth.login.heading') // ✅
```

## 📋 Language Codes

Supported languages:

```typescript
type LanguageCode = 'en' | 'es'

languages: {
  en: "English",      // 🇺🇸
  es: "Spanish",      // 🇪🇸
}
```

## 🎨 Tone Guidelines

All translations follow a **professional, modern fintech/cyberpunk** tone:

### English Examples
- "ENTER THE GUARD" (action-oriented)
- "Access your command center" (tech-forward)
- "Initialize Protocol" (system language)

### Spanish Examples
- "ENTRA EN LA GUARDIA" (action-oriented)
- "Accede a tu centro de comando" (tech-forward)
- "Inicializar Protocolo" (system language)

## 🔗 Integration with SettingsProvider

Translations automatically sync with user's language preference:

```tsx
// In SettingsProvider context
const { t } = useI18n()
// Automatically uses user's selected language

// Outside SettingsProvider context
const { t } = useTranslations({ language: 'en' })
// Falls back to English
```

## 📦 Export References

The dictionary exports several useful types:

```typescript
import {
  en,                  // English dictionary
  es,                  // Spanish dictionary
  type DictionarySection,  // 'auth' | 'settings' | 'themes' | ...
  type TranslationPath,    // Dot notation paths - for type checking
  type GetTranslation,     // Helper type to get value at path
} from '@/locales/dictionary'
```

## 🐛 Troubleshooting

### Missing Translations
If you see a key in the console (e.g., `auth.login.heading`), it means:
1. The key doesn't exist in either dictionary
2. Add it to `en` first
3. TypeScript will error in `es` until you translate it

### Autocomplete Not Working
1. Make sure you're inside a component (not in a class)
2. Ensure your IDE has Pylance or similar TypeScript support
3. Restart your IDE

### Language Not Changing
If the UI doesn't update when changing language:
1. Ensure SettingsProvider wraps your component
2. Use `useI18n()` (which reads from SettingsProvider)
3. Not `useTranslations()` with manual language parameter

## 📝 Future Extensions

This system can be extended with:

- [ ] Plural forms support
- [ ] Date/time formatting
- [ ] RTL language support
- [ ] Translation management UI
- [ ] Dynamic translation loading
- [ ] Namespace organization for large apps

---

**Last Updated:** February 21, 2026  
**Maintained by:** Team  
**Next Review:** Q2 2026
