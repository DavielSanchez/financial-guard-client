/**
 * @/hooks/use-translations.ts
 *
 * Type-safe translation hook with full autocomplete support.
 * Usage: const { t } = useTranslations('en')
 *        t('auth.login.heading') // ✅ Type-safe with autocomplete
 */

import { useCallback, useMemo } from 'react'
import { en, es, type TranslationPath, type LanguageCode } from '@/locales/dictionary'

const dictionaries = { en, es } as const

/**
 * Get a nested value from an object using dot notation
 * @param obj - The object to traverse
 * @param path - The dot-notation path (e.g., 'auth.login.heading')
 * @returns The value at the path, or the path itself if not found
 */
function getNestedValue(obj: any, path: string): any {
  const keys = path.split('.')
  let current = obj

  for (const key of keys) {
    if (current?.[key] !== undefined) {
      current = current[key]
    } else {
      return path
    }
  }

  // MODIFICACIÓN AQUÍ: Permitir strings Y arrays
  return (typeof current === 'string' || Array.isArray(current)) ? current : path
}

export interface UseTranslationsOptions {
  /**
   * Optional: Override current language from SettingsProvider
   */
  language?: LanguageCode
  
  /**
   * Optional: Enable debug mode to log missing translations
   */
  debug?: boolean
}

/**
 * Type-safe translation hook
 * 
 * @example
 * ```tsx
 * const { t, language, setLanguage } = useTranslations()
 * 
 * return <h1>{t('auth.login.heading')}</h1>
 * ```
 */
export function useTranslations(options?: UseTranslationsOptions) {
  const { language = 'en', debug = false } = options || {}
  
  // Get the current dictionary based on language
  const currentDict = useMemo(() => {
    return dictionaries[language as keyof typeof dictionaries] || dictionaries.en
  }, [language])

  /**
   * Translate a key using dot notation
   * @param key - The translation key (e.g., 'auth.login.heading')
   * @param params - Optional interpolation parameters (e.g., { count: 5 })
   * @returns The translated string
   */
  const t = useCallback(
    (key: TranslationPath, params?: Record<string, string | number>) => {
      let translation = getNestedValue(currentDict, key)

      // Fallback to English if key not found in current language
      if (translation === key && language !== 'en') {
        translation = getNestedValue(dictionaries.en, key)
        
        if (debug && translation === key) {
          console.warn(`[i18n] Missing translation key: ${key}`)
        }
      }

      // Replace parameters in the translation
      if (params) {
        Object.entries(params).forEach(([param, value]) => {
          translation = translation.replace(`{${param}}`, String(value))
        })
      }

      return translation
    },
    [currentDict, language, debug]
  )

  return {
    t,
    language,
    isEnglish: language === 'en',
    isSpanish: language === 'es',
  }
}

/**
 * Hook that uses the SettingsProvider context for current language
 * Falls back to useTranslations if not in SettingsProvider context
 * 
 * @example
 * ```tsx
 * // Must be used inside SettingsProvider
 * const { t } = useI18n()
 * return <div>{t('auth.login.heading')}</div>
 * ```
 */
export function useI18n() {
  // Import here to avoid circular dependencies
  const { useSettings } = require('@/components/settings-provider')
  
  let language: LanguageCode = 'en'
  
  try {
    const settings = useSettings()
    language = settings.language
  } catch {
    // Not in SettingsProvider context, use default
    language = 'en'
  }

  return useTranslations({ language })
}
