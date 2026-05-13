import mongoose from 'mongoose';

// Note: Replace with your actual connection string or ensure MONGODB_URI is in your .env file
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/kuttylink";

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable');
}

let cached = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null };
}

export async function connectToDatabase() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      console.log("Connected to MongoDB!");
      return mongoose;
    });
  }
  cached.conn = await cached.promise;
  return cached.conn;
}
