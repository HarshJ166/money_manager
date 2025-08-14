"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { useSession } from "next-auth/react"
import { format } from "date-fns"

interface BalanceData {
  date: string
  balance: number
}

export function BalanceTrend() {
  const [data, setData] = useState<BalanceData[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { data: session } = useSession()

  useEffect(() => {
    const fetchBalanceData = async () => {
      try {
        const response = await fetch("/api/analytics/balance-trend")
        const result = await response.json()
        setData(result.balanceData || [])
      } catch (error) {
        console.error("Failed to fetch balance data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    if (session) {
      fetchBalanceData()
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
          <p className="font-medium">{format(new Date(label), "MMM dd, yyyy")}</p>
          <p className="text-sm text-cyan-600">Balance: {formatCurrency(payload[0].value)}</p>
        </div>
      )
    }
    return null
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.3 }}
    >
      <Card className="p-6 bg-card/80 backdrop-blur-sm border-border/50">
        <h3 className="text-xl font-semibold font-sans mb-6">Balance Trend</h3>

        {isLoading ? (
          <div className="h-80 flex items-center justify-center">
            <div className="w-full h-32 bg-muted rounded animate-pulse"></div>
          </div>
        ) : data.length === 0 ? (
          <div className="h-80 flex items-center justify-center text-muted-foreground">No balance data available</div>
        ) : (
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis
                  dataKey="date"
                  tickFormatter={(value) => format(new Date(value), "MMM dd")}
                  className="text-xs"
                />
                <YAxis tickFormatter={(value) => `$${value.toLocaleString()}`} className="text-xs" />
                <Tooltip content={<CustomTooltip />} />
                <Line
                  type="monotone"
                  dataKey="balance"
                  stroke="#0891b2"
                  strokeWidth={3}
                  dot={{ fill: "#0891b2", strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, stroke: "#0891b2", strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </Card>
    </motion.div>
  )
}
