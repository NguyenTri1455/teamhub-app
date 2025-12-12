import { Router } from "express";
import InvitationController from "../controllers/InvitationController";
import { checkJwt } from "../middlewares/checkJwt";

const router = Router();
router.get("/", [checkJwt], InvitationController.list);
router.post("/", [checkJwt], InvitationController.add);
router.delete("/:email", [checkJwt], InvitationController.delete);

export default router;
