import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { subDays, format } from "date-fns"

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

    const initialBalance = user?.initialBalance || 0

    // Get transactions from the last 30 days
    const thirtyDaysAgo = subDays(new Date(), 30)
    const transactions = await prisma.transaction.findMany({
      where: {
        userId: session.user.id,
        dateTime: { gte: thirtyDaysAgo },
      },
      orderBy: { dateTime: "asc" },
    })

    // Calculate running balance for each day
    const balanceData: { date: string; balance: number }[] = []
    let runningBalance = initialBalance

    // Add transactions that occurred before our 30-day window to the initial balance
    const earlierTransactions = await prisma.transaction.aggregate({
      where: {
        userId: session.user.id,
        dateTime: { lt: thirtyDaysAgo },
      },
      _sum: { amount: true },
    })

    runningBalance += earlierTransactions._sum.amount || 0

    // Group transactions by date and calculate daily balances
    const dailyTransactions = transactions.reduce(
      (acc, t) => {
        const date = format(new Date(t.dateTime), "yyyy-MM-dd")
        if (!acc[date]) acc[date] = []
        acc[date].push(t)
        return acc
      },
      {} as Record<string, typeof transactions>,
    )

    // Generate balance data for each day
    for (let i = 29; i >= 0; i--) {
      const date = format(subDays(new Date(), i), "yyyy-MM-dd")
      const dayTransactions = dailyTransactions[date] || []

      // Add all transactions for this day
      for (const transaction of dayTransactions) {
        runningBalance += transaction.amount
      }

      balanceData.push({
        date,
        balance: runningBalance,
      })
    }

    return NextResponse.json({ balanceData })
  } catch (error) {
    console.error("Failed to fetch balance trend:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
