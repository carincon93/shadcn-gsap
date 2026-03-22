import * as React from "react"
import { useStore } from '@nanostores/react'
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
import { invoices as initialInvoices } from "@/lib/data"
import { invoicesStore, toggleInvoice } from "@/stores/invoicesStore"
import { calculateTotal } from "@/lib/utils"

export function SelectedInvoicesTable() {
  const $invoicesStore = useStore(invoicesStore)
  const total = calculateTotal($invoicesStore)

  return (
    <Table>
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
        {$invoicesStore.map((invoice) => (
          <TableRow key={invoice.invoice} className="hover:bg-muted/50 transition-colors">

            <TableCell className="font-medium">{invoice.invoice}</TableCell>
            <TableCell>{invoice.paymentStatus}</TableCell>
            <TableCell>{invoice.paymentMethod}</TableCell>
            <TableCell className="text-right">{invoice.totalAmount}</TableCell>
            <TableCell>
              <Button variant="destructive" size="sm" onClick={() => toggleInvoice(invoice)}>
                Remove
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
          <TableHead>Select</TableHead>
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
