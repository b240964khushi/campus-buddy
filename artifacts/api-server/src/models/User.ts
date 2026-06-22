import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  college: string;
  year: string;
  createdAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    college: { type: String, required: true, trim: true },
    year: { type: String, required: true },
  },
  { timestamps: true },
);

export const User = mongoose.model<IUser>("User", UserSchema);
