import mongoose, { Schema, Document } from "mongoose";

export interface IItem extends Document {
  name: string;
  price: number;
  category: string;
  description: string;
  condition?: string;
  sellerName: string;
  sellerWhatsapp: string;
  sellerId: string;
  createdAt: Date;
}

const ItemSchema = new Schema<IItem>(
  {
    name: { type: String, required: true, trim: true },
    price: { type: Number, required: true, min: 0 },
    category: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    condition: { type: String, trim: true },
    sellerName: { type: String, required: true },
    sellerWhatsapp: { type: String, required: true },
    sellerId: { type: String, required: true },
  },
  { timestamps: true },
);

export const Item = mongoose.model<IItem>("Item", ItemSchema);
