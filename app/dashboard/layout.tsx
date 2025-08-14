import type React from "react"
import { redirect } from "next/navigation"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar"
import { DashboardNav } from "@/components/dashboard/dashboard-nav"
import { DashboardLayoutClient } from "@/components/dashboard/dashboard-layout"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/auth/signin")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-cyan-50/10">
      <div className="flex">
        <DashboardSidebar />
        <div className="flex-1 flex flex-col">
          <DashboardNav />
          <main className="flex-1 p-6">
            <DashboardLayoutClient>{children}</DashboardLayoutClient>
          </main>
        </div>
      </div>
    </div>
  )
}
