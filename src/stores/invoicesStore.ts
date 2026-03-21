import { atom } from 'nanostores'

export const invoicesStore = atom<string[]>([])

export function toggleInvoice(invoice: string) {
    const currentInvoices = invoicesStore.get()
    if (currentInvoices.includes(invoice)) {
        invoicesStore.set(currentInvoices.filter((i) => i !== invoice))
    } else {
        invoicesStore.set([...currentInvoices, invoice])
    }
}