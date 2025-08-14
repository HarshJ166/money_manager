"use client"

import { useSession } from "next-auth/react"
import { motion } from "framer-motion"

export function DashboardHeader() {
  const { data: session } = useSession()

  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return "Good morning"
    if (hour < 18) return "Good afternoon"
    return "Good evening"
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
      <h1 className="text-3xl font-bold font-sans mb-2">
        {getGreeting()}, {session?.user?.name?.split(" ")[0] || "there"}!
      </h1>
      <p className="text-muted-foreground">Here's what's happening with your finances today.</p>
    </motion.div>
  )
}
