import crypto from "crypto"

// Simple AES-256-GCM utility for field-level encryption at rest.
// For production-grade FLE, prefer MongoDB CSFLE with a KMS.
// This utility demonstrates at-rest encryption using a symmetric key.
const KEY = (process.env.DATA_ENCRYPTION_KEY as string) || ""

if (!KEY) {
  console.warn("DATA_ENCRYPTION_KEY not set. Generating ephemeral key for preview only.")
}

const key = KEY ? Buffer.from(KEY, "base64") : crypto.randomBytes(32)

export function encrypt(value: string): string {
  const iv = crypto.randomBytes(12)
  const cipher = crypto.createCipheriv("aes-256-gcm", key, iv)
  const enc = Buffer.concat([cipher.update(value, "utf8"), cipher.final()])
  const tag = cipher.getAuthTag()
  return Buffer.concat([iv, tag, enc]).toString("base64")
}

export function decrypt(payload: string): string {
  const buf = Buffer.from(payload, "base64")
  const iv = buf.subarray(0, 12)
  const tag = buf.subarray(12, 28)
  const data = buf.subarray(28)
  const decipher = crypto.createDecipheriv("aes-256-gcm", key, iv)
  decipher.setAuthTag(tag)
  const dec = Buffer.concat([decipher.update(data), decipher.final()])
  return dec.toString("utf8")
}
