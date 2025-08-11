import { NextResponse, type NextRequest } from "next/server"

// Security headers and HTTPS redirect in production
export function middleware(req: NextRequest) {
  const res = NextResponse.next()

  // Force HTTPS in production
  if (process.env.NODE_ENV === "production" && req.headers.get("x-forwarded-proto") !== "https") {
    const url = new URL(req.url)
    url.protocol = "https:"
    return NextResponse.redirect(url)
  }

  // Secure headers
  res.headers.set("x-content-type-options", "nosniff")
  res.headers.set("x-frame-options", "DENY")
  res.headers.set("referrer-policy", "strict-origin-when-cross-origin")
  res.headers.set("x-xss-protection", "0")
  res.headers.set("permissions-policy", "geolocation=(), microphone=(), camera=()")
  // Minimal CSP example; adjust as needed
  res.headers.set(
    "content-security-policy",
    [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: https:",
      "font-src 'self' data:",
      "connect-src 'self' https:",
      "frame-ancestors 'none'",
      "base-uri 'self'",
      "form-action 'self'",
    ].join("; "),
  )

  return res
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
}
