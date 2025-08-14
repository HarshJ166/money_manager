"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { useSession } from "next-auth/react"

interface MonthlyData {
  month: string
  income: number
  expenses: number
  net: number
}

export function MonthlySpending() {
  const [data, setData] = useState<MonthlyData[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { data: session } = useSession()

  useEffect(() => {
    const fetchMonthlyData = async () => {
      try {
        const response = await fetch("/api/analytics/monthly")
        const result = await response.json()
        setData(result.monthlyData || [])
      } catch (error) {
        console.error("Failed to fetch monthly data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    if (session) {
      fetchMonthlyData()
    }
  }, [session])

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount)
  }

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card/95 backdrop-blur-sm border border-border/50 rounded-lg p-3 shadow-lg">
          <p className="font-medium mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {formatCurrency(Math.abs(entry.value))}
            </p>
          ))}
        </div>
      )
    }
    return null
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.4 }}
    >
      <Card className="p-6 bg-card/80 backdrop-blur-sm border-border/50">
        <h3 className="text-xl font-semibold font-sans mb-6">Monthly Income vs Expenses</h3>

        {isLoading ? (
          <div className="h-80 flex items-center justify-center">
            <div className="w-full h-32 bg-muted rounded animate-pulse"></div>
          </div>
        ) : data.length === 0 ? (
          <div className="h-80 flex items-center justify-center text-muted-foreground">No monthly data available</div>
        ) : (
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis dataKey="month" className="text-xs" />
                <YAxis tickFormatter={(value) => `$${Math.abs(value).toLocaleString()}`} className="text-xs" />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="income" fill="#16a34a" name="Income" radius={[4, 4, 0, 0]} />
                <Bar dataKey="expenses" fill="#dc2626" name="Expenses" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </Card>
    </motion.div>
  )
}
