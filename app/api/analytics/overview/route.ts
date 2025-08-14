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

    // Get all transactions for the user
    const transactions = await prisma.transaction.findMany({
      where: { userId: session.user.id },
    })

    // Calculate overview statistics
    const totalIncome = transactions.filter((t) => t.type === "CREDIT").reduce((sum, t) => sum + Math.abs(t.amount), 0)

    const totalExpenses = transactions.filter((t) => t.type === "DEBIT").reduce((sum, t) => sum + Math.abs(t.amount), 0)

    const netIncome = totalIncome - totalExpenses
    const transactionCount = transactions.length
    const avgTransaction =
      transactionCount > 0 ? transactions.reduce((sum, t) => sum + Math.abs(t.amount), 0) / transactionCount : 0

    // Find top spending category
    const categoryTotals = transactions
      .filter((t) => t.type === "DEBIT")
      .reduce(
        (acc, t) => {
          acc[t.category] = (acc[t.category] || 0) + Math.abs(t.amount)
          return acc
        },
        {} as Record<string, number>,
      )

    const topCategory = Object.entries(categoryTotals).sort(([, a], [, b]) => b - a)[0]?.[0] || "None"

    return NextResponse.json({
      totalIncome,
      totalExpenses,
      netIncome,
      transactionCount,
      avgTransaction,
      topCategory,
    })
  } catch (error) {
    console.error("Failed to fetch overview:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
