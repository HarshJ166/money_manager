"use client"

import { useState, useTransition } from "react"
import { signIn } from "next-auth/react"
import { LogIn, ShieldCheck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/hooks/use-toast"

export default function SignInPage() {
  const [loading, setLoading] = useState(false)
  const [isPending, startTransition] = useTransition()
  const { toast } = useToast()

  const onGoogle = async () => {
    try {
      setLoading(true)
      await signIn("google", { callbackUrl: "/dashboard" })
    } catch (e: any) {
      toast({ title: "Sign-in failed", description: e?.message ?? "Please try again.", variant: "destructive" })
      setLoading(false)
    }
  }

  return (
    <main className="min-h-svh grid place-items-center bg-[radial-gradient(45rem_30rem_at_50%_-10%,hsl(240_3%_7%/.7),transparent),linear-gradient(to_bottom,hsl(240_6%_10%),hsl(240_6%_6%))] text-foreground">
      <Card className="w-full max-w-md border border-white/10 bg-black/40 backdrop-blur supports-[backdrop-filter]:bg-black/30">
        <CardHeader className="space-y-2">
          <CardTitle className="text-2xl">Welcome to Money Manager</CardTitle>
          <CardDescription className="text-muted-foreground">
            Your secure digital passbook. Sign in to continue.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button
            onClick={() => startTransition(onGoogle)}
            disabled={loading || isPending}
            className="w-full bg-emerald-600 hover:bg-emerald-500 text-white"
          >
            <LogIn className="mr-2 h-4 w-4" />
            Continue with Google
          </Button>
          <Separator className="my-2" />
          <div className="flex items-start gap-2 text-xs text-muted-foreground">
            <ShieldCheck className="h-4 w-4 mt-0.5 text-emerald-500" />
            <p>
              We use industry best-practices: OAuth, secure cookies, HTTPS, input validation, rate limiting, and
              encryption at rest. Configure environment variables on Vercel for production.
            </p>
          </div>
        </CardContent>
      </Card>
    </main>
  )
}
