import type { ReactNode } from "react"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import AppSidebar from "@/components/layout/app-sidebar"
import TopNav from "@/components/layout/top-nav"

// Layout for dashboard pages using shadcn SidebarProvider and SidebarInset [^1].
export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <TopNav />
        {children}
      </SidebarInset>
    </SidebarProvider>
  )
}
