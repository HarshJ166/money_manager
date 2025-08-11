import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { dbConnect } from "@/lib/db"
import Transaction from "@/models/transaction"
import User from "@/models/user"
import { transactionSchema } from "@/lib/validations"

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const data = await req.json()
  const parsed = transactionSchema.safeParse({
    ...data,
    amount: Number(data?.amount),
  })
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input", details: parsed.error.flatten() }, { status: 400 })
  }

  await dbConnect()
  const tx = await Transaction.findOne({ _id: params.id, userId: (session as any).userId })
  if (!tx) return NextResponse.json({ error: "Not found" }, { status: 404 })

  // Revert previous effect
  const prevAdj = tx.type === "credit" ? tx.amount : -tx.amount

  // Apply new values
  tx.type = parsed.data.type
  tx.amount = parsed.data.amount
  tx.description = parsed.data.description
  tx.category = parsed.data.category
  tx.paymentMethod = parsed.data.paymentMethod
  tx.date = parsed.data.date
  tx.metadata = parsed.data.metadata

  const user = await User.findById((session as any).userId)
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 })

  // New adjustment
  const newAdj = parsed.data.type === "credit" ? parsed.data.amount : -parsed.data.amount
  const newBalance = user.currentBalance - prevAdj + newAdj

  user.currentBalance = newBalance
  tx.balanceAfter = newBalance

  await Promise.all([tx.save(), user.save()])

  return NextResponse.json({ ok: true, transaction: tx })
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  await dbConnect()
  const tx = await Transaction.findOne({ _id: params.id, userId: (session as any).userId })
  if (!tx) return NextResponse.json({ error: "Not found" }, { status: 404 })

  const user = await (await import("@/models/user")).default.findById((session as any).userId)
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 })

  const adj = tx.type === "credit" ? tx.amount : -tx.amount
  user.currentBalance = user.currentBalance - adj

  await Promise.all([tx.deleteOne(), user.save()])

  return NextResponse.json({ ok: true })
}
