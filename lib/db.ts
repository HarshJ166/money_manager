import mongoose from "mongoose"

const MONGODB_URI = process.env.MONGODB_URI as string

if (!MONGODB_URI) {
  console.warn("MONGODB_URI is not set. Database operations will fail until configured.")
}

interface GlobalWithMongoose {
  mongooseConn?: { conn: typeof mongoose | null; promise: Promise<typeof mongoose> | null }
}

const globalForMongoose = global as unknown as GlobalWithMongoose

let cached = globalForMongoose.mongooseConn
if (!cached) {
  cached = globalForMongoose.mongooseConn = { conn: null, promise: null }
}

export async function dbConnect() {
  if (cached?.conn) return cached.conn
  if (!cached?.promise) {
    cached!.promise = mongoose
      .connect(MONGODB_URI!, {
        maxPoolSize: 10,
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
        dbName: "money_manager",
      })
      .then((m) => m)
  }
  cached!.conn = await cached!.promise
  return cached!.conn
}
