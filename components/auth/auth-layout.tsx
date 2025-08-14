"use client"

import type React from "react"

import { motion } from "framer-motion"
import { Wallet, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

interface AuthLayoutProps {
  children: React.ReactNode
  title: string
  subtitle: string
}

export function AuthLayout({ children, title, subtitle }: AuthLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-cyan-50/20 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <div className="mb-8">
            <Button variant="ghost" size="sm" asChild className="mb-6">
              <Link href="/">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to home
              </Link>
            </Button>

            <div className="flex items-center justify-center mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-cyan-600 to-cyan-700 rounded-xl flex items-center justify-center">
                <Wallet className="w-6 h-6 text-white" />
              </div>
            </div>

            <div className="text-center">
              <h1 className="text-2xl font-bold font-sans mb-2">{title}</h1>
              <p className="text-muted-foreground">{subtitle}</p>
            </div>
          </div>

          <div className="bg-card/80 backdrop-blur-sm border border-border/50 rounded-2xl p-8 shadow-lg">
            {children}
          </div>
        </motion.div>
      </div>
    </div>
  )
}
