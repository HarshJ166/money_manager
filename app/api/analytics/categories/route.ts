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

    // Get all expense transactions
    const transactions = await prisma.transaction.findMany({
      where: {
        userId: session.user.id,
        type: "DEBIT",
      },
    })

    // Group by category and calculate totals
    const categoryTotals = transactions.reduce(
      (acc, t) => {
        acc[t.category] = (acc[t.category] || 0) + Math.abs(t.amount)
        return acc
      },
      {} as Record<string, number>,
    )

    const totalExpenses = Object.values(categoryTotals).reduce((sum, amount) => sum + amount, 0)

    // Convert to array with percentages
    const categories = Object.entries(categoryTotals)
      .map(([category, amount]) => ({
        category,
        amount,
        percentage: totalExpenses > 0 ? (amount / totalExpenses) * 100 : 0,
      }))
      .sort((a, b) => b.amount - a.amount)

    return NextResponse.json({ categories })
  } catch (error) {
    console.error("Failed to fetch category data:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
