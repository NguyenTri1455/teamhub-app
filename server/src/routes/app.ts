import { Router } from "express";
import AppController from "../controllers/AppController";
import { checkJwt } from "../middlewares/checkJwt";

const router = Router();

// Public routes
router.get("/status", AppController.checkStatus);

// Protected routes (if needed)
router.get("/config", [checkJwt], AppController.getAppConfig);

export default router;
