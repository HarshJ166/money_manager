import { Schema, type InferSchemaType, model, models } from "mongoose"
import { encrypt } from "@/lib/crypto"

const MetadataSchema = new Schema(
  {
    location: { type: String },
    notes: { type: String },
  },
  { _id: false },
)

const TransactionSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    type: { type: String, enum: ["credit", "debit"], required: true, index: true },
    amount: { type: Number, required: true, min: 0, index: true },
    description: { type: String, required: true },
    category: { type: String, required: true, index: true },
    paymentMethod: {
      type: String,
      enum: ["Cash", "GPay", "Paytm", "Bank Transfer", "Card", "Other"],
      required: true,
      index: true,
    },
    date: { type: Date, required: true, index: true },
    balanceAfter: { type: Number, required: true },
    metadata: { type: MetadataSchema },
    // Example encrypted field: description (if sensitive)
    descriptionEnc: { type: String, select: false },
  },
  { timestamps: true },
)

// Demonstration of field-level encryption for "description" (store encrypted in descriptionEnc)
TransactionSchema.pre("save", function (next) {
  // Only encrypt if description changed
  if (this.isModified("description")) {
    const raw = this.get("description")
    if (raw && typeof raw === "string") {
      try {
        const enc = encrypt(raw)
        this.set("descriptionEnc", enc)
        // Optionally, clear plaintext before save
        this.set("description", raw) // keep plaintext for app logic; switch to clearing if preferred
      } catch {
        // if encryption fails, block save to avoid storing plaintext inadvertently
        return next(new Error("Encryption failed"))
      }
    }
  }
  return next()
})

export type TransactionDoc = InferSchemaType<typeof TransactionSchema>
TransactionSchema.index({ userId: 1, date: -1 })
TransactionSchema.index({ userId: 1, type: 1, date: -1 })
TransactionSchema.index({ userId: 1, category: 1, date: -1 })

export default models.Transaction || model("Transaction", TransactionSchema)
