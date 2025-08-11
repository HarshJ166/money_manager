import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { dbConnect } from "@/lib/db"
import Transaction from "@/models/transaction"
import User from "@/models/user"
import { transactionSchema } from "@/lib/validations"
import { rateLimit } from "@/lib/rate-limit"

export async function GET(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const url = new URL(req.url)
  const page = Number(url.searchParams.get("page") ?? 1)
  const limit = Math.min(Number(url.searchParams.get("limit") ?? 20), 100)
  const type = url.searchParams.get("type") || undefined
  const category = url.searchParams.get("category") || undefined
  const q = url.searchParams.get("q") || undefined
  const sort = url.searchParams.get("sort") || "-date"

  const query: any = { userId: (session as any).userId }
  if (type) query.type = type
  if (category) query.category = category
  if (q) query.description = { $regex: q, $options: "i" }

  await dbConnect()
  const [items, total] = await Promise.all([
    Transaction.find(query)
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(limit)
      .lean(),
    Transaction.countDocuments(query),
  ])

  return NextResponse.json({
    items,
    page,
    limit,
    total,
    hasMore: page * limit < total,
  })
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const key = `${(req as any).ip ?? "ip"}:tx:create`
  const rl = rateLimit(key, 60)
  if (!rl.ok) return NextResponse.json({ error: "Too Many Requests" }, { status: 429 })

  const data = await req.json()
  const parsed = transactionSchema.safeParse({
    ...data,
    amount: Number(data?.amount),
  })
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input", details: parsed.error.flatten() }, { status: 400 })
  }

  await dbConnect()
  const user = await User.findById((session as any).userId)
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 })

  const adj = parsed.data.type === "credit" ? parsed.data.amount : -parsed.data.amount
  const newBalance = user.currentBalance + adj

  const tx = await Transaction.create({
    ...parsed.data,
    userId: user._id,
    balanceAfter: newBalance,
  })

  user.currentBalance = newBalance
  await user.save()

  return NextResponse.json({ ok: true, transaction: tx })
}
