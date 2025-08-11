import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { dbConnect } from "@/lib/db"
import User from "@/models/user"
import { rateLimit } from "@/lib/rate-limit"

export async function GET(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const key = `${(req as any).ip ?? "ip"}:profile:GET`
  const rl = rateLimit(key)
  if (!rl.ok) return NextResponse.json({ error: "Too Many Requests" }, { status: 429 })

  await dbConnect()
  const user = await User.findOne({ email: session.user.email }).lean()
  return NextResponse.json({
    email: user?.email,
    name: user?.name,
    image: user?.image,
    preferences: user?.preferences,
    initialBalance: user?.initialBalance,
    currentBalance: user?.currentBalance,
  })
}

export async function PUT(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const key = `${(req as any).ip ?? "ip"}:profile:PUT`
  const rl = rateLimit(key, 30)
  if (!rl.ok) return NextResponse.json({ error: "Too Many Requests" }, { status: 429 })

  const body = await req.json()
  await dbConnect()
  const updated = await User.findOneAndUpdate(
    { email: session.user.email },
    {
      $set: {
        "preferences.theme": body?.preferences?.theme,
        "preferences.currency": body?.preferences?.currency,
        "preferences.notifications": body?.preferences?.notifications,
      },
    },
    { new: true },
  ).lean()
  return NextResponse.json({ ok: true, preferences: updated?.preferences })
}
