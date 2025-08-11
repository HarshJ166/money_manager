"use client"

import { useEffect, useMemo, useState } from "react"
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from "recharts"

type Tx = { date: string; amount: number; type: "credit" | "debit"; balanceAfter: number }

export default function BalanceChart({ range = "30d" }: { range?: "7d" | "30d" | "90d" }) {
  const [data, setData] = useState<Tx[]>([])
  useEffect(() => {
    fetch(`/api/balance/history?range=${range}`)
      .then((r) => r.json())
      .then((d) => setData(d.items ?? []))
      .catch(() => {})
  }, [range])

  const points = useMemo(() => {
    return data.map((d) => ({
      date: new Date(d.date).toLocaleDateString(),
      balance: d.balanceAfter,
    }))
  }, [data])

  return (
    <div className="h-[280px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={points}>
          <CartesianGrid stroke="hsl(240 3.8% 24%)" strokeDasharray="3 3" />
          <XAxis dataKey="date" tick={{ fontSize: 12, fill: "hsl(240 5% 64%)" }} />
          <YAxis tick={{ fontSize: 12, fill: "hsl(240 5% 64%)" }} />
          <Tooltip contentStyle={{ backgroundColor: "hsl(240 6% 10%)", border: "1px solid hsl(240 3.8% 24%)" }} />
          <Line type="monotone" dataKey="balance" stroke="hsl(152 76% 40%)" strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
