import express from "express";
import { Vendor } from "../models/Vendor.js";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { name, email, category } = req.body;
    if (!name || !email) {
      return res.status(400).json({ message: "Name and email are required" });
    }

    const vendor = new Vendor({ name, email, category });
    await vendor.save();
    res.status(201).json(vendor);
  } catch (err) {
    console.error("Create vendor error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/", async (req, res) => {
  try {
    const vendors = await Vendor.find().sort({ createdAt: -1 });
    res.json(vendors);
  } catch (err) {
    console.error("Get vendors error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
