import type { NextAuthOptions } from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import { dbConnect } from "./db"
import User from "@/models/user"

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET
const NEXTAUTH_SECRET = process.env.NEXTAUTH_SECRET

// We use JWT session strategy and augment session with DB userId
export const authOptions: NextAuthOptions = {
  secret: NEXTAUTH_SECRET,
  session: { strategy: "jwt", maxAge: 60 * 60 * 8 }, // 8 hours
  jwt: {
    maxAge: 60 * 60 * 8,
  },
  // You can use an adapter for persistent sessions; with jwt we don't need it, but keeping example here.
  // adapter: MongoDBAdapter((clientPromise as any) as any),
  providers: [
    GoogleProvider({
      clientId: GOOGLE_CLIENT_ID!,
      clientSecret: GOOGLE_CLIENT_SECRET!,
      allowDangerousEmailAccountLinking: false,
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (!user?.email || !account?.providerAccountId) return false
      await dbConnect()
      const existing = await User.findOne({ email: user.email })
      if (!existing) {
        await User.create({
          email: user.email,
          name: user.name ?? "User",
          image: user.image,
          googleId: account.providerAccountId,
          initialBalance: 0,
          currentBalance: 0,
        })
      }
      return true
    },
    async jwt({ token }) {
      if (token?.email) {
        await dbConnect()
        const u = await User.findOne({ email: token.email }).lean()
        if (u) {
          token.userId = u._id.toString()
          token.currency = u.preferences?.currency ?? "INR"
        }
      }
      return token
    },
    async session({ session, token }) {
      if (token?.userId) {
        ;(session as any).userId = token.userId
        ;(session as any).currency = token.currency ?? "INR"
      }
      return session
    },
  },
  pages: {
    signIn: "/signin",
  },
}
