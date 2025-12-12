import { Router } from "express";
import FundController from "../controllers/FundController";
import { checkJwt } from "../middlewares/checkJwt";

import { checkRole } from "../middlewares/checkRole";

const router = Router();
router.get("/", [checkJwt], FundController.list);
router.get("/summary", [checkJwt], FundController.getSummary);
router.post("/", [checkJwt, checkRole(["admin"])], FundController.add);
router.delete("/:id", [checkJwt, checkRole(["admin"])], FundController.delete);

export default router;
