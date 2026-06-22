import mongoose from "mongoose";
import { logger } from "./logger";

let isConnected = false;

export async function connectMongoDB(): Promise<void> {
  if (isConnected) return;

  const uri = process.env["MONGODB_URI"];
  if (!uri) {
    throw new Error("MONGODB_URI must be set.");
  }

  await mongoose.connect(uri, {
    tls: true,
    tlsAllowInvalidCertificates: false,
    serverSelectionTimeoutMS: 10000,
  });
  isConnected = true;
  logger.info("MongoDB connected");
}
