import * as React from "react"
import gsap from "gsap"
import { useStore } from '@nanostores/react'
import { TrashIcon } from "lucide-react"

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
  Checkbox,
  Button,
} from "@/components/ui"
import { invoices as initialInvoices, type Invoice } from "@/lib/data"
import { invoicesStore, toggleInvoice } from "@/stores/invoicesStore"
import { calculateTotal } from "@/lib/utils"

export function SelectedInvoicesTable() {
  const $invoicesStore = useStore(invoicesStore)
  const total = calculateTotal($invoicesStore)

  // 1. Maintain a local copy of the invoices to render.
  // This allows us to keep the row in the DOM while it animates out!
  const [localInvoices, setLocalInvoices] = React.useState($invoicesStore)
  const tableRef = React.useRef<HTMLTableElement>(null)

  const handleRemove = (e: React.MouseEvent<HTMLButtonElement>, invoice: Invoice) => {
    // Only toggle the store. The useEffect will detect the deletion and trigger the animation.
    toggleInvoice(invoice)
  }

  React.useEffect(() => {
    // 2. Find any invoices that are still rendered locally, but missing from the actual store
    const deletedInvoices = localInvoices.filter(inv => !$invoicesStore.includes(inv));

    if (deletedInvoices.length > 0) {
      deletedInvoices.forEach(deletedInvoice => {
        // Find the index in our local array to target the correct DOM row
        const index = localInvoices.findIndex(inv => inv.invoice === deletedInvoice.invoice);
        const rows = tableRef.current?.querySelectorAll("tbody tr");
        const rowToAnimate = rows?.[index];

        if (rowToAnimate) {
          gsap.to(rowToAnimate, {
            y: -20,
            opacity: 0,
            duration: 0.5,
            ease: "bounce.in",
            onComplete: () => {
              // 3. Animation finished! Safely remove it from local state to unmount it from React
              setLocalInvoices(prev => prev.filter(inv => inv.invoice !== deletedInvoice.invoice));
            }
          })
        }
      });
    } else {
      // If an invoice was added, just sync local state immediately so it renders
      setLocalInvoices($invoicesStore);
    }
  }, [$invoicesStore]); // We ONLY track changes from the global store

  return (
    <Table ref={tableRef}>
      <TableCaption>
        A list of your selected invoices (Interactive).
      </TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">Invoice</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Method</TableHead>
          <TableHead className="text-right">Amount</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {/* Render localInvoices instead of $invoicesStore to delay unmounting */}
        {localInvoices.map((invoice) => (
          <TableRow key={invoice.invoice} className="hover:bg-muted/50 transition-colors">

            <TableCell className="font-medium">{invoice.invoice}</TableCell>
            <TableCell>{invoice.paymentStatus}</TableCell>
            <TableCell>{invoice.paymentMethod}</TableCell>
            <TableCell className="text-right">{invoice.totalAmount}</TableCell>
            <TableCell>
              <Button variant="glass" glowColor="red" onClick={(e) => handleRemove(e, invoice)}>
                <TrashIcon />
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableCell colSpan={3}>Total</TableCell>
          <TableCell colSpan={2} className="text-left">{total}</TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  )
}

export function InvoiceTable() {
  const [invoices, setInvoices] = React.useState(initialInvoices)
  const tableRef = React.useRef<HTMLTableElement>(null)
  const $invoicesStore = useStore(invoicesStore)

  React.useEffect(() => {
    console.log("InvoiceTable hydrated and effect running!")
    // You could fetch data here or perform other client-side logic
  }, [])

  const total = calculateTotal(invoices)

  return (
    <Table ref={tableRef}>
      <TableCaption>
        A list of your recent invoices (Interactive).
        {$invoicesStore.length > 0 && (
          <p>Invoices selected: {$invoicesStore.length}</p>
        )}
      </TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[50px]">Select</TableHead>
          <TableHead className="w-[100px]">Invoice</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Method</TableHead>
          <TableHead className="text-right">Amount</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {invoices.map((invoice) => (
          <TableRow key={invoice.invoice} className="hover:bg-muted/50 transition-colors">
            <TableCell>
              <Checkbox checked={$invoicesStore.includes(invoice)} onCheckedChange={() => toggleInvoice(invoice)} />
            </TableCell>
            <TableCell className="font-medium">{invoice.invoice}</TableCell>
            <TableCell>{invoice.paymentStatus}</TableCell>
            <TableCell>{invoice.paymentMethod}</TableCell>
            <TableCell className="text-right">{invoice.totalAmount}</TableCell>
          </TableRow>
        ))}
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableCell colSpan={4}>Total</TableCell>
          <TableCell className="text-right">{total}</TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  )
}
