import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { dbConnect } from "@/lib/db"
import Transaction from "@/models/transaction"
import User from "@/models/user"

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  await dbConnect()
  const userId = (session as any).userId
  const since = new Date(Date.now() - 1000 * 60 * 60 * 24 * 30)

  const [inc, exp, count, user] = await Promise.all([
    Transaction.aggregate([
      { $match: { userId, type: "credit", date: { $gte: since } } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]),
    Transaction.aggregate([
      { $match: { userId, type: "debit", date: { $gte: since } } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]),
    Transaction.countDocuments({ userId, date: { $gte: since } }),
    User.findById(userId).lean(),
  ])

  return NextResponse.json({
    income30d: inc[0]?.total ?? 0,
    expense30d: exp[0]?.total ?? 0,
    count30d: count,
    currency: (session as any).currency ?? user?.preferences?.currency ?? "INR",
  })
}
