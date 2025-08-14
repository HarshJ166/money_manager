import { redirect } from "next/navigation"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { AnalyticsHeader } from "@/components/analytics/analytics-header"
import { SpendingByCategory } from "@/components/analytics/spending-by-category"
import { BalanceTrend } from "@/components/analytics/balance-trend"
import { MonthlySpending } from "@/components/analytics/monthly-spending"
import { AnalyticsOverview } from "@/components/analytics/analytics-overview"

export default async function AnalyticsPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/auth/signin")
  }

  return (
    <div className="space-y-8">
      <AnalyticsHeader />
      <AnalyticsOverview />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SpendingByCategory />
        <BalanceTrend />
      </div>

      <MonthlySpending />
    </div>
  )
}
