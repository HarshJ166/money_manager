import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { format, subMonths, startOfMonth, endOfMonth } from "date-fns"

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const monthlyData = []

    // Get data for the last 6 months
    for (let i = 5; i >= 0; i--) {
      const date = subMonths(new Date(), i)
      const monthStart = startOfMonth(date)
      const monthEnd = endOfMonth(date)
      const monthName = format(date, "MMM yyyy")

      // Get transactions for this month
      const transactions = await prisma.transaction.findMany({
        where: {
          userId: session.user.id,
          dateTime: {
            gte: monthStart,
            lte: monthEnd,
          },
        },
      })

      const income = transactions.filter((t) => t.type === "CREDIT").reduce((sum, t) => sum + Math.abs(t.amount), 0)

      const expenses = transactions.filter((t) => t.type === "DEBIT").reduce((sum, t) => sum + Math.abs(t.amount), 0)

      monthlyData.push({
        month: monthName,
        income,
        expenses: -expenses, // Negative for chart display
        net: income - expenses,
      })
    }

    return NextResponse.json({ monthlyData })
  } catch (error) {
    console.error("Failed to fetch monthly data:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
