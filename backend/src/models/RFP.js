import mongoose from "mongoose";

const RFPSchema = new mongoose.Schema(
  {
    title: String,
    requirements: Array,
    budget: Number,
    deliveryTime: String,
    paymentTerms: String,
    warranty: String
  },
  { timestamps: true }
);

export const RFP = mongoose.model("RFP", RFPSchema);
