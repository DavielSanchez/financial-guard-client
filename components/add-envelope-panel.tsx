"use client"

import React, { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { CategoryIcon } from "@/components/category-icon"
import { CurrencyInput } from "@/components/currency-input"
import { useCategories } from "@/hooks/useCategories"
import { useSettings } from "@/components/settings-provider"
import type { CreateEnvelopePayload } from "@/types/budget.types"

const inputStyle = "rounded-xl px-4 py-3 text-sm text-foreground outline-none placeholder:text-white/30 focus:border-primary"
const inputWrap = "w-full rounded-xl border border-white/10 bg-white/5"

interface AddEnvelopePanelProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (payload: CreateEnvelopePayload) => void | Promise<void>
  isPending?: boolean
  /** When provided, new envelope is created for this period instead of current date */
  periodMonth?: number
  periodYear?: number
}

export function AddEnvelopePanel({
  open,
  onOpenChange,
  onSave,
  isPending,
  periodMonth,
  periodYear,
}: AddEnvelopePanelProps) {
  const { currency } = useSettings()
  const { categories } = useCategories()
  const [categoryId, setCategoryId] = useState("")
  const [budgetAmount, setBudgetAmount] = useState(0)

  const expenseCategories = categories.filter((c) => c.type !== "income" || !c.type)

  const reset = () => {
    setCategoryId("")
    setBudgetAmount(0)
  }

  const handleSave = async () => {
    if (!categoryId || !budgetAmount || budgetAmount <= 0) return
    const now = new Date()
    const month = periodMonth ?? now.getMonth() + 1
    const year = periodYear ?? now.getFullYear()
    const payload: CreateEnvelopePayload = {
      category_id: categoryId,
      budget_amount: budgetAmount,
      currency,
      period_type: "monthly",
      period_month: month,
      period_year: year,
      color: selected?.color,
      icon: selected?.icon,
    }
    try {
      await onSave(payload)
      reset()
      onOpenChange(false)
    } catch {
      // Error handled by parent
    }
  }

  const selected = expenseCategories.find((c) => c.id === categoryId)

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
              Nuevo presupuesto
            </h3>

            <div>
              <label className="mb-1.5 block text-[10px] uppercase tracking-wider text-muted-foreground">
                Categoría
              </label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className={`${inputWrap} ${inputStyle}`}
              >
                <option value="" className="bg-background">
                  Selecciona una categoría
                </option>
                {expenseCategories.map((c) => (
                  <option key={c.id} value={c.id} className="bg-background">
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1.5 block text-[10px] uppercase tracking-wider text-muted-foreground">
                Límite mensual
              </label>
              <div className={`${inputWrap} px-3 py-3`}>
                <CurrencyInput
                  value={budgetAmount}
                  onChange={setBudgetAmount}
                  prefix="$"
                  placeholder="0.00"
                  inputClassName="text-sm placeholder:text-muted-foreground/40"
                />
              </div>
            </div>

            {selected && (
              <div className="flex items-center gap-3 rounded-xl p-3" style={{ backgroundColor: "rgba(143,0,255,0.08)" }}>
                <div
                  className="flex h-10 w-10 items-center justify-center rounded-lg"
                  style={{ backgroundColor: `${selected.color}20` }}
                >
                  <CategoryIcon name={selected.icon} color={selected.color} size={20} strokeWidth={2.5} />
                </div>
                <span className="text-sm font-medium text-foreground">{selected.name}</span>
              </div>
            )}

            <motion.button
              whileTap={{ scale: 0.98 }}
              disabled={!categoryId || !budgetAmount || budgetAmount <= 0 || isPending}
              onClick={handleSave}
              className="rounded-xl py-3 text-sm font-bold text-white disabled:opacity-40"
              style={{
                background: "linear-gradient(135deg, #8F00FF, #00D4FF)",
                boxShadow: "0 0 15px rgba(143,0,255,0.3)",
              }}
            >
              {isPending ? "Guardando…" : "Crear presupuesto"}
            </motion.button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
