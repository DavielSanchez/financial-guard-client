"use client"

import React, { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { CategoryIcon } from "@/components/category-icon"
import { CurrencyInput } from "@/components/currency-input"
import { CATEGORIZED_ICONS } from "@/lib/icons"
import { useI18n } from "@/hooks/use-translations"
import type { CreateAccount } from "@/services/accounts.service"
import type { Account } from "@/types/accounts.types"

const ACCOUNT_TYPES = [
  { value: "bank", label: "Banco" },
  { value: "checking", label: "Cuenta Corriente" },
  { value: "savings", label: "Ahorro" },
  { value: "credit_card", label: "Tarjeta de Crédito" },
  { value: "cash", label: "Efectivo" },
  { value: "investment", label: "Inversión" },
] as const

const CURRENCIES = [
  { value: "USD", label: "USD" },
  { value: "EUR", label: "EUR" },
  { value: "DOP", label: "DOP" },
  { value: "MXN", label: "MXN" },
] as const

const QUICK_COLORS = [
  "#4CAF50", "#8F00FF", "#00D4FF", "#FF007F", "#00FF94",
  "#FFB800", "#FF4D00", "#0EA5E9", "#22C55E",
]

interface AddAccountPanelProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (payload: CreateAccount, accountId?: string) => void | Promise<void>
  isPending?: boolean
  /** When provided, the panel opens in edit mode with pre-filled values */
  account?: Account | null
}

const inputStyle = "rounded-xl px-4 py-3 text-sm text-foreground outline-none placeholder:text-white/30 focus:border-primary"
const inputWrap = "w-full rounded-xl border border-white/10 bg-white/5"

export function AddAccountPanel({
  open,
  onOpenChange,
  onSave,
  isPending,
  account: editingAccount,
}: AddAccountPanelProps) {
  const [name, setName] = useState("")
  const [type, setType] = useState<string>("bank")
  const [balance, setBalance] = useState(0)
  const [currency, setCurrency] = useState("USD")
  const [selectedIcon, setSelectedIcon] = useState("Wallet")
  const [selectedColor, setSelectedColor] = useState("#4CAF50")
  const [interestRate, setInterestRate] = useState("0")
  const [isHidden, setIsHidden] = useState(false)

  const isEditMode = !!editingAccount

  useEffect(() => {
    if (open) {
      if (editingAccount) {
        const bal =
          typeof editingAccount.balance === "string"
            ? parseFloat(editingAccount.balance) || 0
            : Number(editingAccount.balance) ?? 0
        setName(editingAccount.name || "")
        setType(editingAccount.type || "bank")
        setBalance(bal)
        setCurrency(editingAccount.currency || "USD")
        setSelectedIcon(editingAccount.icon || "Wallet")
        setSelectedColor(editingAccount.color || "#4CAF50")
        setInterestRate(
          String(
            typeof editingAccount.interest_rate === "number"
              ? editingAccount.interest_rate
              : parseFloat(String(editingAccount.interest_rate || "0")) || 0
          )
        )
        setIsHidden(!!editingAccount.is_hidden)
      } else {
        setName("")
        setType("bank")
        setBalance(0)
        setCurrency("USD")
        setSelectedIcon("Wallet")
        setSelectedColor("#4CAF50")
        setInterestRate("0")
        setIsHidden(false)
      }
    }
  }, [open, editingAccount])

  const reset = () => {
    if (editingAccount) {
      const bal =
        typeof editingAccount.balance === "string"
          ? parseFloat(editingAccount.balance) || 0
          : Number(editingAccount.balance) ?? 0
      setName(editingAccount.name || "")
      setType(editingAccount.type || "bank")
      setBalance(bal)
      setCurrency(editingAccount.currency || "USD")
      setSelectedIcon(editingAccount.icon || "Wallet")
      setSelectedColor(editingAccount.color || "#4CAF50")
      setInterestRate(
        String(
          typeof editingAccount.interest_rate === "number"
            ? editingAccount.interest_rate
            : parseFloat(String(editingAccount.interest_rate || "0")) || 0
        )
      )
      setIsHidden(!!editingAccount.is_hidden)
    } else {
      setName("")
      setType("bank")
      setBalance(0)
      setCurrency("USD")
      setSelectedIcon("Wallet")
      setSelectedColor("#4CAF50")
      setInterestRate("0")
      setIsHidden(false)
    }
  }

  const handleSave = async () => {
    const payload: CreateAccount = {
      name: name.trim(),
      type,
      balance: balance,
      currency,
      icon: selectedIcon,
      color: selectedColor,
      interest_rate: parseFloat(interestRate) || 0,
      is_hidden: isHidden,
    }
    try {
      await onSave(payload, editingAccount?.id)
      reset()
      onOpenChange(false)
    } catch {
      // Error handled by parent
    }
  }

  const { t } = useI18n()
  const financeIcons = CATEGORIZED_ICONS.find((g) => g.group === "Finanzas")?.icons ?? ["Wallet", "CreditCard", "Landmark", "PiggyBank", "Banknote", "Coins"]

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.25, ease: "easeInOut" }}
          className="overflow-hidden"
        >
          <div
            className="flex flex-col gap-4 rounded-2xl p-5"
            style={{
              backgroundColor: "rgba(255,255,255,0.04)",
              backdropFilter: "blur(25px)",
              border: "1px solid rgba(143,0,255,0.2)",
            }}
          >
            <h3 className="font-serif text-sm font-bold tracking-wider text-foreground">
              {isEditMode ? t("wallet.editAccount" as any) : t("wallet.newAccount" as any)}
            </h3>

            {/* Nombre */}
            <div>
              <label className="mb-1.5 block text-[10px] uppercase tracking-wider text-muted-foreground">Nombre</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Cuenta Principal"
                className={`${inputWrap} ${inputStyle}`}
              />
            </div>

            {/* Tipo */}
            <div>
              <label className="mb-1.5 block text-[10px] uppercase tracking-wider text-muted-foreground">Tipo</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className={`${inputWrap} ${inputStyle}`}
              >
                {ACCOUNT_TYPES.map((t) => (
                  <option key={t.value} value={t.value} className="bg-background">{t.label}</option>
                ))}
              </select>
            </div>

            {/* Balance + Moneda */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-1.5 block text-[10px] uppercase tracking-wider text-muted-foreground">Balance</label>
                <div className={`${inputWrap} px-3 py-3`}>
                  <CurrencyInput
                    value={balance}
                    onChange={setBalance}
                    prefix="$"
                    placeholder="0.00"
                    inputClassName="text-sm placeholder:text-muted-foreground/40"
                  />
                </div>
              </div>
              <div>
                <label className="mb-1.5 block text-[10px] uppercase tracking-wider text-muted-foreground">Moneda</label>
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  className={`${inputWrap} ${inputStyle}`}
                >
                  {CURRENCIES.map((c) => (
                    <option key={c.value} value={c.value} className="bg-background">{c.label}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Color + Icono */}
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="mb-1.5 block text-[10px] uppercase tracking-wider text-muted-foreground">Color</label>
                <div className="flex flex-wrap gap-2">
                  {QUICK_COLORS.map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setSelectedColor(color)}
                      className={`h-8 w-8 rounded-full border-2 transition-transform active:scale-90 ${
                        selectedColor === color ? "border-white ring-2 ring-white/30" : "border-transparent"
                      }`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>
              <div className="flex shrink-0 flex-col items-center gap-1">
                <span className="text-[10px] text-muted-foreground">Icono</span>
                <div
                  className="flex h-12 w-12 items-center justify-center rounded-xl border border-white/10"
                  style={{ backgroundColor: `${selectedColor}20`, borderColor: `${selectedColor}40` }}
                >
                  <CategoryIcon name={selectedIcon} color={selectedColor} size={24} strokeWidth={2.5} />
                </div>
              </div>
            </div>

            {/* Iconos */}
            <div>
              <label className="mb-1.5 block text-[10px] uppercase tracking-wider text-muted-foreground">Seleccionar icono</label>
              <div className="grid grid-cols-8 gap-1.5">
                {financeIcons.map((iconName) => (
                  <motion.button
                    key={iconName}
                    type="button"
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSelectedIcon(iconName)}
                    className={`flex h-9 items-center justify-center rounded-lg transition-all ${
                      selectedIcon === iconName ? "bg-white/20 ring-1 ring-white/40" : "bg-white/5 hover:bg-white/10"
                    }`}
                  >
                    <CategoryIcon
                      name={iconName}
                      color={selectedIcon === iconName ? selectedColor : "currentColor"}
                      size={16}
                      strokeWidth={2.5}
                    />
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Tasa interés */}
            <div>
              <label className="mb-1.5 block text-[10px] uppercase tracking-wider text-muted-foreground">Tasa interés %</label>
              <input
                type="number"
                step="0.1"
                value={interestRate}
                onChange={(e) => setInterestRate(e.target.value)}
                placeholder="0"
                className={`${inputWrap} ${inputStyle}`}
              />
            </div>

            {/* Ocultar cuenta → Bóveda */}
            <div
              className="rounded-xl border border-white/10 bg-white/5 p-4"
            >
              <label className="flex cursor-pointer items-start gap-3">
                <input
                  type="checkbox"
                  checked={isHidden}
                  onChange={(e) => setIsHidden(e.target.checked)}
                  className="mt-0.5 h-4 w-4 shrink-0 rounded border-white/20 accent-primary"
                />
                <div>
                  <span className="text-xs font-medium text-foreground">
                    {t("wallet.hideAccountLabel" as any)}
                  </span>
                  <p className="mt-1 text-[11px] text-muted-foreground">
                    {t("wallet.hideAccountWarning" as any)}
                  </p>
                </div>
              </label>
            </div>

            <motion.button
              whileTap={{ scale: 0.98 }}
              disabled={!name.trim() || isPending}
              onClick={handleSave}
              className="rounded-xl py-3 text-sm font-bold text-white disabled:opacity-40"
              style={{
                background: "linear-gradient(135deg, #8F00FF, #00D4FF)",
                boxShadow: "0 0 15px rgba(143,0,255,0.3)",
              }}
            >
              {isPending ? t("common.saving" as any) : isEditMode ? t("common.save" as any) : t("wallet.createAccount" as any)}
            </motion.button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
