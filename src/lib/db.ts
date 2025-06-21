import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI!;

if (!MONGODB_URI) {
  throw new Error("Please define mongodb uri in env file");
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

// kyuki nextjs edge pe kaam krta hai we have to maintain 3 cases. ho skta hai already db connection available ho, ho skta hai connection ongoing ho, ya ho skta hai connection me error aaye.

export async function dbConnect() {
  if (cached.conn) {
    // agar cached ke andr already connection hai to use hi return kr do.
    return cached.conn;
  }

  if (!cached.promise) {
    const options = {
      bufferCommands: true,
      //buffer commands is used to buffer any request to mongodb through mongoose, mongoose handles the requests and in case of any failure or db connection break, mongoose buffers the request to execute them when db is back online.
      maxPoolSize: 10,
    };

    /// agar promise nhihai to promise naya create kro:
    cached.promise = mongoose
      .connect(MONGODB_URI, options)
      .then(() => mongoose.connection)
      .catch();
  }

  try {
    cached.conn = await cached.promise;
  } catch (error) {
    cached.promise = null;
    throw new Error("Error in connecting to db");
  }

  return cached.conn;
}
