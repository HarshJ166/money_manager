import type { DefaultSession } from "next-auth"

declare module "next-auth" {
  interface Session {
    user?: {
      id?: string
    } & DefaultSession["user"]
    userId?: string
    currency?: string
  }

  interface User {
    id?: string
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    userId?: string
    currency?: string
  }
}
