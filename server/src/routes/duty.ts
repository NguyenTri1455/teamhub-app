import { Router } from "express";
import DutyRotationController from "../controllers/DutyRotationController";
import { checkJwt } from "../middlewares/checkJwt";

import { checkRole } from "../middlewares/checkRole";

const router = Router();
router.get("/", [checkJwt], DutyRotationController.get);
router.post("/config", [checkJwt, checkRole(["admin"])], DutyRotationController.updateConfig);
router.post("/complete", [checkJwt, checkRole(["admin"])], DutyRotationController.completeTurn);

export default router;
