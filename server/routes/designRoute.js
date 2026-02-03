import express from "express";
import { generateDesign } from "../controllers/designController.js";

const router = express.Router();

router.post("/generate", generateDesign);

export default router;
