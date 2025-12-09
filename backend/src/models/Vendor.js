import mongoose from "mongoose";

const VendorSchema = new mongoose.Schema(
  {
    name: String,
    email: String,
    category: String
  },
  { timestamps: true }
);

export const Vendor = mongoose.model("Vendor", VendorSchema);
