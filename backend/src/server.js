import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import vendorRoutes from "./routes/vendorRoutes.js";
import rfpRoutes from "./routes/rfpRoutes.js";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

connectDB();

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});


app.use("/api/vendors", vendorRoutes);
app.use("/api/rfps", rfpRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));
