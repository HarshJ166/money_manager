"use client"

import type React from "react"

import { PageTransition } from "@/components/ui/page-transition"

interface DashboardLayoutProps {
  children: React.ReactNode
}

export function DashboardLayoutClient({ children }: DashboardLayoutProps) {
  return <PageTransition>{children}</PageTransition>
}
