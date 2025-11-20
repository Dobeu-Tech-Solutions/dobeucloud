import mongoose from 'mongoose';

// MongoDB URI will be set in Netlify environment variables
// Using the provided connection string
const uri = process.env.MONGODB_URI || 'mongodb+srv://jeremyw_db_user:4l7pQxun7GnBnSUc@cluster0.pqf8x5.mongodb.net/dobeucloud?retryWrites=true&w=majority';
const options: mongoose.ConnectOptions = {
  maxPoolSize: 10,
};

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function dbConnect() {
  if (!cached) {
    cached = global.mongoose = { conn: null, promise: null };
  }
  
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      ...options,
    };

    cached!.promise = mongoose.connect(uri, opts);
  }

  try {
    cached!.conn = await cached!.promise;
  } catch (e) {
    cached!.promise = null;
    throw e;
  }

  return cached!.conn;
}

export default dbConnect;

// Global type augmentation for cached mongoose
declare global {
  var mongoose: {
    conn: any | null;
    promise: Promise<any> | null;
  } | undefined;
}
