"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { transactionSchema, type TransactionInput } from "@/lib/validations"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useState, useTransition } from "react"
import { useToast } from "@/hooks/use-toast"
import { CreditCard, Wallet } from "lucide-react"

const schema = transactionSchema

export default function AddTransactionForm() {
  const { toast } = useToast()
  const [isPending, startTransition] = useTransition()
  const [type, setType] = useState<"credit" | "debit">("credit")
  const form = useForm<TransactionInput>({
    resolver: zodResolver(schema),
    defaultValues: {
      type: "credit",
      amount: 0,
      description: "",
      category: "Food",
      paymentMethod: "Cash",
      date: new Date(),
    },
  })

  const onSubmit = (values: TransactionInput) => {
    startTransition(async () => {
      const res = await fetch("/api/transactions", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(values),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        toast({ title: "Failed", description: data?.error ?? "Could not create transaction", variant: "destructive" })
        return
      }
      form.reset({ ...form.getValues(), amount: 0, description: "" })
      toast({ title: "Transaction added", description: "Balance updated." })
      // Emit revalidation event for list components (simple)
      document.dispatchEvent(new CustomEvent("transactions:refresh"))
    })
  }

  return (
    <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
      <div className="grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={() => {
            setType("credit")
            form.setValue("type", "credit")
          }}
          className={`rounded-md border p-2 text-sm ${type === "credit" ? "border-emerald-500 bg-emerald-500/10 text-emerald-400" : "border-border hover:bg-muted"}`}
          aria-pressed={type === "credit"}
        >
          <Wallet className="mr-1 inline h-4 w-4" />
          Credit
        </button>
        <button
          type="button"
          onClick={() => {
            setType("debit")
            form.setValue("type", "debit")
          }}
          className={`rounded-md border p-2 text-sm ${type === "debit" ? "border-rose-500 bg-rose-500/10 text-rose-400" : "border-border hover:bg-muted"}`}
          aria-pressed={type === "debit"}
        >
          <CreditCard className="mr-1 inline h-4 w-4" />
          Debit
        </button>
      </div>

      <div className="space-y-2">
        <Label htmlFor="amount">Amount</Label>
        <Input
          id="amount"
          type="number"
          step="0.01"
          min="0"
          placeholder="0.00"
          {...form.register("amount", { valueAsNumber: true })}
        />
        {form.formState.errors.amount && (
          <p className="text-xs text-rose-400">{form.formState.errors.amount.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Input id="description" placeholder="e.g. Groceries at Big Bazaar" {...form.register("description")} />
        {form.formState.errors.description && (
          <p className="text-xs text-rose-400">{form.formState.errors.description.message}</p>
        )}
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div className="space-y-2">
          <Label>Payment Method</Label>
          <Select
            defaultValue={form.getValues("paymentMethod")}
            onValueChange={(v) => form.setValue("paymentMethod", v as any)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select method" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Cash">Cash</SelectItem>
              <SelectItem value="GPay">GPay</SelectItem>
              <SelectItem value="Paytm">Paytm</SelectItem>
              <SelectItem value="Bank Transfer">Bank Transfer</SelectItem>
              <SelectItem value="Card">Card</SelectItem>
              <SelectItem value="Other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Category</Label>
          <Select defaultValue={form.getValues("category")} onValueChange={(v) => form.setValue("category", v)}>
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Food">Food</SelectItem>
              <SelectItem value="Transport">Transport</SelectItem>
              <SelectItem value="Entertainment">Entertainment</SelectItem>
              <SelectItem value="Shopping">Shopping</SelectItem>
              <SelectItem value="Bills">Bills</SelectItem>
              <SelectItem value="Other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="date">Date & Time</Label>
        <Input
          id="date"
          type="datetime-local"
          defaultValue={new Date().toISOString().slice(0, 16)}
          onChange={(e) => form.setValue("date", new Date(e.target.value))}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes">Notes</Label>
        <Textarea
          id="notes"
          placeholder="Optional notes"
          onChange={(e) => form.setValue("metadata", { notes: e.target.value })}
        />
      </div>

      <Button type="submit" className="w-full bg-emerald-600 text-white hover:bg-emerald-500" disabled={isPending}>
        {isPending ? "Adding..." : "Add Transaction"}
      </Button>
    </form>
  )
}
