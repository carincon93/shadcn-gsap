import { atom } from 'nanostores'
import { type Invoice, invoices } from '@/lib/data'

export const invoicesStore = atom<Invoice[]>([])

export function toggleInvoice(invoice: Invoice) {
    const currentInvoices = invoicesStore.get()
    if (currentInvoices.some((i) => i.invoice === invoice.invoice)) {
        invoicesStore.set(currentInvoices.filter((i) => i.invoice !== invoice.invoice))
    } else {
        invoicesStore.set([...currentInvoices, invoice])
    }
}
