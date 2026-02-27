"use client"

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react"
import { useAuthStore } from "@/store/use-auth-store"
import { useSettingsSync } from "@/hooks/use-settings"

// --- Types ---
export type ThemeName = "neon" | "midnight-gold" | "ocean-frost" | "sunset-blaze"
export type ModeName = "dark" | "light"
export type LanguageCode = "en" | "es"
export type CurrencyCode = "USD" | "EUR" | "DOP" | "MXN"

export interface Settings {
  theme: ThemeName
  mode: ModeName
  language: LanguageCode
  currency: CurrencyCode
  userName: string
}

interface SettingsContextValue extends Settings {
  setTheme: (t: ThemeName) => void
  setMode: (m: ModeName) => void
  setLanguage: (l: LanguageCode) => void
  setCurrency: (c: CurrencyCode) => void
  setUserName: (n: string) => void
  formatCurrency: (amount: number) => string
  t: (key: string) => string
}

export const settings: UserSettings = {
  mode: "dark",
  theme: "neon",
  language: "es",
  currency: "USD"
};

export interface UserSettings {
  mode: ModeName;
  theme: ThemeName;
  language: LanguageCode;
  currency: CurrencyCode;
}
// --- Constants & Themes ---
const STORAGE_KEY = "fg_settings"

const defaultSettings: Settings = {
  theme: "neon",
  mode: "light",
  language: "en",
  currency: "USD",
  userName: "User",
}

const themes: Record<ThemeName, any> = {
  neon: {
    neon1: "#8F00FF", neon2: "#00D4FF", neon3: "#FF007F", neon4: "#00FF94",
    darkBg: "#050505", darkFg: "#e8e8e8", lightBg: "#F5F5F5", lightFg: "#1A1A1A",
    darkGlassBg: "rgba(255,255,255,0.04)", darkGlassBorder: "rgba(255,255,255,0.1)",
    lightGlassBg: "rgba(0,0,0,0.03)", lightGlassBorder: "rgba(0,0,0,0.08)",
    darkMuted: "#888888", lightMuted: "#6B7280",
  },
  "midnight-gold": {
    neon1: "#D4AF37", neon2: "#F5E6A3", neon3: "#C0392B", neon4: "#2ECC71",
    darkBg: "#0A0A0A", darkFg: "#F5E6A3", lightBg: "#FFF8E7", lightFg: "#1A1A1A",
    darkGlassBg: "rgba(212,175,55,0.04)", darkGlassBorder: "rgba(212,175,55,0.12)",
    lightGlassBg: "rgba(139,109,24,0.04)", lightGlassBorder: "rgba(139,109,24,0.1)",
    darkMuted: "#9A8C5F", lightMuted: "#8B6D18",
  },
  "ocean-frost": {
    neon1: "#0EA5E9", neon2: "#67E8F9", neon3: "#F43F5E", neon4: "#34D399",
    darkBg: "#0C1222", darkFg: "#E2E8F0", lightBg: "#F0F9FF", lightFg: "#0F172A",
    darkGlassBg: "rgba(14,165,233,0.04)", darkGlassBorder: "rgba(14,165,233,0.12)",
    lightGlassBg: "rgba(14,165,233,0.04)", lightGlassBorder: "rgba(14,165,233,0.1)",
    darkMuted: "#64748B", lightMuted: "#475569",
  },
  "sunset-blaze": {
    neon1: "#FF6B35", neon2: "#FBBF24", neon3: "#EF4444", neon4: "#22C55E",
    darkBg: "#0F0A05", darkFg: "#FEF3C7", lightBg: "#FFFBF0", lightFg: "#1C1917",
    darkGlassBg: "rgba(255,107,53,0.04)", darkGlassBorder: "rgba(255,107,53,0.12)",
    lightGlassBg: "rgba(180,83,9,0.04)", lightGlassBorder: "rgba(180,83,9,0.1)",
    darkMuted: "#A08060", lightMuted: "#92400E",
  },
}

const translations: Record<LanguageCode, Record<string, string>> = {
  en: {
    "settings.title": "Settings",
    "settings.profile": "Profile",
    "settings.appearance": "Appearance",
    "settings.accessibility": "Accessibility",
    "settings.account": "Account",
    "settings.displayName": "Display Name",
    "settings.theme": "Color Theme",
    "settings.mode": "Interface Mode",
    "settings.language": "Language",
    "settings.currency": "Default Currency",
    "settings.logout": "Log Out",
    "settings.logoutConfirm": "Are you sure you want to log out?",
    "common.cancel": "Cancel",
    "mode.dark": "Dark",
    "mode.light": "Light",
    "theme.neon": "Cyber Neon",
    "theme.midnight-gold": "Luxury Gold",
    "theme.ocean-frost": "Ocean Frost",
    "theme.sunset-blaze": "Sunset Blaze",
  },
  es: {
    "settings.title": "Ajustes",
    "settings.profile": "Perfil",
    "settings.appearance": "Apariencia",
    "settings.accessibility": "Accesibilidad",
    "settings.account": "Cuenta",
    "settings.displayName": "Nombre visible",
    "settings.theme": "Tema de color",
    "settings.mode": "Modo de interfaz",
    "settings.language": "Idioma",
    "settings.currency": "Moneda principal",
    "settings.logout": "Cerrar Sesión",
    "settings.logoutConfirm": "¿Estás seguro de que deseas salir?",
    "common.cancel": "Cancelar",
    "mode.dark": "Oscuro",
    "mode.light": "Claro",
    "theme.neon": "Ciber Neón",
    "theme.midnight-gold": "Oro Lujo",
    "theme.ocean-frost": "Océano Gélido",
    "theme.sunset-blaze": "Ocaso Fuego",
  },
}

// --- Utils ---
function hexToRgb(hex: string): string {
  const h = hex.replace("#", "")
  const r = parseInt(h.substring(0, 2), 16)
  const g = parseInt(h.substring(2, 4), 16)
  const b = parseInt(h.substring(4, 6), 16)
  return `${r},${g},${b}`
}

function applyThemeToDOM(theme: ThemeName, mode: ModeName) {
  if (typeof window === "undefined") return
  const t = themes[theme] || themes.neon
  const isDark = mode === "dark"
  const root = document.documentElement

  root.classList.remove("dark", "light")
  root.classList.add(mode)

  const bg = isDark ? t.darkBg : t.lightBg
  const fg = isDark ? t.darkFg : t.lightFg
  const mutedBg = isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.04)"

  const properties: Record<string, string> = {
    "--neon-1": t.neon1,
    "--neon-2": t.neon2,
    "--neon-3": t.neon3,
    "--neon-4": t.neon4,
    "--primary": t.neon1,
    "--accent": t.neon2,
    "--destructive": t.neon3,
    "--background": bg,
    "--foreground": fg,
    "--card": isDark ? t.darkGlassBg : t.lightGlassBg,
    "--border": isDark ? t.darkGlassBorder : t.lightGlassBorder,
    "--muted": mutedBg,
    "--muted-foreground": isDark ? t.darkMuted : t.lightMuted,
    "--neon-1-rgb": hexToRgb(t.neon1),
    "--bg-rgb": hexToRgb(bg),
    // Sidebar adapts to theme
    "--sidebar-primary": t.neon1,
    "--sidebar-ring": t.neon1,
  }

  Object.entries(properties).forEach(([key, val]) => root.style.setProperty(key, val))
}

// --- Provider Component ---
const SettingsContext = createContext<SettingsContextValue | null>(null)

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<Settings>(defaultSettings)
  const { user, _hasHydrated } = useAuthStore()
  const { syncSetting } = useSettingsSync()

  // 1. Efecto Inicial: Cargar de LocalStorage (Previo a Auth)
  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      try {
        const parsed = JSON.parse(raw)
        const merged = { ...defaultSettings, ...parsed }
        setSettings(merged)
        applyThemeToDOM(merged.theme, merged.mode)
      } catch (e) { console.error("Error loading local settings", e) }
    } else {
        applyThemeToDOM(defaultSettings.theme, defaultSettings.mode)
    }
  }, [])

  // 2. Efecto de Sincronización: Cuando el usuario se loguea
  useEffect(() => {
    if (!_hasHydrated || !user) return

    // Mapeo defensivo de la data que viene del backend
    const syncedSettings: Settings = {
      mode: (settings.mode),
      theme: (settings.theme),
      language: (settings.language),
      currency: (settings.currency),
      userName: user.firstName || settings.userName, // firstName viene del profile extendido
    }

    setSettings(syncedSettings)
    applyThemeToDOM(syncedSettings.theme, syncedSettings.mode)
  }, [user, _hasHydrated])

  // 3. Efecto de Persistencia Local y DOM
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings))
    applyThemeToDOM(settings.theme, settings.mode)
  }, [settings])

  // --- Handlers con Sync Automático ---
  const updateAndSync = useCallback((updates: Partial<Settings>) => {
    setSettings(prev => ({ ...prev, ...updates }))
    
    // Disparar sincronización al backend por cada llave modificada
    Object.entries(updates).forEach(([key, value]) => {
      syncSetting(key, value)
    })
  }, [syncSetting])

  const setTheme = (theme: ThemeName) => updateAndSync({ theme })
  const setMode = (mode: ModeName) => updateAndSync({ mode })
  const setLanguage = (language: LanguageCode) => updateAndSync({ language })
  const setCurrency = (currency: CurrencyCode) => updateAndSync({ currency })
  const setUserName = (userName: string) => updateAndSync({ userName })

  const formatCurrency = useCallback((amount: number) => {
    const locale = settings.language === "es" ? "es-DO" : "en-US"
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency: settings.currency,
    }).format(amount)
  }, [settings.language, settings.currency])

  const t = useCallback((key: string) => {
    return translations[settings.language]?.[key] ?? translations.en[key] ?? key
  }, [settings.language])

  return (
    <SettingsContext.Provider
      value={{
        ...settings,
        setTheme,
        setMode,
        setLanguage,
        setCurrency,
        setUserName,
        formatCurrency,
        t,
      }}
    >
      {children}
    </SettingsContext.Provider>
  )
}

export function useSettings() {
  const ctx = useContext(SettingsContext)
  if (!ctx) throw new Error("useSettings must be used within SettingsProvider")
  return ctx
}

export const themeList = Object.entries(themes).map(([key, colors]) => ({
  key: key as ThemeName,
  colors,
}))