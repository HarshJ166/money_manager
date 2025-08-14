import { SignInForm } from "@/components/auth/signin-form"
import { AuthLayout } from "@/components/auth/auth-layout"

export default function SignInPage() {
  return (
    <AuthLayout title="Welcome back" subtitle="Sign in to your account to continue managing your finances">
      <SignInForm />
    </AuthLayout>
  )
}
