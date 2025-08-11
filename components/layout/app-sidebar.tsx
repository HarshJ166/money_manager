"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { BarChart2, Home, Settings, Wallet } from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
  SidebarHeader,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { signOut, useSession } from "next-auth/react"

// Uses shadcn/ui Sidebar primitives, which provide collapsible behavior and responsive off-canvas on mobile [^1].
export default function AppSidebar() {
  const pathname = usePathname()
  const { data } = useSession()

  const items = [
    { title: "Dashboard", href: "/dashboard", icon: Home },
    { title: "Analytics", href: "/dashboard#analytics", icon: BarChart2 },
    { title: "Wallet", href: "/dashboard#wallet", icon: Wallet },
    { title: "Settings", href: "/dashboard#settings", icon: Settings },
  ]

  return (
    <Sidebar collapsible="icon" className="bg-neutral-950 text-neutral-200">
      <SidebarHeader className="px-2">
        <div className="flex items-center gap-2 px-2 py-1.5">
          <div className="size-6 rounded bg-gradient-to-br from-emerald-500 to-emerald-700" />
          <span className="font-semibold">Money Manager</span>
          <div className="ml-auto">
            <SidebarTrigger className="text-neutral-400 hover:text-white" />
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => {
                const active = pathname === item.href
                const Icon = item.icon
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild isActive={active} tooltip={item.title}>
                      <Link href={item.href}>
                        <Icon />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="px-2">
        <div className="flex items-center justify-between px-2 py-1.5 text-xs text-neutral-400">
          <span className="truncate">{data?.user?.email ?? "Not signed in"}</span>
          {data?.user ? (
            <Button variant="ghost" size="sm" className="h-7" onClick={() => signOut({ callbackUrl: "/signin" })}>
              Logout
            </Button>
          ) : (
            <Link className="text-emerald-400 hover:underline" href="/signin">
              Sign in
            </Link>
          )}
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}
