import mongoose, { Schema, Document } from "mongoose";

export interface IDemand extends Document {
  itemName: string;
  description: string;
  budget?: number | null;
  posterName: string;
  posterWhatsapp: string;
  posterId: string;
  createdAt: Date;
}

const DemandSchema = new Schema<IDemand>(
  {
    itemName: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    budget: { type: Number, default: null },
    posterName: { type: String, required: true },
    posterWhatsapp: { type: String, required: true },
    posterId: { type: String, required: true },
  },
  { timestamps: true },
);

export const Demand = mongoose.model<IDemand>("Demand", DemandSchema);
