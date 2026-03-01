"use client"

import { useCallback, useEffect, useState } from "react"
import {
  formatAmountForInput,
  formatAmountForInputStrict,
  parseAmountFromInput,
} from "@/lib/format-currency-input"
import { cn } from "@/lib/utils"

interface CurrencyInputProps
  extends Omit<
    React.InputHTMLAttributes<HTMLInputElement>,
    "value" | "onChange" | "type"
  > {
  value: number
  onChange: (value: number) => void
  prefix?: string
  className?: string
  inputClassName?: string
  min?: number
  max?: number
  allowDecimals?: boolean // Nueva prop opcional
}

export function CurrencyInput({
  value,
  onChange,
  prefix,
  className,
  inputClassName,
  min,
  max,
  allowDecimals = true, // Por defecto permite decimales
  ...rest
}: CurrencyInputProps) {
  const [display, setDisplay] = useState(() =>
    value === 0 ? "" : formatAmountForInputStrict(value)
  )

  useEffect(() => {
    const parsed = parseAmountFromInput(display)
    if (Math.abs(parsed - value) > 0.001) {
      setDisplay(value === 0 ? "" : formatAmountForInputStrict(value))
    }
  }, [value])

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const raw = e.target.value
      let num = parseAmountFromInput(raw)

      // Si no permite decimales, redondeamos el número
      if (!allowDecimals) {
        num = Math.round(num)
      }

      // Aplicar límites solo si existen
      if (max !== undefined) num = Math.min(num, max)
      if (min !== undefined) num = Math.max(num, min)

      onChange(num)
      
      // Si permitimos decimales usamos el formateo normal, 
      // si no, forzamos el formato estricto para limpiar puntos decimales al escribir
      setDisplay(allowDecimals ? formatAmountForInput(num) : formatAmountForInputStrict(num))
    },
    [onChange, min, max, allowDecimals]
  )

  const handleBlur = useCallback(() => {
    setDisplay(formatAmountForInputStrict(value))
  }, [value])

  return (
    <div
      className={cn("flex items-center gap-1", className)}
      onClick={(e) => (e.target as HTMLElement).querySelector("input")?.focus()}
    >
      {prefix && (
        <span className="shrink-0 font-mono text-sm text-muted-foreground">
          {prefix}
        </span>
      )}
      <input
        type="text"
        // Cambiamos el modo de entrada según la prop
        inputMode={allowDecimals ? "decimal" : "numeric"}
        value={display}
        onChange={handleChange}
        onBlur={handleBlur}
        className={cn(
          "w-full min-w-0 bg-transparent font-mono text-foreground outline-none placeholder:text-muted-foreground/40",
          inputClassName
        )}
        {...rest}
      />
    </div>
  )
}