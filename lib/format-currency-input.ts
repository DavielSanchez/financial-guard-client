/**
 * Format a number for display - adds thousand separators, preserves decimals
 * While typing: 1000 -> "1,000", 1000.5 -> "1,000.5"
 * On blur we use formatAmountForInputStrict for 2 decimals
 */
export function formatAmountForInput(value: number, strictDecimals = false): string {
  if (Number.isNaN(value) || value === null || value === undefined) return ""
  if (value === 0) return "0"
  const str = value.toString()
  const [intPart, decPart] = str.split(".")
  const withCommas = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
  if (!decPart) return withCommas
  const decimals = strictDecimals ? Number(decPart).toFixed(2).slice(0, 2) : decPart.slice(0, 2)
  return decimals ? `${withCommas}.${decimals}` : withCommas
}

/**
 * Format for blur - always 2 decimals
 */
export function formatAmountForInputStrict(value: number): string {
  if (Number.isNaN(value) || value === null || value === undefined) return ""
  const fixed = value.toFixed(2)
  const [int, dec] = fixed.split(".")
  const withCommas = int.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
  return dec ? `${withCommas}.${dec}` : withCommas
}

/**
 * Parse a string from user input to a number (strips commas, handles decimals)
 */
export function parseAmountFromInput(input: string): number {
  const cleaned = input.replace(/,/g, "").replace(/[^0-9.]/g, "")
  const parts = cleaned.split(".")
  const intPart = parts[0] || "0"
  const decPart = parts.slice(1).join("").slice(0, 2) // max 2 decimal places
  const numStr = decPart ? `${intPart}.${decPart}` : intPart
  const num = parseFloat(numStr)
  return Number.isNaN(num) ? 0 : num
}
