"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"
import { TrendingUp, TrendingDown, DollarSign, CreditCard } from "lucide-react"
import { useSession } from "next-auth/react"

interface OverviewData {
  totalIncome: number
  totalExpenses: number
  netIncome: number
  transactionCount: number
  avgTransaction: number
  topCategory: string
}

export function AnalyticsOverview() {
  const [data, setData] = useState<OverviewData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const { data: session } = useSession()

  useEffect(() => {
    const fetchOverview = async () => {
      try {
        const response = await fetch("/api/analytics/overview")
        const result = await response.json()
        setData(result)
      } catch (error) {
        console.error("Failed to fetch overview:", error)
      } finally {
        setIsLoading(false)
      }
    }

    if (session) {
      fetchOverview()
    }
  }, [session])

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount)
  }

  const overviewCards = [
    {
      title: "Total Income",
      value: data?.totalIncome || 0,
      icon: TrendingUp,
      color: "text-green-600",
      bgColor: "bg-green-100 dark:bg-green-900/50",
    },
    {
      title: "Total Expenses",
      value: data?.totalExpenses || 0,
      icon: TrendingDown,
      color: "text-red-600",
      bgColor: "bg-red-100 dark:bg-red-900/50",
    },
    {
      title: "Net Income",
      value: data?.netIncome || 0,
      icon: DollarSign,
      color: data && data.netIncome >= 0 ? "text-green-600" : "text-red-600",
      bgColor: data && data.netIncome >= 0 ? "bg-green-100 dark:bg-green-900/50" : "bg-red-100 dark:bg-red-900/50",
    },
    {
      title: "Transactions",
      value: data?.transactionCount || 0,
      icon: CreditCard,
      color: "text-blue-600",
      bgColor: "bg-blue-100 dark:bg-blue-900/50",
      isCount: true,
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {overviewCards.map((card, index) => (
        <motion.div
          key={card.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: index * 0.1 }}
        >
          <Card className="p-6 bg-card/80 backdrop-blur-sm border-border/50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">{card.title}</p>
                {isLoading ? (
                  <div className="h-8 bg-muted rounded animate-pulse mt-2"></div>
                ) : (
                  <p className="text-2xl font-bold mt-2">
                    {card.isCount ? card.value.toLocaleString() : formatCurrency(Math.abs(card.value))}
                  </p>
                )}
              </div>
              <div className={`w-12 h-12 ${card.bgColor} rounded-xl flex items-center justify-center`}>
                <card.icon className={`w-6 h-6 ${card.color}`} />
              </div>
            </div>
          </Card>
        </motion.div>
      ))}
    </div>
  )
}
