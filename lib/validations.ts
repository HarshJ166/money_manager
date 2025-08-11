import { z } from "zod"

export const initialBalanceSchema = z.object({
  initialBalance: z.number().min(0),
})

export const transactionSchema = z.object({
  type: z.enum(["credit", "debit"]),
  amount: z.number().min(0.01),
  description: z.string().min(1).max(200),
  category: z.string().min(1).max(50),
  paymentMethod: z.enum(["Cash", "GPay", "Paytm", "Bank Transfer", "Card", "Other"]),
  date: z.coerce.date(),
  metadata: z
    .object({
      location: z.string().optional(),
      notes: z.string().max(500).optional(),
    })
    .optional(),
})

export type TransactionInput = z.infer<typeof transactionSchema>
