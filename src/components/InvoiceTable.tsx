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
} from "@/components/ui"
import { invoices as initialInvoices } from "@/lib/data"
import { invoicesStore, toggleInvoice } from "@/stores/invoicesStore"

export function InvoiceTable() {
  const [invoices, setInvoices] = React.useState(initialInvoices)
  const [numberOfHeads, setNumberOfHeads] = React.useState(0)
  const tableRef = React.useRef<HTMLTableElement>(null)
  const $invoicesStore = useStore(invoicesStore)

  React.useEffect(() => {
    console.log("InvoiceTable hydrated and effect running!")
    // You could fetch data here or perform other client-side logic
    if (tableRef.current) {
      setNumberOfHeads(tableRef.current.querySelectorAll("th").length)
    }
  }, [])

  return (
    <Table className="border rounded-md overflow-hidden bg-card/50 backdrop-blur-sm" ref={tableRef}>
      <TableCaption>
        A list of your recent invoices (Interactive).
        <p>
          {$invoicesStore.length > 0 && (
            <>Invoices count: {$invoicesStore.length}</>
          )}
        </p>
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
              <Checkbox onCheckedChange={() => toggleInvoice(invoice.invoice)} />
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
          <TableCell colSpan={numberOfHeads}>Total</TableCell>
          <TableCell className="text-right">$2,500.00</TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  )
}
