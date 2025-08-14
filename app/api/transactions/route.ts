import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

const createTransactionSchema = z.object({
  description: z.string().min(1, "Description is required"),
  amount: z.number().positive("Amount must be positive"),
  type: z.enum(["CREDIT", "DEBIT"]),
  category: z.string().min(1, "Category is required"),
  dateTime: z.string().datetime(),
})

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const transactions = await prisma.transaction.findMany({
      where: { userId: session.user.id },
      orderBy: { dateTime: "desc" },
      take: 50,
    })

    return NextResponse.json({ transactions })
  } catch (error) {
    console.error("Failed to fetch transactions:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { description, amount, type, category, dateTime } = createTransactionSchema.parse(body)

    const transaction = await prisma.transaction.create({
      data: {
        userId: session.user.id,
        description,
        amount: type === "DEBIT" ? -Math.abs(amount) : Math.abs(amount),
        type,
        category,
        dateTime: new Date(dateTime),
      },
    })

    return NextResponse.json({ transaction })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors[0].message }, { status: 400 })
    }

    console.error("Failed to create transaction:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
