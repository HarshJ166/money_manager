import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get user's initial balance
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { initialBalance: true },
    })

    // Calculate total from transactions
    const result = await prisma.transaction.aggregate({
      where: { userId: session.user.id },
      _sum: { amount: true },
    })

    const transactionTotal = result._sum.amount || 0
    const initialBalance = user?.initialBalance || 0
    const balance = initialBalance + transactionTotal

    return NextResponse.json({ balance })
  } catch (error) {
    console.error("Failed to fetch balance:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
