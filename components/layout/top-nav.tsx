"use client"

import Image from "next/image"
import { SidebarTrigger } from "@/components/ui/sidebar"
// removed ModeToggle import (not required for preview)
import { useSession } from "next-auth/react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export default function TopNav() {
  const { data } = useSession()
  const name = data?.user?.name ?? "User"
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")

  return (
    <header className="sticky top-0 z-20 flex h-14 items-center gap-2 border-b bg-background/60 px-3 backdrop-blur supports-[backdrop-filter]:bg-background/40">
      <SidebarTrigger />
      <div className="ml-1 flex items-center gap-2">
        <Image src="/abstract-emerald-logo.png" alt="Logo" width={28} height={28} />
        <span className="hidden text-sm font-semibold md:block">Money Manager</span>
      </div>
      <div className="ml-auto flex items-center gap-3">
        {/* small spacer instead of ModeToggle */}
        <Avatar className="size-8">
          <AvatarImage src={data?.user?.image ?? ""} alt="Profile" />
          <AvatarFallback>{initials}</AvatarFallback>
        </Avatar>
      </div>
    </header>
  )
}
