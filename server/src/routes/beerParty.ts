import { Router } from "express";
import BeerPartyController from "../controllers/BeerPartyController";
import { checkJwt } from "../middlewares/checkJwt";

import { checkRole } from "../middlewares/checkRole";

const router = Router();
router.get("/active", [checkJwt], BeerPartyController.getActive);
router.post("/", [checkJwt, checkRole(["admin"])], BeerPartyController.create);
router.post("/count", [checkJwt], BeerPartyController.updateCount); // Allow members to drink!
router.post("/:id/end", [checkJwt, checkRole(["admin"])], BeerPartyController.end);

export default router;
