import mongoose from "mongoose";
import { env } from "./env";

interface MongooseCache {
  conn: typeof mongoose | null,
  promise: Promise<typeof mongoose> | null
}

declare global {
  var mongooseCache: MongooseCache | undefined
}

const cached: MongooseCache = global.mongooseCache ?? {
  conn: null,
  promise: null
}

if(!global.mongooseCache){
  global.mongooseCache = cached
}

export async function connectDB(): Promise<typeof mongoose> {
  if(cached.conn){
    return cached.conn
  }

  if(!cached.promise){
    cached.promise = mongoose.connect(env.MONGODB_URI, {
      bufferCommands: false
    })
  }

  try{
    cached.conn = await cached.promise
  }catch(error){
    cached.promise = null;
    throw error;
  }

  return cached.conn
}
