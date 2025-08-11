import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { dbConnect } from "@/lib/db"
import Transaction from "@/models/transaction"

export async function GET(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const url = new URL(req.url)
  const range = url.searchParams.get("range") ?? "30d"
  const days = range === "7d" ? 7 : range === "90d" ? 90 : 30
  const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000)

  await dbConnect()
  const userId = (session as any).userId

  // Pull transactions and compute daily running balance client-side
  const txs = await Transaction.find({ userId, date: { $gte: since } })
    .sort("date")
    .lean()
  return NextResponse.json({ items: txs })
}
