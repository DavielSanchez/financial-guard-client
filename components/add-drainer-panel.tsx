"use client"

import React, { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useSettings } from "@/components/settings-provider"
import { CurrencyInput } from "@/components/currency-input"
import type { CreateSubscriptionPayload } from "@/types/budget.types"

const inputStyle =
  "rounded-xl px-4 py-3 text-sm text-foreground outline-none placeholder:text-white/30 focus:border-primary"
const inputWrap = "w-full rounded-xl border border-white/10 bg-white/5"

interface AddDrainerPanelProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (payload: CreateSubscriptionPayload) => void | Promise<void>
  isPending?: boolean
  t: (key: string) => string
}

export function AddDrainerPanel({
  open,
  onOpenChange,
  onSave,
  isPending,
  t,
}: AddDrainerPanelProps) {
  const { currency } = useSettings()
  const [name, setName] = useState("")
  const [amount, setAmount] = useState(0)
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly" | "weekly">("monthly")
  const [nextBillDate, setNextBillDate] = useState("")

  useEffect(() => {
    if (open) {
      const d = new Date()
      d.setMonth(d.getMonth() + 1)
      setNextBillDate(d.toISOString().split("T")[0])
    }
  }, [open])

  const reset = () => {
    setName("")
    setAmount(0)
    setBillingCycle("monthly")
    const d = new Date()
    d.setMonth(d.getMonth() + 1)
    setNextBillDate(d.toISOString().split("T")[0])
  }

  const getDefaultNextBill = () => {
    const d = new Date()
    if (billingCycle === "weekly") d.setDate(d.getDate() + 7)
    else if (billingCycle === "monthly") d.setMonth(d.getMonth() + 1)
    else d.setFullYear(d.getFullYear() + 1)
    return d.toISOString().split("T")[0]
  }

  const handleSave = async () => {
    if (!name.trim() || !amount || amount <= 0) return
    const payload: CreateSubscriptionPayload = {
      name: name.trim(),
      amount,
      currency,
      billing_cycle: billingCycle,
      next_bill_date: nextBillDate || getDefaultNextBill(),
      color: "#FF007F",
    }
    try {
      await onSave(payload)
      reset()
      onOpenChange(false)
    } catch {
      // Error handled by parent
    }
  }

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
              border: "1px solid rgba(255,0,127,0.2)",
            }}
          >
            <h3 className="font-serif text-sm font-bold tracking-wider text-foreground">
              {t("budgeting.newDrainer" as any)}
            </h3>

            <div>
              <label className="mb-1.5 block text-[10px] uppercase tracking-wider text-muted-foreground">
                {t("budgeting.drainerName" as any)}
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Netflix, Gym..."
                className={`${inputWrap} ${inputStyle}`}
              />
            </div>

            <div>
              <label className="mb-1.5 block text-[10px] uppercase tracking-wider text-muted-foreground">
                {t("budgeting.drainerAmount" as any)}
              </label>
              <div className={`${inputWrap} px-3 py-3`}>
                <CurrencyInput
                  value={amount}
                  onChange={setAmount}
                  prefix={currency === "DOP" ? "RD$" : currency === "EUR" ? "€" : "$"}
                  placeholder="0.00"
                  inputClassName="text-sm placeholder:text-muted-foreground/40"
                />
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-[10px] uppercase tracking-wider text-muted-foreground">
                {t("budgeting.drainerBillingCycle" as any)}
              </label>
              <select
                value={billingCycle}
                onChange={(e) =>
                  setBillingCycle(e.target.value as "monthly" | "yearly" | "weekly")
                }
                className={`${inputWrap} ${inputStyle}`}
              >
                <option value="monthly" className="bg-background">
                  {t("budgeting.billingMonthly" as any)}
                </option>
                <option value="yearly" className="bg-background">
                  {t("budgeting.billingYearly" as any)}
                </option>
                <option value="weekly" className="bg-background">
                  {t("budgeting.billingWeekly" as any)}
                </option>
              </select>
            </div>

            <div>
              <label className="mb-1.5 block text-[10px] uppercase tracking-wider text-muted-foreground">
                {t("budgeting.drainerNextBill" as any)}
              </label>
              <input
                type="date"
                value={nextBillDate}
                onChange={(e) => setNextBillDate(e.target.value)}
                className={`${inputWrap} ${inputStyle}`}
              />
            </div>

            <motion.button
              whileTap={{ scale: 0.98 }}
              disabled={!name.trim() || !amount || amount <= 0 || isPending}
              onClick={handleSave}
              className="rounded-xl py-3 text-sm font-bold text-white disabled:opacity-40"
              style={{
                background: "linear-gradient(135deg, #FF007F, #CC0066)",
                boxShadow: "0 0 15px rgba(255,0,127,0.3)",
              }}
            >
              {isPending ? "…" : t("budgeting.createDrainer" as any)}
            </motion.button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
