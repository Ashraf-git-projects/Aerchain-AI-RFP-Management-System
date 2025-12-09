import mongoose from "mongoose";

const ProposalSchema = new mongoose.Schema(
  {
    rfpId: { type: mongoose.Schema.Types.ObjectId, ref: "RFP" },
    vendorId: { type: mongoose.Schema.Types.ObjectId, ref: "Vendor" },
    price: Number,
    deliveryTime: String,
    paymentTerms: String,
    warranty: String,
    summary: String,
    rawResponse: String
  },
  { timestamps: true }
);

export const Proposal = mongoose.model("Proposal", ProposalSchema);
