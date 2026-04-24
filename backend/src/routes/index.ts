import { Router } from "express";
import aiRoutes from "./ai.routes.js";

const router = Router();

router.use("/ai", aiRoutes);

export default router;
