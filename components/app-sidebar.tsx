"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { useI18n } from "@/hooks/use-translations"
import {
  SIDEBAR_NAV_ITEMS,
  SIDEBAR_FOOTER_ITEMS,
} from "@/config/sidebar-nav"

export function AppSidebar() {
  const [mounted, setMounted] = useState(false)
  const pathname = usePathname()
  const { t } = useI18n()

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <Sidebar collapsible="icon" variant="inset">
        <SidebarHeader className="border-b border-sidebar-border/60 px-3 py-4" style={{ borderColor: "var(--sidebar-border)" }} />
        <SidebarContent />
      </Sidebar>
    )
  }

  const getGreetingKey = () => {
    const h = new Date().getHours()
    if (h < 6) return "greetings.night"
    if (h < 12) return "greetings.morning"
    if (h < 18) return "greetings.afternoon"
    return "greetings.evening"
  }

  return (
    <Sidebar collapsible="icon" variant="inset">
      <SidebarHeader
        className="border-b border-sidebar-border/60 px-3 py-4"
        style={{
          borderColor: "var(--sidebar-border)",
        }}
      >
        <Link href="/dashboard" className="flex items-center gap-2">
          <div
            className="flex h-8 w-8 items-center justify-center rounded-lg"
            style={{
              backgroundColor: "rgba(var(--neon-1-rgb, 143,0,255), 0.2)",
              boxShadow: "0 0 12px rgba(var(--neon-1-rgb, 143,0,255), 0.3)",
            }}
          >
            <span
              className="text-xs font-bold tracking-widest"
              style={{ color: "var(--sidebar-primary)" }}
            >
              FG
            </span>
          </div>
          <div className="group-data-[collapsible=icon]:hidden">
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              Cyber Finance
            </p>
            <p className="text-xs font-semibold text-foreground">
              Financial Guard
            </p>
          </div>
        </Link>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="group-data-[collapsible=icon]:hidden">
            {t("nav.groupLabel" as any)}
          </SidebarGroupLabel>
          <SidebarMenu>
            {SIDEBAR_NAV_ITEMS.map((item) => {
              const isActive =
                pathname === item.href ||
                (item.href !== "/dashboard" && pathname.startsWith(item.href))
              return (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton asChild isActive={isActive}>
                    <Link href={item.href}>
                      <FontAwesomeIcon
                        icon={item.icon}
                        className="shrink-0"
                        style={
                          isActive
                            ? {
                                color: "var(--sidebar-primary)",
                                filter:
                                  "drop-shadow(0 0 6px var(--sidebar-primary))",
                              }
                            : {}
                        }
                      />
                      <span className="group-data-[collapsible=icon]:hidden">
                        {t(item.i18nKey as any)}
                      </span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )
            })}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter
        className="border-t border-sidebar-border/60 p-3 group-data-[collapsible=icon]:hidden"
        style={{ borderColor: "var(--sidebar-border)" }}
      >
        <div className="space-y-1">
          {SIDEBAR_FOOTER_ITEMS.map((item) => {
            const isActive = pathname === item.href
            return (
              <SidebarMenuButton
                key={item.href}
                asChild
                isActive={isActive}
                className="h-8"
              >
                <Link href={item.href}>
                  <FontAwesomeIcon icon={item.icon} className="shrink-0" />
                  <span>{t(item.i18nKey as any)}</span>
                </Link>
              </SidebarMenuButton>
            )
          })}
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}
