import { Schema, type InferSchemaType, model, models } from "mongoose"

const PreferencesSchema = new Schema(
  {
    theme: { type: String, enum: ["dark", "light"], default: "dark" },
    currency: { type: String, default: "INR" },
    notifications: { type: Boolean, default: true },
  },
  { _id: false },
)

const UserSchema = new Schema(
  {
    email: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true },
    image: { type: String },
    googleId: { type: String, required: true, unique: true, index: true },
    initialBalance: { type: Number, required: true, default: 0 },
    currentBalance: { type: Number, required: true, default: 0 },
    preferences: { type: PreferencesSchema, default: () => ({}) },
  },
  { timestamps: true },
)

export type UserDoc = InferSchemaType<typeof UserSchema>
export default models.User || model("User", UserSchema)
