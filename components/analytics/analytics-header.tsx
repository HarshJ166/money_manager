"use client"

import { motion } from "framer-motion"
import { TrendingUp } from "lucide-react"

export function AnalyticsHeader() {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
      <div className="flex items-center space-x-3 mb-4">
        <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-xl flex items-center justify-center">
          <TrendingUp className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-bold font-sans">Analytics</h1>
          <p className="text-muted-foreground">Insights into your financial patterns and trends</p>
        </div>
      </div>
    </motion.div>
  )
}
