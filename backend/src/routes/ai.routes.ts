import { Router } from "express";
import { getAiInsights } from "../controllers/ai.controller.js";

const router = Router();

router.post("/insights", getAiInsights);

export default router;
