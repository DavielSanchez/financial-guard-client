/**
 * Sidebar navigation configuration.
 * Edit this file to add, remove, or reorder sidebar routes.
 * i18nKey must exist in locales/dictionary.ts (nav.*)
 */

import type { IconDefinition } from "@fortawesome/fontawesome-svg-core"
import {
  faGrip,
  faPlus,
  faChartPie,
  faWallet,
  faPiggyBank,
  faRobot,
  faGear,
} from "@fortawesome/free-solid-svg-icons"

export interface SidebarNavItem {
  href: string
  icon: IconDefinition
  i18nKey: string
}

/** Main navigation items (primary links) */
export const SIDEBAR_NAV_ITEMS: SidebarNavItem[] = [
  { href: "/dashboard", icon: faGrip, i18nKey: "nav.dashboard" },
  { href: "/transactions", icon: faPlus, i18nKey: "nav.transactions" },
  { href: "/budgeting", icon: faChartPie, i18nKey: "nav.budgeting" },
  { href: "/wallet", icon: faWallet, i18nKey: "nav.wallet" },
  { href: "/savings", icon: faPiggyBank, i18nKey: "nav.savings" },
  { href: "/ai-coach", icon: faRobot, i18nKey: "nav.aiCoach" },
]

/** Secondary items (e.g. settings, profile) */
export const SIDEBAR_FOOTER_ITEMS: SidebarNavItem[] = [
  { href: "/settings", icon: faGear, i18nKey: "nav.settings" },
]
