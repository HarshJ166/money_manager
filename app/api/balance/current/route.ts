import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { dbConnect } from "@/lib/db"
import User from "@/models/user"

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  await dbConnect()
  const user = await User.findById((session as any).userId).lean()
  return NextResponse.json({
    balance: user?.currentBalance ?? 0,
    currency: (session as any).currency ?? user?.preferences?.currency ?? "INR",
  })
}
