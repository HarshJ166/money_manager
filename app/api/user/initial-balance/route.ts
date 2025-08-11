import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { dbConnect } from "@/lib/db"
import User from "@/models/user"

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const { initialBalance } = await req.json()

  if (typeof initialBalance !== "number" || initialBalance < 0) {
    return NextResponse.json({ error: "Invalid initial balance" }, { status: 400 })
  }

  await dbConnect()
  const user = await User.findOne({ email: session.user.email })
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 })
  if (user.initialBalance && user.initialBalance > 0) {
    return NextResponse.json({ error: "Initial balance already set" }, { status: 400 })
  }

  user.initialBalance = initialBalance
  user.currentBalance = initialBalance
  await user.save()

  return NextResponse.json({ ok: true })
}
