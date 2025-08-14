import { redirect } from "next/navigation"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { BalanceCard } from "@/components/dashboard/balance-card"
import { TransactionTable } from "@/components/dashboard/transaction-table"
import { QuickActions } from "@/components/dashboard/quick-actions"
import { MiniAnalytics } from "@/components/dashboard/mini-analytics"

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/auth/signin")
  }

  return (
    <div className="space-y-8">
      <DashboardHeader />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3 space-y-6">
          <BalanceCard />
          <TransactionTable />
        </div>
        <div className="lg:col-span-1 space-y-6">
          <QuickActions />
          <MiniAnalytics />
        </div>
      </div>
    </div>
  )
}
