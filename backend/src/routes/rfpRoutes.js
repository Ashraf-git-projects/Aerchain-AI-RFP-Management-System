import express from "express";
import { RFP } from "../models/RFP.js";
import { Vendor } from "../models/Vendor.js";
import { generateRfpFromText } from "../services/ai.js";
import { sendRfpEmail } from "../services/email.js";

const router = express.Router();

// Create RFP manually
router.post("/", async (req, res) => {
  try {
    const {
      title,
      requirements,
      budget,
      deliveryTime,
      paymentTerms,
      warranty
    } = req.body;

    if (!title) {
      return res.status(400).json({ message: "Title is required" });
    }

    const rfp = new RFP({
      title,
      requirements,
      budget,
      deliveryTime,
      paymentTerms,
      warranty
    });

    await rfp.save();
    return res.status(201).json(rfp);
  } catch (err) {
    console.error("Create RFP error:", err);
    return res.status(500).json({ message: "Server error" });
  }
});

// Create RFP from natural language using AI
router.post("/from-text", async (req, res) => {
  try {
    const { description } = req.body;

    console.log("Description Input:", description);

    if (!description) {
      return res.status(400).json({ message: "Description is required" });
    }

    if (!process.env.OPENAI_API_KEY) {
      return res
        .status(500)
        .json({ message: "AI not configured (missing API key)" });
    }

    const structured = await generateRfpFromText(description);

    const rfp = new RFP({
      title: structured.title,
      requirements: structured.requirements,
      budget: structured.budget,
      deliveryTime: structured.deliveryTime,
      paymentTerms: structured.paymentTerms,
      warranty: structured.warranty
    });

    await rfp.save();
    return res.status(201).json(rfp);
  } catch (err) {
    console.error("AI RFP create error:", err);
    return res
      .status(500)
      .json({ message: "Failed to generate RFP from text" });
  }
});

// Send RFP to vendors via email
router.post("/:id/send", async (req, res) => {
  try {
    const { vendorIds } = req.body;

    if (!Array.isArray(vendorIds) || vendorIds.length === 0) {
      return res.status(400).json({ message: "vendorIds array is required" });
    }

    const rfp = await RFP.findById(req.params.id);
    if (!rfp) {
      return res.status(404).json({ message: "RFP not found" });
    }

    const vendors = await Vendor.find({ _id: { $in: vendorIds } });
    if (!vendors.length) {
      return res.status(400).json({ message: "No valid vendors found" });
    }

    const subject = `RFP: ${rfp.title || "New Request for Proposal"}`;

    const requirementsText =
      Array.isArray(rfp.requirements) && rfp.requirements.length > 0
        ? rfp.requirements.map((req) => `- ${req}`).join("\n")
        : "-";

    const body = `Hello,

You are invited to submit a proposal for the following RFP:

Title: ${rfp.title || "-"}

Requirements:
${requirementsText}

Budget: ${rfp.budget || "-"}
Delivery Time: ${rfp.deliveryTime || "-"}
Payment Terms: ${rfp.paymentTerms || "-"}
Warranty: ${rfp.warranty || "-"}

Please reply to this email with your detailed proposal, including pricing, delivery schedule, and terms.

Best regards,
Procurement Team
`;

    const sentTo = [];
    const failedTo = [];

    for (const vendor of vendors) {
      if (!vendor.email) continue;

      try {
        await sendRfpEmail({
          to: vendor.email,
          subject,
          text: body
        });
        sentTo.push(vendor.email);
      } catch (err) {
        console.error("Send failed for", vendor.email, err.message);
        failedTo.push(vendor.email);
      }
    }

    if (sentTo.length === 0) {
      return res
        .status(500)
        .json({ message: "Failed to send RFP emails", failedTo });
    }

    return res.json({
      message:
        failedTo.length > 0
          ? "RFP sent to some vendors"
          : "RFP sent to all vendors",
      sentTo,
      failedTo
    });
  } catch (err) {
    console.error("Send RFP email error:", err);
    return res.status(500).json({ message: "Failed to send RFP emails" });
  }
});

// Get all RFPs
router.get("/", async (req, res) => {
  try {
    const rfps = await RFP.find().sort({ createdAt: -1 });
    return res.json(rfps);
  } catch (err) {
    console.error("Get RFPs error:", err);
    return res.status(500).json({ message: "Server error" });
  }
});

// Get single RFP by id
router.get("/:id", async (req, res) => {
  try {
    const rfp = await RFP.findById(req.params.id);
    if (!rfp) {
      return res.status(404).json({ message: "RFP not found" });
    }
    return res.json(rfp);
  } catch (err) {
    console.error("Get RFP by id error:", err);
    return res.status(500).json({ message: "Server error" });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const { title, requirements, budget, deliveryTime, paymentTerms, warranty } =
      req.body;

    const update = {};
    if (title !== undefined) update.title = title;
    if (requirements !== undefined) update.requirements = requirements;
    if (budget !== undefined) update.budget = budget;
    if (deliveryTime !== undefined) update.deliveryTime = deliveryTime;
    if (paymentTerms !== undefined) update.paymentTerms = paymentTerms;
    if (warranty !== undefined) update.warranty = warranty;

    const rfp = await RFP.findByIdAndUpdate(req.params.id, update, {
      new: true
    });

    if (!rfp) {
      return res.status(404).json({ message: "RFP not found" });
    }

    return res.json(rfp);
  } catch (err) {
    console.error("Update RFP error:", err);
    return res.status(500).json({ message: "Server error" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const rfp = await RFP.findByIdAndDelete(req.params.id);
    if (!rfp) {
      return res.status(404).json({ message: "RFP not found" });
    }
    return res.json({ message: "RFP deleted" });
  } catch (err) {
    console.error("Delete RFP error:", err);
    return res.status(500).json({ message: "Server error" });
  }
});


export default router;
