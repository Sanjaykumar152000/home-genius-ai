import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import designRoutes from "./routes/designRoute.js";

dotenv.config();

const app = express();

// MUST be before routes
app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true,
  })
);

app.use(express.json());

app.use("/api/design", designRoutes);

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
