"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts"
import { TrendingUp, ArrowRight } from "lucide-react"
import { useSession } from "next-auth/react"
import Link from "next/link"

interface CategoryData {
  category: string
  amount: number
}

const COLORS = ["#0891b2", "#a16207", "#dc2626", "#16a34a", "#9333ea"]

export function MiniAnalytics() {
  const [data, setData] = useState<CategoryData[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { data: session } = useSession()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/analytics/categories")
        const result = await response.json()
        setData(result.categories?.slice(0, 5) || [])
      } catch (error) {
        console.error("Failed to fetch mini analytics:", error)
      } finally {
        setIsLoading(false)
      }
    }

    if (session) {
      fetchData()
    }
  }, [session])

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.4 }}
    >
      <Card className="p-6 bg-card/80 backdrop-blur-sm border-border/50">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <TrendingUp className="w-5 h-5 text-cyan-600" />
            <h3 className="font-semibold">Quick Insights</h3>
          </div>
        </div>

        {isLoading ? (
          <div className="h-32 flex items-center justify-center">
            <div className="w-24 h-24 bg-muted rounded-full animate-pulse"></div>
          </div>
        ) : data.length === 0 ? (
          <div className="h-32 flex items-center justify-center text-muted-foreground text-sm">No data yet</div>
        ) : (
          <>
            <div className="h-32 mb-4">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data}
                    cx="50%"
                    cy="50%"
                    innerRadius={30}
                    outerRadius={60}
                    paddingAngle={2}
                    dataKey="amount"
                  >
                    {data.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="space-y-2 mb-4">
              {data.slice(0, 3).map((item, index) => (
                <div key={item.category} className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index] }} />
                    <span>{item.category}</span>
                  </div>
                  <span className="font-medium">${item.amount.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </>
        )}

        <Button variant="outline" size="sm" className="w-full bg-transparent" asChild>
          <Link href="/dashboard/analytics">
            View Full Analytics
            <ArrowRight className="w-4 h-4 ml-2" />
          </Link>
        </Button>
      </Card>
    </motion.div>
  )
}
