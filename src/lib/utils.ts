import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import type { Invoice } from "./data"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function calculateTotal(invoices: Invoice[]) {
  const invoicesWithAmountNormalised = invoices.map((invoice) => {
    return {
      ...invoice,
      totalAmount: parseFloat(invoice.totalAmount.replace('$', ''))
    }
  })
  const total = invoicesWithAmountNormalised.reduce((total, invoice) => total + invoice.totalAmount, 0)
  return `$${total.toFixed(2)}`
}